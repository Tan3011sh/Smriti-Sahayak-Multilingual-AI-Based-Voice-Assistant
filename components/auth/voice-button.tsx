'use client'

import { useState } from 'react'
import { Volume2, Mic } from 'lucide-react'

interface VoiceButtonProps {
  mode: 'listen' | 'speak'
  label?: string
  onActivate?: () => void
  size?: 'md' | 'patient'
}

export function VoiceButton({
  mode,
  label,
  onActivate,
  size = 'md',
}: VoiceButtonProps) {
  const [active, setActive] = useState(false)

  const handleClick = () => {
    setActive(true)
    onActivate?.()

    window.setTimeout(() => {
      setActive(false)
    }, 1600)
  }

  const Icon = mode === 'listen' ? Volume2 : Mic
  const defaultLabel = mode === 'listen' ? 'Listen' : 'Speak'
  const isPatient = size === 'patient'

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label ?? defaultLabel}
      className={`
        inline-flex items-center gap-2 rounded-full
        border-2 font-semibold transition-all
        ${
          active
            ? 'border-sun bg-sun/10 text-sun'
            : 'border-primary/20 bg-card text-primary hover:border-primary/40'
        }
        ${
          isPatient
            ? 'px-6 py-4 text-lg'
            : 'px-4 py-2 text-sm'
        }
      `}
    >
      <Icon
        className={`
          ${isPatient ? 'h-6 w-6' : 'h-4 w-4'}
          ${active ? 'animate-pulse' : ''}
        `}
        aria-hidden="true"
      />

      {label ?? defaultLabel}

      {active && (
        <span className="sr-only">, active</span>
      )}
    </button>
  )
}