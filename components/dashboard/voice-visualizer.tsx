'use client'

import { motion } from 'motion/react'
import type { VoiceState } from '@/hooks/use-voice-assistant'

const BAR_COUNT = 5

export function VoiceVisualizer({ state }: { state: VoiceState }) {
  if (state === 'idle' || state === 'listening') return null

  return (
    <div
      className="flex h-8 items-center justify-center gap-1.5"
      role="img"
      aria-label={state === 'thinking' ? 'AI is thinking' : 'AI is speaking'}
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full bg-primary-foreground"
          animate={
            state === 'thinking'
              ? { height: [6, 14, 6] }
              : { height: [8, 28, 10, 24, 8] }
          }
          transition={{
            duration: state === 'thinking' ? 1.1 : 0.9,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: i * 0.12,
          }}
        />
      ))}
    </div>
  )
}
