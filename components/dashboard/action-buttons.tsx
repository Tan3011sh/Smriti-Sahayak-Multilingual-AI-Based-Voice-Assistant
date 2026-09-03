import Link from 'next/link'
import { ClipboardList, Puzzle } from 'lucide-react'
import { cn } from '@/lib/utils'

function ActionCard({
  href,
  icon: Icon,
  label,
  description,
  tone,
}: {
  href: string
  icon: typeof ClipboardList
  label: string
  description: string
  tone: 'primary' | 'sun'
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-1 flex-col items-center gap-3 rounded-3xl border border-border/60 bg-card/85 p-6 text-center shadow-sm backdrop-blur transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'sm:p-8',
      )}
    >
      <span
        className={cn(
          'flex size-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 sm:size-20',
          tone === 'primary' ? 'bg-primary/15 text-primary' : 'bg-sun/25 text-sun-foreground',
        )}
      >
        <Icon className="size-8 sm:size-9" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="text-xl font-semibold text-foreground sm:text-2xl">{label}</span>
      <span className="text-base text-muted-foreground">{description}</span>
    </Link>
  )
}

export function ActionButtons() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
      <ActionCard
        href="/todo"
        icon={ClipboardList}
        label="To Do List"
        description="See today's tasks and reminders"
        tone="primary"
      />
      <ActionCard
        href="/games"
        icon={Puzzle}
        label="Play Games"
        description="Fun exercises to keep your mind sharp"
        tone="sun"
      />
    </div>
  )
}
