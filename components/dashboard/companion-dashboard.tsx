'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DynamicBackground } from './dynamic-background'
import { NotificationPanel } from './notification-panel'
import { ProfilePanel } from './profile-panel'
import { AIGreeting } from './ai-greeting'
import { VoiceAssistant } from './voice-assistant'
import { ActionButtons } from './action-buttons'
import { useVoiceAssistant } from '@/hooks/use-voice-assistant'
import {
  encouragementGreetings,
  getTimeOfDayGreeting,
  type Greeting,
} from '@/data/mock-greetings'
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
    relative isolate flex h-svh min-h-0 flex-col overflow-hidden
    px-6 py-4
    sm:px-10 sm:py-5
  "
>
  <DynamicBackground />

  <header className="relative z-10 flex items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
  <p className="font-serif text-2xl font-semibold tracking-tight text-primary drop-shadow-sm sm:text-3xl">
    Smriti Sahayak
  </p>

  <p className="text-sm font-medium tracking-wide text-foreground/65 sm:text-base">
    Your calm companion
  </p>
</div>
        <div className="flex items-center gap-5 sm:gap-6">
          <NotificationPanel notifications={notifications} />
          <ProfilePanel user={user} />
        </div>
      </header>

      <div
  className="
    dashboard-compact
    relative z-10 flex min-h-0 flex-1 flex-col
    items-center justify-center
    gap-[clamp(0.75rem,2.5vh,1.5rem)]
    py-[clamp(0.25rem,1.5vh,1rem)]
  "
>
        <AIGreeting greeting={greeting} />
        <VoiceAssistant state={state} onActivate={activate} />
        <ActionButtons />
      </div>
    </main>
  )
}
