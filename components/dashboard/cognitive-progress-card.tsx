'use client'

import { Activity, Target, Zap, Award, CheckCheck, Clock, History } from 'lucide-react'
import type { CognitiveProgress } from '@/data/mock-patient-dashboard'
import type { GameResult } from '@/types/game'

export interface ExtendedCognitiveProgress extends CognitiveProgress {
  todayScore?: number
  averageAccuracy?: number
  recentResult?: GameResult | null
}

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
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  )
}

export function CognitiveProgressCard({
  progress,
  recentResult,
}: {
  progress: ExtendedCognitiveProgress
  recentResult?: GameResult | null
}) {
  const completionPercentage = Math.min(
    100,
    Math.round((progress.activitiesCompleted / progress.totalActivitiesGoal) * 100),
  )

  return (
    <div className="w-full rounded-[2rem] border border-white/70 bg-card/90 p-6 sm:p-7 shadow-[0_12px_35px_rgba(44,61,50,0.16)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_18px_45px_rgba(44,61,50,0.22)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3 text-primary font-bold text-xl sm:text-2xl">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Activity className="size-6" strokeWidth={2} />
          </div>
          <span>Today's Cognitive Progress</span>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-sun/30 px-3.5 py-1 text-sm sm:text-base font-bold text-sun-foreground">
          <Award className="size-4" /> {progress.streakDays}-Day Streak
        </span>
      </div>

      {/* Quick Summary Highlights for Elderly Ease */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-secondary/60 p-3.5 border border-border/50 text-center">
          <span className="text-xs sm:text-sm font-bold text-muted-foreground uppercase">
            Completed Today
          </span>
          <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-foreground">
            {progress.activitiesCompleted}
          </p>
        </div>

        <div className="rounded-2xl bg-secondary/60 p-3.5 border border-border/50 text-center">
          <span className="text-xs sm:text-sm font-bold text-muted-foreground uppercase">
            Latest Score
          </span>
          <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-primary">
            {progress.todayScore !== undefined ? `${progress.todayScore}/5` : '4/5'}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl bg-secondary/60 p-3.5 border border-border/50 text-center">
          <span className="text-xs sm:text-sm font-bold text-muted-foreground uppercase">
            Accuracy
          </span>
          <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-700">
            {progress.averageAccuracy !== undefined ? `${progress.averageAccuracy}%` : '85%'}
          </p>
        </div>
      </div>

      {/* Domain Skills Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricItem
          label="Memory Recall"
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

        {/* Daily Goal Completion */}
        <div className="rounded-2xl bg-primary/10 p-4 border border-primary/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-base sm:text-lg text-primary">
              <CheckCheck className="size-5" />
              <span>Daily Target</span>
            </div>
            <span className="text-lg sm:text-xl font-extrabold text-primary">
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
            <p className="mt-1.5 text-xs sm:text-sm font-semibold text-primary/80 text-right">
              {completionPercentage}% completed
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Highlight */}
      {recentResult && (
        <div className="mt-4 rounded-2xl bg-secondary/40 p-3.5 border border-border/50 flex items-center justify-between gap-3 text-sm sm:text-base font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <History className="size-5 text-primary shrink-0" />
            <span>
              Recent Practice: <strong className="text-foreground">Memory ({recentResult.difficulty})</strong>
            </span>
          </div>
          <span className="font-bold text-foreground">
            {recentResult.score}/{recentResult.totalQuestions} ({recentResult.accuracy}%)
          </span>
        </div>
      )}
    </div>
  )
}
