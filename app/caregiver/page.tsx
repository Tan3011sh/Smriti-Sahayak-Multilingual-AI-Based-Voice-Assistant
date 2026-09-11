'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  HeartHandshake,
  User,
  ArrowLeft,
  LogOut,
  Activity,
  CheckCircle,
  Clock,
  Compass,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  BellRing,
} from 'lucide-react'
import { DynamicBackground } from '@/components/dashboard/dynamic-background'
import { getCurrentUser, logoutUser } from '@/lib/services/auth-service'
import {
  getConnectedPatients,
  getPatientCaregiverSummary,
  PatientCaregiverSummary,
} from '@/lib/services/caregiver-service'
import type { UserProfile } from '@/data/mock-user'

export default function CaregiverPage() {
  const router = useRouter()
  const [caregiver, setCaregiver] = useState<UserProfile | null>(null)
  const [patients, setPatients] = useState<UserProfile[]>([])
  const [summaries, setSummaries] = useState<Record<string, PatientCaregiverSummary>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    setCaregiver(user)

    if (user && user.role === 'caregiver') {
      const connected = getConnectedPatients(user)
      setPatients(connected)

      // Load summary metrics for each connected patient
      const summaryMap: Record<string, PatientCaregiverSummary> = {}
      connected.forEach((p) => {
        if (p.id) {
          const s = getPatientCaregiverSummary(p.id, user.id || 'usr_caregiver_default')
          if (s) summaryMap[p.id] = s
        }
      })
      setSummaries(summaryMap)
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    logoutUser()
    router.push('/auth')
  }

  // Non-caregiver role protection
  if (!isLoading && caregiver?.role !== 'caregiver') {
    return (
      <main className="relative isolate min-h-svh flex items-center justify-center p-6">
        <DynamicBackground />
        <div className="relative z-10 w-full max-w-md rounded-[2.5rem] border-2 border-white/80 bg-card/95 p-8 shadow-2xl backdrop-blur-xl text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 mb-4">
            <ShieldAlert className="size-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Caregiver Access Only</h2>
          <p className="mt-2 text-base text-muted-foreground font-medium">
            You are currently signed in as a patient ({caregiver?.name}). The Caregiver Portal is reserved for connected family members and healthcare workers.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/"
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center shadow-md hover:brightness-110 active:scale-95"
            >
              Return to Patient Companion
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full h-14 rounded-2xl bg-secondary text-foreground font-bold text-base hover:bg-secondary/80"
            >
              Sign In with Another Account
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative isolate min-h-svh flex flex-col overflow-x-hidden p-4 sm:p-8 lg:p-10">
      <DynamicBackground />

      {/* Header */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/40">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Back to home"
            className="flex items-center justify-center size-12 rounded-full border border-white/70 bg-card/90 text-foreground shadow-md backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowLeft className="size-6 text-primary" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-primary drop-shadow-sm">
              Caregiver Portal
            </h1>
            <p className="text-xs sm:text-sm text-foreground/75 font-semibold">
              Monitoring, Analytics & Alerts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-2xl border border-rose-300 bg-rose-50/90 px-4 py-2.5 text-base sm:text-lg font-bold text-rose-800 shadow-md backdrop-blur-md hover:bg-rose-100 transition-all active:scale-95"
          >
            <LogOut className="size-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Caregiver Welcome & Connected Patients */}
      <div className="relative z-10 max-w-6xl mx-auto w-full mt-6 space-y-6">
        {/* Caregiver Greeting Card */}
        <div className="rounded-[2rem] border border-white/80 bg-card/95 p-6 shadow-lg backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <HeartHandshake className="size-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Welcome, {caregiver?.name || 'Caregiver'}
                </h2>
                <span className="rounded-full bg-emerald-100 text-emerald-800 font-bold px-3 py-0.5 text-xs">
                  {caregiver?.relationshipRole || 'Caregiver'}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">
                Monitoring connected patient daily cognitive wellbeing and routine adherence.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
            <span className="text-xs text-muted-foreground font-bold uppercase">Connection Code</span>
            <p className="text-xl font-extrabold text-primary tracking-wide">
              {caregiver?.connectionCode || 'SM-7892'}
            </p>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between pt-2">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            Connected Patients ({patients.length})
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            Select a patient to view detailed analytics and history.
          </p>
        </div>

        {/* Patients Grid */}
        {patients.length === 0 ? (
          <div className="rounded-[2.5rem] border border-white/80 bg-card/90 p-12 text-center shadow-lg">
            <User className="size-16 text-muted-foreground mx-auto mb-3" />
            <h4 className="text-2xl font-bold text-foreground">No Patients Connected Yet</h4>
            <p className="mt-2 text-base text-muted-foreground max-w-md mx-auto">
              Share your Caregiver Connection Code (<strong>{caregiver?.connectionCode || 'SM-7892'}</strong>) with your patient to connect their account.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {patients.map((patient) => {
              const summary = patient.id ? summaries[patient.id] : null
              const hasAlerts = (summary?.unreadAlertsCount || 0) > 0
              const recommendedDiff = summary?.recommendation?.recommendedDifficulty || 'Medium'

              return (
                <div
                  key={patient.id}
                  className="rounded-[2.5rem] border-2 border-white/80 bg-card/95 p-6 sm:p-8 shadow-[0_16px_40px_rgba(44,61,50,0.18)] backdrop-blur-xl flex flex-col justify-between transition-all hover:shadow-[0_22px_50px_rgba(44,61,50,0.22)]"
                >
                  <div>
                    {/* Top Row: Patient Name & Status Badge */}
                    <div className="flex items-start justify-between gap-3 pb-4 border-b border-border/60">
                      <div className="flex items-center gap-3">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl">
                          <User className="size-7" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-foreground">
                            {patient.name}
                          </h4>
                          <p className="text-sm font-medium text-muted-foreground">
                            {patient.age} years old • Code: {patient.connectionCode || 'SM-7892'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold px-3 py-1 text-xs sm:text-sm">
                          <CheckCircle className="size-3.5" />
                          {summary?.statusBadge || 'Active today'}
                        </span>

                        {hasAlerts && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 text-xs">
                            <AlertTriangle className="size-3 text-amber-700" />
                            {summary?.unreadAlertsCount} Alert{summary?.unreadAlertsCount === 1 ? '' : 's'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                      <div className="rounded-2xl bg-secondary/60 p-3.5 border border-border/40 text-center">
                        <span className="text-xs font-bold uppercase text-muted-foreground">
                          Today's Activity
                        </span>
                        <p className="mt-1 text-xl sm:text-2xl font-extrabold text-foreground">
                          {summary?.reminderSummary.completedToday ?? 3} / {summary?.reminderSummary.totalToday ?? 4}
                        </p>
                        <span className="text-[11px] text-muted-foreground font-medium">completed</span>
                      </div>

                      <div className="rounded-2xl bg-secondary/60 p-3.5 border border-border/40 text-center">
                        <span className="text-xs font-bold uppercase text-muted-foreground">
                          Practice Accuracy
                        </span>
                        <p className="mt-1 text-xl sm:text-2xl font-extrabold text-emerald-700">
                          {summary?.averageAccuracy ?? 82}%
                        </p>
                        <span className="text-[11px] text-muted-foreground font-medium">recent average</span>
                      </div>

                      <div className="rounded-2xl bg-secondary/60 p-3.5 border border-border/40 text-center">
                        <span className="text-xs font-bold uppercase text-muted-foreground">
                          Reminders
                        </span>
                        <p className="mt-1 text-xl sm:text-2xl font-extrabold text-foreground">
                          {summary?.reminderSummary.completedToday ?? 3} / {summary?.reminderSummary.totalToday ?? 4}
                        </p>
                        <span className="text-[11px] text-muted-foreground font-medium">on schedule</span>
                      </div>

                      <div className="rounded-2xl bg-secondary/60 p-3.5 border border-border/40 text-center">
                        <span className="text-xs font-bold uppercase text-muted-foreground">
                          Next Difficulty
                        </span>
                        <p className="mt-1 text-xl sm:text-2xl font-extrabold text-primary uppercase">
                          {recommendedDiff}
                        </p>
                        <span className="text-[11px] text-muted-foreground font-medium">adaptive engine</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Link to Patient Detail Page */}
                  <div className="pt-4 border-t border-border/60">
                    <Link
                      href={`/caregiver/patient/${patient.id}`}
                      className="group flex w-full h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-md hover:brightness-110 active:scale-[0.99] transition-all"
                    >
                      <span>View Patient Dashboard & History</span>
                      <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
