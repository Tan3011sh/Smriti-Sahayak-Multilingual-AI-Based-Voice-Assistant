'use client'

import { CheckCircle2 } from 'lucide-react'

interface ConfirmationStepProps {
  role: 'patient' | 'caregiver'
  onFinish: () => void
}

export function ConfirmationStep({
  role,
  onFinish,
}: ConfirmationStepProps) {
  return (
    <div className="animate-fade-in text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF2EF]">
        <CheckCircle2
          className="h-9 w-9"
          style={{ color: '#2F6F62' }}
          aria-hidden="true"
        />
      </div>

      <h2 className="mt-6 font-serif text-2xl font-semibold text-[#1F3B33] sm:text-3xl">
        You're all set.
      </h2>

      <p className="mx-auto mt-3 max-w-md text-[#4A5D56]">
        Your SmritiCare account is ready. You can now continue to your
        {role === 'caregiver'
          ? ' caregiver dashboard.'
          : ' patient experience.'}
      </p>

      <button
        type="button"
        onClick={onFinish}
        className="
          mt-8 inline-flex h-12 w-full items-center
          justify-center rounded-xl px-5
          text-base font-semibold text-white
        "
        style={{
          backgroundColor: '#2F6F62',
        }}
      >
        Continue to SmritiCare
      </button>
    </div>
  )
}