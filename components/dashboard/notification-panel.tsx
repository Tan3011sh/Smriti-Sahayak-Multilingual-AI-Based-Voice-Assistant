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
          'flex items-start gap-4 rounded-2xl p-4',
          isHigh ? 'bg-destructive/10' : 'bg-secondary/60',
        )}
      >
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-full',
            isHigh ? 'bg-destructive/20 text-destructive' : 'bg-primary/15 text-primary',
          )}
        >
          <Icon className="size-5" strokeWidth={2} aria-hidden="true" />
        </div>
        <div className="flex-1 gap-1">
          <p className="text-lg font-medium leading-snug text-foreground">{notification.title}</p>
          <p className="text-base text-muted-foreground">{notification.time}</p>
        </div>
        {isHigh && (
          <Badge variant="destructive" className="mt-0.5 shrink-0">
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
        className="relative flex size-14 items-center justify-center rounded-full bg-card/80 text-foreground shadow-md ring-1 ring-border backdrop-blur transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Bell className="size-6" strokeWidth={2} aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-sun text-sm font-semibold text-sun-foreground"
            aria-hidden="true"
          >
            {unreadCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl">Your Reminders</SheetTitle>
          <SheetDescription className="text-base">
            Activities and medical reminders for today.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-7rem)] px-4">
          <div className="flex flex-col gap-6 pb-8">
            <div className="flex flex-col gap-3">
              <h2 className="px-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
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
