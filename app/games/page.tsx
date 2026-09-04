'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowLeft, Brain, Grid3X3, Languages, Puzzle } from 'lucide-react'
import { cn } from '@/lib/utils'

/*
  ---------------------------------------------------------
  GAME CARD
  ---------------------------------------------------------
  This reusable component creates one game button.

  IMPORTANT:
  Each game card receives its own "href".
  So clicking a card takes the user to a different game page.
*/
function GameCard({
  href,
  icon: Icon,
  title,
  description,
  tone,
}: {
  href: string
  icon: typeof Brain
  title: string
  description: string
  tone: 'pink' | 'blue' | 'green' | 'yellow'
}) {
  return (
    <Link
      href={href}
      className={cn(
        /*
          Large elderly-friendly touch area
        */
        'group flex min-h-[15rem] w-full flex-col items-center justify-center',
        'rounded-[2rem] border border-white/70 bg-card/90',
        'px-6 py-7 text-center backdrop-blur-md',

        /*
          Shadow + hover interaction
        */
        'shadow-[0_12px_35px_rgba(44,61,50,0.18)]',
        'transition-all duration-300',
        'hover:-translate-y-2 hover:scale-[1.02]',
        'hover:shadow-[0_20px_45px_rgba(44,61,50,0.25)]',
        'active:scale-[0.98]',

        /*
          Keyboard accessibility
        */
        'focus-visible:outline-none',
        'focus-visible:ring-4',
        'focus-visible:ring-primary/50',

        /*
          On large screens cards have a fixed comfortable width
        */
        'sm:w-[19rem] lg:w-[21rem]',
      )}
    >
      {/* -------------------------------------------------
          LARGE GAME ICON
          ------------------------------------------------- */}
      <div
        className={cn(
          'flex size-[5.5rem] items-center justify-center',
          'rounded-full shadow-sm',
          'transition-transform duration-300',
          'group-hover:scale-110',

          tone === 'pink' &&
            'bg-rose-200 text-rose-900',

          tone === 'blue' &&
            'bg-sky-200 text-sky-900',

          tone === 'green' &&
            'bg-emerald-200 text-emerald-900',

          tone === 'yellow' &&
            'bg-amber-200 text-amber-900',
        )}
      >
        <Icon
          className="size-11"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      {/* -------------------------------------------------
          GAME NAME
          ------------------------------------------------- */}
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>

      {/* -------------------------------------------------
          GAME DESCRIPTION
          ------------------------------------------------- */}
      <p className="mt-2 max-w-[17rem] text-lg font-medium leading-relaxed text-muted-foreground">
        {description}
      </p>
    </Link>
  )
}


/*
  =========================================================
  GAMES PAGE
  =========================================================
*/
export default function GamesPage() {
  return (
    <main className="relative min-h-svh overflow-hidden">

      {/* =================================================
          BACKGROUND
          ================================================= */}

      {/* =================================================
    MAIN MOUNTAIN BACKGROUND
    ================================================= */}
<div
  aria-hidden="true"
  className="absolute inset-0 bg-cover bg-center"
  style={{
    backgroundImage:
      "url('/images/mountain-background.jpg')",
  }}
/>


{/* =================================================
    CINEMATIC MOVING MIST
    Reuses the same mist effect as the home page.
    ================================================= */}
<motion.div
  aria-hidden="true"
  className="pointer-events-none absolute z-[1]"
  style={{
    top: '32%',
    left: '-30%',
    width: '180%',
    height: '70%',
    backgroundImage: "url('/images/mist-overlay.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.42,
  }}
  animate={{
    x: [-80, 80, -80],
    y: [0, -8, 0],
  }}
  transition={{
    duration: 13,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
/>


{/* Soft readability layer */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 z-[2] bg-white/5"
/>


      {/* =================================================
          BACK BUTTON
          ================================================= */}

      <Link
        href="/"
        aria-label="Go back to home page"
        className="
          absolute left-7 top-7 z-30
          flex size-14 items-center justify-center
          rounded-full
          border border-white/70
          bg-card/90
          text-foreground
          shadow-[0_8px_25px_rgba(44,61,50,0.18)]
          backdrop-blur-md
          transition-all duration-300
          hover:-translate-y-1
          hover:scale-105
          hover:bg-card
          active:scale-95
          focus-visible:outline-none
          focus-visible:ring-4
          focus-visible:ring-primary/50
          sm:left-8 sm:top-8
          sm:size-16
        "
      >
        <ArrowLeft
          className="size-8 sm:size-9"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </Link>


      {/* =================================================
          CENTER TITLE
          ================================================= */}

      <div
        className="
          absolute left-1/2 top-1/2 z-10
          hidden -translate-x-1/2 -translate-y-1/2
          text-center
          lg:block
        "
      >
        <h1 className="
          font-serif
          text-5xl
          font-semibold
          tracking-tight
          text-foreground
          drop-shadow-sm
          xl:text-6xl
        ">
          Choose a Game
        </h1>

        <p className="
          mt-4
          text-2xl
          font-medium
          text-foreground/75
          xl:text-3xl
        ">
          Keep your mind active and happy!
        </p>
      </div>


      {/* =================================================
          GAME CARDS
          
          DESKTOP:
          -------------------------
          Memory Match  | Number Puzzle
          
          
          Word Recall   | Picture Puzzle
          
          They are positioned toward the four corners.
          ================================================= */}

      <div
        className="
          relative z-20
          flex min-h-svh flex-col
          justify-center
          gap-8
          px-6 py-28

          sm:px-10

          lg:block
          lg:px-0
          lg:py-0
        "
      >

        {/* =================================================
            1. MEMORY MATCH
            =================================================
            CHANGE THIS LINK if you choose another route.

            Current route:
            /games/memory-match
        */}
        <div
          className="
            lg:absolute
            lg:left-[3%]
            lg:top-[12%]
          "
        >
          <GameCard
            href="/games/memory-match"
            icon={Brain}
            title="Memory Match"
            description="Match pairs of cards to sharpen your memory."
            tone="pink"
          />
        </div>


        {/* =================================================
            2. NUMBER PUZZLE
            =================================================
            Current route:
            /games/number-puzzle
        */}
        <div
          className="
            lg:absolute
            lg:right-[3%]
            lg:top-[12%]
          "
        >
          <GameCard
            href="/games/number-puzzle"
            icon={Grid3X3}
            title="Number Puzzle"
            description="A gentle sliding puzzle to keep your mind active."
            tone="blue"
          />
        </div>


        {/* =================================================
            3. WORD RECALL
            =================================================
            Current route:
            /games/word-recall
        */}
        <div
          className="
            lg:absolute
            lg:bottom-[7%]
            lg:left-[3%]
          "
        >
          <GameCard
            href="/games/word-recall"
            icon={Languages}
            title="Word Recall"
            description="Recall simple words with helpful picture clues."
            tone="green"
          />
        </div>


        {/* =================================================
            4. PICTURE PUZZLE
            =================================================
            Current route:
            /games/picture-puzzle
        */}
        <div
          className="
            lg:absolute
            lg:bottom-[7%]
            lg:right-[3%]
          "
        >
          <GameCard
            href="/games/picture-puzzle"
            icon={Puzzle}
            title="Picture Puzzle"
            description="Piece together calming pictures of nature."
            tone="yellow"
          />
        </div>

      </div>


      {/* =================================================
          MOBILE TITLE
          =================================================
          On smaller screens the four cards stack vertically,
          so we show the title normally instead of putting it
          in the center of the screen.
      */}
      <div
        className="
          absolute left-1/2 top-24 z-10
          w-full -translate-x-1/2
          px-6 text-center
          lg:hidden
        "
      >
        <h1 className="
          font-serif
          text-4xl
          font-semibold
          tracking-tight
          text-foreground
        ">
          Choose a Game
        </h1>

        <p className="
          mt-2
          text-lg
          font-medium
          text-foreground/75
        ">
          Keep your mind active and happy!
        </p>
      </div>

    </main>
  )
}