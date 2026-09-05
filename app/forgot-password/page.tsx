'use client'

import { useState } from 'react'
import Link from 'next/link'
import { KeyRound, MailCheck } from 'lucide-react'
import { Logo } from '@/components/auth/logo'

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!identifier.trim()) {
      setError(
        'Enter your registered mobile number or email.'
      )
      return
    }

    setError(null)
    setSent(true)
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-10"
      style={{ backgroundColor: '#F7F5F0' }}
    >
      <Logo size="sm" className="mb-8" />

      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm">

        {!sent ? (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF2EF]">
              <KeyRound
                className="h-7 w-7 text-[#2F6F62]"
                aria-hidden="true"
              />
            </div>

            <h1 className="mt-5 font-serif text-2xl font-semibold text-[#1F3B33]">
              Reset your password
            </h1>

            <p className="mt-2 text-[#4A5D56]">
              Enter your mobile number or email and we'll send you a reset link.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
              noValidate
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="identifier"
                  className="text-sm font-semibold text-[#4A5D56]"
                >
                  Mobile number or email
                </label>

                <input
                  id="identifier"
                  value={identifier}
                  onChange={(event) =>
                    setIdentifier(event.target.value)
                  }
                  className="
                    w-full rounded-xl border-2
                    border-[#CFE2DC] bg-white
                    px-4 py-3 text-base
                    text-[#1F3B33] outline-none
                    focus:border-[#2F6F62]
                  "
                />

                {error && (
                  <p className="text-sm font-medium text-[#A2453A]">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="
                  h-12 w-full rounded-xl
                  bg-[#2F6F62] px-5
                  text-base font-semibold text-white
                "
              >
                Send reset link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF2EF]">
              <MailCheck
                className="h-7 w-7 text-[#2F6F62]"
                aria-hidden="true"
              />
            </div>

            <h1 className="mt-5 font-serif text-2xl font-semibold text-[#1F3B33]">
              Check your inbox
            </h1>

            <p className="mt-2 text-[#4A5D56]">
              If an account exists for{' '}
              <span className="font-semibold text-[#1F3B33]">
                {identifier}
              </span>
              , a reset link is on its way.
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-sm">
          <Link
            href="/login"
            className="font-semibold text-[#2F6F62] hover:opacity-80"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}