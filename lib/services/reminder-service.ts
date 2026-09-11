import {
  ReminderItem,
  CreateReminderInput,
  ReminderSummary,
  ReminderType,
  ReminderRecurrence,
} from '@/types/reminder'

const REMINDERS_STORAGE_KEY = 'smriti_sahayak_reminders_v1'

export function formatTime12h(time24: string): string {
  if (!time24) return ''
  const [hourStr, minStr] = time24.split(':')
  const hour = parseInt(hourStr, 10)
  if (isNaN(hour)) return time24
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minStr || '00'} ${ampm}`
}

export function getTodayDateString(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getCurrentTimeString(): string {
  const d = new Date()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

function generateDefaultReminders(patientId: string): ReminderItem[] {
  const today = getTodayDateString()
  return [
    {
      id: `rem_med_${Date.now()}_1`,
      patientId,
      title: 'Morning Blood Pressure Medication',
      description: '1 tablet after breakfast with warm water',
      type: 'MEDICINE',
      date: today,
      time: '08:00',
      recurrence: 'DAILY',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      voicePrompt: 'It is time for your morning blood pressure medicine with warm water.',
    },
    {
      id: `rem_hyd_${Date.now()}_2`,
      patientId,
      title: 'Hydration Break — Warm Water',
      description: '1 full glass of water to stay fresh',
      type: 'HYDRATION',
      date: today,
      time: '11:00',
      recurrence: 'DAILY',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      voicePrompt: 'It is time for a refreshing hydration break. Please drink a glass of water.',
    },
    {
      id: `rem_act_${Date.now()}_3`,
      patientId,
      title: 'Gentle Evening Walk in Garden',
      description: '15-minute relaxed stroll in fresh air',
      type: 'DAILY_ACTIVITY',
      date: today,
      time: '17:00',
      recurrence: 'DAILY',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      voicePrompt: 'It is time for your gentle evening stroll in the garden.',
    },
    {
      id: `rem_app_${Date.now()}_4`,
      patientId,
      title: 'Dr. Sen Medical Checkup',
      description: 'City Clinic, Room 204 — routine health review',
      type: 'MEDICAL_APPOINTMENT',
      date: today,
      time: '16:30',
      recurrence: 'ONCE',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      voicePrompt: 'You have a doctor appointment with Dr. Sen at 4:30 PM.',
    },
  ]
}

export function getAllStoredReminders(): ReminderItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(REMINDERS_STORAGE_KEY)
    if (!raw) {
      const initial = generateDefaultReminders('usr_patient_default')
      localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to load reminders from storage:', err)
    return []
  }
}

export function saveAllReminders(reminders: ReminderItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders))
    window.dispatchEvent(new CustomEvent('smriti_reminders_updated'))
  } catch (err) {
    console.error('Failed to save reminders to storage:', err)
  }
}

export function getReminders(patientId: string = 'usr_patient_default'): ReminderItem[] {
  const all = getAllStoredReminders()
  let patientItems = all.filter((r) => r.patientId === patientId)

  if (patientItems.length === 0) {
    const seeded = generateDefaultReminders(patientId)
    saveAllReminders([...all, ...seeded])
    return seeded
  }

  return checkAndUpdateMissedReminders(patientId)
}

export function getTodayReminders(patientId: string = 'usr_patient_default'): ReminderItem[] {
  const today = getTodayDateString()
  const reminders = getReminders(patientId)
  return reminders
    .filter((r) => r.date === today)
    .sort((a, b) => a.time.localeCompare(b.time))
}

export function getReminderSummary(patientId: string = 'usr_patient_default'): ReminderSummary {
  const todayItems = getTodayReminders(patientId)
  const completedToday = todayItems.filter((r) => r.status === 'COMPLETED').length
  const missedToday = todayItems.filter((r) => r.status === 'MISSED').length
  const pendingToday = todayItems.filter((r) => r.status === 'PENDING').length

  return {
    totalToday: todayItems.length,
    completedToday,
    pendingToday,
    missedToday,
  }
}

export function createReminder(input: CreateReminderInput): ReminderItem {
  const all = getAllStoredReminders()

  let voicePrompt = `Reminder: ${input.title}.`
  if (input.type === 'MEDICINE') {
    voicePrompt = `It is time to take your medicine: ${input.title}.`
  } else if (input.type === 'HYDRATION') {
    voicePrompt = `Hydration reminder: ${input.title}. Please drink some water.`
  } else if (input.type === 'MEDICAL_APPOINTMENT') {
    voicePrompt = `Appointment reminder: ${input.title} at ${formatTime12h(input.time)}.`
  }

  const newReminder: ReminderItem = {
    id: `rem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    patientId: input.patientId,
    title: input.title.trim(),
    description: input.description?.trim(),
    type: input.type,
    date: input.date || getTodayDateString(),
    time: input.time,
    recurrence: input.recurrence,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    voicePrompt,
  }

  const updated = [newReminder, ...all]
  saveAllReminders(updated)
  return newReminder
}

export function updateReminder(
  id: string,
  updates: Partial<Omit<ReminderItem, 'id' | 'patientId' | 'createdAt'>>,
): ReminderItem | null {
  const all = getAllStoredReminders()
  const idx = all.findIndex((r) => r.id === id)
  if (idx === -1) return null

  const updatedItem: ReminderItem = {
    ...all[idx],
    ...updates,
  }

  all[idx] = updatedItem
  saveAllReminders(all)
  return updatedItem
}

export function deleteReminder(id: string): boolean {
  const all = getAllStoredReminders()
  const filtered = all.filter((r) => r.id !== id)
  if (filtered.length === all.length) return false
  saveAllReminders(filtered)
  return true
}

export function completeReminder(id: string): ReminderItem | null {
  const all = getAllStoredReminders()
  const item = all.find((r) => r.id === id)
  if (!item) return null

  const completedItem: ReminderItem = {
    ...item,
    status: 'COMPLETED',
    completedAt: new Date().toISOString(),
  }

  const updatedList = all.map((r) => (r.id === id ? completedItem : r))

  // If daily or weekly recurring, schedule the next occurrence
  if (item.recurrence === 'DAILY' || item.recurrence === 'WEEKLY') {
    const daysToAdd = item.recurrence === 'DAILY' ? 1 : 7
    const [y, m, d] = item.date.split('-').map(Number)
    const nextDate = new Date(Date.UTC(y, m - 1, d + daysToAdd))
    const nextDateStr = nextDate.toISOString().split('T')[0]

    const alreadyExists = all.some(
      (r) =>
        r.patientId === item.patientId &&
        r.title === item.title &&
        r.date === nextDateStr &&
        r.time === item.time,
    )

    if (!alreadyExists) {
      const nextReminder: ReminderItem = {
        id: `rem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        patientId: item.patientId,
        title: item.title,
        description: item.description,
        type: item.type,
        date: nextDateStr,
        time: item.time,
        recurrence: item.recurrence,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        voicePrompt: item.voicePrompt,
      }
      updatedList.push(nextReminder)
    }
  }

  saveAllReminders(updatedList)
  return completedItem
}

export function checkAndUpdateMissedReminders(patientId?: string): ReminderItem[] {
  const all = getAllStoredReminders()
  const today = getTodayDateString()
  const currentTime = getCurrentTimeString()
  let hasChanges = false

  const updatedAll = all.map((r) => {
    if (patientId && r.patientId !== patientId) return r

    if (r.status === 'PENDING') {
      const isPastDate = r.date < today
      const isTodayAndPastTime = r.date === today && r.time < currentTime

      if (isPastDate || isTodayAndPastTime) {
        hasChanges = true
        return {
          ...r,
          status: 'MISSED' as const,
        }
      }
    }
    return r
  })

  if (hasChanges) {
    saveAllReminders(updatedAll)
  }

  return patientId ? updatedAll.filter((r) => r.patientId === patientId) : updatedAll
}
