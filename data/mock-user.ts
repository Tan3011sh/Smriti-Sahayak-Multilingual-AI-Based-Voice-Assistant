export interface UserProfile {
  id?: string
  name: string
  age: number
  dateOfBirth?: string
  phone: string
  email?: string
  role?: 'patient' | 'caregiver'
  relationshipRole?: string
  caregiverName: string
  caregiverPhone: string
  language: string
  connectionCode?: string
  passwordHash?: string
}

export const mockUser: UserProfile = {
  id: 'usr_patient_default',
  name: 'Ramesh Sharma',
  age: 72,
  dateOfBirth: '14 March 1954',
  phone: '+91 98765 43210',
  email: 'ramesh@example.com',
  role: 'patient',
  caregiverName: 'Anita Sharma',
  caregiverPhone: '+91 98765 12345',
  language: 'Hindi',
  connectionCode: 'SM-7892',
}

export const mockCaregiverUser: UserProfile = {
  id: 'usr_caregiver_default',
  name: 'Anita Sharma',
  age: 42,
  dateOfBirth: '20 August 1983',
  phone: '+91 98765 12345',
  email: 'anita@example.com',
  role: 'caregiver',
  relationshipRole: 'Family Member',
  caregiverName: 'Anita Sharma',
  caregiverPhone: '+91 98765 12345',
  language: 'Hindi',
  connectionCode: 'SM-7892',
}

