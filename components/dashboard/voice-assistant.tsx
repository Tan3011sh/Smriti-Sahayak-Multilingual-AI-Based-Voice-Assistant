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
    ? {
        scale: [1, 1.08, 1],
        opacity: [0.35, 0.12, 0.35],
      }
    : state === 'listening'
      ? {
          scale: [1, 1.4],
          opacity: [0.7, 0],
        }
      : state === 'thinking'
        ? {
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.15, 0.35],
          }
        : {
            scale: [1, 1.25, 1],
            opacity: [0.5, 0.18, 0.5],
          }
}
              transition={{
                duration: state === 'idle' ? 3.6 : 1.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: i * (state === 'idle' ? 0.5 : 0.5),
              }}
            />
          ))}

        <motion.button
          type="button"
          onClick={onActivate}
          disabled={isBusy}
          aria-label={
            isBusy
              ? `AI companion is busy: ${STATE_LABEL[state]}`
              : 'Activate voice assistant'
          }
          aria-live="polite"
          animate={
  prefersReducedMotion
    ? {}
    : state === 'idle'
      ? {
          scale: [1, 1.025, 1],
          boxShadow: [
            '0 18px 60px -10px oklch(0.38 0.075 152 / 0.45)',
            '0 22px 75px -5px oklch(0.48 0.09 152 / 0.65)',
            '0 18px 60px -10px oklch(0.38 0.075 152 / 0.45)',
          ],
        }
      : state === 'listening'
        ? {
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 18px 60px -10px oklch(0.55 0.12 100 / 0.5)',
              '0 25px 90px 0px oklch(0.65 0.14 90 / 0.8)',
              '0 18px 60px -10px oklch(0.55 0.12 100 / 0.5)',
            ],
          }
        : state === 'thinking'
          ? {
              scale: [1, 1.035, 1],
              boxShadow: [
                '0 18px 60px -10px oklch(0.4 0.09 170 / 0.5)',
                '0 22px 80px -5px oklch(0.48 0.12 180 / 0.75)',
                '0 18px 60px -10px oklch(0.4 0.09 170 / 0.5)',
              ],
            }
          : {
              scale: [1, 1.06, 1],
              boxShadow: [
                '0 18px 60px -10px oklch(0.42 0.1 155 / 0.55)',
                '0 28px 95px 0px oklch(0.55 0.13 145 / 0.85)',
                '0 18px 60px -10px oklch(0.42 0.1 155 / 0.55)',
              ],
            }
}
transition={{
  duration:
    state === 'idle'
      ? 3
      : state === 'listening'
        ? 1.2
        : state === 'thinking'
          ? 1.5
          : 0.8,
  repeat: Number.POSITIVE_INFINITY,
  ease: 'easeInOut',
}}
          className={cn(
  'relative flex h-44 w-44 items-center justify-center rounded-full',
  
  state === 'idle'
    ? 'bg-gradient-to-br from-primary via-primary to-[oklch(0.3_0.06_155)]'
    : state === 'listening'
      ? 'bg-gradient-to-br from-[oklch(0.48_0.11_145)] via-primary to-sun'
      : state === 'thinking'
        ? 'bg-gradient-to-br from-primary via-[oklch(0.42_0.09_170)] to-[oklch(0.3_0.06_155)]'
        : 'bg-gradient-to-br from-[oklch(0.45_0.1_155)] via-primary to-[oklch(0.55_0.12_145)]',

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
    initial={{ opacity: 0, scale: 0.75 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.75 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col items-center gap-3 text-primary-foreground"
  >
    {state === 'thinking' ? (
      <motion.div
        animate={
          prefersReducedMotion
            ? {}
            : { rotate: 360, scale: [1, 1.15, 1] }
        }
        transition={{
          rotate: {
            duration: 2.5,
            repeat: Infinity,
            ease: 'linear',
          },
          scale: {
            duration: 1.2,
            repeat: Infinity,
          },
        }}
      >
        <Sparkles
          className="size-14"
          strokeWidth={1.6}
          aria-hidden="true"
        />
      </motion.div>
    ) : state === 'speaking' ? (
      <motion.div
        animate={
          prefersReducedMotion
            ? {}
            : { scale: [1, 1.12, 1] }
        }
        transition={{
          duration: 0.8,
          repeat: Infinity,
        }}
      >
        <Volume2
          className="size-14"
          strokeWidth={1.6}
          aria-hidden="true"
        />
      </motion.div>
    ) : (
      <motion.div
        animate={
          !prefersReducedMotion && state === 'listening'
            ? { scale: [1, 1.15, 1] }
            : {}
        }
        transition={{
          duration: 0.9,
          repeat: Infinity,
        }}
      >
        <Mic
          className="size-14"
          strokeWidth={1.6}
          aria-hidden="true"
        />
      </motion.div>
    )}

    <VoiceVisualizer state={state} />
  </motion.div>
</AnimatePresence>
        </motion.button>
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
