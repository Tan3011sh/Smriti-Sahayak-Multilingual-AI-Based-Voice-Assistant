import { Difficulty, GameResult, GameType } from './game'

export interface MetricsBreakdown {
  accuracyScore: number       // 0 - 100
  speedScore: number          // 0 - 100
  mistakeScore: number        // 0 - 100 (penalty inverted)
  consistencyScore: number    // 0 - 100
}

export interface AdaptiveEngineConfig {
  promotionThreshold: number   // default 75
  demotionThreshold: number    // default 50
  weights: {
    accuracy: number           // default 0.50
    speed: number              // default 0.25
    mistake: number            // default 0.15
    consistency: number        // default 0.10
  }
  // Benchmark average seconds per question for normal comfortable response
  benchmarkSecondsPerQuestion: {
    Easy: number               // e.g. 6 seconds
    Medium: number             // e.g. 5 seconds
    Hard: number               // e.g. 4 seconds
  }
}

export interface DifficultyRecommendation {
  id: string
  patientId: string
  gameType: GameType
  previousDifficulty: Difficulty
  recommendedDifficulty: Difficulty
  performanceScore: number    // Normalized 0 - 100 Game Performance Score
  accuracy: number            // 0 - 100
  responseTime: number        // Total seconds
  reason: string              // Encouraging non-medical reason
  detailedExplanation: string // Clear rationale for prototype/caregiver
  metricsBreakdown: MetricsBreakdown
  timestamp: string           // ISO Date string
}

export interface AdaptiveEngineInput {
  patientId: string
  gameType: GameType
  currentDifficulty: Difficulty
  latestResult: GameResult
  historicalResults: GameResult[] // Recent sessions (up to 5)
}

/**
 * Modular Interface for the Cognitive Adaptive Engine.
 * Allows seamless replacement of the current rule-based engine
 * with a trained Machine Learning model in future phases without rewriting consumer code.
 */
export interface AdaptiveCognitiveEngine {
  readonly version: string
  readonly modelType: 'explainable-rule-based' | 'machine-learning'
  evaluatePerformance(input: AdaptiveEngineInput): DifficultyRecommendation
}
