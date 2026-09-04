'use client'

import { useState } from 'react'
import { Cake, Languages, Phone, ShieldCheck } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import type { UserProfile } from '@/data/mock-user'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Cake
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-5 rounded-2xl bg-secondary/60 p-5">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon className="size-7" strokeWidth={2} aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="text-base font-medium text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 text-xl font-semibold leading-snug text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}

export function ProfilePanel({ user }: { user: UserProfile }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
  aria-label={`Open profile for ${user.name}`}
  className="
    flex size-[5.5rem] items-center justify-center
    rounded-full
    border border-white/60
    bg-card/85
    p-1
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
  <Avatar className="size-full">
    <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">
      {initials(user.name)}
    </AvatarFallback>
  </Avatar>
</SheetTrigger>
      <SheetContent
  side="right"
  className="w-full gap-0 sm:max-w-lg"
>
        <SheetHeader className="items-center px-6 pb-6 text-center">
  <Avatar className="size-28">
    <AvatarFallback className="bg-primary text-4xl font-semibold text-primary-foreground">
      {initials(user.name)}
    </AvatarFallback>
  </Avatar>

  <SheetTitle className="text-3xl font-semibold">
    {user.name}
  </SheetTitle>

  <SheetDescription className="text-lg">
    {user.age} years old
  </SheetDescription>
</SheetHeader>
        <div className="flex flex-col gap-3 px-4 pb-8">
          <InfoRow icon={Cake} label="Date of Birth" value={user.dateOfBirth} />
          <InfoRow icon={Phone} label="Phone Number" value={user.phone} />
          <InfoRow icon={Languages} label="Preferred Language" value={user.language} />
          <Separator className="my-1" />
          <h2 className="px-1 text-base font-bold uppercase tracking-wide text-foreground/70">
  Caregiver
</h2>
          <InfoRow icon={ShieldCheck} label="Caregiver Name" value={user.caregiverName} />
          <InfoRow icon={Phone} label="Caregiver Phone" value={user.caregiverPhone} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
