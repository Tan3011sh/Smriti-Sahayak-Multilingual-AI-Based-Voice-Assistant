'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  HeartHandshake,
  KeyRound,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Globe2,
  Volume2,
} from 'lucide-react'

import { Logo } from '@/components/auth/logo'
import { useAuth } from '@/hooks/use-auth'

type Role = 'patient' | 'caregiver'
type LoginMode = 'password' | 'otp'
type LanguageCode = 'en' | 'hi' | 'as' | 'bn' | 'kha' | 'lus'

const LANGUAGES = [
  { code: 'en', nativeLabel: 'English' },
  { code: 'hi', nativeLabel: 'हिन्दी' },
  { code: 'as', nativeLabel: 'অসমীয়া' },
  { code: 'bn', nativeLabel: 'বাংলা' },
  { code: 'kha', nativeLabel: 'Khasi' },
  { code: 'lus', nativeLabel: 'Mizo ṭawng' },
] as const

export function LoginForm() {
  const router = useRouter()
  const { mockLogin } = useAuth()

  const [role, setRole] = useState<Role>('caregiver')
  const [mode, setMode] = useState<LoginMode>('password')
  const [language, setLanguage] = useState<LanguageCode>('en')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [voiceActive, setVoiceActive] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!identifier.trim()) {
      setError('Enter your mobile number or email to continue.')
      return
    }

    if (mode === 'password' && !password.trim()) {
      setError('Enter your password, or switch to OTP login.')
      return
    }

    setSubmitting(true)

    window.setTimeout(() => {
      mockLogin(role)

      // Patient dashboard in the team project is "/".
      router.replace(role === 'caregiver' ? '/caregiver' : '/patient')
    }, 500)
  }

  const handleVoiceClick = () => {
    setVoiceActive(true)

    window.setTimeout(() => {
      setVoiceActive(false)
    }, 1600)
  }

  return (
    <div
      className="grid min-h-screen lg:grid-cols-2"
      style={{ backgroundColor: '#F7F5F0' }}
    >
      {/* =====================================================
          LEFT — BRAND STORY
          ===================================================== */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden px-12 py-12 text-white lg:flex"
        style={{ backgroundColor: '#1E453E' }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full"
          style={{ backgroundColor: 'rgba(38,90,80,0.40)' }}
          aria-hidden="true"
        />

        <div
          className="absolute -left-16 bottom-10 h-56 w-56 rounded-full"
          style={{ backgroundColor: 'rgba(217,142,63,0.10)' }}
          aria-hidden="true"
        />

        {/* Logo */}
        <Logo
          size="md"
          onDark
          className="relative z-10"
        />

        {/* Main story */}
        <div className="relative max-w-md">
          <h1 className="font-serif text-4xl font-semibold leading-tight">
            Steady support for memory, every single day.
          </h1>

          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: '#CFE2DC' }}
          >
            Smriti Sahayak pairs gentle cognitive activities for patients with
            clear, real-time insight for the family and caregivers supporting
            them — built for the North Eastern Region. Provides offline support
            for regions with less connectivity.
          </p>

          <ul className="mt-8 space-y-4">
            <li className="flex items-start gap-3">
              <Sparkles
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: '#EDB05C' }}
                aria-hidden="true"
              />

              <span style={{ color: '#EAF2EF' }}>
                Your personal adaptive friend and caretaker.
              </span>
            </li>

            <li className="flex items-start gap-3">
              <HeartHandshake
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: '#EDB05C' }}
                aria-hidden="true"
              />

              <span style={{ color: '#EAF2EF' }}>
                Personalised dashboards for patients, families and caregivers.
              </span>
            </li>

            <li className="flex items-start gap-3">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: '#EDB05C' }}
                aria-hidden="true"
              />

              <span style={{ color: '#EAF2EF' }}>
                Designed for elder citizens, with interactive voice guidance.
              </span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <p
          className="relative text-sm"
          style={{ color: '#A3C7BC' }}
        >
          Built for Smart India Hackathon 2026 · SIH26003 · Ministry of
          Development of North Eastern Region
        </p>
      </div>

      {/* =====================================================
          RIGHT — LOGIN
          ===================================================== */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">

        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <Logo size="sm" />
        </div>

        {/* Language + voice */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2
              className="h-5 w-5 shrink-0"
              style={{ color: '#2F6F62' }}
              aria-hidden="true"
            />

            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as LanguageCode)
              }
              className="
                cursor-pointer rounded-lg border-2 border-transparent
                bg-transparent px-2 py-1 font-medium
                focus:outline-none
              "
              style={{ color: '#4A5D56' }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeLabel}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleVoiceClick}
            aria-label="Read this page aloud"
            className="
              inline-flex items-center gap-2 rounded-full
              border-2 bg-white px-4 py-2 text-sm font-semibold
              transition-all
            "
            style={{
              borderColor: voiceActive ? '#D98E3F' : '#CFE2DC',
              color: voiceActive ? '#B96F2A' : '#2F6F62',
              backgroundColor: voiceActive ? '#FDF3E6' : '#FFFFFF',
            }}
          >
            <Volume2
              className={`h-4 w-4 ${voiceActive ? 'animate-pulse' : ''}`}
              aria-hidden="true"
            />

            Read this page aloud

            {voiceActive && (
              <span className="sr-only">, active</span>
            )}
          </button>
        </div>

        <div className="w-full max-w-md">

          {/* Heading */}
          <h2
            className="font-serif text-3xl font-semibold"
            style={{ color: '#1F3B33' }}
          >
            Welcome
          </h2>

          <p
            className="mt-2"
            style={{ color: '#4A5D56' }}
          >
            Continue your journey toward better cognitive engagement and
            everyday support.
          </p>

          {/* Role selector */}
          <div
            className="mt-6 inline-flex rounded-xl p-1"
            style={{ backgroundColor: '#EFF3EC' }}
            role="tablist"
            aria-label="Choose which portal to log in to"
          >
            {(['caregiver', 'patient'] as Role[]).map((currentRole) => (
              <button
                key={currentRole}
                type="button"
                role="tab"
                aria-selected={role === currentRole}
                onClick={() => setRole(currentRole)}
                className="rounded-lg px-5 py-2 text-sm font-semibold capitalize transition-colors"
                style={{
                  backgroundColor:
                    role === currentRole ? '#FFFFFF' : 'transparent',
                  color:
                    role === currentRole ? '#1E453E' : '#4A5D56',
                  boxShadow:
                    role === currentRole
                      ? '0 2px 8px -2px rgba(31,59,51,0.10)'
                      : 'none',
                }}
              >
                {currentRole === 'caregiver'
                  ? 'Caregiver / Family'
                  : 'Patient'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
            noValidate
          >

            {/* Identifier */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="identifier"
                className="text-sm font-semibold"
                style={{ color: '#4A5D56' }}
              >
                Mobile number or email
              </label>

              <input
                id="identifier"
                placeholder="98xxxxxx21 or name@example.com"
                value={identifier}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setIdentifier(event.target.value)
                }
                autoComplete="username"
                className="
                  w-full rounded-xl border-2 px-4 py-3 text-base
                  transition-colors focus:outline-none
                "
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#CFE2DC',
                  color: '#1F3B33',
                }}
              />
            </div>

            {/* Password / OTP */}
            {mode === 'password' ? (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold"
                  style={{ color: '#4A5D56' }}
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  className="
                    w-full rounded-xl border-2 px-4 py-3 text-base
                    transition-colors focus:outline-none
                  "
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#CFE2DC',
                    color: '#1F3B33',
                  }}
                />
              </div>
            ) : (
              <div
                className="rounded-xl border-2 border-dashed p-4 text-sm"
                style={{
                  borderColor: '#A3C7BC',
                  backgroundColor: 'rgba(234,242,239,0.50)',
                  color: '#4A5D56',
                }}
              >
                We'll send a one-time code to this number or email when you
                continue.
              </div>
            )}

            {/* Error */}
            {error && (
              <p
                role="alert"
                className="text-sm font-medium"
                style={{ color: '#A2453A' }}
              >
                {error}
              </p>
            )}

            {/* Remember / forgot */}
            <div
              className="flex items-center justify-between text-sm"
            >
              <label
                className="flex items-center gap-2"
                style={{ color: '#4A5D56' }}
              >
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setRemember(event.target.checked)
                  }
                  className="h-4 w-4 rounded border-2"
                  style={{ accentColor: '#2F6F62' }}
                />

                Remember me
              </label>

              <Link
                href="/forgot-password"
                className="font-semibold hover:opacity-80"
                style={{ color: '#2F6F62' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={submitting}
              className="
                inline-flex h-12 w-full items-center justify-center
                rounded-xl px-5 text-base font-semibold
                text-white transition-colors
                disabled:cursor-not-allowed
              "
              style={{
                backgroundColor: submitting
                  ? '#A3C7BC'
                  : '#2F6F62',
              }}
            >
              {submitting ? 'Signing you in…' : 'Login'}
            </button>

            {/* OTP */}
            <button
              type="button"
              onClick={() =>
                setMode(
                  mode === 'password'
                    ? 'otp'
                    : 'password'
                )
              }
              className="
                inline-flex h-12 w-full items-center justify-center
                gap-2 rounded-xl border-2 bg-transparent
                px-5 text-base font-semibold transition-colors
              "
              style={{
                borderColor: '#2F6F62',
                color: '#2F6F62',
              }}
            >
              <KeyRound
                className="h-4 w-4"
                aria-hidden="true"
              />

              {mode === 'password'
                ? 'Continue with OTP instead'
                : 'Use password instead'}
            </button>
          </form>

          {/* Signup */}
          <p
            className="mt-8 text-center"
            style={{ color: '#4A5D56' }}
          >
            New to Smriti Sahayak?{' '}
            <Link
              href="/signup"
              className="font-semibold hover:opacity-80"
              style={{ color: '#2F6F62' }}
            >
              Create new account
            </Link>
          </p>

          {/* Privacy */}
          <div
            className="mt-6 flex items-start gap-2 text-sm"
            style={{ color: '#7C8B85' }}
          >
            <MessageSquareText
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />

            <span>
              Your information is securely protected and only shared with
              caregivers you connect with.
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}