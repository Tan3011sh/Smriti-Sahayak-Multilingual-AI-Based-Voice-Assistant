'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { sendVoiceCommand, type VoiceCommandResult } from '@/lib/services/voice-service'
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '@/types/language'

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking'

export interface UseVoiceAssistantOptions {
  language?: SupportedLanguage
  onAction?: (action: NonNullable<VoiceCommandResult['action']>) => void
}

export function useVoiceAssistant(options: UseVoiceAssistantOptions = {}) {
  const [state, setState] = useState<VoiceState>('idle')
  const [transcript, setTranscript] = useState<string | null>(null)
  const [response, setResponse] = useState<string | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const onActionRef = useRef(options.onAction)
  onActionRef.current = options.onAction
  const lang = options.language || 'en'

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout)
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel()
        } catch {
          // ignore
        }
      }
    }
  }, [])

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay)
    timers.current.push(id)
  }, [])

  const speakText = useCallback((text: string, currentLang: SupportedLanguage) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      const locale = SUPPORTED_LANGUAGES[currentLang]?.speechLocale || 'en-IN'
      utterance.lang = locale
      utterance.rate = 0.9 // gentle, slower pace for elderly users
      utterance.pitch = 1.0

      // Try to find matching voice if available
      const voices = window.speechSynthesis.getVoices()
      const matchingVoice = voices.find(v => v.lang === locale || v.lang.startsWith(locale.slice(0, 2)))
      if (matchingVoice) {
        utterance.voice = matchingVoice
      }

      window.speechSynthesis.speak(utterance)
    } catch (e) {
      console.warn('Speech synthesis graceful fallback:', e)
    }
  }, [])

  const activate = useCallback(async () => {
    if (state !== 'idle') return

    setTranscript(null)
    setResponse(null)
    setState('listening')

    schedule(async () => {
      setState('thinking')
      const result = await sendVoiceCommand(lang)
      setTranscript(result.transcript)

      schedule(() => {
        setState('speaking')
        setResponse(result.response)

        // Try speech output
        speakText(result.response, lang)

        if (result.action) {
          onActionRef.current?.(result.action)
        }

        schedule(() => {
          setState('idle')
        }, 2800)
      }, 700)
    }, 1800)
  }, [state, schedule, lang, speakText])

  const cancel = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel()
      } catch {
        // ignore
      }
    }
    setState('idle')
    setTranscript(null)
    setResponse(null)
  }, [])

  return { state, transcript, response, activate, cancel }
}
