export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type GameType = 'memory' | 'attention' | 'pattern'

export interface MemoryGameObject {
  id: string
  name: string
  hindiName: string
  assameseName?: string
  category: string
  emoji: string
  description: string
  voicePrompt: string
  names?: {
    en: string
    hi: string
    as: string
  }
  descriptions?: {
    en: string
    hi: string
    as: string
  }
  voicePrompts?: {
    en: string
    hi: string
    as: string
  }
}


export interface GameQuestion {
  id: string
  targetObjects: MemoryGameObject[]
  questionText: string
  options: MemoryGameObject[]
  correctAnswerId: string
  memorizeSeconds: number
}

export interface GameResult {
  id: string
  patientId: string
  gameId: string
  gameType: GameType
  difficulty: Difficulty
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  accuracy: number // 0 - 100 percentage
  timeTaken: number // seconds
  completedAt: string // ISO date string
}

export interface PatientProgress {
  patientId: string
  gamesCompleted: number
  todayScore: number
  averageAccuracy: number
  streakDays: number
  recentResults: GameResult[]
  memoryScore: number
  attentionScore: number
  patternScore: number
}

export interface CognitiveGameMeta {
  id: string
  title: string
  category: GameType
  description: string
  skillTrained: string
  defaultDifficulty: Difficulty
  route: string
  status: 'active' | 'coming_soon'
}
