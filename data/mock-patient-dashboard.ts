export interface CognitiveActivity {
  id: string
  title: string
  description: string
  difficulty: 'Gentle' | 'Moderate' | 'Challenging'
  estimatedMinutes: number
  gameUrl: string
  category: string
}

export interface ReminderItem {
  id: string
  title: string
  time: string
  type: 'medicine' | 'hydration' | 'activity' | 'appointment'
  completed: boolean
  detail?: string
}

export interface CognitiveProgress {
  memoryScore: number // percentage e.g. 85
  attentionScore: number // percentage e.g. 90
  patternScore: number // percentage e.g. 78
  activitiesCompleted: number // e.g. 3
  totalActivitiesGoal: number // e.g. 4
  streakDays: number
}

export const mockCognitiveActivity: CognitiveActivity = {
  id: 'cog_1',
  title: 'Memory Recall — Familiar Objects',
  description: 'Sharpen visual recall and object recognition at your own comfortable pace.',
  difficulty: 'Gentle',
  estimatedMinutes: 3,
  gameUrl: '/games/memory',
  category: 'Memory Enhancement',
}

export const mockReminders: ReminderItem[] = [
  {
    id: 'rem_1',
    title: 'Morning Blood Pressure Medication',
    time: '8:00 AM',
    type: 'medicine',
    completed: true,
    detail: '1 tablet after breakfast',
  },
  {
    id: 'rem_2',
    title: 'Hydration Break — Warm Water',
    time: '11:00 AM',
    type: 'hydration',
    completed: true,
    detail: '1 full glass of water',
  },
  {
    id: 'rem_3',
    title: 'Gentle Evening Walk in Garden',
    time: '5:00 PM',
    type: 'activity',
    completed: false,
    detail: '15-minute relaxed stroll',
  },
  {
    id: 'rem_4',
    title: 'Dr. Sen Medical Checkup',
    time: '4:30 PM (Tomorrow)',
    type: 'appointment',
    completed: false,
    detail: 'City Clinic, Room 204',
  },
]

export const mockCognitiveProgress: CognitiveProgress = {
  memoryScore: 85,
  attentionScore: 90,
  patternScore: 78,
  activitiesCompleted: 3,
  totalActivitiesGoal: 4,
  streakDays: 5,
}
