export interface UserProfile {
  name: string
  age: number
  dateOfBirth: string
  phone: string
  caregiverName: string
  caregiverPhone: string
  language: string
}

export const mockUser: UserProfile = {
  name: 'Ramesh Sharma',
  age: 72,
  dateOfBirth: '14 March 1954',
  phone: '+91 98765 43210',
  caregiverName: 'Anita Sharma',
  caregiverPhone: '+91 98765 12345',
  language: 'Hindi',
}
