import { CaregiverAlert, AlertSeverity, AlertType } from '@/types/alert'
import { getTodayReminders, getTodayDateString } from './reminder-service'
import { getGameResults } from './game-performance-service'

const ALERTS_STORAGE_KEY = 'smriti_sahayak_caregiver_alerts_v1'

export function toLocalDateString(dateInput: Date | string): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getAllStoredAlerts(): CaregiverAlert[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(ALERTS_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to load caregiver alerts:', err)
    return []
  }
}

export function saveAllAlerts(alerts: CaregiverAlert[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts))
    window.dispatchEvent(new CustomEvent('smriti_alerts_updated'))
  } catch (err) {
    console.error('Failed to save caregiver alerts:', err)
  }
}

/**
 * Generate rule-based alerts from observable application data:
 * 1. Missed reminders
 * 2. Significant performance drop
 * 3. Extended daily inactivity
 * 4. Completed game sessions
 */
export function generateCaregiverAlerts(patientId: string, caregiverId: string): CaregiverAlert[] {
  const existingAlerts = getAllStoredAlerts()
  const todayStr = getTodayDateString()
  const newGenerated: CaregiverAlert[] = []

  // Helper to check if alert was already created today to avoid duplicates
  const alertExists = (type: AlertType, keySubstr: string) => {
    return existingAlerts.some(
      (a) =>
        a.patientId === patientId &&
        a.type === type &&
        toLocalDateString(a.createdAt) === todayStr &&
        (a.relatedEntityId === keySubstr || a.id.includes(keySubstr)),
    )
  }

  // 1. Evaluate Reminders Data
  const todayReminders = getTodayReminders(patientId)
  const missedReminders = todayReminders.filter((r) => r.status === 'MISSED')

  if (missedReminders.length >= 2) {
    if (!alertExists('MULTIPLE_MISSED_REMINDERS', 'multi_missed')) {
      newGenerated.push({
        id: `alert_multi_missed_${patientId}_${todayStr}`,
        patientId,
        caregiverId,
        type: 'MULTIPLE_MISSED_REMINDERS',
        severity: 'IMPORTANT',
        title: 'Multiple Reminders Incomplete',
        message: 'Several scheduled daily reminders were missed by the patient today.',
        createdAt: new Date().toISOString(),
        isRead: false,
        relatedEntityId: 'multi_missed',
      })
    }
  } else if (missedReminders.length === 1) {
    const m = missedReminders[0]
    if (!alertExists('MISSED_REMINDER', m.id)) {
      newGenerated.push({
        id: `alert_missed_${m.id}`,
        patientId,
        caregiverId,
        type: 'MISSED_REMINDER',
        severity: 'ATTENTION',
        title: `Missed ${m.type.replace('_', ' ')} Reminder`,
        message: `Patient missed scheduled ${m.type.toLowerCase()} reminder: "${m.title}".`,
        createdAt: new Date().toISOString(),
        isRead: false,
        relatedEntityId: m.id,
      })
    }
  }

  // 2. Evaluate Game Results & Performance Drops
  const gameResults = getGameResults(patientId)
  const todayGames = gameResults.filter((g) => toLocalDateString(g.completedAt) === todayStr)

  if (todayGames.length === 0) {
    if (!alertExists('INACTIVITY', 'daily_inactivity')) {
      newGenerated.push({
        id: `alert_inactive_${patientId}_${todayStr}`,
        patientId,
        caregiverId,
        type: 'INACTIVITY',
        severity: 'INFO',
        title: 'No Cognitive Activity Yet Today',
        message: 'No memory practice session has been recorded so far today.',
        createdAt: new Date().toISOString(),
        isRead: false,
        relatedEntityId: 'daily_inactivity',
      })
    }
  } else {
    // Game completed notification
    const latestGame = todayGames[0]
    if (!alertExists('GAME_COMPLETED', latestGame.id)) {
      newGenerated.push({
        id: `alert_game_comp_${latestGame.id}`,
        patientId,
        caregiverId,
        type: 'GAME_COMPLETED',
        severity: 'INFO',
        title: 'Cognitive Practice Completed',
        message: `Patient completed ${latestGame.difficulty} Memory Practice with ${latestGame.accuracy}% accuracy (${latestGame.score}/${latestGame.totalQuestions}).`,
        createdAt: latestGame.completedAt,
        isRead: false,
        relatedEntityId: latestGame.id,
      })
    }

    // Check for performance drop: latest < 60% when previous sessions had average >= 75%
    if (gameResults.length >= 2) {
      const latest = gameResults[0]
      const previousSessions = gameResults.slice(1, 4)
      const prevAvg =
        previousSessions.reduce((sum, g) => sum + g.accuracy, 0) / previousSessions.length

      if (latest.accuracy < 60 && prevAvg >= 75) {
        if (!alertExists('PERFORMANCE_DROP', latest.id)) {
          newGenerated.push({
            id: `alert_drop_${latest.id}`,
            patientId,
            caregiverId,
            type: 'PERFORMANCE_DROP',
            severity: 'ATTENTION',
            title: 'Performance Variation Noticed',
            message: 'Recent activity performance was lower than the patient’s recent baseline.',
            createdAt: new Date().toISOString(),
            isRead: false,
            relatedEntityId: latest.id,
          })
        }
      }
    }
  }

  if (newGenerated.length > 0) {
    const updated = [...newGenerated, ...existingAlerts]
    saveAllAlerts(updated)
    return updated.filter((a) => a.caregiverId === caregiverId && a.patientId === patientId)
  }

  return existingAlerts.filter((a) => a.caregiverId === caregiverId && a.patientId === patientId)
}

export function getAlertsForCaregiver(
  caregiverId: string,
  patientId?: string,
): CaregiverAlert[] {
  if (patientId) {
    return generateCaregiverAlerts(patientId, caregiverId)
  }

  const all = getAllStoredAlerts()
  return all.filter((a) => a.caregiverId === caregiverId)
}

export function markAlertAsRead(alertId: string): void {
  const all = getAllStoredAlerts()
  const updated = all.map((a) => (a.id === alertId ? { ...a, isRead: true } : a))
  saveAllAlerts(updated)
}

export function markAllAlertsAsRead(caregiverId: string, patientId?: string): void {
  const all = getAllStoredAlerts()
  const updated = all.map((a) => {
    if (a.caregiverId === caregiverId && (!patientId || a.patientId === patientId)) {
      return { ...a, isRead: true }
    }
    return a
  })
  saveAllAlerts(updated)
}

export function getUnreadAlertsCount(caregiverId: string, patientId?: string): number {
  const alerts = getAlertsForCaregiver(caregiverId, patientId)
  return alerts.filter((a) => !a.isRead).length
}
