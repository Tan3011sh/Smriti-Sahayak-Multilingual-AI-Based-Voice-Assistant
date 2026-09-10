import { getCurrentUser } from '@/lib/services/auth-service'
import type { UserProfile } from '@/data/mock-user'

export async function getUserProfile(): Promise<UserProfile> {
  return Promise.resolve(getCurrentUser())
}

