'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Cake, Languages, LogOut, Phone, ShieldCheck, UserCheck } from 'lucide-react'
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
import { logoutUser } from '@/lib/services/auth-service'
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
    <div className="flex items-center gap-4 rounded-2xl bg-secondary/60 p-[clamp(0.75rem,2vh,1.25rem)]">
      <div className="flex size-[clamp(3rem,7vh,3.5rem)] shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon
          className="size-[clamp(1.5rem,3.5vh,1.75rem)]"
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0">
        <p className="text-[clamp(0.9rem,2vh,1rem)] font-medium text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 text-[clamp(1.1rem,2.5vh,1.25rem)] font-semibold leading-snug text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}

export function ProfilePanel({ user }: { user: UserProfile }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logoutUser()
    setOpen(false)
    router.push('/auth')
  }

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
        className="
          h-dvh max-h-dvh
          w-[min(100vw,36rem)]
          gap-0
          overflow-hidden
          p-0
        "
      >
        <SheetHeader className="shrink-0 items-center px-6 pb-4 pt-6 text-center">
          <Avatar className="size-[clamp(5rem,12vh,7rem)]">
            <AvatarFallback className="bg-primary text-[clamp(1.75rem,4vh,2.5rem)] font-semibold text-primary-foreground">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            <UserCheck className="size-4" />
            <span className="capitalize">{user.role || 'Patient'} Account</span>
          </div>

          <SheetTitle className="mt-1 text-[clamp(1.75rem,4vh,2rem)] font-semibold">
            {user.name}
          </SheetTitle>

          <SheetDescription className="text-lg">
            {user.age} years old
          </SheetDescription>
        </SheetHeader>
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-4
            pb-6
          "
        >
          <div className="flex flex-col gap-[clamp(0.5rem,1.5vh,0.75rem)]">
            <InfoRow icon={Cake} label="Date of Birth" value={user.dateOfBirth || 'N/A'} />
            <InfoRow icon={Phone} label="Phone / Contact" value={user.phone} />
            <InfoRow icon={Languages} label="Preferred Language" value={user.language} />
            <Separator className="my-1" />
            <h2 className="px-1 text-base font-bold uppercase tracking-wide text-foreground/70">
              Caregiver Connection
            </h2>
            <InfoRow icon={ShieldCheck} label="Caregiver Name" value={user.caregiverName} />
            <InfoRow icon={Phone} label="Caregiver Phone" value={user.caregiverPhone} />

            <div className="mt-4 pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex w-full h-14 items-center justify-center gap-3
                  rounded-2xl border border-destructive/30
                  bg-destructive/10 text-destructive
                  text-lg font-bold
                  shadow-sm
                  transition-all duration-200
                  hover:bg-destructive hover:text-white
                  active:scale-[0.98]
                "
              >
                <LogOut className="size-6" />
                <span>Log Out / Switch Account</span>
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

