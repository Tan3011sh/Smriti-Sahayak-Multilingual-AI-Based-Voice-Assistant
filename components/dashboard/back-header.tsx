import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function BackHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center gap-4">
      <Link
        href="/"
        aria-label="Back to home"
        className="flex size-14 items-center justify-center rounded-full bg-card/80 shadow-md ring-1 ring-border backdrop-blur transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeft className="size-6" strokeWidth={2} aria-hidden="true" />
      </Link>
      <h1 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">{title}</h1>
    </header>
  )
}
