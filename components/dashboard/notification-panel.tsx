'use client'

import { useMemo, useState } from 'react'
import { Bell, Droplet, Footprints, Pill, Stethoscope } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { AppNotification } from '@/data/mock-notifications'

const ICONS = {
  brain: Stethoscope,
  walk: Footprints,
  water: Droplet,
  hospital: Stethoscope,
  pill: Pill,
} as const

function NotificationRow({ notification }: { notification: AppNotification }) {
  const Icon = ICONS[notification.icon]
  const isHigh = notification.priority === 'high'

  return (
    <li>
      <div
        className={cn(
          'flex items-center gap-5 rounded-2xl p-5',
          isHigh ? 'bg-destructive/10' : 'bg-secondary/60',
        )}
      >
        <div
          className={cn(
            'flex size-14 shrink-0 items-center justify-center rounded-full',
            isHigh
              ? 'bg-destructive/20 text-destructive'
              : 'bg-primary/15 text-primary',
          )}
        >
          <Icon
            className="size-7"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xl font-semibold leading-snug text-foreground">
            {notification.title}
          </p>

          <p className="mt-1 text-lg font-medium text-muted-foreground">
            {notification.time}
          </p>
        </div>

        {isHigh && (
          <Badge
            variant="destructive"
            className="shrink-0 px-3 py-1.5 text-base font-semibold"
          >
            Important
          </Badge>
        )}
      </div>
    </li>
  )
}

export function NotificationPanel({ notifications }: { notifications: AppNotification[] }) {
  const [open, setOpen] = useState(false)
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])
  const activities = notifications.filter((n) => n.category === 'activity')
  const medical = notifications.filter((n) => n.category === 'medical')

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
  aria-label={`Notifications, ${unreadCount} unread`}
  className="
    relative flex size-[5.5rem] items-center justify-center
    rounded-full
    border border-white/60
    bg-card/85
    text-primary
    shadow-[0_8px_24px_rgba(44,61,50,0.16)]
    backdrop-blur-md
    transition-all duration-300
    hover:-translate-y-0.5 hover:scale-105
    hover:bg-card
    hover:shadow-[0_12px_30px_rgba(44,61,50,0.20)]
    active:translate-y-0 active:scale-95
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary
  "
>
        <Bell className="size-9" strokeWidth={2} aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border-2 border-card bg-sun text-xs font-bold text-sun-foreground shadow-sm"
            aria-hidden="true"
          >
            {unreadCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent
  side="right"
  className="w-full gap-0 sm:max-w-xl"
>
        <SheetHeader>
          <SheetTitle className="text-3xl font-semibold">
  Your Reminders
</SheetTitle>

<SheetDescription className="text-lg leading-relaxed">
  Activities and medical reminders for today.
</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-7rem)] px-4">
          <div className="flex flex-col gap-8 pb-10">
            <div className="flex flex-col gap-5">
              <h2 className="px-1 text-lg font-bold uppercase tracking-wide text-foreground/70">
                Daily Activities
              </h2>
              <ul className="flex flex-col gap-3">
                {activities.map((notification) => (
                  <NotificationRow key={notification.id} notification={notification} />
                ))}
              </ul>
            </div>
            <Separator />
            <div className="flex flex-col gap-3">
              <h2 className="px-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Medical
              </h2>
              <ul className="flex flex-col gap-3">
                {medical.map((notification) => (
                  <NotificationRow key={notification.id} notification={notification} />
                ))}
              </ul>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
