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
    <main className="relative isolate flex min-h-svh flex-col overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
  <DynamicBackground />

  <header className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-primary sm:text-xl">Smriti Sahayak</p>
          <p className="text-sm text-muted-foreground">Your calm companion</p>
        </div>
        <div className="flex items-center gap-3">
          <NotificationPanel notifications={notifications} />
          <ProfilePanel user={user} />
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-12 py-8">
        <AIGreeting greeting={greeting} />
        <VoiceAssistant state={state} onActivate={activate} />
        <ActionButtons />
      </div>
    </main>
  )
}
