import { mockNotifications, type AppNotification } from '@/data/mock-notifications'

// TODO: replace with `GET /user/notifications` once the backend is available.
export async function getNotifications(): Promise<AppNotification[]> {
  return Promise.resolve(mockNotifications)
}
