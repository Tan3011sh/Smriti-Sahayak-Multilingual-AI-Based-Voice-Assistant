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
import { CognitiveProgressCard, ExtendedCognitiveProgress } from './cognitive-progress-card'
import { TodayRemindersCard } from './today-reminders-card'
import { ReminderDueModal } from './reminder-due-modal'
import { LanguageSelector } from '@/components/ui/language-selector'
import { useLanguage } from '@/context/language-context'
import { useVoiceAssistant } from '@/hooks/use-voice-assistant'
import {
  encouragementGreetings,
  getTimeOfDayGreeting,
  type Greeting,
} from '@/data/mock-greetings'
import {
  mockCognitiveActivity,
  mockCognitiveProgress,
  mockReminders,
} from '@/data/mock-patient-dashboard'
import type { UserProfile } from '@/data/mock-user'
import type { AppNotification } from '@/data/mock-notifications'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getPatientProgress } from '@/lib/services/game-performance-service'
import { getLatestRecommendation } from '@/lib/services/adaptive-engine-service'
import type { GameResult, Difficulty } from '@/types/game'
import type { DifficultyRecommendation } from '@/types/adaptive'

export function CompanionDashboard({
  user: initialUser,
  notifications,
}: {
  user: UserProfile
  notifications: AppNotification[]
}) {
  const router = useRouter()
  const { language, t } = useLanguage()
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialUser)
  const [greeting, setGreeting] = useState<Greeting>(() => {
    const firstName = initialUser.name.split(' ')[0]
    return {
      title: getTimeOfDayGreeting(firstName, new Date().getHours()).title,
      subtitle: t('voice.namasteGreeting') || 'Namaste! How can I help you today?',
    }
  })

  // Dynamic progress state backed by local storage
  const [progress, setProgress] = useState<ExtendedCognitiveProgress>(() => {
    return {
      ...mockCognitiveProgress,
      todayScore: 4,
      averageAccuracy: 85,
    }
  })
  const [recentResult, setRecentResult] = useState<GameResult | null>(null)
  const [recommendation, setRecommendation] = useState<DifficultyRecommendation | null>(null)

  // Hydrate user, progress, and adaptive recommendation from local storage
  useEffect(() => {
    const active = getCurrentUser()
    if (active && active.id) {
      setCurrentUser(active)
      setGreeting({
        title: getTimeOfDayGreeting(active.name.split(' ')[0], new Date().getHours()).title,
        subtitle: t('voice.namasteGreeting') || 'Namaste! How can I help you today?',
      })
    }

    const loadData = () => {
      const patientId = active?.id || 'default_patient'
      const p = getPatientProgress(patientId)
      setProgress({
        memoryScore: p.memoryScore,
        attentionScore: p.attentionScore,
        patternScore: p.patternScore,
        activitiesCompleted: p.gamesCompleted,
        totalActivitiesGoal: 4,
        streakDays: p.streakDays,
        todayScore: p.todayScore,
        averageAccuracy: p.averageAccuracy,
      })
      if (p.recentResults.length > 0) {
        setRecentResult(p.recentResults[0])
      }

      const latestRec = getLatestRecommendation(patientId, 'memory')
      setRecommendation(latestRec)
    }

    loadData()

    // Listen for completion of any cognitive game or recommendation update
    const handleGameCompleted = (e: Event) => {
      const customEvent = e as CustomEvent<{ result?: GameResult; recommendation?: DifficultyRecommendation }>
      if (customEvent.detail?.result) {
        setRecentResult(customEvent.detail.result)
      }
      if (customEvent.detail?.recommendation) {
        setRecommendation(customEvent.detail.recommendation)
      }
      loadData()
    }

    const handleRecUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<DifficultyRecommendation>
      if (customEvent.detail) {
        setRecommendation(customEvent.detail)
      }
    }

    window.addEventListener('smriti_game_completed', handleGameCompleted)
    window.addEventListener('smriti_recommendation_updated', handleRecUpdated)

    return () => {
      window.removeEventListener('smriti_game_completed', handleGameCompleted)
      window.removeEventListener('smriti_recommendation_updated', handleRecUpdated)
    }
  }, [t])

  // Sarvam Voice Assistant Integration (Strictly Conversational Scope in Phase 6.5A)
  const {
    state,
    transcript,
    response,
    errorMessage,
    activate,
    sendTextMessage,
    replayLastResponse,
  } = useVoiceAssistant({
    language,
    patientName: currentUser?.name?.split(' ')[0],
  })

  useEffect(() => {
    if (response) {
      setGreeting((prev) => ({ title: prev.title, subtitle: response }))
    }
  }, [response])

  const recommendedDifficulty: Difficulty = recommendation?.recommendedDifficulty || 'Easy'
  const recommendationReason: string | undefined = recommendation?.reason

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
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex flex-col gap-0.5">
          <p className="font-serif text-2xl font-bold tracking-tight text-primary drop-shadow-sm sm:text-3xl">
            {t('common.appName')}
          </p>
          <p className="text-xs font-semibold tracking-wide text-foreground/70 sm:text-sm">
            {t('common.appSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <LanguageSelector variant="compact" />
          <NotificationPanel notifications={notifications} />
          <ProfilePanel user={currentUser} />
        </div>
      </header>

      {/* Main Patient Dashboard Container */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center gap-6 py-4">
        
        {/* 1. Welcome Section with Patient Name & Greeting */}
        <AIGreeting greeting={greeting} />

        {/* 2. Central Voice Assistant Widget */}
        <VoiceAssistant
          state={state}
          onActivate={activate}
          transcript={transcript}
          response={response}
          errorMessage={errorMessage}
          onSendText={sendTextMessage}
          onReplay={replayLastResponse}
        />

        {/* 3. Quick Navigation Actions (Play Games, To Do List) */}
        <ActionButtons />

        {/* 4. Cognitive Activity & Live Progress Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Today's Cognitive Activity with Adaptive Difficulty */}
          <CognitiveActivityCard
            activity={mockCognitiveActivity}
            recommendedDifficulty={recommendedDifficulty}
            recommendationReason={recommendationReason}
          />

          {/* Today's Cognitive Progress (Live updated from completed games) */}
          <CognitiveProgressCard progress={progress} recentResult={recentResult} />
        </div>

        {/* 5. Today's Reminders (Preserves existing Todo system integration) */}
        <div className="w-full pt-2">
          <TodayRemindersCard reminders={mockReminders} />
        </div>

        {/* Real-time In-App Due Reminder Notification Modal */}
        <ReminderDueModal />

      </div>
    </main>
  )
}
