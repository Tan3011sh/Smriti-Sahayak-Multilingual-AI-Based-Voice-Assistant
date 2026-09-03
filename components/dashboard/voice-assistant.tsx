'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Mic, Sparkles, Volume2 } from 'lucide-react'
import type { VoiceState } from '@/hooks/use-voice-assistant'
import { VoiceVisualizer } from './voice-visualizer'
import { cn } from '@/lib/utils'

const STATE_LABEL: Record<VoiceState, string> = {
  idle: 'Tap to talk to me',
  listening: 'Listening...',
  thinking: 'Let me help you...',
  speaking: 'Speaking...',
}

const RING_COUNT = 3

export function VoiceAssistant({
  state,
  onActivate,
}: {
  state: VoiceState
  onActivate: () => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const isBusy = state !== 'idle'

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex h-[15rem] w-[15rem] items-center justify-center sm:h-[17rem] sm:w-[17rem]">
        {!prefersReducedMotion &&
          Array.from({ length: RING_COUNT }).map((_, i) => (
            <motion.span
              key={i}
              className={cn(
                'absolute rounded-full border-2',
                state === 'listening' ? 'border-sun/70' : 'border-primary/25',
              )}
              style={{ inset: 0 }}
              animate={
                state === 'idle'
                  ? { scale: [1, 1.08, 1], opacity: [0.5, 0.15, 0.5] }
                  : { scale: [1, 1.35], opacity: [0.55, 0] }
              }
              transition={{
                duration: state === 'idle' ? 3.6 : 1.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: i * (state === 'idle' ? 0.5 : 0.5),
              }}
            />
          ))}

        <button
          type="button"
          onClick={onActivate}
          disabled={isBusy}
          aria-label={
            isBusy
              ? `AI companion is busy: ${STATE_LABEL[state]}`
              : 'Activate voice assistant'
          }
          aria-live="polite"
          className={cn(
            'relative flex h-44 w-44 items-center justify-center rounded-full',
            'bg-gradient-to-br from-primary via-primary to-[oklch(0.3_0.06_155)]',
            'shadow-[0_18px_60px_-10px_oklch(0.38_0.075_152_/_0.55)]',
            'ring-4 ring-card/80 transition-transform duration-300 ease-out',
            'hover:scale-[1.03] active:scale-[0.97]',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun',
            'disabled:cursor-default sm:h-52 sm:w-52',
          )}
        >
          <motion.div
            className="absolute inset-3 rounded-full bg-gradient-to-t from-white/0 via-white/5 to-white/25"
            animate={
              !prefersReducedMotion && state === 'idle'
                ? { scale: [1, 1.05, 1] }
                : {}
            }
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-2 text-primary-foreground"
            >
              {state === 'thinking' ? (
                <Sparkles className="size-14" strokeWidth={1.6} aria-hidden="true" />
              ) : state === 'speaking' ? (
                <Volume2 className="size-14" strokeWidth={1.6} aria-hidden="true" />
              ) : (
                <Mic className="size-14" strokeWidth={1.6} aria-hidden="true" />
              )}
              <VoiceVisualizer state={state} />
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      <motion.p
        key={state}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-medium text-foreground sm:text-3xl"
        aria-live="polite"
      >
        {STATE_LABEL[state]}
      </motion.p>
    </div>
  )
}
