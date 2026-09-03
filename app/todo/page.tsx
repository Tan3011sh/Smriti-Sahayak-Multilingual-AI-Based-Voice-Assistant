import { Droplet, Footprints, Hospital, Pill, Stethoscope } from 'lucide-react'
import { DynamicBackground } from '@/components/dashboard/dynamic-background'
import { BackHeader } from '@/components/dashboard/back-header'
import { getNotifications } from '@/lib/services/notifications-service'
import { cn } from '@/lib/utils'

const ICONS = {
  brain: Stethoscope,
  walk: Footprints,
  water: Droplet,
  hospital: Hospital,
  pill: Pill,
} as const

export default async function TodoPage() {
  const notifications = await getNotifications()

  return (
    <main className="relative flex min-h-svh flex-col gap-8 px-6 py-8 sm:px-10 sm:py-12">
      <DynamicBackground />
      <BackHeader title="Your To-Do List" />

      <ul className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        {notifications.map((item) => {
          const Icon = ICONS[item.icon]
          const isHigh = item.priority === 'high'
          return (
            <li key={item.id}>
              <div
                className={cn(
                  'flex items-center gap-5 rounded-3xl border border-border/60 bg-card/85 p-5 shadow-sm backdrop-blur',
                )}
              >
                <span
                  className={cn(
                    'flex size-14 shrink-0 items-center justify-center rounded-full',
                    isHigh ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary',
                  )}
                >
                  <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xl font-medium text-foreground">{item.title}</p>
                  <p className="text-base text-muted-foreground">{item.time}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
