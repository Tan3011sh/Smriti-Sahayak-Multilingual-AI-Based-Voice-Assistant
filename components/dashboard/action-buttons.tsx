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
        'group flex min-h-[14rem] w-full flex-col items-center justify-center gap-4 sm:w-[28rem]',
        'rounded-[2rem] border border-white/60 bg-card/90 p-7 text-center',
        'shadow-[0_14px_35px_rgba(44,61,50,0.14)] backdrop-blur-md',
        'transition-all duration-300 sm:min-h-[14rem] sm:p-10',

        'hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(44,61,50,0.18)]',
        'active:scale-[0.98]',
        'focus-visible:-translate-y-1',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-primary',
      )}
    >
      <span
        className={cn(
          'flex size-[5.8rem] items-center justify-center rounded-full',
          'shadow-sm transition-all duration-300',
          'group-hover:scale-110 group-hover:shadow-md',
          'sm:size-[5.5rem]',

          tone === 'primary'
            ? 'bg-primary/15 text-primary'
            : 'bg-sun/30 text-sun-foreground',
        )}
      >
        <Icon
          className="size-10 sm:size-11"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </span>

      <span className="text-[1.35rem] font-bold tracking-tight text-foreground sm:text-2xl">
        {label}
      </span>

      <span className="max-w-[16rem] text-[1rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">
        {description}
      </span>
    </Link>
  )
}

export function ActionButtons() {
  return (
    <div className="flex w-full flex-col justify-between gap-10 sm:flex-row sm:px-6 lg:px-16">
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