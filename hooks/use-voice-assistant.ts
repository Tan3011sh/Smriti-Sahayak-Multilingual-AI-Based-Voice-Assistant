'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { sendVoiceCommand, type VoiceCommandResult } from '@/lib/services/voice-service'

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking'

export interface UseVoiceAssistantOptions {
  onAction?: (action: NonNullable<VoiceCommandResult['action']>) => void
}

export function useVoiceAssistant(options: UseVoiceAssistantOptions = {}) {
  const [state, setState] = useState<VoiceState>('idle')
  const [transcript, setTranscript] = useState<string | null>(null)
  const [response, setResponse] = useState<string | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const onActionRef = useRef(options.onAction)
  onActionRef.current = options.onAction

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [])

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay)
    timers.current.push(id)
  }, [])

  const activate = useCallback(async () => {
    if (state !== 'idle') return

    setTranscript(null)
    setResponse(null)
    setState('listening')

    // Simulated listening window. Real implementation can hook the
    // Web Speech API's SpeechRecognition `onresult` here instead.
    schedule(async () => {
      setState('thinking')
      const result = await sendVoiceCommand()
      setTranscript(result.transcript)

      schedule(() => {
        setState('speaking')
        setResponse(result.response)

        if (result.action) {
          onActionRef.current?.(result.action)
        }

        schedule(() => {
          setState('idle')
        }, 2600)
      }, 700)
    }, 1800)
  }, [state, schedule])

  const cancel = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setState('idle')
    setTranscript(null)
    setResponse(null)
  }, [])

  return { state, transcript, response, activate, cancel }
}
