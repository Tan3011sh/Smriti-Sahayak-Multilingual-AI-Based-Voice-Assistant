import {
  createReminder,
  updateReminder,
  deleteReminder,
  completeReminder,
  getReminders,
  getTodayReminders,
  getReminderSummary,
  checkAndUpdateMissedReminders,
  formatTime12h,
  getTodayDateString,
} from '../lib/services/reminder-service'
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

function runReminderTests() {
  console.log('--- RUNNING MEMORY ASSISTANCE & REMINDER TEST SUITE ---\n')
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

  const patientA = 'test_patient_alpha'
  const patientB = 'test_patient_beta'
  const today = getTodayDateString()

  // 1. Create Medicine reminder
  const med = createReminder({
    patientId: patientA,
    title: 'Morning Heart Medication',
    description: '1 tablet after breakfast',
    type: 'MEDICINE',
    date: today,
    time: '08:00',
    recurrence: 'DAILY',
  })
  assert('1. Create Medicine Reminder', med.type === 'MEDICINE' && med.title === 'Morning Heart Medication' && med.status === 'PENDING')

  // 2. Create Hydration reminder
  const hyd = createReminder({
    patientId: patientA,
    title: 'Drink 1 Glass of Water',
    type: 'HYDRATION',
    date: today,
    time: '10:30',
    recurrence: 'DAILY',
  })
  assert('2. Create Hydration Reminder', hyd.type === 'HYDRATION' && hyd.status === 'PENDING')

  // 3. Create Daily Activity reminder
  const act = createReminder({
    patientId: patientA,
    title: 'Afternoon Garden Walk',
    description: '15 mins walking in sunlight',
    type: 'DAILY_ACTIVITY',
    date: today,
    time: '16:00',
    recurrence: 'DAILY',
  })
  assert('3. Create Daily Activity Reminder', act.type === 'DAILY_ACTIVITY' && act.recurrence === 'DAILY')

  // 4. Create Medical Appointment reminder
  const app = createReminder({
    patientId: patientA,
    title: 'Dr. Sen Clinic Visit',
    description: 'Room 204 routine checkup',
    type: 'MEDICAL_APPOINTMENT',
    date: today,
    time: '17:30',
    recurrence: 'ONCE',
  })
  assert('4. Create Medical Appointment Reminder', app.type === 'MEDICAL_APPOINTMENT' && app.recurrence === 'ONCE')

  // 5. Edit Reminder
  const edited = updateReminder(med.id, {
    title: 'Morning Blood Pressure Medication (Updated)',
    time: '08:30',
  })
  assert('5. Edit Reminder', edited !== null && edited.title.includes('Updated') && edited.time === '08:30')

  // 6. Delete Reminder
  const toDelete = createReminder({
    patientId: patientA,
    title: 'Temporary Reminder to Delete',
    type: 'HYDRATION',
    date: today,
    time: '12:00',
    recurrence: 'ONCE',
  })
  const deleteResult = deleteReminder(toDelete.id)
  const remaining = getReminders(patientA)
  assert('6. Delete Reminder with Confirmation', deleteResult === true && !remaining.some((r) => r.id === toDelete.id))

  // 7. Mark Reminder Complete
  const completedMed = completeReminder(med.id)
  assert(
    '7. Mark Reminder Complete (status COMPLETED, records completedAt)',
    completedMed !== null && completedMed.status === 'COMPLETED' && completedMed.completedAt !== undefined,
  )

  // 8. Recurring Reminder Behavior: completing DAILY creates next occurrence
  const allPatA = getReminders(patientA)
  const [y, m, d] = today.split('-').map(Number)
  const tomorrowStr = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().split('T')[0]
  const nextScheduled = allPatA.find(
    (r) => r.title === completedMed!.title && r.date === tomorrowStr && r.status === 'PENDING',
  )
  assert('8. Daily Recurring Reminder schedules next occurrence for tomorrow', nextScheduled !== undefined)

  // 9. Completion Count & Summary
  const summaryA = getReminderSummary(patientA)
  assert(
    '9. Today summary counts completed vs total correctly',
    summaryA.totalToday >= 3 && summaryA.completedToday >= 1,
    `Total: ${summaryA.totalToday}, Completed: ${summaryA.completedToday}`,
  )

  // 10. Missed Reminder Detection
  const overdueReminder = createReminder({
    patientId: patientA,
    title: 'Early Morning Water (Overdue)',
    type: 'HYDRATION',
    date: '2020-01-01',
    time: '06:00',
    recurrence: 'ONCE',
  })
  checkAndUpdateMissedReminders(patientA)
  const updatedOverdue = getReminders(patientA).find((r) => r.id === overdueReminder.id)
  assert('10. Past pending reminders correctly marked as MISSED', updatedOverdue?.status === 'MISSED')

  // 11. Patient-specific isolation (Patient A vs Patient B)
  const medB = createReminder({
    patientId: patientB,
    title: 'Patient B Specific Reminder',
    type: 'MEDICINE',
    date: today,
    time: '09:00',
    recurrence: 'DAILY',
  })
  const listA = getReminders(patientA)
  const listB = getReminders(patientB)
  assert(
    '11. Patient-specific data isolation: Patient A does not see Patient B reminders',
    !listA.some((r) => r.title === 'Patient B Specific Reminder') && listB.some((r) => r.title === 'Patient B Specific Reminder'),
  )

  // 12. Time formatting helper
  assert('12. 12-hour time format converts 09:00 to 9:00 AM and 16:30 to 4:30 PM', formatTime12h('09:00') === '9:00 AM' && formatTime12h('16:30') === '4:30 PM')

  console.log(`\nREMINDER TEST RESULTS: ${passed} passed, ${failed} failed out of ${passed + failed} tests.`)
  if (failed > 0) process.exit(1)
}

runReminderTests()
