'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/auth/logo'

const OTP_LENGTH = 4

export default function OtpPage() {
  const [digits, setDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill('')
  )
  const [error, setError] = useState<string | null>(null)

  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return

    const next = [...digits]
    next[index] = value
    setDigits(next)
    setError(null)

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === 'Backspace' &&
      !digits[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleVerify = () => {
    const code = digits.join('')

    if (code.length < OTP_LENGTH) {
      setError(
        'Enter the complete code sent to your phone.'
      )
      return
    }

    // Prototype: any 4-digit code is accepted.
    window.location.href = '/login'
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-10"
      style={{ backgroundColor: '#F7F5F0' }}
    >
      <Logo size="sm" className="mb-8" />

      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF2EF]">
            <ShieldCheck
              className="h-7 w-7 text-[#2F6F62]"
              aria-hidden="true"
            />
          </div>

          <h1 className="mt-5 font-serif text-2xl font-semibold text-[#1F3B33]">
            Verify your number
          </h1>

          <p className="mt-2 text-[#4A5D56]">
            We've sent a 4-digit code to your registered mobile number.
          </p>
        </div>

        <div
          className="mt-6 flex justify-center gap-3"
          role="group"
          aria-label="One-time code"
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputsRef.current[index] = element
              }}
              value={digit}
              onChange={(event) =>
                handleChange(index, event.target.value)
              }
              onKeyDown={(event) =>
                handleKeyDown(index, event)
              }
              inputMode="numeric"
              maxLength={1}
              aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
              className="
                h-14 w-12 rounded-xl border-2
                border-[#CFE2DC] bg-white text-center
                text-xl font-semibold text-[#1F3B33]
                focus:border-[#2F6F62] focus:outline-none
              "
            />
          ))}
        </div>

        {error && (
          <p
            role="alert"
            className="mt-3 text-center text-sm font-medium text-[#A2453A]"
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleVerify}
          className="
            mt-6 h-12 w-full rounded-xl
            bg-[#2F6F62] px-5 text-base
            font-semibold text-white
          "
        >
          Verify &amp; continue
        </button>

        <button
          type="button"
          className="
            mt-4 block w-full text-center
            text-sm font-semibold text-[#2F6F62]
          "
          onClick={() => setError(null)}
        >
          Resend code
        </button>

        <p className="mt-6 text-center text-sm">
          <Link
            href="/login"
            className="text-[#7C8B85] hover:text-[#4A5D56]"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}