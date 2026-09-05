'use client'

import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react'

type Role = 'patient' | 'caregiver'
type LanguageCode = 'en' | 'hi' | 'as' | 'bn' | 'kha' | 'lus'
type TextSize = 'default' | 'large' | 'extra-large'

interface AccessibilityPreferences {
  textSize: TextSize
  voiceAssistance: boolean
  highContrast: boolean
  soundLevel: 'off' | 'low' | 'normal' | 'high'
}

interface CaregiverProfile {
  id: string
  fullName: string
  mobile: string
  email?: string
  language: LanguageCode
}

interface PatientProfile {
  id: string
  fullName: string
  age: number
  language: LanguageCode
  accessibility: AccessibilityPreferences
  avatarInitials: string
}

interface AuthState {
  status: 'signed-out' | 'signed-in'
  role: Role | null
  caregiver: CaregiverProfile | null
  patient: PatientProfile | null
}

interface SignupDraft {
  role: Role | null
  fullName: string
  mobile: string
  email: string
  password: string
  age: string
  language: LanguageCode
  accessibility: AccessibilityPreferences
}

interface AuthContextValue {
  auth: AuthState
  signupDraft: SignupDraft
  updateSignupDraft: (patch: Partial<SignupDraft>) => void
  resetSignupDraft: () => void
  mockLogin: (role: Role) => void
  completeSignup: () => void
  logout: () => void
}

const DEFAULT_ACCESSIBILITY: AccessibilityPreferences = {
  textSize: 'large',
  voiceAssistance: true,
  highContrast: false,
  soundLevel: 'normal',
}

const EMPTY_SIGNUP_DRAFT: SignupDraft = {
  role: null,
  fullName: '',
  mobile: '',
  email: '',
  password: '',
  age: '',
  language: 'en',
  accessibility: DEFAULT_ACCESSIBILITY,
}

const SIGNED_OUT_STATE: AuthState = {
  status: 'signed-out',
  role: null,
  caregiver: null,
  patient: null,
}

function initialsFromName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined)

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [auth, setAuth] = useState<AuthState>(
    SIGNED_OUT_STATE
  )

  const [signupDraft, setSignupDraft] =
    useState<SignupDraft>(EMPTY_SIGNUP_DRAFT)

  const updateSignupDraft = useCallback(
    (patch: Partial<SignupDraft>) => {
      setSignupDraft((current) => ({
        ...current,
        ...patch,
      }))
    },
    []
  )

  const resetSignupDraft = useCallback(() => {
    setSignupDraft(EMPTY_SIGNUP_DRAFT)
  }, [])

  const mockLogin = useCallback((role: Role) => {
    if (role === 'caregiver') {
      setAuth({
        status: 'signed-in',
        role: 'caregiver',
        caregiver: {
          id: 'cg-demo-1',
          fullName: 'Rahul Sharma',
          mobile: '+91 98xxxxxx21',
          language: 'en',
        },
        patient: null,
      })
    } else {
      setAuth({
        status: 'signed-in',
        role: 'patient',
        caregiver: null,
        patient: {
          id: 'pt-demo-1',
          fullName: 'Anima Das',
          age: 72,
          language: 'as',
          accessibility: DEFAULT_ACCESSIBILITY,
          avatarInitials: 'AD',
        },
      })
    }
  }, [])

  const completeSignup = useCallback(() => {
    if (!signupDraft.role) return

    if (signupDraft.role === 'caregiver') {
      setAuth({
        status: 'signed-in',
        role: 'caregiver',
        caregiver: {
          id: `cg-${Date.now()}`,
          fullName: signupDraft.fullName,
          mobile: signupDraft.mobile,
          email: signupDraft.email || undefined,
          language: signupDraft.language,
        },
        patient: null,
      })
    } else {
      setAuth({
        status: 'signed-in',
        role: 'patient',
        caregiver: null,
        patient: {
          id: `pt-${Date.now()}`,
          fullName: signupDraft.fullName,
          age: Number(signupDraft.age),
          language: signupDraft.language,
          accessibility: signupDraft.accessibility,
          avatarInitials: initialsFromName(
            signupDraft.fullName
          ),
        },
      })
    }
  }, [signupDraft])

  const logout = useCallback(() => {
    setAuth(SIGNED_OUT_STATE)
    setSignupDraft(EMPTY_SIGNUP_DRAFT)
  }, [])

  const value = useMemo(
    () => ({
      auth,
      signupDraft,
      updateSignupDraft,
      resetSignupDraft,
      mockLogin,
      completeSignup,
      logout,
    }),
    [
      auth,
      signupDraft,
      updateSignupDraft,
      resetSignupDraft,
      mockLogin,
      completeSignup,
      logout,
    ]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}