'use client'

import Link from 'next/link'
import { Brain, Play, Sparkles, Clock, Signal } from 'lucide-react'
import type { CognitiveActivity } from '@/data/mock-patient-dashboard'

export function CognitiveActivityCard({ activity }: { activity: CognitiveActivity }) {
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

        <div className="flex flex-wrap items-center gap-4 text-base font-semibold text-foreground/80 pt-1">
          <div className="flex items-center gap-2 rounded-xl bg-secondary/70 px-3.5 py-2">
            <Signal className="size-5 text-primary" />
            <span>Difficulty: <strong className="text-primary">{activity.difficulty}</strong></span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-secondary/70 px-3.5 py-2">
            <Clock className="size-5 text-primary" />
            <span>{activity.estimatedMinutes} mins</span>
          </div>
        </div>

        <div className="pt-3">
          <Link
            href={activity.gameUrl}
            className="group flex w-full h-16 items-center justify-center gap-3 rounded-2xl bg-primary text-primary-foreground text-xl font-bold shadow-lg transition-all duration-300 hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
          >
            <Play className="size-6 fill-current transition-transform group-hover:scale-110" />
            <span>Start Recommended Activity</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
