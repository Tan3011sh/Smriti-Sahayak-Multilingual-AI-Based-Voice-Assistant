'use client'

import { motion } from 'motion/react'
import type { VoiceState } from '@/hooks/use-voice-assistant'

const BAR_COUNT = 5

export function VoiceVisualizer({ state }: { state: VoiceState }) {
  if (state === 'idle' || state === 'listening') return null

  return (
    <div
      className="flex h-9 items-center justify-center gap-1.5"
      role="img"
      aria-label={state === 'thinking' ? 'AI is thinking' : 'AI is speaking'}
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const isThinking = state === 'thinking'

        return (
          <motion.span
            key={i}
            className="w-1.5 rounded-full bg-primary-foreground"
            animate={
              isThinking
                ? {
                    height: [6, 12 + (i % 2) * 5, 6],
                    opacity: [0.5, 1, 0.5],
                  }
                : {
                    height: [
                      8,
                      18 + ((i * 7) % 16),
                      10,
                      24 + ((i * 5) % 12),
                      8,
                    ],
                    opacity: [0.65, 1, 0.8, 1, 0.65],
                  }
            }
            transition={{
              duration: isThinking ? 1.4 : 0.75,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: i * (isThinking ? 0.14 : 0.08),
            }}
          />
        )
      })}
    </div>
  )
}