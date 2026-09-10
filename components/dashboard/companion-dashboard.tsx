'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DynamicBackground } from './dynamic-background'
import { NotificationPanel } from './notification-panel'
import { ProfilePanel } from './profile-panel'
import { AIGreeting } from './ai-greeting'
import { VoiceAssistant } from './voice-assistant'
import { ActionButtons } from './action-buttons'
import { CognitiveActivityCard } from './cognitive-activity-card'
import { CognitiveProgressCard } from './cognitive-progress-card'
import { useVoiceAssistant } from '@/hooks/use-voice-assistant'
import {
  encouragementGreetings,
  getTimeOfDayGreeting,
  type Greeting,
} from '@/data/mock-greetings'
import {
  mockCognitiveActivity,
  mockCognitiveProgress,
} from '@/data/mock-patient-dashboard'
import type { UserProfile } from '@/data/mock-user'
import type { AppNotification } from '@/data/mock-notifications'

export function CompanionDashboard({
  user,
  notifications,
}: {
  user: UserProfile
  notifications: AppNotification[]
}) {
  const router = useRouter()
  const [greeting, setGreeting] = useState<Greeting>(() =>
    getTimeOfDayGreeting(user.name.split(' ')[0], new Date().getHours()),
  )

  const { state, response, activate } = useVoiceAssistant({
    onAction: (action) => {
      if (action === 'todo') router.push('/todo')
      if (action === 'games') router.push('/games')
    },
  })

  useEffect(() => {
    if (response) {
      const random =
        encouragementGreetings[Math.floor(Math.random() * encouragementGreetings.length)]
      setGreeting({ title: random.title, subtitle: response })
    }
  }, [response])

  return (
    <main
      className="
        relative isolate flex min-h-svh flex-col overflow-y-auto overflow-x-hidden
        px-4 py-4
        sm:px-8 sm:py-6
      "
    >
      <DynamicBackground />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between gap-6 pb-2">
        <div className="flex flex-col gap-0.5">
          <p className="font-serif text-2xl font-bold tracking-tight text-primary drop-shadow-sm sm:text-3xl">
            Smriti Sahayak
          </p>
          <p className="text-xs font-semibold tracking-wide text-foreground/70 sm:text-sm">
            Patient Companion Dashboard
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <NotificationPanel notifications={notifications} />
          <ProfilePanel user={user} />
        </div>
      </header>

      {/* Main Patient Dashboard Container */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center gap-6 py-4">
        
        {/* 1. Welcome Section with Patient Name & Greeting */}
        <AIGreeting greeting={greeting} />

        {/* 2. Central Voice Assistant Widget */}
        <VoiceAssistant state={state} onActivate={activate} />

        {/* 3. Navigation Action Buttons */}
        <ActionButtons />

        {/* 4. Patient Dashboard Structured Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Today's Cognitive Activity */}
          <CognitiveActivityCard activity={mockCognitiveActivity} />

          {/* Quick Cognitive Progress */}
          <CognitiveProgressCard progress={mockCognitiveProgress} />
        </div>

      </div>
    </main>
  )
}


