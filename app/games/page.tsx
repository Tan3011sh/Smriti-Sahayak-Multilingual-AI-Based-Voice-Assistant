import { BrainCircuit, Grid3x3, Puzzle, SpellCheck } from 'lucide-react'
import { DynamicBackground } from '@/components/dashboard/dynamic-background'
import { BackHeader } from '@/components/dashboard/back-header'

const GAMES = [
  {
    icon: BrainCircuit,
    title: 'Memory Match',
    description: 'Match pairs of cards to sharpen your memory.',
  },
  {
    icon: Grid3x3,
    title: 'Number Puzzle',
    description: 'A gentle sliding puzzle to keep your mind active.',
  },
  {
    icon: SpellCheck,
    title: 'Word Recall',
    description: 'Recall simple words with helpful picture clues.',
  },
  {
    icon: Puzzle,
    title: 'Picture Puzzle',
    description: 'Piece together calming pictures of nature.',
  },
]

export default function GamesPage() {
  return (
    <main className="relative flex min-h-svh flex-col gap-8 px-6 py-8 sm:px-10 sm:py-12">
      <DynamicBackground />
      <BackHeader title="Play Games" />

      <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {GAMES.map((game) => (
          <button
            key={game.title}
            type="button"
            className="flex flex-col items-center gap-3 rounded-3xl border border-border/60 bg-card/85 p-6 text-center shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-sun/25 text-sun-foreground">
              <game.icon className="size-8" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="text-xl font-semibold text-foreground">{game.title}</span>
            <span className="text-base text-muted-foreground">{game.description}</span>
          </button>
        ))}
      </div>
    </main>
  )
}
