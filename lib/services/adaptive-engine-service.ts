import { Difficulty, GameResult, GameType } from '@/types/game'
import {
  AdaptiveEngineConfig,
  AdaptiveEngineInput,
  AdaptiveCognitiveEngine,
  DifficultyRecommendation,
  MetricsBreakdown,
} from '@/types/adaptive'

export const DEFAULT_ADAPTIVE_CONFIG: AdaptiveEngineConfig = {
  promotionThreshold: 75,
  demotionThreshold: 50,
  weights: {
    accuracy: 0.5,
    speed: 0.25,
    mistake: 0.15,
    consistency: 0.1,
  },
  benchmarkSecondsPerQuestion: {
    Easy: 6,
    Medium: 5,
    Hard: 4,
  },
}

const RECOMMENDATIONS_STORAGE_KEY = 'smriti_sahayak_recommendations_v1'

/**
 * RuleBasedAdaptiveEngine
 *
 * Implements an explainable, deterministic scoring system.
 * Follows the AdaptiveCognitiveEngine interface so that it can later be
 * swapped with a trained ML model (e.g. regression / reinforcement learning agent)
 * without altering client components.
 */
export class RuleBasedAdaptiveEngine implements AdaptiveCognitiveEngine {
  readonly version = '1.0.0-explainable-rules'
  readonly modelType = 'explainable-rule-based' as const

  private config: AdaptiveEngineConfig

  constructor(config: AdaptiveEngineConfig = DEFAULT_ADAPTIVE_CONFIG) {
    this.config = config
  }

  evaluatePerformance(input: AdaptiveEngineInput): DifficultyRecommendation {
    const { patientId, gameType, currentDifficulty, latestResult, historicalResults } = input

    // Cold-start fallback if no valid result
    if (!latestResult) {
      return this.createDefaultRecommendation(patientId, gameType)
    }

    // 1. Calculate Accuracy Score (0 - 100)
    const accuracyScore = Math.max(0, Math.min(100, latestResult.accuracy ?? 0))

    // 2. Calculate Speed / Response Time Score (0 - 100)
    // Compare total time taken against expected benchmark
    const totalQuestions = Math.max(1, latestResult.totalQuestions || 5)
    const benchmarkTotalSec = (this.config.benchmarkSecondsPerQuestion[currentDifficulty] || 5) * totalQuestions
    const actualTime = Math.max(1, latestResult.timeTaken || benchmarkTotalSec)

    // If completed within benchmark time -> 100 score; linearly tapers down if taking longer
    const speedRatio = benchmarkTotalSec / actualTime
    const speedScore = Math.max(20, Math.min(100, Math.round(speedRatio * 85)))

    // 3. Calculate Mistake Score (0 - 100)
    const incorrect = Math.max(0, latestResult.incorrectAnswers ?? 0)
    const mistakeRatio = incorrect / totalQuestions
    const mistakeScore = Math.max(0, Math.min(100, Math.round((1 - mistakeRatio) * 100)))

    // 4. Calculate Consistency Score across recent sessions (0 - 100)
    const recentSessions = (historicalResults || []).filter((r) => r.gameType === gameType).slice(0, 4)
    let consistencyScore = 80 // baseline for single session

    if (recentSessions.length >= 2) {
      const accuracies = [latestResult.accuracy, ...recentSessions.map((r) => r.accuracy)]
      const mean = accuracies.reduce((a, b) => a + b, 0) / accuracies.length
      const variance = accuracies.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / accuracies.length
      const stdDev = Math.sqrt(variance)
      // Low standard deviation indicates consistent performance
      consistencyScore = Math.max(30, Math.min(100, Math.round(100 - stdDev * 2)))
    }

    // Weighted Combined Game Performance Score (0 - 100)
    const rawScore =
      accuracyScore * this.config.weights.accuracy +
      speedScore * this.config.weights.speed +
      mistakeScore * this.config.weights.mistake +
      consistencyScore * this.config.weights.consistency

    const performanceScore = Math.max(0, Math.min(100, Math.round(rawScore)))

    const metricsBreakdown: MetricsBreakdown = {
      accuracyScore,
      speedScore,
      mistakeScore,
      consistencyScore,
    }

    // 5. Apply Difficulty Adjustment Rules with Boundaries
    let recommendedDifficulty: Difficulty = currentDifficulty
    let reason = ''
    let detailedExplanation = ''

    if (performanceScore > this.config.promotionThreshold) {
      if (currentDifficulty === 'Easy') {
        recommendedDifficulty = 'Medium'
        reason = 'You performed consistently well in your recent activities! Ready for the next gentle step.'
        detailedExplanation = `Game Performance Score of ${performanceScore} exceeds the promotion threshold (${this.config.promotionThreshold}). Progressing from Easy to Medium.`
      } else if (currentDifficulty === 'Medium') {
        recommendedDifficulty = 'Hard'
        reason = 'Excellent focus and accuracy! You are ready for our highest practice level.'
        detailedExplanation = `Game Performance Score of ${performanceScore} exceeds the promotion threshold (${this.config.promotionThreshold}). Progressing from Medium to Hard.`
      } else {
        recommendedDifficulty = 'Hard'
        reason = 'Outstanding performance! You are mastering the highest practice level.'
        detailedExplanation = `Game Performance Score of ${performanceScore} remains at peak level. Maintaining Hard (upper boundary).`
      }
    } else if (performanceScore < this.config.demotionThreshold) {
      if (currentDifficulty === 'Hard') {
        recommendedDifficulty = 'Medium'
        reason = 'Let us practice at a comfortable Medium pace to reinforce your memory.'
        detailedExplanation = `Game Performance Score of ${performanceScore} fell below the threshold (${this.config.demotionThreshold}). Stepping down from Hard to Medium for comfort.`
      } else if (currentDifficulty === 'Medium') {
        recommendedDifficulty = 'Easy'
        reason = 'Let us practice at an easier, relaxed pace to keep things fun and comfortable.'
        detailedExplanation = `Game Performance Score of ${performanceScore} fell below the threshold (${this.config.demotionThreshold}). Stepping down from Medium to Easy.`
      } else {
        recommendedDifficulty = 'Easy'
        reason = 'Keep up the daily practice! Every gentle session supports your cognitive wellbeing.'
        detailedExplanation = `Game Performance Score of ${performanceScore} is below ${this.config.demotionThreshold}, but difficulty is already at minimum (Easy). Maintaining Easy.`
      }
    } else {
      // Maintained (Score 50 - 75)
      recommendedDifficulty = currentDifficulty
      reason = 'You are doing well at this pace. Let us keep practicing here to build comfort and confidence.'
      detailedExplanation = `Game Performance Score of ${performanceScore} is in the stable zone (${this.config.demotionThreshold}–${this.config.promotionThreshold}). Maintaining current ${currentDifficulty} level.`
    }

    return {
      id: `rec_${Date.now()}`,
      patientId,
      gameType,
      previousDifficulty: currentDifficulty,
      recommendedDifficulty,
      performanceScore,
      accuracy: latestResult.accuracy,
      responseTime: latestResult.timeTaken,
      reason,
      detailedExplanation,
      metricsBreakdown,
      timestamp: new Date().toISOString(),
    }
  }

  createDefaultRecommendation(
    patientId: string = 'default_patient',
    gameType: GameType = 'memory',
  ): DifficultyRecommendation {
    return {
      id: `rec_default_${Date.now()}`,
      patientId,
      gameType,
      previousDifficulty: 'Easy',
      recommendedDifficulty: 'Easy',
      performanceScore: 70,
      accuracy: 80,
      responseTime: 20,
      reason: 'Welcome to your cognitive practice! Starting with gentle and familiar activities.',
      detailedExplanation: 'Initial default recommendation for a new patient profile. Initialized at Easy.',
      metricsBreakdown: {
        accuracyScore: 80,
        speedScore: 75,
        mistakeScore: 80,
        consistencyScore: 80,
      },
      timestamp: new Date().toISOString(),
    }
  }
}

// Singleton engine instance for client usage
export const adaptiveCognitiveEngine = new RuleBasedAdaptiveEngine()

/**
 * Functional wrapper matching project requirements:
 * calculateDifficultyRecommendation()
 */
export function calculateDifficultyRecommendation(
  currentDifficulty: Difficulty,
  recentResults: GameResult[],
  gameType: GameType = 'memory',
  patientId: string = 'default_patient',
): DifficultyRecommendation {
  if (!recentResults || recentResults.length === 0) {
    return adaptiveCognitiveEngine.createDefaultRecommendation(patientId, gameType)
  }

  const [latestResult, ...historical] = recentResults

  return adaptiveCognitiveEngine.evaluatePerformance({
    patientId,
    gameType,
    currentDifficulty,
    latestResult,
    historicalResults: historical,
  })
}

/**
 * Persistence layer for Caregiver-ready recommendation records
 */
export function saveDifficultyRecommendation(rec: DifficultyRecommendation): void {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY)
    const existing: DifficultyRecommendation[] = raw ? JSON.parse(raw) : []
    const updated = [rec, ...existing.slice(0, 20)]
    localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(updated))

    // Dispatch custom event for immediate UI responsiveness
    window.dispatchEvent(new CustomEvent('smriti_recommendation_updated', { detail: rec }))
  } catch (err) {
    console.error('Failed to save recommendation:', err)
  }
}

export function getLatestRecommendation(
  patientId?: string,
  gameType?: GameType,
): DifficultyRecommendation | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY)
    if (!raw) return null
    const list: DifficultyRecommendation[] = JSON.parse(raw)
    const match = list.find((r) => {
      if (patientId && r.patientId !== patientId) return false
      if (gameType && r.gameType !== gameType) return false
      return true
    })
    return match || null
  } catch (err) {
    console.error('Failed to load recommendation:', err)
    return null
  }
}
