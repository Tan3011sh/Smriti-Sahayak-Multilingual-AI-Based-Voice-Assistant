import { mockUser, type UserProfile } from '@/data/mock-user'

// TODO: replace with `GET /user/profile` once the backend is available.
export async function getUserProfile(): Promise<UserProfile> {
  return Promise.resolve(mockUser)
}
