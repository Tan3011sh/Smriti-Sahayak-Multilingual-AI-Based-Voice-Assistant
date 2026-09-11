'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  User,
  Activity,
  Brain,
  Clock,
  Compass,
  BellRing,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Circle,
  Calendar,
  Pill,
  Droplets,
  Footprints,
  CheckCheck,
  ShieldCheck,
  History,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DynamicBackground } from '@/components/dashboard/dynamic-background'
import { getCurrentUser } from '@/lib/services/auth-service'
import {
  getPatientCaregiverSummary,
  isCaregiverAuthorizedForPatient,
  PatientCaregiverSummary,
} from '@/lib/services/caregiver-service'
import { markAlertAsRead, markAllAlertsAsRead } from '@/lib/services/alert-service'
import { formatTime12h } from '@/lib/services/reminder-service'
import type { AlertSeverity } from '@/types/alert'

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ patientId: string }>
}) {
  const resolvedParams = use(params)
  const patientId = resolvedParams.patientId

  const router = useRouter()
  const [summary, setSummary] = useState<PatientCaregiverSummary | null>(null)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'games' | 'reminders' | 'alerts' | 'feed'>('overview')

  const loadData = () => {
    const caregiver = getCurrentUser()
    if (!caregiver || caregiver.role !== 'caregiver') {
      setIsAuthorized(false)
      return
    }

    const authorized = isCaregiverAuthorizedForPatient(caregiver, patientId)
    setIsAuthorized(authorized)

    if (authorized) {
      const data = getPatientCaregiverSummary(patientId, caregiver.id || 'usr_caregiver_default')
      setSummary(data)
    }
  }

  useEffect(() => {
    loadData()

    const handleUpdate = () => loadData()
    window.addEventListener('smriti_alerts_updated', handleUpdate)
    window.addEventListener('smriti_game_completed', handleUpdate)
    window.addEventListener('smriti_reminders_updated', handleUpdate)

    return () => {
      window.removeEventListener('smriti_alerts_updated', handleUpdate)
      window.removeEventListener('smriti_game_completed', handleUpdate)
      window.removeEventListener('smriti_reminders_updated', handleUpdate)
    }
  }, [patientId])

  const handleMarkAlert = (alertId: string) => {
    markAlertAsRead(alertId)
    loadData()
  }

  const handleMarkAllAlerts = () => {
    const caregiver = getCurrentUser()
    if (caregiver) {
      markAllAlertsAsRead(caregiver.id || 'usr_caregiver_default', patientId)
      loadData()
    }
  }

  if (isAuthorized === false) {
    return (
      <main className="relative isolate min-h-svh flex items-center justify-center p-6">
        <DynamicBackground />
        <div className="relative z-10 w-full max-w-md rounded-[2.5rem] border-2 border-white/80 bg-card/95 p-8 shadow-2xl backdrop-blur-xl text-center">
          <AlertCircle className="size-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Access Restricted</h2>
          <p className="mt-2 text-base text-muted-foreground font-medium">
            You do not have caregiver authorization to view records for this patient.
          </p>
          <Link
            href="/caregiver"
            className="mt-6 inline-flex w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg items-center justify-center shadow-md hover:brightness-110"
          >
            Back to Caregiver Portal
          </Link>
        </div>
      </main>
    )
  }

  if (!summary) {
    return (
      <div className="min-h-svh flex items-center justify-center text-primary font-bold text-xl">
        Loading Patient Details...
      </div>
    )
  }

  const { patient, reminderSummary, recommendation, latestGame, alerts } = summary

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'IMPORTANT':
        return 'bg-rose-100 text-rose-900 border-rose-300'
      case 'ATTENTION':
        return 'bg-amber-100 text-amber-900 border-amber-300'
      case 'INFO':
        return 'bg-sky-100 text-sky-900 border-sky-300'
    }
  }

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'IMPORTANT':
        return <AlertCircle className="size-5 text-rose-700 shrink-0" />
      case 'ATTENTION':
        return <AlertTriangle className="size-5 text-amber-700 shrink-0" />
      case 'INFO':
        return <Info className="size-5 text-sky-700 shrink-0" />
    }
  }

  return (
    <main className="relative isolate min-h-svh flex flex-col overflow-x-hidden p-4 sm:p-8 lg:p-10">
      <DynamicBackground />

      {/* Top Header */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/40">
        <div className="flex items-center gap-3">
          <Link
            href="/caregiver"
            aria-label="Back to Caregiver Portal"
            className="flex items-center justify-center size-12 rounded-full border border-white/70 bg-card/90 text-foreground shadow-md backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowLeft className="size-6 text-primary" />
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                {patient.name}
              </h1>
              <span className="rounded-full bg-emerald-100 text-emerald-800 font-bold px-3 py-0.5 text-xs sm:text-sm">
                {summary.statusBadge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
              {patient.age} years old • Preferred Language: {patient.language || 'Hindi'} • Code: {patient.connectionCode || 'SM-7892'}
            </p>
          </div>
        </div>

        {/* Quick Tabs Nav */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'overview', label: 'Overview' },
              { id: 'games', label: 'Cognitive Practice' },
              { id: 'reminders', label: 'Reminders' },
              { id: 'alerts', label: `Alerts (${summary.unreadAlertsCount})` },
              { id: 'feed', label: 'Activity Feed' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm sm:text-base font-bold transition-all',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-card/80 text-muted-foreground hover:text-foreground border border-border/60',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-6xl mx-auto w-full mt-6 space-y-6">
        {/* ============================================================ */}
        {/* 1. OVERVIEW & SUMMARY */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-[2rem] border border-white/80 bg-card/95 p-5 shadow-md backdrop-blur-md text-center">
                <span className="text-xs sm:text-sm font-bold uppercase text-muted-foreground">
                  Practice This Week
                </span>
                <p className="mt-1 text-2xl sm:text-4xl font-extrabold text-foreground">
                  {summary.gamesCompletedThisWeek}
                </p>
                <span className="text-xs text-muted-foreground font-medium">cognitive sessions</span>
              </div>

              <div className="rounded-[2rem] border border-white/80 bg-card/95 p-5 shadow-md backdrop-blur-md text-center">
                <span className="text-xs sm:text-sm font-bold uppercase text-muted-foreground">
                  Average Accuracy
                </span>
                <p className="mt-1 text-2xl sm:text-4xl font-extrabold text-emerald-700">
                  {summary.averageAccuracy}%
                </p>
                <span className="text-xs text-muted-foreground font-medium">game performance</span>
              </div>

              <div className="rounded-[2rem] border border-white/80 bg-card/95 p-5 shadow-md backdrop-blur-md text-center">
                <span className="text-xs sm:text-sm font-bold uppercase text-muted-foreground">
                  Today's Reminders
                </span>
                <p className="mt-1 text-2xl sm:text-4xl font-extrabold text-primary">
                  {reminderSummary.completedToday} / {reminderSummary.totalToday}
                </p>
                <span className="text-xs text-muted-foreground font-medium">completed today</span>
              </div>

              <div className="rounded-[2rem] border border-white/80 bg-card/95 p-5 shadow-md backdrop-blur-md text-center">
                <span className="text-xs sm:text-sm font-bold uppercase text-muted-foreground">
                  Recommended Pace
                </span>
                <p className="mt-1 text-2xl sm:text-4xl font-extrabold text-primary uppercase">
                  {recommendation?.recommendedDifficulty || 'Medium'}
                </p>
                <span className="text-xs text-muted-foreground font-medium">adaptive difficulty</span>
              </div>
            </div>

            {/* Two Column Section: Adaptive Trajectory & Alert Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Adaptive Difficulty Card */}
              <div className="rounded-[2.5rem] border border-white/80 bg-card/95 p-6 sm:p-8 shadow-md backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-border/60">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Compass className="size-6 text-primary" /> Adaptive Recommendation
                    </h3>
                    <span className="rounded-full bg-primary/10 text-primary font-bold px-3 py-1 text-xs">
                      Phase 3 Engine
                    </span>
                  </div>

                  <div className="my-5 space-y-3">
                    <div className="flex items-center gap-3 text-lg font-semibold text-foreground">
                      <span>Trajectory:</span>
                      <span className="font-bold text-muted-foreground">
                        {recommendation?.previousDifficulty || 'Easy'}
                      </span>
                      <span>→</span>
                      <span className="font-extrabold text-primary text-xl uppercase underline decoration-primary/40">
                        {recommendation?.recommendedDifficulty || 'Medium'}
                      </span>
                    </div>

                    <p className="text-base text-foreground/80 leading-relaxed font-medium bg-secondary/60 p-4 rounded-2xl border border-border/40">
                      "{recommendation?.reason || 'Recent performance has been consistently strong.'}"
                    </p>

                    <div className="text-xs text-muted-foreground pt-1">
                      Performance Score: <strong>{recommendation?.performanceScore || 78} / 100</strong> (Normalized gameplay adaptation metric)
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 text-xs text-muted-foreground italic">
                  Note: Values represent game mechanics adaptation and do not constitute clinical or medical diagnosis.
                </div>
              </div>

              {/* Recent Alerts Card */}
              <div className="rounded-[2.5rem] border border-white/80 bg-card/95 p-6 sm:p-8 shadow-md backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-border/60">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <BellRing className="size-6 text-primary" /> Caregiver Alerts
                    </h3>
                    <span className="rounded-full bg-amber-100 text-amber-900 font-bold px-3 py-1 text-xs">
                      {summary.unreadAlertsCount} Unread
                    </span>
                  </div>

                  <div className="my-4 space-y-2.5">
                    {alerts.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        className={cn(
                          'p-3.5 rounded-2xl border flex items-start justify-between gap-3 text-sm transition-all',
                          a.isRead ? 'bg-secondary/40 border-border/50 opacity-70' : 'bg-card border-white/80 shadow-sm',
                        )}
                      >
                        <div className="flex items-start gap-2.5">
                          {getSeverityIcon(a.severity)}
                          <div>
                            <p className="font-bold text-foreground">{a.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{a.message}</p>
                          </div>
                        </div>

                        {!a.isRead && (
                          <button
                            type="button"
                            onClick={() => handleMarkAlert(a.id)}
                            className="text-xs font-bold text-primary hover:underline shrink-0"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => setActiveTab('alerts')}
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    View All Alerts ({alerts.length}) →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. COGNITIVE PERFORMANCE & RECENT GAMES */}
        {/* ============================================================ */}
        {activeTab === 'games' && (
          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-white/80 bg-card/95 p-6 sm:p-8 shadow-md backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div>
                  <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Brain className="size-6 text-primary" /> Cognitive Game Performance
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    Observed practice metrics across completed visual memory sessions.
                  </p>
                </div>

                <span className="rounded-full bg-primary/10 text-primary font-bold px-3.5 py-1 text-sm self-start sm:self-auto">
                  Memory Recall: Active
                </span>
              </div>

              {/* Game Categories Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900">Memory Recall</span>
                    <span className="text-xs font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <p className="text-2xl font-extrabold text-rose-950 mt-1">{summary.averageAccuracy}%</p>
                  <p className="text-xs text-rose-800/80 font-medium">Visual recall of familiar objects</p>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/60 opacity-75">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Focused Attention</span>
                    <span className="text-xs font-bold bg-secondary px-2 py-0.5 rounded-full">Coming Soon</span>
                  </div>
                  <p className="text-2xl font-extrabold text-muted-foreground mt-1">—</p>
                  <p className="text-xs text-muted-foreground font-medium">Target tracking and focus</p>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/60 opacity-75">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Pattern Recognition</span>
                    <span className="text-xs font-bold bg-secondary px-2 py-0.5 rounded-full">Coming Soon</span>
                  </div>
                  <p className="text-2xl font-extrabold text-muted-foreground mt-1">—</p>
                  <p className="text-xs text-muted-foreground font-medium">Visual sequence logic</p>
                </div>
              </div>

              {/* Recent Sessions Table */}
              <h4 className="text-lg font-bold text-foreground mb-3">Recent Practice Sessions</h4>

              {summary.recentGames.length === 0 ? (
                <div className="p-6 rounded-2xl bg-secondary/40 text-center text-muted-foreground font-medium">
                  No cognitive practice sessions completed yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-xs font-bold uppercase text-muted-foreground">
                        <th className="pb-3 px-2">Activity</th>
                        <th className="pb-3 px-2">Difficulty</th>
                        <th className="pb-3 px-2">Score</th>
                        <th className="pb-3 px-2">Accuracy</th>
                        <th className="pb-3 px-2">Time Taken</th>
                        <th className="pb-3 px-2">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-medium">
                      {summary.recentGames.map((g) => (
                        <tr key={g.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="py-3.5 px-2 font-bold text-foreground">
                            Memory Recall
                          </td>
                          <td className="py-3.5 px-2">
                            <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                              {g.difficulty}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-foreground font-bold">
                            {g.score} / {g.totalQuestions}
                          </td>
                          <td className="py-3.5 px-2 text-emerald-700 font-extrabold">
                            {g.accuracy}%
                          </td>
                          <td className="py-3.5 px-2 text-muted-foreground">
                            {g.timeTaken}s
                          </td>
                          <td className="py-3.5 px-2 text-muted-foreground text-xs">
                            {new Date(g.completedAt).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. REMINDER MONITORING */}
        {/* ============================================================ */}
        {activeTab === 'reminders' && (
          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-white/80 bg-card/95 p-6 sm:p-8 shadow-md backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div>
                  <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Clock className="size-6 text-primary" /> Today's Reminders Adherence
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    Read-only monitoring of patient scheduled medicines, hydration, and appointments.
                  </p>
                </div>

                <span className="rounded-full bg-primary/10 text-primary font-bold px-4 py-1 text-sm">
                  {reminderSummary.completedToday} of {reminderSummary.totalToday} Completed
                </span>
              </div>

              {/* Reminders List */}
              <div className="mt-6 space-y-3">
                {summary.todayReminders.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-secondary/40 text-center text-muted-foreground font-medium">
                    No reminders scheduled for today.
                  </div>
                ) : (
                  summary.todayReminders.map((r) => {
                    const isCompleted = r.status === 'COMPLETED'
                    const isMissed = r.status === 'MISSED'

                    return (
                      <div
                        key={r.id}
                        className={cn(
                          'p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3',
                          isCompleted
                            ? 'bg-secondary/30 border-border/50'
                            : isMissed
                            ? 'bg-amber-50/70 border-amber-300'
                            : 'bg-card border-white/80',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary font-bold">
                            {r.type === 'MEDICINE' && <Pill className="size-5 text-rose-700" />}
                            {r.type === 'HYDRATION' && <Droplets className="size-5 text-sky-700" />}
                            {r.type === 'DAILY_ACTIVITY' && <Footprints className="size-5 text-emerald-700" />}
                            {r.type === 'MEDICAL_APPOINTMENT' && <Calendar className="size-5 text-amber-700" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground text-base">{r.title}</span>
                              <span className="text-xs text-muted-foreground">({formatTime12h(r.time)})</span>
                            </div>
                            {r.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full text-xs font-bold">
                              <CheckCircle2 className="size-3.5" /> Completed
                            </span>
                          ) : isMissed ? (
                            <span className="inline-flex items-center gap-1 text-amber-900 bg-amber-100 px-3 py-1 rounded-full text-xs font-bold">
                              <AlertTriangle className="size-3.5" /> Missed / Overdue
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sky-800 bg-sky-100 px-3 py-1 rounded-full text-xs font-bold">
                              <Circle className="size-3.5" /> Pending
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. CAREGIVER ALERTS */}
        {/* ============================================================ */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-white/80 bg-card/95 p-6 sm:p-8 shadow-md backdrop-blur-md">
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div>
                  <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <BellRing className="size-6 text-primary" /> Caregiver Alerts
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    Rule-based observations for routine adherence and practice milestones.
                  </p>
                </div>

                {summary.unreadAlertsCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAlerts}
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    Mark All as Read
                  </button>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {alerts.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-secondary/40 text-center text-muted-foreground font-medium">
                    No active alerts for this patient.
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        'p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all',
                        alert.isRead ? 'bg-secondary/30 border-border/50 opacity-75' : 'bg-card border-white/90 shadow-sm',
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getSeverityIcon(alert.severity)}</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={cn('px-2.5 py-0.5 text-xs font-bold rounded-md border', getSeverityBadge(alert.severity))}>
                              {alert.severity}
                            </span>
                            <span className="font-bold text-foreground text-base">{alert.title}</span>
                          </div>
                          <p className="text-sm text-foreground/80 font-medium">{alert.message}</p>
                          <span className="text-xs text-muted-foreground block">
                            {new Date(alert.createdAt).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {!alert.isRead && (
                        <button
                          type="button"
                          onClick={() => handleMarkAlert(alert.id)}
                          className="h-10 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs self-start sm:self-center shrink-0 hover:brightness-110 active:scale-95 transition-all"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. CHRONOLOGICAL ACTIVITY FEED */}
        {/* ============================================================ */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-white/80 bg-card/95 p-6 sm:p-8 shadow-md backdrop-blur-md">
              <div className="pb-4 border-b border-border/60">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <History className="size-6 text-primary" /> Chronological Activity Feed
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Recent timeline of cognitive activities, completed reminders, and schedule updates.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {summary.activityFeed.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-secondary/40 text-center text-muted-foreground font-medium">
                    No activity recorded yet for this patient.
                  </div>
                ) : (
                  summary.activityFeed.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50"
                    >
                      <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        {event.category === 'game' ? (
                          <Brain className="size-5" />
                        ) : (
                          <Clock className="size-5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-bold text-foreground text-base">{event.title}</p>
                          <span className="text-xs text-muted-foreground font-medium">
                            {new Date(event.timestamp).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{event.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
