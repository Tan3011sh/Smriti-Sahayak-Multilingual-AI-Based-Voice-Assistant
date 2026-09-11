'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft,
  Plus,
  Pill,
  Droplets,
  Footprints,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit2,
  AlertCircle,
  Volume2,
  Repeat,
  History,
  Sparkles,
  Check,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReminderItem, ReminderType, ReminderRecurrence, ReminderStatus } from '@/types/reminder'
import {
  getReminders,
  getTodayReminders,
  getReminderSummary,
  createReminder,
  updateReminder,
  deleteReminder,
  completeReminder,
  formatTime12h,
  getTodayDateString,
} from '@/lib/services/reminder-service'
import { getCurrentUser } from '@/lib/services/auth-service'
import { useLanguage } from '@/context/language-context'
import { LanguageSelector } from '@/components/ui/language-selector'

const REMINDER_TYPES: { type: ReminderType; label: string; icon: typeof Pill; tone: string; hint: string }[] = [
  {
    type: 'MEDICINE',
    label: 'Medicine',
    icon: Pill,
    tone: 'rose',
    hint: 'e.g. Blood pressure tablet after breakfast',
  },
  {
    type: 'HYDRATION',
    label: 'Hydration',
    icon: Droplets,
    tone: 'sky',
    hint: 'e.g. Warm water break',
  },
  {
    type: 'DAILY_ACTIVITY',
    label: 'Daily Activity',
    icon: Footprints,
    tone: 'emerald',
    hint: 'e.g. Evening walk in garden',
  },
  {
    type: 'MEDICAL_APPOINTMENT',
    label: 'Doctor Visit',
    icon: Calendar,
    tone: 'amber',
    hint: 'e.g. Health checkup at City Clinic',
  },
]

export default function RemindersPage() {
  const { t } = useLanguage()
  const [patientId, setPatientId] = useState<string>('usr_patient_default')
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today')

  const [todayList, setTodayList] = useState<ReminderItem[]>([])
  const [allList, setAllList] = useState<ReminderItem[]>([])
  const [summary, setSummary] = useState({
    totalToday: 0,
    completedToday: 0,
    pendingToday: 0,
    missedToday: 0,
  })

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Form states
  const [formType, setFormType] = useState<ReminderType>('MEDICINE')
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formDate, setFormDate] = useState(getTodayDateString())
  const [formTime, setFormTime] = useState('09:00')
  const [formRecurrence, setFormRecurrence] = useState<ReminderRecurrence>('DAILY')

  // Load reminders
  const reloadData = () => {
    const user = getCurrentUser()
    const pId = user?.id || 'usr_patient_default'
    setPatientId(pId)

    const today = getTodayReminders(pId)
    const all = getReminders(pId)
    const sum = getReminderSummary(pId)

    setTodayList(today)
    setAllList(all)
    setSummary(sum)
  }

  useEffect(() => {
    reloadData()

    const handleUpdate = () => reloadData()
    window.addEventListener('smriti_reminders_updated', handleUpdate)
    return () => window.removeEventListener('smriti_reminders_updated', handleUpdate)
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    setFormType('MEDICINE')
    setFormTitle('')
    setFormDescription('')
    setFormDate(getTodayDateString())
    setFormTime('09:00')
    setFormRecurrence('DAILY')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: ReminderItem) => {
    setEditingId(item.id)
    setFormType(item.type)
    setFormTitle(item.title)
    setFormDescription(item.description || '')
    setFormDate(item.date)
    setFormTime(item.time)
    setFormRecurrence(item.recurrence)
    setIsModalOpen(true)
  }

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return

    if (editingId) {
      updateReminder(editingId, {
        type: formType,
        title: formTitle,
        description: formDescription,
        date: formDate,
        time: formTime,
        recurrence: formRecurrence,
      })
      showToast('Reminder updated successfully!')
    } else {
      createReminder({
        patientId,
        type: formType,
        title: formTitle,
        description: formDescription,
        date: formDate,
        time: formTime,
        recurrence: formRecurrence,
      })
      showToast('New reminder scheduled!')
    }

    setIsModalOpen(false)
    reloadData()
  }

  const handleMarkComplete = (id: string) => {
    completeReminder(id)
    showToast(t('reminders.completedToast'))
    reloadData()
  }

  const handleDelete = (id: string) => {
    deleteReminder(id)
    setConfirmDeleteId(null)
    showToast('Reminder removed.')
    reloadData()
  }

  const getIconComponent = (type: ReminderType) => {
    switch (type) {
      case 'MEDICINE':
        return <Pill className="size-7 text-rose-700" />
      case 'HYDRATION':
        return <Droplets className="size-7 text-sky-700" />
      case 'DAILY_ACTIVITY':
        return <Footprints className="size-7 text-emerald-700" />
      case 'MEDICAL_APPOINTMENT':
        return <Calendar className="size-7 text-amber-700" />
    }
  }

  const getBadgeStyle = (type: ReminderType) => {
    switch (type) {
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
    <main className="relative min-h-svh overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* Mountain & Calm Mist Background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mountain-background.jpg')" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] bg-background/35 backdrop-blur-md"
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Top Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6">
          <Link
            href="/"
            aria-label={t('common.back')}
            className="flex items-center gap-2 rounded-full border border-white/80 bg-card/95 px-5 py-2.5 text-base sm:text-lg font-bold text-foreground shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
          >
            <ArrowLeft className="size-6 text-primary" strokeWidth={2.2} />
            <span>{t('common.back')}</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSelector variant="compact" />
            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-base sm:text-lg font-bold text-primary-foreground shadow-lg transition-all hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
            >
              <Plus className="size-6" strokeWidth={2.5} />
              <span>{t('reminders.addNew')}</span>
            </button>
          </div>
        </header>

        {/* Page Title & Completion Summary Banner */}
        <div className="mb-6 rounded-[2rem] border border-white/80 bg-card/95 p-6 sm:p-8 shadow-[0_16px_40px_rgba(44,61,50,0.18)] backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {t('reminders.title')}
              </h1>
              <p className="mt-1 text-base sm:text-lg font-medium text-muted-foreground">
                {t('reminders.subtitle')}
              </p>
            </div>

            {/* Completion Summary Card */}
            <div className="rounded-2xl bg-primary/10 border border-primary/25 px-5 py-3 text-center sm:text-right shrink-0">
              <span className="text-xs sm:text-sm font-bold uppercase text-primary tracking-wider">
                Today's Progress
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {summary.completedToday} of {summary.totalToday} <span className="text-lg font-bold text-muted-foreground">completed</span>
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="mt-6 flex rounded-2xl bg-secondary/70 p-1.5 border border-border/50 max-w-md">
            <button
              type="button"
              onClick={() => setActiveTab('today')}
              className={cn(
                'flex-1 py-2.5 rounded-xl font-bold text-base sm:text-lg transition-all duration-200',
                activeTab === 'today'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Today's Schedule ({todayList.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={cn(
                'flex-1 py-2.5 rounded-xl font-bold text-base sm:text-lg transition-all duration-200',
                activeTab === 'history'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              All & History ({allList.length})
            </button>
          </div>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 rounded-2xl bg-emerald-700 text-white p-4 font-bold text-lg shadow-lg flex items-center gap-3"
          >
            <Check className="size-6" />
            <span>{toastMessage}</span>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* TODAY'S REMINDERS LIST */}
        {/* ============================================================ */}
        {activeTab === 'today' && (
          <div className="space-y-4 pb-12">
            {todayList.length === 0 ? (
              <div className="rounded-[2rem] border border-white/80 bg-card/90 p-10 text-center shadow-md">
                <p className="text-xl font-bold text-foreground">{t('reminders.emptyState')}</p>
              </div>
            ) : (
              todayList.map((item) => {
                const isCompleted = item.status === 'COMPLETED'
                const isMissed = item.status === 'MISSED'

                return (
                  <div
                    key={item.id}
                    className={cn(
                      'rounded-[2rem] border p-5 sm:p-7 backdrop-blur-md transition-all duration-200 shadow-md',
                      isCompleted
                        ? 'bg-card/75 border-border/60 opacity-85'
                        : isMissed
                        ? 'bg-card/95 border-amber-300'
                        : 'bg-card/95 border-white/80 hover:shadow-lg',
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Type Icon & Info */}
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        <div
                          className={`flex size-14 shrink-0 items-center justify-center rounded-2xl border-2 ${getBadgeStyle(
                            item.type,
                          )}`}
                        >
                          {getIconComponent(item.type)}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-foreground flex items-center gap-1.5">
                              <Clock className="size-4 text-primary" />
                              {formatTime12h(item.time)}
                            </span>

                            {item.recurrence !== 'ONCE' && (
                              <span className="rounded-lg bg-secondary/80 px-2.5 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                <Repeat className="size-3" />
                                {item.recurrence}
                              </span>
                            )}

                            {isCompleted && (
                              <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 flex items-center gap-1">
                                <CheckCircle2 className="size-3.5" /> Completed
                              </span>
                            )}

                            {isMissed && (
                              <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                                Overdue
                              </span>
                            )}
                          </div>

                          <h2
                            className={cn(
                              'text-xl sm:text-2xl font-bold leading-tight',
                              isCompleted ? 'line-through text-muted-foreground' : 'text-foreground',
                            )}
                          >
                            {item.title}
                          </h2>

                          {item.description && (
                            <p className="text-sm sm:text-base font-medium text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
                        {!isCompleted && (
                          <button
                            type="button"
                            onClick={() => handleMarkComplete(item.id)}
                            className="h-14 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base sm:text-lg shadow-md transition-all active:scale-95 flex items-center gap-2"
                          >
                            <CheckCircle2 className="size-6" />
                            <span>{t('reminders.markComplete')}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="size-12 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground flex items-center justify-center transition-transform active:scale-95"
                          title="Edit reminder"
                        >
                          <Edit2 className="size-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="size-12 rounded-2xl bg-secondary hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-transform active:scale-95"
                          title="Delete reminder"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* ALL & HISTORY LIST */}
        {/* ============================================================ */}
        {activeTab === 'history' && (
          <div className="space-y-4 pb-12">
            {allList.length === 0 ? (
              <div className="rounded-[2rem] border border-white/80 bg-card/90 p-10 text-center shadow-md">
                <p className="text-xl font-bold text-foreground">No reminder history recorded yet.</p>
              </div>
            ) : (
              allList.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[2rem] border border-white/80 bg-card/90 p-5 sm:p-6 backdrop-blur-md shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border ${getBadgeStyle(item.type)}`}>
                      {getIconComponent(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{formatTime12h(item.time)}</span>
                        <span>•</span>
                        <span className={cn(
                          'font-bold px-2 py-0.5 rounded-md',
                          item.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : item.status === 'MISSED' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                        )}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-foreground">{item.title}</p>
                      {item.completedAt && (
                        <p className="text-xs text-emerald-700 font-medium">
                          Completed on: {new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(item.id)}
                    className="size-10 rounded-xl bg-secondary hover:text-destructive flex items-center justify-center self-end sm:self-auto"
                    title="Delete record"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* ADD / EDIT MODAL FORM */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl rounded-[2.5rem] border-2 border-white/80 bg-card/95 p-6 sm:p-8 shadow-[0_25px_60px_rgba(44,61,50,0.25)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {editingId ? 'Edit Reminder' : 'Add New Reminder'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="size-10 rounded-full bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="mt-6 space-y-4">
              {/* Type Selector */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Select Reminder Type:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {REMINDER_TYPES.map(({ type, label, icon: Icon, tone }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormType(type)}
                      className={cn(
                        'flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all text-center',
                        formType === type
                          ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm scale-105'
                          : 'border-border/60 bg-secondary/50 text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <Icon className="size-6 mb-1" />
                      <span className="text-xs sm:text-sm">{t(`reminders.types.${type}`) || label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Reminder Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Morning Blood Pressure Medicine"
                  className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/90 px-4 text-lg font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Details / Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. 1 tablet after breakfast with warm water"
                  className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/90 px-4 text-base font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/90 px-4 text-base font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/90 px-4 text-base font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Recurrence */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Recurrence
                </label>
                <select
                  value={formRecurrence}
                  onChange={(e) => setFormRecurrence(e.target.value as ReminderRecurrence)}
                  className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/90 px-4 text-base font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                >
                  <option value="DAILY">Repeat Daily (Recommended for medicine/water)</option>
                  <option value="ONCE">Once Only (For appointment/event)</option>
                  <option value="WEEKLY">Repeat Weekly</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  {editingId ? 'Update Reminder' : 'Save Reminder'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 h-14 rounded-2xl bg-secondary text-foreground text-lg font-bold hover:bg-secondary/80 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ============================================================ */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-[2.5rem] border-2 border-white/80 bg-card/95 p-6 sm:p-8 shadow-[0_25px_60px_rgba(44,61,50,0.25)] text-center"
          >
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
              <Trash2 className="size-8" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Delete Reminder?</h3>
            <p className="mt-2 text-base text-muted-foreground font-medium">
              Are you sure you want to remove this reminder from your schedule?
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 h-14 rounded-2xl bg-destructive text-destructive-foreground text-lg font-bold shadow-md hover:brightness-110 active:scale-95"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 h-14 rounded-2xl bg-secondary text-foreground text-lg font-bold hover:bg-secondary/80 active:scale-95"
              >
                Keep It
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  )
}
