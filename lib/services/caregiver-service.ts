import { UserProfile, mockUser } from '@/data/mock-user'
import { getStoredUsers } from './auth-service'
import { getGameResults } from './game-performance-service'
import { getLatestRecommendation } from './adaptive-engine-service'
import { getTodayReminders, getReminderSummary, formatTime12h } from './reminder-service'
import { generateCaregiverAlerts } from './alert-service'
import { ActivityFeedItem, CaregiverAlert } from '@/types/alert'
import { GameResult, Difficulty } from '@/types/game'
import { ReminderItem, ReminderSummary } from '@/types/reminder'
import { DifficultyRecommendation } from '@/types/adaptive'

export interface PatientCaregiverSummary {
  patient: UserProfile
  gamesCompletedThisWeek: number
  averageAccuracy: number
  latestGame: GameResult | null
  recentGames: GameResult[]
  recommendation: DifficultyRecommendation | null
  todayReminders: ReminderItem[]
  reminderSummary: ReminderSummary
  alerts: CaregiverAlert[]
  unreadAlertsCount: number
  activityFeed: ActivityFeedItem[]
  statusBadge: 'Active today' | 'No activity today'
}

/**
 * Resolves connected patients for a given caregiver.
 * Connects via connection code or default assignment.
 */
export function getConnectedPatients(caregiver: UserProfile): UserProfile[] {
  if (!caregiver || caregiver.role !== 'caregiver') return []

  const users = getStoredUsers()
  const patients = users.filter((u) => u.role === 'patient')

  // Match by connectionCode
  const connected = patients.filter((p) => {
    if (!caregiver.connectionCode) return false
    return (
      p.connectionCode === caregiver.connectionCode ||
      p.caregiverPhone === caregiver.phone ||
      (caregiver.id === 'usr_caregiver_default' && p.id === 'usr_patient_default')
    )
  })

  // Ensure default fallback for demo accounts if none explicitly matched
  if (connected.length === 0 && caregiver.id === 'usr_caregiver_default') {
    return [mockUser]
  }

  return connected
}

/**
 * Access-control guard ensuring caregiver A cannot view an unconnected patient.
 */
export function isCaregiverAuthorizedForPatient(
  caregiver: UserProfile | null,
  patientId: string,
): boolean {
  if (!caregiver || caregiver.role !== 'caregiver') return false
  const connected = getConnectedPatients(caregiver)
  return connected.some((p) => p.id === patientId)
}

/**
 * Aggregates all observability data into a clean, unified caregiver summary.
 */
export function getPatientCaregiverSummary(
  patientId: string,
  caregiverId: string,
): PatientCaregiverSummary | null {
  const users = getStoredUsers()
  const patient = users.find((u) => u.id === patientId && u.role === 'patient') || (patientId === 'usr_patient_default' ? mockUser : null)

  if (!patient) return null

  // 1. Cognitive Game Performance
  const allGames = getGameResults(patientId)
  const latestGame = allGames.length > 0 ? allGames[0] : null
  const recentGames = allGames.slice(0, 5)

  // Games completed this week (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const gamesThisWeek = allGames.filter((g) => g.completedAt >= sevenDaysAgo).length

  // Average game accuracy
  const relevantGames = allGames.slice(0, 10)
  const averageAccuracy =
    relevantGames.length > 0
      ? Math.round(relevantGames.reduce((acc, g) => acc + g.accuracy, 0) / relevantGames.length)
      : 82

  // 2. Adaptive Difficulty
  const recommendation = getLatestRecommendation(patientId, 'memory')

  // 3. Reminders
  const todayReminders = getTodayReminders(patientId)
  const reminderSummary = getReminderSummary(patientId)

  // 4. Alerts
  const alerts = generateCaregiverAlerts(patientId, caregiverId)
  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length

  // 5. Activity Status
  const todayStr = new Date().toISOString().split('T')[0]
  const hasGameToday = allGames.some((g) => g.completedAt.startsWith(todayStr))
  const hasReminderCompletedToday = todayReminders.some((r) => r.status === 'COMPLETED')
  const statusBadge: 'Active today' | 'No activity today' =
    hasGameToday || hasReminderCompletedToday ? 'Active today' : 'No activity today'

  // 6. Chronological Activity Feed
  const activityFeed: ActivityFeedItem[] = []

  // Add game events
  allGames.slice(0, 10).forEach((g) => {
    activityFeed.push({
      id: `act_game_${g.id}`,
      patientId,
      category: 'game',
      title: `${g.difficulty} Memory Game Completed`,
      description: `Score: ${g.score}/${g.totalQuestions} • Accuracy: ${g.accuracy}% • Time: ${g.timeTaken}s`,
      timestamp: g.completedAt,
      status: 'completed',
    })
  })

  // Add reminder events
  todayReminders.forEach((r) => {
    if (r.status === 'COMPLETED' && r.completedAt) {
      activityFeed.push({
        id: `act_rem_comp_${r.id}`,
        patientId,
        category: 'reminder',
        title: `${r.title} Completed`,
        description: `Scheduled at ${formatTime12h(r.time)} (${r.type.replace('_', ' ')})`,
        timestamp: r.completedAt,
        status: 'completed',
      })
    } else if (r.status === 'MISSED') {
      activityFeed.push({
        id: `act_rem_miss_${r.id}`,
        patientId,
        category: 'reminder',
        title: `${r.title} Missed`,
        description: `Scheduled at ${formatTime12h(r.time)} — marked overdue`,
        timestamp: `${r.date}T${r.time}:00.000Z`,
        status: 'missed',
      })
    }
  })

  // Sort chronological activity feed descending
  activityFeed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return {
    patient,
    gamesCompletedThisWeek: gamesThisWeek,
    averageAccuracy,
    latestGame,
    recentGames,
    recommendation,
    todayReminders,
    reminderSummary,
    alerts,
    unreadAlertsCount,
    activityFeed: activityFeed.slice(0, 15),
    statusBadge,
  }
}
