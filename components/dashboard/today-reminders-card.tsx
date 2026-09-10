'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import type { ReminderItem } from '@/data/mock-patient-dashboard'

export function TodayRemindersCard({ reminders: initialReminders }: { reminders: ReminderItem[] }) {
  const [reminders, setReminders] = useState(initialReminders)

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)),
    )
  }

  const getIcon = (type: ReminderItem['type']) => {
    switch (type) {
      case 'medicine':
        return <Pill className="size-6 text-rose-700" />
      case 'hydration':
        return <Droplets className="size-6 text-sky-700" />
      case 'activity':
        return <Footprints className="size-6 text-emerald-700" />
      case 'appointment':
        return <Calendar className="size-6 text-amber-700" />
    }
  }

  const getToneStyle = (type: ReminderItem['type']) => {
    switch (type) {
      case 'medicine':
        return 'bg-rose-100/90 text-rose-900 border-rose-200'
      case 'hydration':
        return 'bg-sky-100/90 text-sky-900 border-sky-200'
      case 'activity':
        return 'bg-emerald-100/90 text-emerald-900 border-emerald-200'
      case 'appointment':
        return 'bg-amber-100/90 text-amber-900 border-amber-200'
    }
  }

  return (
    <div className="w-full rounded-[2rem] border border-white/70 bg-card/90 p-6 sm:p-7 shadow-[0_12px_35px_rgba(44,61,50,0.16)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_18px_45px_rgba(44,61,50,0.22)]">
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3 text-primary font-bold text-xl sm:text-2xl">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <BellRing className="size-6" strokeWidth={2} />
          </div>
          <span>Today's Reminders</span>
        </div>

        <Link
          href="/todo"
          className="flex items-center gap-1 text-base font-bold text-primary hover:underline"
        >
          <span>View All</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-5 space-y-3.5">
        {reminders.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleReminder(item.id)}
            className={`group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 ${
              item.completed
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
                      item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs sm:text-sm font-semibold text-muted-foreground">
                    {item.time}
                  </span>
                </div>
                {item.detail && (
                  <p className="mt-1 text-sm sm:text-base font-medium text-muted-foreground truncate">
                    {item.detail}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              aria-label={`Mark ${item.title} as ${item.completed ? 'incomplete' : 'complete'}`}
              className="shrink-0 text-primary transition-transform group-hover:scale-110"
            >
              {item.completed ? (
                <CheckCircle2 className="size-8 text-emerald-600 fill-emerald-100" />
              ) : (
                <Circle className="size-8 text-muted-foreground/60" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
