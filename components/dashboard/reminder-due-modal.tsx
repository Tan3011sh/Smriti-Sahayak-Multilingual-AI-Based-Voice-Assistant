'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Pill, Droplets, Footprints, Calendar, CheckCircle2, X, Volume2, BellRing } from 'lucide-react'
import { ReminderItem } from '@/types/reminder'
import {
  getTodayReminders,
  completeReminder,
  formatTime12h,
  getCurrentTimeString,
} from '@/lib/services/reminder-service'
import { getCurrentUser } from '@/lib/services/auth-service'

export function ReminderDueModal() {
  const [dueReminder, setDueReminder] = useState<ReminderItem | null>(null)
  const [dismissedIds, setDismissedIds] = useState<string[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.85
        utterance.pitch = 1.0
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
      } catch (err) {
        console.warn('Speech synthesis error:', err)
      }
    }
  }

  // Check for due reminders periodically (every 15 seconds)
  useEffect(() => {
    const checkDueReminders = () => {
      const user = getCurrentUser()
      const patientId = user?.id || 'usr_patient_default'
      const todayReminders = getTodayReminders(patientId)
      const currentTime = getCurrentTimeString()

      // Find any pending reminder that is scheduled for today and is currently due or overdue within recent hours
      const due = todayReminders.find((r) => {
        if (r.status !== 'PENDING') return false
        if (dismissedIds.includes(r.id)) return false

        // Check if current time is equal or slightly past reminder time (within 60 mins)
        const [rHour, rMin] = r.time.split(':').map(Number)
        const [cHour, cMin] = currentTime.split(':').map(Number)
        const rTotalMin = rHour * 60 + rMin
        const cTotalMin = cHour * 60 + cMin

        // Due if current time is within [rTotalMin - 2, rTotalMin + 45]
        return cTotalMin >= rTotalMin - 2 && cTotalMin <= rTotalMin + 45
      })

      if (due && (!dueReminder || dueReminder.id !== due.id)) {
        setDueReminder(due)
      }
    }

    checkDueReminders()
    const interval = setInterval(checkDueReminders, 15000)

    const handleRemindersUpdated = () => {
      checkDueReminders()
    }
    window.addEventListener('smriti_reminders_updated', handleRemindersUpdated)

    return () => {
      clearInterval(interval)
      window.removeEventListener('smriti_reminders_updated', handleRemindersUpdated)
    }
  }, [dismissedIds, dueReminder])

  const handleComplete = (id: string) => {
    completeReminder(id)
    speakText('Great! Reminder marked as completed.')
    setDueReminder(null)
  }

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id])
    setDueReminder(null)
  }

  if (!dueReminder) return null

  const getIcon = () => {
    switch (dueReminder.type) {
      case 'MEDICINE':
        return <Pill className="size-10 text-rose-700" />
      case 'HYDRATION':
        return <Droplets className="size-10 text-sky-700" />
      case 'DAILY_ACTIVITY':
        return <Footprints className="size-10 text-emerald-700" />
      case 'MEDICAL_APPOINTMENT':
        return <Calendar className="size-10 text-amber-700" />
    }
  }

  const getBadgeStyle = () => {
    switch (dueReminder.type) {
      case 'MEDICINE':
        return 'bg-rose-100 text-rose-900 border-rose-200'
      case 'HYDRATION':
        return 'bg-sky-100 text-sky-900 border-sky-200'
      case 'DAILY_ACTIVITY':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200'
      case 'MEDICAL_APPOINTMENT':
        return 'bg-amber-100 text-amber-900 border-amber-200'
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg rounded-[2.5rem] border-2 border-white/80 bg-card/95 p-6 sm:p-8 shadow-[0_25px_60px_rgba(44,61,50,0.25)] backdrop-blur-xl text-center"
        >
          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => handleDismiss(dueReminder.id)}
            className="absolute right-5 top-5 size-10 rounded-full bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-transform active:scale-95"
            aria-label="Dismiss reminder"
          >
            <X className="size-5" />
          </button>

          {/* Reminder Icon */}
          <div className="mx-auto flex size-20 items-center justify-center rounded-3xl border-2 mb-4 shadow-sm" style={{}}>
            <div className={`flex size-full items-center justify-center rounded-3xl ${getBadgeStyle()}`}>
              {getIcon()}
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-bold text-primary mb-2">
            <BellRing className="size-4 animate-bounce" />
            <span>Reminder Due Now • {formatTime12h(dueReminder.time)}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mt-1">
            {dueReminder.title}
          </h2>

          {dueReminder.description && (
            <p className="mt-2 text-base sm:text-lg text-muted-foreground font-medium max-w-sm mx-auto">
              {dueReminder.description}
            </p>
          )}

          {/* Actions */}
          <div className="mt-6 space-y-3 pt-2">
            <button
              type="button"
              onClick={() => handleComplete(dueReminder.id)}
              className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-bold shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <CheckCircle2 className="size-7" />
              <span>Mark Complete</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  speakText(
                    dueReminder.voicePrompt ||
                      `It is time for your reminder: ${dueReminder.title}.`,
                  )
                }
                className="flex-1 h-12 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all"
              >
                <Volume2 className="size-4 text-primary" />
                <span>{isSpeaking ? 'Listening...' : 'Read Aloud'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDismiss(dueReminder.id)}
                className="flex-1 h-12 rounded-xl border border-border/80 bg-background/80 hover:bg-background text-muted-foreground font-bold text-sm sm:text-base transition-all"
              >
                Remind Later
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
