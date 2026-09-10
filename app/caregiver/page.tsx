'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  HeartHandshake,
  User,
  Phone,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  Calendar,
  Activity,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { DynamicBackground } from '@/components/dashboard/dynamic-background'
import { getCurrentUser, logoutUser } from '@/lib/services/auth-service'
import type { UserProfile } from '@/data/mock-user'

export default function CaregiverPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    logoutUser()
    router.push('/auth')
  }

  return (
    <main className="relative isolate min-h-svh flex flex-col overflow-x-hidden p-6 sm:p-10">
      <DynamicBackground />

      {/* Header */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center size-12 rounded-full border border-white/70 bg-card/90 text-foreground shadow-md backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowLeft className="size-6 text-primary" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Caregiver Portal
            </h1>
            <p className="text-base text-foreground/75 font-medium">
              Smriti Sahayak Companion Assistance
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-2xl border border-rose-300 bg-rose-50/90 px-5 py-3 text-lg font-bold text-rose-800 shadow-md backdrop-blur-md hover:bg-rose-100 transition-all active:scale-95"
        >
          <LogOut className="size-5" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
        
        {/* Caregiver Profile Card */}
        <div className="md:col-span-1 rounded-[2rem] border border-white/80 bg-card/95 p-6 shadow-xl backdrop-blur-md flex flex-col items-center text-center">
          <div className="size-24 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-4">
            <HeartHandshake className="size-12" />
          </div>
          <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 font-bold px-3 py-1 text-sm mb-2">
            {user?.relationshipRole || 'Caregiver'}
          </span>
          <h2 className="text-2xl font-bold text-foreground">
            {user?.name || 'Anita Sharma'}
          </h2>
          <p className="text-base text-muted-foreground mt-1">
            {user?.email || user?.phone || '+91 98765 12345'}
          </p>

          <div className="w-full mt-6 pt-6 border-t border-border space-y-3 text-left">
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground font-medium">Connection Code:</span>
              <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                {user?.connectionCode || 'SM-7892'}
              </span>
            </div>
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground font-medium">Language:</span>
              <span className="font-semibold text-foreground">{user?.language || 'Hindi'}</span>
            </div>
          </div>
        </div>

        {/* Patient Status Overview */}
        <div className="md:col-span-2 rounded-[2rem] border border-white/80 bg-card/95 p-6 sm:p-8 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <User className="size-6 text-primary" /> Connected Patient
                </h3>
                <p className="text-lg font-medium text-muted-foreground">
                  Ramesh Sharma (72 years old)
                </p>
              </div>
              <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-sm">
                <CheckCircle className="size-4" /> Active Today
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="rounded-2xl bg-secondary/60 p-4">
                <div className="flex items-center gap-3 text-primary mb-1">
                  <Activity className="size-5" />
                  <span className="font-bold text-lg">Daily Activity</span>
                </div>
                <p className="text-2xl font-bold text-foreground">3 Games Played</p>
                <p className="text-sm text-muted-foreground font-medium">Memory Match & Word Recall</p>
              </div>

              <div className="rounded-2xl bg-secondary/60 p-4">
                <div className="flex items-center gap-3 text-primary mb-1">
                  <Clock className="size-5" />
                  <span className="font-bold text-lg">Reminders Completed</span>
                </div>
                <p className="text-2xl font-bold text-foreground">4 / 4 Tasks</p>
                <p className="text-sm text-muted-foreground font-medium">Morning & Evening Medicine</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
            <Link
              href="/"
              className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-bold flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-[0.99] transition-all"
            >
              <span>View Patient Companion View</span>
            </Link>
            <Link
              href="/todo"
              className="h-14 px-6 rounded-2xl bg-secondary text-foreground text-lg font-bold flex items-center justify-center gap-2 shadow-md hover:bg-secondary/80 transition-all"
            >
              <span>Manage Reminders</span>
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
