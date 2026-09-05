import { CompanionDashboard } from '@/components/dashboard/companion-dashboard'
import { getUserProfile } from '@/lib/services/user-service'
import { getNotifications } from '@/lib/services/notifications-service'

export default async function Page() {
  const [user, notifications] = await Promise.all([getUserProfile(), getNotifications()])

  return <CompanionDashboard user={user} notifications={notifications} />
}
