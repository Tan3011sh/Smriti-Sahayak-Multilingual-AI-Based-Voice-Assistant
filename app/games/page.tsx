'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowLeft, Brain, Eye, Shapes, Sparkles, Play, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GameCategoryCardProps {
  title: string
  subtitle: string
  description: string
  skill: string
  icon: typeof Brain
  href?: string
  status: 'active' | 'coming_soon'
  tone: 'rose' | 'sky' | 'amber'
}

function GameCategoryCard({
  title,
  subtitle,
  description,
  skill,
  icon: Icon,
  href,
  status,
  tone,
}: GameCategoryCardProps) {
  const isAvailable = status === 'active' && !!href

  const content = (
    <div
      className={cn(
        'relative flex flex-col justify-between rounded-[2.5rem] border border-white/80 p-7 sm:p-9 text-left transition-all duration-300',
        'backdrop-blur-xl shadow-[0_16px_40px_rgba(44,61,50,0.18)]',
        isAvailable
          ? 'bg-card/95 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(44,61,50,0.25)] hover:border-primary/50 cursor-pointer active:scale-[0.99]'
          : 'bg-card/75 opacity-80 cursor-not-allowed border-dashed',
      )}
    >
      {/* Top row: Icon & Status Tag */}
      <div className="flex items-center justify-between gap-4">
        <div
          className={cn(
            'flex size-20 items-center justify-center rounded-3xl shadow-sm transition-transform duration-300',
            tone === 'rose' && 'bg-rose-100 text-rose-800',
            tone === 'sky' && 'bg-sky-100 text-sky-800',
            tone === 'amber' && 'bg-amber-100 text-amber-900',
          )}
        >
          <Icon className="size-10" strokeWidth={2} />
        </div>

        {isAvailable ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-sm sm:text-base font-bold text-emerald-800 shadow-sm">
            <Sparkles className="size-4" /> Ready to Play
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-4 py-1.5 text-sm sm:text-base font-bold text-muted-foreground border border-border/60">
            <Lock className="size-4" /> Coming Soon
          </span>
        )}
      </div>

      {/* Middle: Title & Descriptions */}
      <div className="mt-6 space-y-2.5">
        <div>
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-primary">
            {subtitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
        </div>

        <p className="text-base sm:text-lg font-medium leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="pt-2">
          <span className="inline-block rounded-xl bg-secondary/70 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-foreground/80">
            Skill: <strong className="text-foreground">{skill}</strong>
          </span>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="mt-8 pt-4 border-t border-border/50">
        {isAvailable ? (
          <div className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 px-6 text-xl font-bold text-primary-foreground shadow-md transition-all group-hover:brightness-110">
            <Play className="size-6 fill-current" />
            <span>Start Practice</span>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary/50 py-4 px-6 text-lg font-semibold text-muted-foreground">
            <span>In Preparation</span>
          </div>
        )}
      </div>
    </div>
  )

  if (isAvailable && href) {
    return (
      <Link href={href} className="group block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 rounded-[2.5rem]">
        {content}
      </Link>
    )
  }

  return <div>{content}</div>
}

export default function GamesPage() {
  return (
    <main className="relative min-h-svh overflow-x-hidden p-4 sm:p-6 lg:p-10">
      {/* Background with Mountain & Mist */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mountain-background.jpg')" }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[1]"
        style={{
          top: '30%',
          left: '-20%',
          width: '160%',
          height: '70%',
          backgroundImage: "url('/images/mist-overlay.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.38,
        }}
        animate={{
          x: [-60, 60, -60],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Soft overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[2] bg-background/30 backdrop-blur-[2px]"
      />

      {/* Content Layer */}
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Top Header */}
        <header className="flex items-center justify-between gap-4 pb-6">
          <Link
            href="/"
            aria-label="Back to Dashboard"
            className="flex items-center gap-2.5 rounded-full border border-white/70 bg-card/90 px-5 py-3 text-base sm:text-lg font-bold text-foreground shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
          >
            <ArrowLeft className="size-6 text-primary" strokeWidth={2.2} />
            <span>Dashboard</span>
          </Link>

          <div className="text-right">
            <p className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-primary drop-shadow-sm">
              Smriti Sahayak
            </p>
            <p className="text-xs sm:text-sm font-semibold text-foreground/75">
              Cognitive Wellness & Memory
            </p>
          </div>
        </header>

        {/* Page Title & Gentle Intro */}
        <div className="mt-4 mb-8 text-center max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground drop-shadow-sm">
            Choose a Cognitive Game
          </h1>
          <p className="mt-3 text-lg sm:text-2xl font-medium text-foreground/80 leading-relaxed">
            Gentle, engaging exercises to keep your memory sharp and mind cheerful.
          </p>
        </div>

        {/* 3 Game Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-2 pb-16">
          {/* 1. MEMORY (Active) */}
          <GameCategoryCard
            title="Memory Recall"
            subtitle="Category 1"
            description="Observe familiar culturally resonant objects for a few seconds, then pick out what you saw."
            skill="Short-Term Visual Recall"
            icon={Brain}
            href="/games/memory"
            status="active"
            tone="rose"
          />

          {/* 2. ATTENTION (Coming Soon) */}
          <GameCategoryCard
            title="Focused Attention"
            subtitle="Category 2"
            description="Gentle visual attention and object tracking exercises to strengthen everyday focus."
            skill="Sustained Attention"
            icon={Eye}
            status="coming_soon"
            tone="sky"
          />

          {/* 3. PATTERN RECOGNITION (Coming Soon) */}
          <GameCategoryCard
            title="Pattern Recognition"
            subtitle="Category 3"
            description="Calming shape and color pattern puzzles designed to support logical sequencing."
            skill="Visual & Spatial Logic"
            icon={Shapes}
            status="coming_soon"
            tone="amber"
          />
        </div>
      </div>
    </main>
  )
}