'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AlertCircle, Keyboard, Mic, Send, Sparkles, Volume2, RotateCcw } from 'lucide-react'
import type { VoiceState } from '@/hooks/use-voice-assistant'
import { VoiceVisualizer } from './voice-visualizer'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/language-context'

const DEFAULT_STATE_LABEL: Record<VoiceState, string> = {
  idle: 'Tap to talk to me',
  listening: 'Listening... (Tap to finish)',
  processing: 'Understanding...',
  speaking: 'Speaking...',
  error: 'Something went wrong. Tap to try again.',
}

const RING_COUNT = 3

interface VoiceAssistantProps {
  state: VoiceState
  onActivate: () => void
  transcript?: string | null
  response?: string | null
  errorMessage?: string | null
  onSendText?: (text: string) => void
  onReplay?: () => void
}

export function VoiceAssistant({
  state,
  onActivate,
  transcript,
  response,
  errorMessage,
  onSendText,
  onReplay,
}: VoiceAssistantProps) {
  const prefersReducedMotion = useReducedMotion()
  const { t } = useLanguage()
  const [showTextInput, setShowTextInput] = useState(false)
  const [textValue, setTextValue] = useState('')

  const isBusy = state === 'processing'

  const stateLabels: Record<VoiceState, string> = {
    idle: t('voice.tapToTalk') || DEFAULT_STATE_LABEL.idle,
    listening: t('voice.listening') || DEFAULT_STATE_LABEL.listening,
    processing: t('voice.processing') || DEFAULT_STATE_LABEL.processing,
    speaking: t('voice.speaking') || DEFAULT_STATE_LABEL.speaking,
    error: errorMessage || t('voice.error') || DEFAULT_STATE_LABEL.error,
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!textValue.trim() || isBusy) return
    onSendText?.(textValue.trim())
    setTextValue('')
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-2xl px-2">
      {/* 1. Main Interactive Voice Button Orb */}
      <div
        className="
          relative flex
          h-[clamp(11rem,25vh,14rem)]
          w-[clamp(11rem,25vh,14rem)]
          items-center justify-center
          sm:h-[clamp(12rem,27vh,16rem)]
          sm:w-[clamp(12rem,27vh,16rem)]
          lg:h-[clamp(13rem,29vh,18rem)]
          lg:w-[clamp(13rem,29vh,18rem)]
        "
      >
        {!prefersReducedMotion &&
          Array.from({ length: RING_COUNT }).map((_, i) => (
            <motion.span
              key={i}
              className={cn(
                'absolute rounded-full border-2',
                state === 'listening'
                  ? 'border-amber-400/80'
                  : state === 'error'
                    ? 'border-red-400/50'
                    : 'border-primary/25',
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
                        scale: [1, 1.45],
                        opacity: [0.8, 0],
                      }
                    : state === 'processing'
                      ? {
                          scale: [1, 1.15, 1],
                          opacity: [0.45, 0.15, 0.45],
                        }
                      : state === 'speaking'
                        ? {
                            scale: [1, 1.25, 1],
                            opacity: [0.55, 0.18, 0.55],
                          }
                        : {
                            scale: [1, 1.05, 1],
                            opacity: [0.3, 0.1, 0.3],
                          }
              }
              transition={{
                duration: state === 'idle' ? 3.6 : state === 'listening' ? 1.4 : 1.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: i * 0.45,
              }}
            />
          ))}

        <motion.button
          type="button"
          onClick={onActivate}
          disabled={isBusy}
          aria-label={
            state === 'listening'
              ? 'Listening. Tap to finish speaking.'
              : isBusy
                ? `Voice companion is processing`
                : 'Tap to talk to Smriti Sahayak'
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
                      scale: [1, 1.07, 1],
                      boxShadow: [
                        '0 20px 70px -5px rgba(245, 158, 11, 0.55)',
                        '0 28px 95px 0px rgba(245, 158, 11, 0.85)',
                        '0 20px 70px -5px rgba(245, 158, 11, 0.55)',
                      ],
                    }
                  : state === 'processing'
                    ? {
                        scale: [1, 1.04, 1],
                        boxShadow: [
                          '0 18px 60px -10px oklch(0.4 0.09 170 / 0.5)',
                          '0 24px 85px -5px oklch(0.48 0.12 180 / 0.75)',
                          '0 18px 60px -10px oklch(0.4 0.09 170 / 0.5)',
                        ],
                      }
                    : state === 'speaking'
                      ? {
                          scale: [1, 1.06, 1],
                          boxShadow: [
                            '0 18px 60px -10px oklch(0.42 0.1 155 / 0.55)',
                            '0 28px 95px 0px oklch(0.55 0.13 145 / 0.85)',
                            '0 18px 60px -10px oklch(0.42 0.1 155 / 0.55)',
                          ],
                        }
                      : {
                          scale: [1, 1.02, 1],
                          boxShadow: ['0 10px 40px -5px rgba(239, 68, 68, 0.4)'],
                        }
          }
          transition={{
            duration: state === 'idle' ? 3 : state === 'listening' ? 1.2 : 1.6,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
          className={cn(
            'relative flex h-[clamp(9.5rem,22vh,11.5rem)] w-[clamp(9.5rem,22vh,11.5rem)] items-center justify-center rounded-full',
            state === 'idle'
              ? 'bg-gradient-to-br from-primary via-primary to-[oklch(0.3_0.06_155)]'
              : state === 'listening'
                ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700'
                : state === 'processing'
                  ? 'bg-gradient-to-br from-teal-600 via-emerald-600 to-primary'
                  : state === 'speaking'
                    ? 'bg-gradient-to-br from-emerald-500 via-primary to-teal-700'
                    : 'bg-gradient-to-br from-red-600 via-rose-600 to-orange-700',
            'shadow-[0_18px_60px_-10px_oklch(0.38_0.075_152_/_0.55)]',
            'ring-4 ring-card/80 transition-transform duration-300 ease-out cursor-pointer',
            'hover:scale-[1.04] active:scale-[0.96]',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary',
            'disabled:cursor-wait sm:h-52 sm:w-52',
          )}
        >
          <motion.div
            className="absolute inset-3 rounded-full bg-gradient-to-t from-white/0 via-white/10 to-white/30"
            animate={!prefersReducedMotion && state === 'idle' ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-2 text-primary-foreground select-none"
            >
              {state === 'processing' ? (
                <motion.div
                  animate={
                    prefersReducedMotion ? {} : { rotate: 360, scale: [1, 1.15, 1] }
                  }
                  transition={{
                    rotate: { duration: 2.2, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 1.1, repeat: Infinity },
                  }}
                >
                  <Sparkles className="size-14 sm:size-16" strokeWidth={1.75} aria-hidden="true" />
                </motion.div>
              ) : state === 'speaking' ? (
                <motion.div
                  animate={prefersReducedMotion ? {} : { scale: [1, 1.14, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Volume2 className="size-14 sm:size-16" strokeWidth={1.75} aria-hidden="true" />
                </motion.div>
              ) : state === 'error' ? (
                <AlertCircle className="size-14 sm:size-16" strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <motion.div
                  animate={
                    !prefersReducedMotion && state === 'listening'
                      ? { scale: [1, 1.16, 1] }
                      : {}
                  }
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="flex flex-col items-center"
                >
                  <Mic className="size-14 sm:size-16" strokeWidth={1.75} aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-semibold tracking-wider mt-1 uppercase opacity-90">
                    {state === 'listening' ? t('voice.listening') : t('voice.talk') || 'Talk'}
                  </span>
                </motion.div>
              )}

              <VoiceVisualizer state={state} />
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* 2. Large, Clear Voice State Label */}
      <motion.div
        key={stateLabels[state]}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center px-4"
        aria-live="polite"
      >
        <p
          className={cn(
            'text-2xl font-semibold tracking-tight sm:text-3xl',
            state === 'error' ? 'text-red-600 dark:text-red-400' : 'text-foreground',
          )}
        >
          {stateLabels[state]}
        </p>
      </motion.div>

      {/* 3. Live Conversational Transcript & Response Bubble (Elderly-Friendly High Contrast) */}
      <AnimatePresence>
        {(transcript || response) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-card/90 backdrop-blur-md rounded-2xl border-2 border-primary/20 shadow-md p-4 sm:p-5 flex flex-col gap-3"
          >
            {transcript && (
              <div className="flex items-start gap-2.5 text-foreground/80">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary uppercase">
                  {t('voice.youSaid') || 'You'}
                </span>
                <p className="text-base sm:text-lg font-medium text-foreground leading-snug">
                  &ldquo;{transcript}&rdquo;
                </p>
              </div>
            )}

            {response && (
              <div className="flex flex-col gap-2 pt-1 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 uppercase">
                    {t('voice.assistantSaid') || 'Smriti Sahayak'}
                  </span>

                  {onReplay && (
                    <button
                      type="button"
                      onClick={onReplay}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors p-1"
                      title={t('voice.listenAgain') || 'Listen again'}
                    >
                      <RotateCcw className="size-3.5" />
                      <span>{t('voice.listenAgain') || 'Listen again'}</span>
                    </button>
                  )}
                </div>

                <p className="text-lg sm:text-xl font-medium text-foreground leading-relaxed">
                  {response}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Text Fallback Option for Accessibility */}
      <div className="w-full flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setShowTextInput((prev) => !prev)}
          className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-foreground/70 hover:text-foreground transition-colors py-1.5 px-3 rounded-lg hover:bg-card/60"
        >
          <Keyboard className="size-4" />
          <span>
            {showTextInput
              ? 'Hide text option'
              : t('voice.typePlaceholder') || 'Or type a message to Smriti Sahayak...'}
          </span>
        </button>

        {showTextInput && (
          <form
            onSubmit={handleTextSubmit}
            className="w-full flex items-center gap-2 mt-1"
          >
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={t('voice.typePlaceholder') || 'Type your question or message...'}
              disabled={isBusy}
              className="flex-1 text-base sm:text-lg bg-card border-2 border-primary/30 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/45 focus:outline-none focus:border-primary shadow-sm"
            />
            <button
              type="submit"
              disabled={!textValue.trim() || isBusy}
              className="h-full px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold flex items-center gap-2 text-base transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <span>{t('voice.send') || 'Send'}</span>
              <Send className="size-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
