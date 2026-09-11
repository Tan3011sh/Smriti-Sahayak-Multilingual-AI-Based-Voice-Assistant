import { Difficulty, GameResult, GameType, PatientProgress } from '@/types/game'
import {
  calculateDifficultyRecommendation,
  getLatestRecommendation,
  saveDifficultyRecommendation,
} from './adaptive-engine-service'
import { DifficultyRecommendation } from '@/types/adaptive'

const GAME_RESULTS_STORAGE_KEY = 'smriti_sahayak_game_results_v1'

export function getGameResults(patientId?: string): GameResult[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(GAME_RESULTS_STORAGE_KEY)
    if (!raw) return []
    const allResults: GameResult[] = JSON.parse(raw)
    if (patientId) {
      return allResults.filter((r) => r.patientId === patientId)
    }
    return allResults
  } catch (err) {
    console.error('Failed to load game results from local storage:', err)
    return []
  }
}

export function saveGameResult(result: GameResult): DifficultyRecommendation {
  const existing = getGameResults()
  const updated = [result, ...existing]

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(GAME_RESULTS_STORAGE_KEY, JSON.stringify(updated))
    } catch (err) {
      console.error('Failed to save game result:', err)
    }
  }

  // Evaluate and persist difficulty recommendation via Adaptive Cognitive Engine
  const recommendation = calculateDifficultyRecommendation(
    result.difficulty,
    updated.filter((r) => r.gameType === result.gameType),
    result.gameType,
    result.patientId,
  )

  saveDifficultyRecommendation(recommendation)

  if (typeof window !== 'undefined') {
    // Dispatch event to inform listeners (e.g., Patient Dashboard)
    window.dispatchEvent(
      new CustomEvent('smriti_game_completed', {
        detail: { result, recommendation },
      }),
    )
  }

  return recommendation
}

export function getRecommendedDifficulty(
  patientId: string = 'default_patient',
  gameType: GameType = 'memory',
): Difficulty {
  const latestRec = getLatestRecommendation(patientId, gameType)
  if (latestRec) {
    return latestRec.recommendedDifficulty
  }

  // If no saved recommendation, evaluate from historical results or default to Easy
  const results = getGameResults(patientId).filter((r) => r.gameType === gameType)
  if (results.length > 0) {
    const rec = calculateDifficultyRecommendation(results[0].difficulty, results, gameType, patientId)
    return rec.recommendedDifficulty
  }

  return 'Easy'
}

export function getPatientProgress(patientId: string = 'default_patient'): PatientProgress {
  const results = getGameResults(patientId)

  // Filter today's completed games
  const todayStr = new Date().toISOString().split('T')[0]
  const todayGames = results.filter((r) => r.completedAt.startsWith(todayStr))

  const gamesCompleted = todayGames.length

  // Calculate today's latest or average score
  const todayScore =
    todayGames.length > 0
      ? Math.round(
          todayGames.reduce((acc, curr) => acc + curr.score, 0) / todayGames.length,
        )
      : 0

  // Calculate overall average accuracy
  const relevantResults = results.slice(0, 10)
  const averageAccuracy =
    relevantResults.length > 0
      ? Math.round(
          relevantResults.reduce((acc, curr) => acc + curr.accuracy, 0) /
            relevantResults.length,
        )
      : 85 // default baseline

  // Calculate streak: count consecutive unique days
  const completedDates = Array.from(
    new Set(results.map((r) => r.completedAt.split('T')[0])),
  ).sort().reverse()

  let streak = 0
  const checkDate = new Date()
  for (let i = 0; i < 30; i++) {
    const dateStr = checkDate.toISOString().split('T')[0]
    if (completedDates.includes(dateStr)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else if (i === 0) {
      // If user hasn't played today yet, check yesterday to preserve ongoing streak
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  // Base streak minimum is 1 for positive encouragement if games exist, or mock baseline
  const streakDays = Math.max(streak, results.length > 0 ? 1 : 3)

  // Memory score dynamically adjusts based on memory game results
  const memoryResults = results.filter((r) => r.gameType === 'memory')
  const memoryScore =
    memoryResults.length > 0
      ? Math.round(
          memoryResults.slice(0, 5).reduce((acc, curr) => acc + curr.accuracy, 0) /
            Math.min(memoryResults.length, 5),
        )
      : 85

  return {
    patientId,
    gamesCompleted,
    todayScore: todayScore || (memoryResults.length > 0 ? memoryResults[0].score : 4),
    averageAccuracy,
    streakDays,
    recentResults: results.slice(0, 5),
    memoryScore,
    attentionScore: 90, // Baseline for upcoming Attention module
    patternScore: 78,   // Baseline for upcoming Pattern module
  }
}
