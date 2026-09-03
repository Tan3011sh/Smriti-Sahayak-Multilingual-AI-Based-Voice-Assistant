export type NotificationCategory = 'activity' | 'medical'
export type NotificationPriority = 'normal' | 'high'

export interface AppNotification {
  id: string
  category: NotificationCategory
  icon: 'brain' | 'walk' | 'water' | 'hospital' | 'pill'
  title: string
  time: string
  priority: NotificationPriority
  read: boolean
}

export const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    category: 'activity',
    icon: 'brain',
    title: 'Memory Exercise',
    time: 'Today, 10:00 AM',
    priority: 'normal',
    read: false,
  },
  {
    id: 'n2',
    category: 'activity',
    icon: 'walk',
    title: 'Evening Walk',
    time: 'Today, 5:00 PM',
    priority: 'normal',
    read: false,
  },
  {
    id: 'n3',
    category: 'activity',
    icon: 'water',
    title: 'Drink Water',
    time: 'Every 2 Hours',
    priority: 'normal',
    read: false,
  },
  {
    id: 'n4',
    category: 'medical',
    icon: 'hospital',
    title: 'Doctor Appointment',
    time: '15 September, 11:00 AM',
    priority: 'high',
    read: false,
  },
  {
    id: 'n5',
    category: 'medical',
    icon: 'pill',
    title: 'Medicine Reminder',
    time: 'Today, 8:00 PM',
    priority: 'high',
    read: false,
  },
]
