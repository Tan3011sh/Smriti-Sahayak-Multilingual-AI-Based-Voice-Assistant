'use client'

import { useState, type ChangeEvent } from 'react'
import { LanguageSelector, type LanguageCode } from '@/components/auth/language-selector'

type Role = 'patient' | 'caregiver'

interface SignupDraft {
  role: Role | null
  fullName: string
  mobile: string
  email: string
  password: string
  age: string
  language: LanguageCode
}

interface BasicInfoStepProps {
  draft: SignupDraft
  onChange: (patch: Partial<SignupDraft>) => void
  onNext: () => void
  onBack: () => void
}

export function BasicInfoStep({
  draft,
  onChange,
  onNext,
  onBack,
}: BasicInfoStepProps) {
  const [touched, setTouched] = useState(false)

  const isCaregiver = draft.role === 'caregiver'

  const canContinue = isCaregiver
    ? Boolean(
        draft.fullName.trim() &&
        draft.mobile.trim() &&
        draft.password.trim()
      )
    : Boolean(
        draft.fullName.trim() &&
        draft.age.trim()
      )

  const handleNext = () => {
    setTouched(true)

    if (canContinue) {
      onNext()
    }
  }

  return (
    <div className="animate-fade-in">
      <h2 className="font-serif text-2xl font-semibold text-[#1F3B33] sm:text-3xl">
        {isCaregiver
          ? 'A little about you'
          : 'A little about the patient'}
      </h2>

      <p className="mt-2 text-[#4A5D56]">
        {isCaregiver
          ? 'We use this to set up your caregiver account.'
          : "Just the basics — we'll keep this simple."}
      </p>

      <div className="mt-8 space-y-5">

        {/* Full name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-full-name"
            className="text-sm font-semibold text-[#4A5D56]"
          >
            Full name
          </label>

          <input
            id="signup-full-name"
            value={draft.fullName}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange({ fullName: event.target.value })
            }
            className={`
              w-full rounded-xl border-2 bg-white px-4 py-3
              text-base text-[#1F3B33] outline-none
              placeholder:text-[#9AA9A3]
              ${
                touched && !draft.fullName.trim()
                  ? 'border-[#A2453A]'
                  : 'border-[#CFE2DC]'
              }
            `}
          />

          {touched && !draft.fullName.trim() && (
            <p className="text-sm font-medium text-[#A2453A]">
              Full name is required.
            </p>
          )}
        </div>

        {isCaregiver ? (
          <>
            {/* Mobile */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-mobile"
                className="text-sm font-semibold text-[#4A5D56]"
              >
                Mobile number
              </label>

              <input
                id="signup-mobile"
                value={draft.mobile}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onChange({ mobile: event.target.value })
                }
                placeholder="98xxxxxx21"
                className={`
                  w-full rounded-xl border-2 bg-white px-4 py-3
                  text-base text-[#1F3B33] outline-none
                  placeholder:text-[#9AA9A3]
                  ${
                    touched && !draft.mobile.trim()
                      ? 'border-[#A2453A]'
                      : 'border-[#CFE2DC]'
                  }
                `}
              />

              {touched && !draft.mobile.trim() && (
                <p className="text-sm font-medium text-[#A2453A]">
                  Mobile number is required.
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-email"
                className="text-sm font-semibold text-[#4A5D56]"
              >
                Email (optional)
              </label>

              <input
                id="signup-email"
                type="email"
                value={draft.email}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onChange({ email: event.target.value })
                }
                className="
                  w-full rounded-xl border-2 border-[#CFE2DC]
                  bg-white px-4 py-3 text-base text-[#1F3B33]
                  outline-none placeholder:text-[#9AA9A3]
                "
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-password"
                className="text-sm font-semibold text-[#4A5D56]"
              >
                Password
              </label>

              <input
                id="signup-password"
                type="password"
                value={draft.password}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onChange({ password: event.target.value })
                }
                className={`
                  w-full rounded-xl border-2 bg-white px-4 py-3
                  text-base text-[#1F3B33] outline-none
                  ${
                    touched && !draft.password.trim()
                      ? 'border-[#A2453A]'
                      : 'border-[#CFE2DC]'
                  }
                `}
              />

              {touched && !draft.password.trim() && (
                <p className="text-sm font-medium text-[#A2453A]">
                  Choose a password.
                </p>
              )}
            </div>
          </>
        ) : (
          /* Patient age */
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signup-age"
              className="text-sm font-semibold text-[#4A5D56]"
            >
              Age
            </label>

            <input
              id="signup-age"
              type="number"
              inputMode="numeric"
              value={draft.age}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onChange({ age: event.target.value })
              }
              className={`
                w-full rounded-xl border-2 bg-white px-4 py-3
                text-base text-[#1F3B33] outline-none
                ${
                  touched && !draft.age.trim()
                    ? 'border-[#A2453A]'
                    : 'border-[#CFE2DC]'
                }
              `}
            />

            {touched && !draft.age.trim() && (
              <p className="text-sm font-medium text-[#A2453A]">
                Age is required.
              </p>
            )}
          </div>
        )}

        {/* Preferred language */}
        <div>
          <span className="text-sm font-semibold text-[#4A5D56]">
            Preferred language
          </span>

          <LanguageSelector
            value={draft.language}
            onChange={(code) => onChange({ language: code })}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="
            inline-flex items-center justify-center rounded-xl
            border-2 border-[#2F6F62] bg-transparent
            px-5 py-3 text-base font-semibold text-[#2F6F62]
          "
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="
            inline-flex flex-1 items-center justify-center rounded-xl
            px-5 py-3 text-base font-semibold text-white
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