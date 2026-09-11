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
        'group flex min-h-[clamp(6rem,11vh,8rem)] w-full flex-col items-center justify-center gap-[clamp(0.5rem,1vh,0.75rem)] sm:w-[24rem] sm:min-h-[clamp(7rem,12vh,9rem)]',
        'rounded-[2rem] border border-white/50 bg-card/65 p-7 text-center',
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
          'sm:size-[5rem]',

          tone === 'primary'
            ? 'bg-primary/15 text-primary'
            : 'bg-sun/30 text-sun-foreground',
        )}
      >
        <Icon
  className="size-[clamp(2rem,4vh,2.5rem)] sm:size-[clamp(2.25rem,4vh,2.75rem)]"
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

import { useLanguage } from '@/context/language-context'

export function ActionButtons() {
  const { t } = useLanguage()

  return (
    <div className="flex w-full flex-col justify-between gap-6 sm:gap-10 sm:flex-row sm:px-6 lg:px-16">
      <ActionCard
        href="/todo"
        icon={ClipboardList}
        label={t('nav.todo') || 'Daily Tasks'}
        description={t('dashboard.dailyTasksDesc') || "See today's tasks and reminders"}
        tone="primary"
      />

      <ActionCard
        href="/games"
        icon={Puzzle}
        label={t('nav.games') || 'Play Games'}
        description={t('dashboard.brainExerciseDesc') || 'Fun exercises to keep your mind sharp'}
        tone="sun"
      />
    </div>
  )
}