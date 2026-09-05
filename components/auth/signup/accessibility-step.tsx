'use client'

import { Ear, Type, Volume2 } from 'lucide-react'

type TextSize = 'default' | 'large' | 'extra-large'
type SoundLevel = 'off' | 'low' | 'normal' | 'high'

interface AccessibilityPreferences {
  textSize: TextSize
  voiceAssistance: boolean
  highContrast: boolean
  soundLevel: SoundLevel
}

interface AccessibilityStepProps {
  accessibility: AccessibilityPreferences
  onChange: (
    patch: Partial<{
      accessibility: AccessibilityPreferences
    }>
  ) => void
  onNext: () => void
  onBack: () => void
}

const TEXT_SIZES: {
  value: TextSize
  label: string
  sample: string
}[] = [
  {
    value: 'default',
    label: 'Regular',
    sample: 'text-base',
  },
  {
    value: 'large',
    label: 'Large',
    sample: 'text-lg',
  },
  {
    value: 'extra-large',
    label: 'Extra Large',
    sample: 'text-xl',
  },
]

export function AccessibilityStep({
  accessibility,
  onChange,
  onNext,
  onBack,
}: AccessibilityStepProps) {
  const update = (
    patch: Partial<AccessibilityPreferences>
  ) => {
    onChange({
      accessibility: {
        ...accessibility,
        ...patch,
      },
    })
  }

  return (
    <div className="animate-fade-in">
      <h2 className="font-serif text-2xl font-semibold text-[#1F3B33] sm:text-3xl">
        Let's make the app comfortable for you.
      </h2>

      <p className="mt-2 text-[#4A5D56]">
        You can always change these later in Settings.
      </p>

      <div className="mt-8 space-y-8">

        {/* Text size */}
        <div>
          <div className="flex items-center gap-2 font-semibold text-[#1F3B33]">
            <Type
              className="h-5 w-5"
              style={{ color: '#2F6F62' }}
              aria-hidden="true"
            />

            Text size
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {TEXT_SIZES.map((option) => {
              const selected =
                accessibility.textSize === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    update({
                      textSize: option.value,
                    })
                  }
                  aria-pressed={selected}
                  className="rounded-xl border-2 p-4 text-center transition-colors"
                  style={{
                    borderColor: selected
                      ? '#2F6F62'
                      : '#CFE2DC',
                    backgroundColor: selected
                      ? '#EAF2EF'
                      : 'transparent',
                  }}
                >
                  <span
                    className={`
                      block font-serif font-semibold
                      text-[#1F3B33]
                      ${option.sample}
                    `}
                  >
                    Aa
                  </span>

                  <span className="mt-1 block text-xs text-[#4A5D56]">
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Voice assistance */}
        <div
          className="
            flex items-center justify-between
            rounded-xl border-2 p-4
          "
          style={{
            borderColor: '#CFE2DC',
          }}
        >
          <div className="flex items-center gap-3">
            <Volume2
              className="h-5 w-5"
              style={{ color: '#2F6F62' }}
              aria-hidden="true"
            />

            <div>
              <p className="font-semibold text-[#1F3B33]">
                Voice assistance
              </p>

              <p className="text-sm text-[#4A5D56]">
                Hear buttons and instructions read aloud.
              </p>
            </div>
          </div>

          <ToggleSwitch
            checked={accessibility.voiceAssistance}
            onChange={(checked) =>
              update({
                voiceAssistance: checked,
              })
            }
            label="Voice assistance"
          />
        </div>

        {/* Sound level */}
        <div>
          <div className="flex items-center gap-2 font-semibold text-[#1F3B33]">
            <Ear
              className="h-5 w-5"
              style={{ color: '#2F6F62' }}
              aria-hidden="true"
            />

            Sound level
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {(
              ['off', 'low', 'normal', 'high'] as SoundLevel[]
            ).map((level) => {
              const selected =
                accessibility.soundLevel === level

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    update({
                      soundLevel: level,
                    })
                  }
                  aria-pressed={selected}
                  className="rounded-lg border-2 py-2 text-sm font-medium capitalize transition-colors"
                  style={{
                    borderColor: selected
                      ? '#2F6F62'
                      : '#CFE2DC',
                    backgroundColor: selected
                      ? '#EAF2EF'
                      : 'transparent',
                    color: selected
                      ? '#1E453E'
                      : '#4A5D56',
                  }}
                >
                  {level}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="
            inline-flex items-center justify-center
            rounded-xl border-2 border-[#2F6F62]
            bg-transparent px-5 py-3
            text-base font-semibold text-[#2F6F62]
          "
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="
            inline-flex flex-1 items-center justify-center
            rounded-xl px-5 py-3
            text-base font-semibold text-white
          "
          style={{
            backgroundColor: '#2F6F62',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative h-8 w-14 shrink-0 rounded-full transition-colors"
      style={{
        backgroundColor: checked
          ? '#2F6F62'
          : '#CFE2DC',
      }}
    >
      <span
        className="
          absolute top-1 h-6 w-6 rounded-full
          bg-white shadow-sm transition-transform
        "
        style={{
          transform: checked
            ? 'translateX(28px)'
            : 'translateX(4px)',
        }}
      />
    </button>
  )
}