import {
  getConnectedPatients,
  isCaregiverAuthorizedForPatient,
  getPatientCaregiverSummary,
} from '../lib/services/caregiver-service'
import {
  generateCaregiverAlerts,
  markAlertAsRead,
  getUnreadAlertsCount,
} from '../lib/services/alert-service'
import { getTodayDateString } from '../lib/services/reminder-service'
import { UserProfile } from '../data/mock-user'
import { GameResult } from '../types/game'
import { ReminderItem } from '../types/reminder'

// In-memory mock localStorage for Node testing environment
const storage: Record<string, string> = {}
global.window = {
  dispatchEvent: () => true,
} as any
global.localStorage = {
  getItem: (key: string) => storage[key] || null,
  setItem: (key: string, val: string) => {
    storage[key] = val
  },
  removeItem: (key: string) => {
    delete storage[key]
  },
  clear: () => {
    for (const k in storage) delete storage[k]
  },
} as any

function runCaregiverTests() {
  console.log('--- RUNNING CAREGIVER MONITORING, ANALYTICS & ALERTS TEST SUITE ---\n')
  let passed = 0
  let failed = 0

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`[PASS] ${name}`)
      passed++
    } else {
      console.error(`[FAIL] ${name} -> Details: ${details}`)
      failed++
    }
  }

  // Set up mock users
  const caregiverAnita: UserProfile = {
    id: 'usr_caregiver_1',
    name: 'Anita Sharma',
    age: 40,
    phone: '+91 98765 12345',
    email: 'anita@example.com',
    role: 'caregiver',
    connectionCode: 'SM-7892',
    caregiverName: 'Anita Sharma',
    caregiverPhone: '+91 98765 12345',
    language: 'Hindi',
  }

  const patientRamesh: UserProfile = {
    id: 'usr_patient_ramesh',
    name: 'Ramesh Sharma',
    age: 72,
    phone: '+91 98765 43210',
    email: 'ramesh@example.com',
    role: 'patient',
    connectionCode: 'SM-7892',
    caregiverName: 'Anita Sharma',
    caregiverPhone: '+91 98765 12345',
    language: 'Hindi',
  }

  const patientUnconnected: UserProfile = {
    id: 'usr_patient_other',
    name: 'Other Patient',
    age: 68,
    phone: '+91 98765 99999',
    role: 'patient',
    connectionCode: 'OTHER-CODE-999',
    caregiverName: 'Someone Else',
    caregiverPhone: '+91 00000 00000',
    language: 'English',
  }

  // Seed users in mock storage
  storage['smriti_sahayak_users_v1'] = JSON.stringify([caregiverAnita, patientRamesh, patientUnconnected])

  // 1. Caregiver sees connected patient
  const connected = getConnectedPatients(caregiverAnita)
  assert(
    '1. Caregiver sees connected patient matching connectionCode',
    connected.some((p) => p.id === patientRamesh.id),
  )

  // 2. Unconnected patient is not visible
  assert(
    '2. Caregiver cannot see unconnected patient',
    !connected.some((p) => p.id === patientUnconnected.id),
  )

  // 3. Authorization check
  const isAuthConnected = isCaregiverAuthorizedForPatient(caregiverAnita, patientRamesh.id!)
  const isAuthUnconnected = isCaregiverAuthorizedForPatient(caregiverAnita, patientUnconnected.id!)
  assert('3. isCaregiverAuthorizedForPatient validates access correctly', isAuthConnected === true && isAuthUnconnected === false)

  // 4. Non-caregiver role cannot access caregiver summary
  const isPatientAuth = isCaregiverAuthorizedForPatient(patientRamesh, patientRamesh.id!)
  assert('4. Non-caregiver user cannot access caregiver data', isPatientAuth === false)

  // 5. Alert generation: Inactivity alert when no games played
  const alertsInactivity = generateCaregiverAlerts(patientRamesh.id!, caregiverAnita.id!)
  assert(
    '5. Alert rule: Inactivity generates INFO alert when no games played',
    alertsInactivity.some((a) => a.type === 'INACTIVITY' && a.severity === 'INFO'),
  )

  // 6. Alert generation: Missed reminder generates ATTENTION alert
  const todayStr = getTodayDateString()
  const missedReminder: ReminderItem = {
    id: 'rem_test_missed_1',
    patientId: patientRamesh.id!,
    title: 'Hydration Break',
    type: 'HYDRATION',
    date: todayStr,
    time: '08:00',
    recurrence: 'DAILY',
    status: 'MISSED',
    createdAt: new Date().toISOString(),
  }
  storage['smriti_sahayak_reminders_v1'] = JSON.stringify([missedReminder])
  delete storage['smriti_sahayak_caregiver_alerts_v1']
  const alertsMissed = generateCaregiverAlerts(patientRamesh.id!, caregiverAnita.id!)
  assert(
    '6. Alert rule: 1 Missed reminder generates ATTENTION alert',
    alertsMissed.some((a) => a.type === 'MISSED_REMINDER' && a.severity === 'ATTENTION'),
  )

  // 7. Alert generation: Multiple missed reminders generate IMPORTANT alert
  const missedReminder2: ReminderItem = {
    id: 'rem_test_missed_2',
    patientId: patientRamesh.id!,
    title: 'Blood Pressure Tablet',
    type: 'MEDICINE',
    date: todayStr,
    time: '09:00',
    recurrence: 'DAILY',
    status: 'MISSED',
    createdAt: new Date().toISOString(),
  }
  storage['smriti_sahayak_reminders_v1'] = JSON.stringify([missedReminder, missedReminder2])
  delete storage['smriti_sahayak_caregiver_alerts_v1']
  const alertsMulti = generateCaregiverAlerts(patientRamesh.id!, caregiverAnita.id!)
  assert(
    '7. Alert rule: Multiple missed reminders generate IMPORTANT alert',
    alertsMulti.some((a) => a.type === 'MULTIPLE_MISSED_REMINDERS' && a.severity === 'IMPORTANT'),
  )

  // 8. Alert generation: Significant performance drop generates ATTENTION alert
  const gameHigh1: GameResult = {
    id: 'game_h1',
    patientId: patientRamesh.id!,
    gameId: 'game_memory_1',
    gameType: 'memory',
    difficulty: 'Medium',
    score: 5,
    totalQuestions: 5,
    correctAnswers: 5,
    incorrectAnswers: 0,
    accuracy: 100,
    timeTaken: 15,
    completedAt: '2026-09-08T10:00:00Z',
  }
  const gameHigh2: GameResult = {
    id: 'game_h2',
    patientId: patientRamesh.id!,
    gameId: 'game_memory_1',
    gameType: 'memory',
    difficulty: 'Medium',
    score: 4,
    totalQuestions: 5,
    correctAnswers: 4,
    incorrectAnswers: 1,
    accuracy: 80,
    timeTaken: 18,
    completedAt: '2026-09-09T10:00:00Z',
  }
  const gameDrop: GameResult = {
    id: 'game_drop',
    patientId: patientRamesh.id!,
    gameId: 'game_memory_1',
    gameType: 'memory',
    difficulty: 'Medium',
    score: 1,
    totalQuestions: 5,
    correctAnswers: 1,
    incorrectAnswers: 4,
    accuracy: 20,
    timeTaken: 35,
    completedAt: `${todayStr}T11:00:00.000Z`,
  }
  storage['smriti_sahayak_game_results_v1'] = JSON.stringify([gameDrop, gameHigh2, gameHigh1])
  delete storage['smriti_sahayak_caregiver_alerts_v1']
  const alertsDrop = generateCaregiverAlerts(patientRamesh.id!, caregiverAnita.id!)
  assert(
    '8. Alert rule: Performance drop below 60% after high baseline generates ATTENTION alert',
    alertsDrop.some((a) => a.type === 'PERFORMANCE_DROP' && a.severity === 'ATTENTION'),
  )

  // 9. Mark alert as read updates unread counter
  const unreadBefore = getUnreadAlertsCount(caregiverAnita.id!, patientRamesh.id!)
  if (alertsDrop.length > 0) {
    markAlertAsRead(alertsDrop[0].id)
  }
  const unreadAfter = getUnreadAlertsCount(caregiverAnita.id!, patientRamesh.id!)
  assert('9. markAlertAsRead decrements unread counter', unreadAfter < unreadBefore)

  // 10. Patient summary aggregation
  const summary = getPatientCaregiverSummary(patientRamesh.id!, caregiverAnita.id!)
  assert(
    '10. getPatientCaregiverSummary aggregates patient, games, and reminders correctly',
    summary !== null && summary.patient.name === 'Ramesh Sharma' && summary.recentGames.length >= 3,
  )

  // 11. Activity feed chronological ordering
  const feed = summary!.activityFeed
  const isChronological = feed.every((item, i) => {
    if (i === 0) return true
    return new Date(item.timestamp).getTime() <= new Date(feed[i - 1].timestamp).getTime()
  })
  assert('11. Activity feed is sorted chronologically descending', isChronological && feed.length > 0)

  // 12. Empty state handling (safe fallback when no records)
  const emptySummary = getPatientCaregiverSummary(patientUnconnected.id!, caregiverAnita.id!)
  assert(
    '12. Empty state handling: summarizes new patient without crashing',
    emptySummary !== null && emptySummary.gamesCompletedThisWeek === 0,
  )

  console.log(`\nCAREGIVER TEST RESULTS: ${passed} passed, ${failed} failed out of ${passed + failed} tests.`)
  if (failed > 0) process.exit(1)
}

runCaregiverTests()
