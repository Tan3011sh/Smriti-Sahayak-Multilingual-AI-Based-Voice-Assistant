'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  User,
  HeartHandshake,
  ArrowLeft,
  Lock,
  Mail,
  Phone,
  Calendar,
  Languages,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { DynamicBackground } from '@/components/dashboard/dynamic-background'
import {
  loginUser,
  registerPatient,
  registerCaregiver,
} from '@/lib/services/auth-service'

type AuthMode = 'login' | 'signup'
type RoleType = 'patient' | 'caregiver' | null

const LANGUAGES = [
  'Hindi',
  'Assamese',
  'Bengali',
  'Manipuri',
  'English',
  'Bodo',
  'Khasi',
  'Mizo',
  'Nagamese',
  'Garo',
]

const CAREGIVER_ROLES = ['Family Member', 'Caregiver', 'Healthcare Worker']

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  const [selectedRole, setSelectedRole] = useState<RoleType>(null)

  // Common Login Form state
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // Patient Signup Form state
  const [patientName, setPatientName] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [patientIdentifier, setPatientIdentifier] = useState('')
  const [patientPassword, setPatientPassword] = useState('')
  const [patientConfirmPassword, setPatientConfirmPassword] = useState('')
  const [patientLanguage, setPatientLanguage] = useState('Hindi')
  const [patientCaregiverCode, setPatientCaregiverCode] = useState('')
  const [showPatientPassword, setShowPatientPassword] = useState(false)

  // Caregiver Signup Form state
  const [caregiverName, setCaregiverName] = useState('')
  const [caregiverIdentifier, setCaregiverIdentifier] = useState('')
  const [caregiverPassword, setCaregiverPassword] = useState('')
  const [caregiverConfirmPassword, setCaregiverConfirmPassword] = useState('')
  const [caregiverRole, setCaregiverRole] = useState('Family Member')
  const [caregiverPatientCode, setCaregiverPatientCode] = useState('')
  const [showCaregiverPassword, setShowCaregiverPassword] = useState(false)

  // UI state
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const clearMessages = () => {
    setError(null)
  }

  const handleModeSwitch = (newMode: AuthMode) => {
    clearMessages()
    setMode(newMode)
    if (newMode === 'login') {
      setSelectedRole(null)
    }
  }

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()
    setIsLoading(true)

    try {
      const res = await loginUser(loginIdentifier, loginPassword)
      if (!res.success || !res.user) {
        setError(res.error || 'Failed to sign in.')
        setIsLoading(false)
        return
      }

      // Role-based redirect
      if (res.user.role === 'caregiver') {
        router.push('/caregiver')
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  // Handle Patient Signup submission
  const handlePatientSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()

    if (patientPassword !== patientConfirmPassword) {
      setError('Passwords do not match. Please check and try again.')
      return
    }

    setIsLoading(true)
    try {
      const res = await registerPatient({
        name: patientName,
        age: Number(patientAge),
        identifier: patientIdentifier,
        password: patientPassword,
        preferredLanguage: patientLanguage,
        caregiverCode: patientCaregiverCode,
      })

      if (!res.success || !res.user) {
        setError(res.error || 'Failed to create account.')
        setIsLoading(false)
        return
      }

      router.push('/')
    } catch (err) {
      setError('An unexpected error occurred during signup.')
      setIsLoading(false)
    }
  }

  // Handle Caregiver Signup submission
  const handleCaregiverSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()

    if (caregiverPassword !== caregiverConfirmPassword) {
      setError('Passwords do not match. Please check and try again.')
      return
    }

    setIsLoading(true)
    try {
      const res = await registerCaregiver({
        name: caregiverName,
        identifier: caregiverIdentifier,
        password: caregiverPassword,
        relationshipRole: caregiverRole,
        patientCode: caregiverPatientCode,
      })

      if (!res.success || !res.user) {
        setError(res.error || 'Failed to create account.')
        setIsLoading(false)
        return
      }

      router.push('/caregiver')
    } catch (err) {
      setError('An unexpected error occurred during signup.')
      setIsLoading(false)
    }
  }

  return (
    <main className="relative isolate min-h-svh flex flex-col items-center justify-center overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <DynamicBackground />

      {/* Navigation / Header back to main app */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-white/70 bg-card/90 px-4 py-2 text.base font-semibold text-foreground shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="size-5 text-primary" />
          <span>Home</span>
        </Link>
        <div className="text-right">
          <p className="font-serif text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Smriti Sahayak
          </p>
          <p className="text-xs text-foreground/70 sm:text-sm font-medium">
            Your Calm & Caring Companion
          </p>
        </div>
      </header>

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-2xl my-auto">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/80 bg-card/95 p-6 shadow-[0_20px_50px_rgba(44,61,50,0.22)] backdrop-blur-xl sm:p-10">
          
          {/* Main Mode Toggle: Login vs Create Account */}
          <div className="flex rounded-2xl bg-secondary/80 p-1.5 shadow-inner mb-8">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={`flex-1 rounded-xl py-3.5 text-center text-lg sm:text-xl font-bold transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('signup')}
              className={`flex-1 rounded-xl py-3.5 text-center text-lg sm:text-xl font-bold transition-all duration-300 ${
                mode === 'signup'
                  ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="size-6 shrink-0 mt-0.5" />
              <div className="text-base sm:text-lg font-semibold">{error}</div>
            </div>
          )}

          {/* LOGIN VIEW */}
          {mode === 'login' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 text-center">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                  Welcome Back
                </h1>
                <p className="mt-2 text-lg sm:text-xl text-muted-foreground">
                  Please sign in to access your companion account.
                </p>
              </div>

              {/* Demo Hint Banner for ease of testing */}
              <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground/80">
                <div className="flex items-center gap-2 font-bold text-primary text-base mb-1">
                  <Sparkles className="size-5" /> Quick Demo Credentials:
                </div>
                <p><strong>Patient:</strong> ramesh@example.com (Password: any)</p>
                <p><strong>Caregiver:</strong> anita@example.com (Password: any)</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-bold text-foreground mb-2">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-6 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. ramesh@example.com or +91 98765 43210"
                      className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 pl-14 pr-4 text-lg font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-bold text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-6 text-muted-foreground" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 pl-14 pr-12 text-lg font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showLoginPassword ? <EyeOff className="size-6" /> : <Eye className="size-6" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 rounded-2xl bg-primary text-primary-foreground text-xl font-bold shadow-lg hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </motion.div>
          )}

          {/* SIGNUP VIEW */}
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Role Selection */}
              {selectedRole === null ? (
                <div>
                  <div className="mb-8 text-center">
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                      Who is this account for?
                    </h1>
                    <p className="mt-2 text-lg sm:text-xl text-muted-foreground">
                      Choose an option to personalize your experience.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Patient Card */}
                    <button
                      type="button"
                      onClick={() => {
                        clearMessages()
                        setSelectedRole('patient')
                      }}
                      className="group flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-border/80 bg-card/90 hover:border-primary hover:bg-primary/5 shadow-md hover:shadow-xl transition-all duration-300 text-center active:scale-98"
                    >
                      <div className="size-20 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <User className="size-10" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">
                        Patient
                      </h2>
                      <p className="mt-2 text-base text-muted-foreground font-medium">
                        For elderly users seeking daily memory support, games, and voice assistance.
                      </p>
                    </button>

                    {/* Caregiver Card */}
                    <button
                      type="button"
                      onClick={() => {
                        clearMessages()
                        setSelectedRole('caregiver')
                      }}
                      className="group flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-border/80 bg-card/90 hover:border-primary hover:bg-primary/5 shadow-md hover:shadow-xl transition-all duration-300 text-center active:scale-98"
                    >
                      <div className="size-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <HeartHandshake className="size-10" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">
                        Caregiver
                      </h2>
                      <p className="mt-2 text-base text-muted-foreground font-medium">
                        For family members, caregivers, and healthcare workers managing care.
                      </p>
                    </button>
                  </div>
                </div>
              ) : selectedRole === 'patient' ? (
                /* Step 2: Patient Signup Form */
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setSelectedRole(null)}
                      className="flex items-center justify-center size-12 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-all"
                    >
                      <ArrowLeft className="size-6" />
                    </button>
                    <div>
                      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                        Patient Account Creation
                      </h1>
                      <p className="text-base text-muted-foreground">
                        Simple signup for daily memory support
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handlePatientSignupSubmit} className="space-y-5">
                    <div>
                      <label className="block text-lg font-bold text-foreground mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Ramesh Sharma"
                        className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 px-4 text-lg font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-lg font-bold text-foreground mb-1.5">
                          Age *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="120"
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                          placeholder="e.g. 72"
                          className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 px-4 text-lg font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-foreground mb-1.5">
                          Preferred Language
                        </label>
                        <select
                          value={patientLanguage}
                          onChange={(e) => setPatientLanguage(e.target.value)}
                          className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 px-4 text-lg font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                        >
                          {LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>
                              {lang}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-bold text-foreground mb-1.5">
                        Email or Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={patientIdentifier}
                        onChange={(e) => setPatientIdentifier(e.target.value)}
                        placeholder="e.g. ramesh@example.com or +91 98765 43210"
                        className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 px-4 text-lg font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-lg font-bold text-foreground mb-1.5">
                          Password *
                        </label>
                        <input
                          type={showPatientPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={patientPassword}
                          onChange={(e) => setPatientPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 px-4 text-lg font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-foreground mb-1.5">
                          Confirm Password *
                        </label>
                        <input
                          type={showPatientPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={patientConfirmPassword}
                          onChange={(e) => setPatientConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 px-4 text-lg font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-bold text-foreground mb-1.5">
                        Caregiver Connection Code (Optional)
                      </label>
                      <input
                        type="text"
                        value={patientCaregiverCode}
                        onChange={(e) => setPatientCaregiverCode(e.target.value)}
                        placeholder="e.g. CG-1234 (leave blank if none)"
                        className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 px-4 text-lg font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-16 rounded-2xl bg-primary text-primary-foreground text-xl font-bold shadow-lg hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 mt-4"
                    >
                      {isLoading ? 'Creating Account...' : 'Complete Patient Signup'}
                    </button>
                  </form>
                </div>
              ) : (
                /* Step 2: Caregiver Signup Form */
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setSelectedRole(null)}
                      className="flex items-center justify-center size-12 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-all"
                    >
                      <ArrowLeft className="size-6" />
                    </button>
                    <div>
                      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                        Caregiver Account Creation
                      </h1>
                      <p className="text-base text-muted-foreground">
                        Support and connect with your patient
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleCaregiverSignupSubmit} className="space-y-5">
                    <div>
                      <label className="block text-lg font-bold text-foreground mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={caregiverName}
                        onChange={(e) => setCaregiverName(e.target.value)}
                        placeholder="e.g. Anita Sharma"
                        className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 px-4 text-lg font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-bold text-foreground mb-1.5">
                        Relationship / Role *
                      </label>
                      <select
                        value={caregiverRole}
                        onChange={(e) => setCaregiverRole(e.target.value)}
                        className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 px-4 text-lg font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                      >
                        {CAREGIVER_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-lg font-bold text-foreground mb-1.5">
                        Email or Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={caregiverIdentifier}
                        onChange={(e) => setCaregiverIdentifier(e.target.value)}
                        placeholder="e.g. anita@example.com or +91 98765 12345"
                        className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 px-4 text-lg font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-lg font-bold text-foreground mb-1.5">
                          Password *
                        </label>
                        <input
                          type={showCaregiverPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={caregiverPassword}
                          onChange={(e) => setCaregiverPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 px-4 text-lg font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-foreground mb-1.5">
                          Confirm Password *
                        </label>
                        <input
                          type={showCaregiverPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={caregiverConfirmPassword}
                          onChange={(e) => setCaregiverConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 px-4 text-lg font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-bold text-foreground mb-1.5">
                        Patient Connection Code (Optional)
                      </label>
                      <input
                        type="text"
                        value={caregiverPatientCode}
                        onChange={(e) => setCaregiverPatientCode(e.target.value)}
                        placeholder="e.g. SM-7892 (leave blank if none)"
                        className="w-full h-14 rounded-2xl border-2 border-border/80 bg-background/80 px-4 text-lg font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-16 rounded-2xl bg-primary text-primary-foreground text-xl font-bold shadow-lg hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 mt-4"
                    >
                      {isLoading ? 'Creating Account...' : 'Complete Caregiver Signup'}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </main>
  )
}
