import { mockUser, mockCaregiverUser, type UserProfile } from '@/data/mock-user'

const USERS_STORAGE_KEY = 'smriti_sahayak_users_v1'
const CURRENT_SESSION_KEY = 'smriti_sahayak_current_user_v1'

// Helper for SHA-256 hashing using Web Crypto API to avoid storing plaintext passwords
export async function hashPassword(password: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    // Basic fallback hash for non-browser/SSR context
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash |= 0
    }
    return `mock_hash_${Math.abs(hash)}`
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function getStoredUsers(): UserProfile[] {
  if (typeof window === 'undefined') {
    return [mockUser, mockCaregiverUser]
  }

  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) {
      // Seed default demo accounts
      const defaultUsers = [
        { ...mockUser, passwordHash: 'mock_hash_default' },
        { ...mockCaregiverUser, passwordHash: 'mock_hash_default' },
      ]
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers))
      return defaultUsers
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading stored users:', err)
    return [mockUser, mockCaregiverUser]
  }
}

export function getCurrentUser(): UserProfile {
  if (typeof window === 'undefined') {
    return mockUser
  }

  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY)
    if (!raw) {
      // Default initial session is Patient Ramesh Sharma
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(mockUser))
      return mockUser
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading current user:', err)
    return mockUser
  }
}

export function setCurrentUserSession(user: UserProfile): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user))
  } catch (err) {
    console.error('Error saving current user session:', err)
  }
}

export async function loginUser(
  identifier: string,
  password: string,
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const cleanId = identifier.trim().toLowerCase()
  if (!cleanId) {
    return { success: false, error: 'Please enter your email or phone number.' }
  }
  if (!password) {
    return { success: false, error: 'Please enter your password.' }
  }

  const users = getStoredUsers()
  const hashed = await hashPassword(password)

  // Search by email or phone
  const foundUser = users.find(
    (u) =>
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.phone && u.phone.replace(/\s+/g, '').includes(cleanId.replace(/\s+/g, ''))),
  )

  if (!foundUser) {
    return { success: false, error: 'Account not found. Please check your credentials or create an account.' }
  }

  // Verify password hash (if passwordHash exists on record)
  if (foundUser.passwordHash && foundUser.passwordHash !== 'mock_hash_default') {
    if (foundUser.passwordHash !== hashed) {
      return { success: false, error: 'Incorrect password. Please try again.' }
    }
  }

  // Set active session
  setCurrentUserSession(foundUser)
  return { success: true, user: foundUser }
}

export interface PatientSignupInput {
  name: string
  age: number
  identifier: string // email or phone
  password: string
  preferredLanguage: string
  caregiverCode?: string
}

export async function registerPatient(
  input: PatientSignupInput,
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  if (!input.name.trim()) return { success: false, error: 'Full name is required.' }
  if (!input.age || input.age <= 0) return { success: false, error: 'Please enter a valid age.' }
  if (!input.identifier.trim()) return { success: false, error: 'Email or phone number is required.' }
  if (!input.password || input.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' }
  }

  const users = getStoredUsers()
  const cleanId = input.identifier.trim().toLowerCase()

  const existing = users.find(
    (u) =>
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.phone && u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')),
  )
  if (existing) {
    return { success: false, error: 'An account with this email or phone number already exists.' }
  }

  const passwordHash = await hashPassword(input.password)
  const isEmail = cleanId.includes('@')

  const newUser: UserProfile = {
    id: `usr_patient_${Date.now()}`,
    name: input.name.trim(),
    age: Number(input.age),
    phone: isEmail ? '+91 98765 00000' : input.identifier.trim(),
    email: isEmail ? cleanId : undefined,
    role: 'patient',
    language: input.preferredLanguage || 'English',
    caregiverName: 'Assigned Caregiver',
    caregiverPhone: '+91 98765 12345',
    connectionCode: input.caregiverCode?.trim() || `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
    passwordHash,
  }

  users.push(newUser)
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  }
  setCurrentUserSession(newUser)

  return { success: true, user: newUser }
}

export interface CaregiverSignupInput {
  name: string
  identifier: string // email or phone
  password: string
  relationshipRole: string
  patientCode?: string
}

export async function registerCaregiver(
  input: CaregiverSignupInput,
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  if (!input.name.trim()) return { success: false, error: 'Full name is required.' }
  if (!input.identifier.trim()) return { success: false, error: 'Email or phone number is required.' }
  if (!input.password || input.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' }
  }
  if (!input.relationshipRole) return { success: false, error: 'Please select your role/relationship.' }

  const users = getStoredUsers()
  const cleanId = input.identifier.trim().toLowerCase()

  const existing = users.find(
    (u) =>
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.phone && u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')),
  )
  if (existing) {
    return { success: false, error: 'An account with this email or phone number already exists.' }
  }

  const passwordHash = await hashPassword(input.password)
  const isEmail = cleanId.includes('@')

  const newUser: UserProfile = {
    id: `usr_caregiver_${Date.now()}`,
    name: input.name.trim(),
    age: 35,
    phone: isEmail ? '+91 98765 12345' : input.identifier.trim(),
    email: isEmail ? cleanId : undefined,
    role: 'caregiver',
    relationshipRole: input.relationshipRole,
    caregiverName: input.name.trim(),
    caregiverPhone: isEmail ? '+91 98765 12345' : input.identifier.trim(),
    language: 'English',
    connectionCode: input.patientCode?.trim() || `CG-${Math.floor(1000 + Math.random() * 9000)}`,
    passwordHash,
  }

  users.push(newUser)
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  }
  setCurrentUserSession(newUser)

  return { success: true, user: newUser }
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(CURRENT_SESSION_KEY)
  } catch (err) {
    console.error('Error logging out user:', err)
  }
}
