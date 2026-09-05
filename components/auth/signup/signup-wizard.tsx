'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Logo } from '@/components/auth/logo'
import { useAuth } from '@/hooks/use-auth'
import { RoleSelectStep } from './role-select-step'
import { BasicInfoStep } from './basic-info-step'
import { AccessibilityStep } from './accessibility-step'
import { ConfirmationStep } from './confirmation-step'

type Step = 'role' | 'basic' | 'accessibility' | 'confirmation'

export function SignupWizard() {
  const router = useRouter()

  const {
    signupDraft,
    updateSignupDraft,
    completeSignup,
  } = useAuth()

  const [step, setStep] = useState<Step>('role')

  const handleRoleNext = () => {
    if (!signupDraft.role) return
    setStep('basic')
  }

  const handleBasicNext = () => {
    if (signupDraft.role === 'patient') {
      setStep('accessibility')
    } else {
      finishSignup()
    }
  }

  const handleAccessibilityNext = () => {
    finishSignup()
  }

  const finishSignup = () => {
    completeSignup()
    setStep('confirmation')
  }

  const handleFinish = () => {
    router.replace(
      signupDraft.role === 'caregiver'
        ? '/caregiver'
        : '/'
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#F7F5F0' }}
    >
      {/* Header */}
      <header className="border-b border-[#E0E8E3] bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Logo size="sm" />

          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-sm font-semibold text-[#2F6F62] hover:opacity-80"
          >
            Already have an account?
          </button>
        </div>
      </header>

      {/* Progress */}
      <div className="mx-auto max-w-3xl px-6 pt-8">
        <div className="flex items-center gap-2">
          <StepIndicator
            active={step === 'role'}
            complete={
              step === 'basic' ||
              step === 'accessibility' ||
              step === 'confirmation'
            }
            label="Role"
          />

          <div className="h-0.5 flex-1 bg-[#DCE7E2]" />

          <StepIndicator
            active={step === 'basic'}
            complete={
              step === 'accessibility' ||
              step === 'confirmation'
            }
            label="Details"
          />

          {signupDraft.role === 'patient' && (
            <>
              <div className="h-0.5 flex-1 bg-[#DCE7E2]" />

              <StepIndicator
                active={step === 'accessibility'}
                complete={step === 'confirmation'}
                label="Comfort"
              />
            </>
          )}

          <div className="h-0.5 flex-1 bg-[#DCE7E2]" />

          <StepIndicator
            active={step === 'confirmation'}
            complete={false}
            label="Done"
          />
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-10">

          {step === 'role' && (
            <RoleSelectStep
              value={signupDraft.role}
              onChange={(role) =>
                updateSignupDraft({ role })
              }
              onNext={handleRoleNext}
            />
          )}

          {step === 'basic' && (
            <BasicInfoStep
              draft={signupDraft}
              onChange={updateSignupDraft}
              onNext={handleBasicNext}
              onBack={() => setStep('role')}
            />
          )}

          {step === 'accessibility' && (
            <AccessibilityStep
              accessibility={signupDraft.accessibility}
              onChange={(patch) =>
                updateSignupDraft(patch)
              }
              onNext={handleAccessibilityNext}
              onBack={() => setStep('basic')}
            />
          )}

          {step === 'confirmation' && signupDraft.role && (
            <ConfirmationStep
              role={signupDraft.role}
              onFinish={handleFinish}
            />
          )}

        </div>
      </main>
    </div>
  )
}

function StepIndicator({
  active,
  complete,
  label,
}: {
  active: boolean
  complete: boolean
  label: string
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
        style={{
          backgroundColor:
            active || complete
              ? '#2F6F62'
              : '#EAF2EF',
          color:
            active || complete
              ? '#FFFFFF'
              : '#4A5D56',
        }}
      >
        {complete ? '✓' : ''}
      </div>

      <span
        className={`hidden text-xs font-semibold sm:block ${
          active
            ? 'text-[#1F3B33]'
            : 'text-[#7C8B85]'
        }`}
      >
        {label}
      </span>
    </div>
  )
}