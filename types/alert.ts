export type AlertSeverity = 'INFO' | 'ATTENTION' | 'IMPORTANT'

export type AlertType =
  | 'MISSED_REMINDER'
  | 'MULTIPLE_MISSED_REMINDERS'
  | 'PERFORMANCE_DROP'
  | 'INACTIVITY'
  | 'GAME_COMPLETED'
  | 'RECOMMENDATION_CHANGE'

export interface CaregiverAlert {
  id: string
  patientId: string
  caregiverId: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  createdAt: string // ISO timestamp
  isRead: boolean
  relatedEntityId?: string
}

export interface ActivityFeedItem {
  id: string
  patientId: string
  category: 'game' | 'reminder' | 'adaptive'
  title: string
  description: string
  timestamp: string
  status: 'completed' | 'missed' | 'info'
}
