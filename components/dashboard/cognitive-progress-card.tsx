'use client'

import { Activity, Target, Zap, Award, CheckCheck } from 'lucide-react'
import type { CognitiveProgress } from '@/data/mock-patient-dashboard'

function MetricItem({
  label,
  score,
  icon: Icon,
  colorTone,
}: {
  label: string
  score: number
  icon: typeof Activity
  colorTone: 'rose' | 'emerald' | 'amber' | 'sky'
}) {
  const getBadgeColors = () => {
    switch (colorTone) {
      case 'rose':
        return { bg: 'bg-rose-500', lightBg: 'bg-rose-100', text: 'text-rose-800' }
      case 'emerald':
        return { bg: 'bg-emerald-500', lightBg: 'bg-emerald-100', text: 'text-emerald-800' }
      case 'amber':
        return { bg: 'bg-amber-500', lightBg: 'bg-amber-100', text: 'text-amber-800' }
      case 'sky':
        return { bg: 'bg-sky-500', lightBg: 'bg-sky-100', text: 'text-sky-800' }
    }
  }

  const tones = getBadgeColors()

  return (
    <div className="rounded-2xl bg-secondary/50 p-4 border border-border/40">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 font-bold text-lg text-foreground">
          <div className={`flex size-9 items-center justify-center rounded-xl ${tones.lightBg} ${tones.text}`}>
            <Icon className="size-5" />
          </div>
          <span>{label}</span>
        </div>
        <span className="text-xl font-extrabold text-foreground">{score}%</span>
      </div>

      {/* Elderly-friendly progress bar */}
      <div className="h-3.5 w-full overflow-hidden rounded-full bg-border/60">
        <div
          className={`h-full rounded-full ${tones.bg} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

export function CognitiveProgressCard({ progress }: { progress: CognitiveProgress }) {
  const completionPercentage = Math.round(
    (progress.activitiesCompleted / progress.totalActivitiesGoal) * 100,
  )

  return (
    <div className="w-full rounded-[2rem] border border-white/70 bg-card/90 p-6 sm:p-7 shadow-[0_12px_35px_rgba(44,61,50,0.16)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_18px_45px_rgba(44,61,50,0.22)]">
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3 text-primary font-bold text-xl sm:text-2xl">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Activity className="size-6" strokeWidth={2} />
          </div>
          <span>Quick Cognitive Progress</span>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-sun/30 px-3.5 py-1 text-sm sm:text-base font-bold text-sun-foreground">
          <Award className="size-4" /> {progress.streakDays}-Day Streak
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricItem
          label="Memory"
          score={progress.memoryScore}
          icon={Target}
          colorTone="rose"
        />
        <MetricItem
          label="Attention"
          score={progress.attentionScore}
          icon={Zap}
          colorTone="sky"
        />
        <MetricItem
          label="Pattern Recognition"
          score={progress.patternScore}
          icon={Activity}
          colorTone="amber"
        />

        {/* Activity Completion Metric Card */}
        <div className="rounded-2xl bg-primary/10 p-4 border border-primary/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-lg text-primary">
              <CheckCheck className="size-5" />
              <span>Activities Completed</span>
            </div>
            <span className="text-xl font-extrabold text-primary">
              {progress.activitiesCompleted} / {progress.totalActivitiesGoal}
            </span>
          </div>

          <div className="mt-3">
            <div className="h-3.5 w-full overflow-hidden rounded-full bg-primary/20">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="mt-2 text-xs sm:text-sm font-semibold text-primary/80 text-right">
              {completionPercentage}% of daily goal
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
