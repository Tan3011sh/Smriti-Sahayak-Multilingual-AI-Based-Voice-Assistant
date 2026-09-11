'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '@/types/language'

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error'

export interface UseVoiceAssistantOptions {
  language?: SupportedLanguage
  patientName?: string
}

export interface ConversationHistoryItem {
  role: 'user' | 'assistant'
  content: string
}

export function useVoiceAssistant(options: UseVoiceAssistantOptions = {}) {
  const [state, setState] = useState<VoiceState>('idle')
  const [transcript, setTranscript] = useState<string | null>(null)
  const [response, setResponse] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [history, setHistory] = useState<ConversationHistoryItem[]>([])

  const lang = options.language || 'en'
  const patientName = options.patientName || ''

  // References for cleanup and media recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeAudioElementRef = useRef<HTMLAudioElement | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecordingTracks()
      stopAudioPlayback()
    }
  }, [])

  const stopRecordingTracks = () => {
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop()
      } catch {
        // ignore
      }
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop())
      audioStreamRef.current = null
    }
  }

  const stopAudioPlayback = () => {
    if (activeAudioElementRef.current) {
      try {
        activeAudioElementRef.current.pause()
        activeAudioElementRef.current.currentTime = 0
      } catch {
        // ignore
      }
      activeAudioElementRef.current = null
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel()
      } catch {
        // ignore
      }
    }
  }

  // Fallback speech synthesis if Sarvam TTS audio is unavailable
  const speakWithBrowserSynthesis = useCallback(
    (text: string, currentLang: SupportedLanguage, onFinish?: () => void) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        onFinish?.()
        return
      }

      try {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        const locale = SUPPORTED_LANGUAGES[currentLang]?.speechLocale || 'en-IN'
        utterance.lang = locale
        utterance.rate = 0.88 // Gentle, slightly slower pacing for elderly comfort
        utterance.pitch = 1.0

        const voices = window.speechSynthesis.getVoices()
        const matchingVoice = voices.find(
          (v) => v.lang === locale || v.lang.startsWith(locale.slice(0, 2)),
        )
        if (matchingVoice) {
          utterance.voice = matchingVoice
        }

        utterance.onend = () => {
          onFinish?.()
        }

        utterance.onerror = () => {
          onFinish?.()
        }

        window.speechSynthesis.speak(utterance)
      } catch (e) {
        console.warn('Speech synthesis fallback failed:', e)
        onFinish?.()
      }
    },
    [],
  )

  // Plays synthesized base64 audio or falls back to Web Speech API
  const playResponseAudio = useCallback(
    (base64Audio: string | null, textToSpeak: string, currentLang: SupportedLanguage) => {
      setState('speaking')

      if (base64Audio) {
        try {
          stopAudioPlayback()
          const audio = new Audio(`data:audio/wav;base64,${base64Audio}`)
          activeAudioElementRef.current = audio

          audio.onended = () => {
            activeAudioElementRef.current = null
            setState('idle')
          }

          audio.onerror = (e) => {
            console.warn('Sarvam audio playback error, falling back to browser synthesis:', e)
            activeAudioElementRef.current = null
            speakWithBrowserSynthesis(textToSpeak, currentLang, () => setState('idle'))
          }

          audio.play().catch((err) => {
            console.warn('Audio play was interrupted, falling back to speech synthesis:', err)
            speakWithBrowserSynthesis(textToSpeak, currentLang, () => setState('idle'))
          })
          return
        } catch (e) {
          console.warn('Could not initialize Sarvam Audio element:', e)
        }
      }

      // If no base64 audio or failed to initialize, use browser synthesis fallback
      speakWithBrowserSynthesis(textToSpeak, currentLang, () => {
        setState('idle')
      })
    },
    [speakWithBrowserSynthesis],
  )

  // Send audio/text request to server endpoint
  const sendToServer = useCallback(
    async (payload: { audioBlob?: Blob; text?: string }) => {
      setState('processing')
      setErrorMessage(null)

      try {
        let res: Response

        if (payload.audioBlob) {
          const formData = new FormData()
          formData.append('audio', payload.audioBlob, 'recording.webm')
          formData.append('language', lang)
          if (patientName) formData.append('patientName', patientName)
          formData.append('history', JSON.stringify(history.slice(-4)))

          res = await fetch('/api/voice/conversation', {
            method: 'POST',
            body: formData,
          })
        } else {
          res = await fetch('/api/voice/conversation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: payload.text,
              language: lang,
              patientName,
              history: history.slice(-4),
            }),
          })
        }

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`)
        }

        const data = await res.json()

        const recognizedTranscript = data.transcript || payload.text || ''
        const assistantReply = data.response || ''

        if (recognizedTranscript) {
          setTranscript(recognizedTranscript)
        }
        setResponse(assistantReply)

        // Update short in-session history
        if (recognizedTranscript && assistantReply) {
          setHistory((prev) => [
            ...prev.slice(-4),
            { role: 'user', content: recognizedTranscript },
            { role: 'assistant', content: assistantReply },
          ])
        }

        // Speak the reply
        playResponseAudio(data.audioBase64, assistantReply, lang)
      } catch (err) {
        console.error('Voice conversation error:', err)
        setState('error')
        const fallbackMsg =
          lang === 'hi'
            ? 'क्षमा करें, आवाज़ समझने में कठिनाई हुई। कृपया पुनः प्रयास करें।'
            : lang === 'as'
              ? 'ক্ষমা কৰিব, কথা বুজি পোৱাত অসুবিধা হৈছে। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।'
              : 'Sorry, I had trouble hearing. Please tap to try again or type below.'
        setErrorMessage(fallbackMsg)
      }
    },
    [history, lang, patientName, playResponseAudio],
  )

  // Start listening: request microphone permission only when user taps
  const startListening = useCallback(async () => {
    if (state !== 'idle' && state !== 'error') return

    stopAudioPlayback()
    stopRecordingTracks()

    setErrorMessage(null)

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setState('error')
      setErrorMessage(
        lang === 'hi'
          ? 'इस डिवाइस पर माइक्रोफ़ोन समर्थित नहीं है।'
          : lang === 'as'
            ? 'এই যন্ত্ৰত মাইক্ৰ’ফ’ন সমৰ্থন নকৰে।'
            : 'Microphone is not supported on this browser.',
      )
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStreamRef.current = stream

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : ''

      const options = mimeType ? { mimeType } : undefined
      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType || 'audio/webm',
        })
        stopRecordingTracks()
        sendToServer({ audioBlob })
      }

      mediaRecorder.start(250)
      setState('listening')

      // Automatically wrap up speech after 5.5 seconds of speaking to assist elderly users
      recordingTimerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop()
        }
      }, 5500)
    } catch (err: any) {
      console.warn('Microphone permission or recording error:', err)
      setState('error')
      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
      setErrorMessage(
        isDenied
          ? lang === 'hi'
            ? 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र में अनुमति दें।'
            : lang === 'as'
              ? 'মাইক্ৰ’ফ’নৰ অনুমতি পোৱা নগল। অনুগ্ৰহ কৰি অনুমতি দিয়ক।'
              : 'Microphone permission was denied. Please allow microphone access or type below.'
          : lang === 'hi'
            ? 'माइक्रोफ़ोन शुरू नहीं हो सका।'
            : lang === 'as'
              ? 'মাইক্ৰ’ফ’ন আৰম্ভ কৰিব পৰা নগ’ল।'
              : 'Could not access microphone.',
      )
    }
  }, [lang, sendToServer, state])

  // Manually finish speaking if user taps while listening
  const stopListening = useCallback(() => {
    if (state === 'listening' && mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [state])

  // Activate handler toggles listening or stops listening
  const activate = useCallback(() => {
    if (state === 'listening') {
      stopListening()
    } else if (state === 'idle' || state === 'error') {
      startListening()
    }
  }, [startListening, state, stopListening])

  // Text message fallback method
  const sendTextMessage = useCallback(
    async (text: string) => {
      if (!text || text.trim() === '') return
      stopAudioPlayback()
      stopRecordingTracks()
      setTranscript(text.trim())
      await sendToServer({ text: text.trim() })
    },
    [sendToServer],
  )

  // Cancel/Reset
  const cancel = useCallback(() => {
    stopRecordingTracks()
    stopAudioPlayback()
    setState('idle')
    setTranscript(null)
    setResponse(null)
    setErrorMessage(null)
  }, [])

  // Re-play last response
  const replayLastResponse = useCallback(() => {
    if (response) {
      speakWithBrowserSynthesis(response, lang)
    }
  }, [lang, response, speakWithBrowserSynthesis])

  return {
    state,
    transcript,
    response,
    errorMessage,
    activate,
    stopListening,
    sendTextMessage,
    replayLastResponse,
    cancel,
  }
}
