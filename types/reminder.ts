export type ReminderType =
  | 'MEDICINE'
  | 'HYDRATION'
  | 'DAILY_ACTIVITY'
  | 'MEDICAL_APPOINTMENT'

export type ReminderStatus = 'PENDING' | 'COMPLETED' | 'MISSED'

export type ReminderRecurrence = 'ONCE' | 'DAILY' | 'WEEKLY'

export interface ReminderItem {
  id: string
  patientId: string
  title: string
  description?: string
  type: ReminderType
  date: string // YYYY-MM-DD
  time: string // HH:mm (24h format for reliable ordering e.g. "09:00", "14:30")
  recurrence: ReminderRecurrence
  status: ReminderStatus
  completedAt?: string // ISO timestamp
  createdAt: string // ISO timestamp
  voicePrompt?: string // Natural voice prompt for speech synthesis
}

export interface CreateReminderInput {
  patientId: string
  title: string
  description?: string
  type: ReminderType
  date: string
  time: string
  recurrence: ReminderRecurrence
}

export interface ReminderSummary {
  totalToday: number
  completedToday: number
  pendingToday: number
  missedToday: number
}
