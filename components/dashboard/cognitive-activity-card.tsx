'use client'

import Link from 'next/link'
import { Brain, Play, Sparkles, Clock, Signal, Compass } from 'lucide-react'
import type { CognitiveActivity } from '@/data/mock-patient-dashboard'
import type { Difficulty } from '@/types/game'

export function CognitiveActivityCard({
  activity,
  recommendedDifficulty,
  recommendationReason,
}: {
  activity: CognitiveActivity
  recommendedDifficulty?: Difficulty
  recommendationReason?: string
}) {
  const currentDiff = recommendedDifficulty || 'Easy'
  const targetUrl = `${activity.gameUrl}?difficulty=${currentDiff}`

  return (
    <div className="w-full rounded-[2rem] border border-white/70 bg-card/90 p-6 sm:p-7 shadow-[0_12px_35px_rgba(44,61,50,0.16)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_18px_45px_rgba(44,61,50,0.22)]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3 text-primary font-bold text-xl sm:text-2xl">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Brain className="size-6" strokeWidth={2} />
          </div>
          <span>Today's Cognitive Activity</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-sm sm:text-base font-bold text-emerald-800 shadow-sm">
          <Sparkles className="size-4" /> Recommended
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {activity.title}
          </h3>
          <p className="mt-2 text-lg font-medium leading-relaxed text-muted-foreground">
            {activity.description}
          </p>
        </div>

        {/* Personalized Difficulty Recommendation Banner */}
        <div className="rounded-2xl bg-primary/10 border border-primary/25 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-base sm:text-lg">
              <Compass className="size-5" />
              <span>Recommended for you: <strong className="text-xl uppercase underline decoration-primary/40">{currentDiff}</strong></span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-foreground/75">
              {recommendationReason || 'Based on your recent activity'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm sm:text-base font-semibold text-foreground/80">
            <div className="flex items-center gap-2 rounded-xl bg-card/80 px-3 py-1.5 shadow-sm border border-border/40">
              <Clock className="size-4 text-primary" />
              <span>{activity.estimatedMinutes} mins</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href={targetUrl}
            className="group flex w-full h-16 items-center justify-center gap-3 rounded-2xl bg-primary text-primary-foreground text-xl font-bold shadow-lg transition-all duration-300 hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
          >
            <Play className="size-6 fill-current transition-transform group-hover:scale-110" />
            <span>Start Activity ({currentDiff})</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
