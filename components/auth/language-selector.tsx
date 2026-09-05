'use client'

import { useId } from 'react'
import { Globe2 } from 'lucide-react'

export type LanguageCode = 'en' | 'hi' | 'as' | 'bn' | 'kha' | 'lus'

interface LanguageSelectorProps {
  value: LanguageCode
  onChange: (code: LanguageCode) => void
  compact?: boolean
  className?: string
}

const LANGUAGES = [
  { code: 'en', nativeLabel: 'English' },
  { code: 'hi', nativeLabel: 'हिन्दी' },
  { code: 'as', nativeLabel: 'অসমীয়া' },
  { code: 'bn', nativeLabel: 'বাংলা' },
  { code: 'kha', nativeLabel: 'Khasi' },
  { code: 'lus', nativeLabel: 'Mizo ṭawng' },
] as const

export function LanguageSelector({
  value,
  onChange,
  compact,
  className,
}: LanguageSelectorProps) {
  const id = useId()

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <Globe2
        className="h-5 w-5 shrink-0 text-primary"
        aria-hidden="true"
      />

      {!compact && (
        <label htmlFor={id} className="sr-only">
          Choose language
        </label>
      )}

      <select
        id={id}
        value={value}
        onChange={(event) =>
          onChange(event.target.value as LanguageCode)
        }
        className="
          cursor-pointer rounded-lg border-2 border-transparent
          bg-transparent px-2 py-1 font-medium text-muted-foreground
          hover:border-primary/10 focus:outline-none
        "
      >
        {LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  )
}