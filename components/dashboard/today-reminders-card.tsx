'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BellRing,
  Pill,
  Droplets,
  Footprints,
  Calendar,
  CheckCircle2,
  Circle,
  ArrowRight,
  Plus,
} from 'lucide-react'
import type { ReminderItem as MockReminderItem } from '@/data/mock-patient-dashboard'
import type { ReminderItem, ReminderType } from '@/types/reminder'
import {
  getTodayReminders,
  getReminderSummary,
  completeReminder,
  formatTime12h,
} from '@/lib/services/reminder-service'
import { getCurrentUser } from '@/lib/services/auth-service'
import { useLanguage } from '@/context/language-context'

export function TodayRemindersCard({
  reminders: initialMockReminders,
}: {
  reminders?: MockReminderItem[]
}) {
  const { t } = useLanguage()
  const [reminders, setReminders] = useState<ReminderItem[]>([])
  const [summary, setSummary] = useState({ totalToday: 0, completedToday: 0 })

  const loadData = () => {
    const user = getCurrentUser()
    const patientId = user?.id || 'usr_patient_default'
    const todayList = getTodayReminders(patientId)
    const sum = getReminderSummary(patientId)
    setReminders(todayList)
    setSummary({ totalToday: sum.totalToday, completedToday: sum.completedToday })
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('smriti_reminders_updated', handleUpdate)
    return () => window.removeEventListener('smriti_reminders_updated', handleUpdate)
  }, [])

  const handleToggle = (id: string, currentStatus: string) => {
    if (currentStatus !== 'COMPLETED') {
      completeReminder(id)
    }
  }

  const getIcon = (type: ReminderType) => {
    switch (type) {
      case 'MEDICINE':
        return <Pill className="size-6 text-rose-700" />
      case 'HYDRATION':
        return <Droplets className="size-6 text-sky-700" />
      case 'DAILY_ACTIVITY':
        return <Footprints className="size-6 text-emerald-700" />
      case 'MEDICAL_APPOINTMENT':
        return <Calendar className="size-6 text-amber-700" />
    }
  }

  const getToneStyle = (type: ReminderType) => {
    switch (type) {
      case 'MEDICINE':
        return 'bg-rose-100/90 text-rose-900 border-rose-200'
      case 'HYDRATION':
        return 'bg-sky-100/90 text-sky-900 border-sky-200'
      case 'DAILY_ACTIVITY':
        return 'bg-emerald-100/90 text-emerald-900 border-emerald-200'
      case 'MEDICAL_APPOINTMENT':
        return 'bg-amber-100/90 text-amber-900 border-amber-200'
    }
  }

  return (
    <div className="w-full rounded-[2rem] border border-white/70 bg-card/90 p-6 sm:p-7 shadow-[0_12px_35px_rgba(44,61,50,0.16)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_18px_45px_rgba(44,61,50,0.22)]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3 text-primary font-bold text-xl sm:text-2xl">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <BellRing className="size-6" strokeWidth={2} />
          </div>
          <span>{t('reminders.title')}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3.5 py-1 text-sm sm:text-base font-bold text-primary">
            {summary.completedToday} / {summary.totalToday} {t('common.completed')}
          </span>

          <Link
            href="/reminders"
            className="flex items-center gap-1 text-base font-bold text-primary hover:underline"
          >
            <span>{t('common.viewAll')}</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="mt-5 space-y-3.5">
        {reminders.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-base font-medium">{t('reminders.emptyState')}</p>
            <Link
              href="/reminders"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
            >
              <Plus className="size-4" /> {t('reminders.addNew')}
            </Link>
          </div>
        ) : (
          reminders.map((item) => {
            const isCompleted = item.status === 'COMPLETED'

            return (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id, item.status)}
                className={`group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                  isCompleted
                    ? 'bg-secondary/40 border-border/50 opacity-80'
                    : 'bg-card/95 border-white/80 shadow-sm hover:border-primary/40 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border ${getToneStyle(
                      item.type,
                    )}`}
                  >
                    {getIcon(item.type)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-lg sm:text-xl font-bold leading-tight ${
                          isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs sm:text-sm font-semibold text-muted-foreground">
                        {formatTime12h(item.time)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-sm sm:text-base font-medium text-muted-foreground truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={`Mark ${item.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
                  className="shrink-0 text-primary transition-transform group-hover:scale-110"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="size-8 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="size-8 text-muted-foreground/60 hover:text-emerald-600" />
                  )}
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
