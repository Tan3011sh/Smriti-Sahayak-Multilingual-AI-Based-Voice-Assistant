'use client'

import { HeartHandshake, UserRound } from 'lucide-react'

type Role = 'patient' | 'caregiver'

interface RoleSelectStepProps {
  value: Role | null
  onChange: (role: Role) => void
  onNext: () => void
}

export function RoleSelectStep({
  value,
  onChange,
  onNext,
}: RoleSelectStepProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-[#1F3B33] sm:text-3xl">
        Who are you?
      </h2>

      <p className="mt-2 text-[#4A5D56]">
        This helps us set up the right experience for you.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">

        {/* Patient */}
        <button
          type="button"
          onClick={() => onChange('patient')}
          className={`
            rounded-xl border-2 p-5 text-left
            transition-colors
            ${
              value === 'patient'
                ? 'border-[#2F6F62] bg-[#EAF2EF]'
                : 'border-[#CFE2DC] hover:border-[#A3C7BC]'
            }
          `}
        >
          <UserRound
            className="h-7 w-7"
            style={{ color: '#2F6F62' }}
            aria-hidden="true"
          />

          <h3 className="mt-4 font-semibold text-[#1F3B33]">
            Patient
          </h3>

          <p className="mt-1 text-sm text-[#4A5D56]">
            I am using Smriti Sahayak for myself.
          </p>
        </button>

        {/* Caregiver */}
        <button
          type="button"
          onClick={() => onChange('caregiver')}
          className={`
            rounded-xl border-2 p-5 text-left
            transition-colors
            ${
              value === 'caregiver'
                ? 'border-[#2F6F62] bg-[#EAF2EF]'
                : 'border-[#CFE2DC] hover:border-[#A3C7BC]'
            }
          `}
        >
          <HeartHandshake
            className="h-7 w-7"
            style={{ color: '#2F6F62' }}
            aria-hidden="true"
          />

          <h3 className="mt-4 font-semibold text-[#1F3B33]">
            Caregiver
          </h3>

          <p className="mt-1 text-sm text-[#4A5D56]">
            I help care for someone.
          </p>
        </button>
      </div>

      <button
        type="button"
        disabled={!value}
        onClick={onNext}
        className="
          mt-8 inline-flex h-12 w-full items-center justify-center
          rounded-xl px-5 text-base font-semibold text-white
          transition-colors disabled:cursor-not-allowed
        "
        style={{
          backgroundColor: value ? '#2F6F62' : '#A3C7BC',
        }}
      >
        Continue
      </button>
    </div>
  )
}