'use client'

import { motion, useReducedMotion } from 'motion/react'

/**
 * A calm, layered backdrop inspired by the misty hills, tea gardens and
 * soft morning light of North East India. Every layer is decorative and
 * marked aria-hidden; motion is skipped for prefers-reduced-motion.
 */
export function DynamicBackground() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[oklch(0.93_0.03_95)] via-background to-[oklch(0.9_0.035_150)]"
    >
      {/* Sun glow */}
      <div className="absolute -top-24 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-sun/35 blur-3xl sm:h-[34rem] sm:w-[34rem]" />

      {/* Far hills */}
      <svg
        className="absolute bottom-[38%] left-0 w-full text-primary/10"
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,180 C180,80 320,220 500,150 C700,70 860,200 1040,120 C1220,50 1340,160 1440,110 L1440,300 L0,300 Z" />
      </svg>

      {/* Mid hills */}
      <svg
        className="absolute bottom-[24%] left-0 w-full text-primary/18"
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,200 C220,120 360,240 560,170 C760,100 920,220 1120,150 C1280,100 1360,180 1440,150 L1440,300 L0,300 Z" />
      </svg>

      {/* Near forested hills */}
      <svg
        className="absolute bottom-0 left-0 w-full text-primary/30"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,220 C200,140 340,260 540,190 C760,110 940,240 1160,170 C1300,120 1380,190 1440,170 L1440,320 L0,320 Z" />
      </svg>

      {/* Drifting mist layers */}
      <motion.div
        className="absolute bottom-[18%] left-[-20%] h-40 w-[140%] rounded-full bg-mist/30 blur-2xl"
        animate={prefersReducedMotion ? {} : { x: ['0%', '8%', '0%'] }}
        transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[8%] left-[-30%] h-32 w-[160%] rounded-full bg-card/40 blur-3xl"
        animate={prefersReducedMotion ? {} : { x: ['0%', '-10%', '0%'] }}
        transition={{ duration: 55, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />

      {/* Floating light particles */}
      {!prefersReducedMotion &&
        Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-sun/50"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${20 + ((i * 23) % 60)}%`,
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
            }}
            animate={{ y: [0, -18, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: 8 + (i % 5),
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: i * 0.6,
            }}
          />
        ))}
    </div>
  )
}
