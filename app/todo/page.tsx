'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  Droplet,
  Footprints,
  Pill,
  Stethoscope,
} from 'lucide-react'
import { cn } from '@/lib/utils'


/*
  =========================================================
  TODO ITEM
  =========================================================

  This component creates one large reminder card.

  The card is intentionally large because this interface
  is designed for elderly users.
*/
function TodoItem({
  icon: Icon,
  title,
  time,
  important = false,
}: {
  icon: typeof Stethoscope
  title: string
  time: string
  important?: boolean
}) {
  return (
    <motion.div
      /*
        Small animation when the page loads.
      */
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}

      className={cn(
        /*
          LARGE CARD

          Increased:
          - width
          - height
          - padding
          - spacing
        */
        'flex min-h-[7rem] w-full items-center',
        'rounded-[2rem]',
        'border border-white/70',
        'bg-card/90',
        'px-7 py-5',
        'backdrop-blur-md',

        /*
          Shadow makes the card visible against the
          mountain background.
        */
        'shadow-[0_12px_35px_rgba(44,61,50,0.18)]',

        /*
          Slight interaction when touched / hovered.
        */
        'transition-all duration-300',
        'hover:-translate-y-1',
        'hover:shadow-[0_18px_40px_rgba(44,61,50,0.24)]',
      )}
    >

      {/* =================================================
          LARGE ICON
          ================================================= */}

      <div
        className={cn(
          /*
            64px icon container.
            This is intentionally much larger than before.
          */
          'flex size-16 shrink-0 items-center justify-center',
          'rounded-full',

          important
            ? 'bg-red-100 text-red-700'
            : 'bg-primary/10 text-primary',
        )}
      >
        <Icon
          className="size-8"
          strokeWidth={1.9}
          aria-hidden="true"
        />
      </div>


      {/* =================================================
          TEXT CONTENT
          ================================================= */}

      <div className="ml-6 min-w-0 flex-1">

        {/* Reminder title */}
        <h2 className="text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
          {title}
        </h2>

        {/* Reminder time */}
        <p className="mt-2 text-lg font-medium text-muted-foreground sm:text-xl">
          {time}
        </p>

      </div>

    </motion.div>
  )
}


/*
  =========================================================
  TO DO PAGE
  =========================================================
*/

export default function TodoPage() {
  return (
    <main className="relative min-h-svh overflow-hidden">


      {/* =================================================
          MOUNTAIN BACKGROUND
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
          MOVING CINEMATIC MIST

          Same effect used on the Home and Games pages.
          ================================================= */}

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute z-[1]"
        style={{
          top: '32%',
          left: '-30%',
          width: '180%',
          height: '60%',
          backgroundImage:
            "url('/images/mist-overlay.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.38,
        }}
        animate={{
          x: [-80, 80, -80],
          y: [0, -8, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />


      {/* =================================================
          BACK BUTTON
          ================================================= */}

      <Link
        href="/"
        aria-label="Go back to home page"
        className="
          absolute left-7 top-7 z-30
          flex size-16 items-center justify-center
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
        "
      >
        <ArrowLeft
          className="size-9"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </Link>


      {/* =================================================
          PAGE CONTENT
          ================================================= */}

      <div
        className="
          relative z-20
          flex min-h-svh
          flex-col items-center
          px-6
          pb-10
          pt-28

          sm:px-12
          sm:pt-32

          lg:px-[12%]
          lg:pt-24
        "
      >

        {/* =================================================
            PAGE TITLE
            ================================================= */}

        <div className="mb-8 text-center sm:mb-10">

          <h1
            className="
              font-serif
              text-4xl
              font-semibold
              tracking-tight
              text-foreground
              drop-shadow-sm
              sm:text-5xl
              lg:text-6xl
            "
          >
            Today's Activities
          </h1>

          <p
            className="
              mt-2
              text-lg
              font-medium
              text-foreground/75
              sm:text-xl
              lg:text-2xl
            "
          >
            Your reminders for today
          </p>

        </div>


        {/* =================================================
            REMINDER LIST

            The max width is intentionally large so that
            the cards occupy most of the screen horizontally.
            ================================================= */}

        <div
          className="
            flex w-full
            max-w-6xl
            flex-col
            gap-5
            sm:gap-6
          "
        >

          {/* =================================================
              1. MEMORY EXERCISE
              ================================================= */}

          <TodoItem
            icon={Stethoscope}
            title="Memory Exercise"
            time="Today, 10:00 AM"
          />


          {/* =================================================
              2. EVENING WALK
              ================================================= */}

          <TodoItem
            icon={Footprints}
            title="Evening Walk"
            time="Today, 5:00 PM"
          />


          {/* =================================================
              3. DRINK WATER
              ================================================= */}

          <TodoItem
            icon={Droplet}
            title="Drink Water"
            time="Every 2 Hours"
          />


          {/* =================================================
              4. DOCTOR APPOINTMENT
              ================================================= */}

          <TodoItem
            icon={Stethoscope}
            title="Doctor Appointment"
            time="15 September, 11:00 AM"
            important
          />


          {/* =================================================
              5. MEDICINE REMINDER
              ================================================= */}

          <TodoItem
            icon={Pill}
            title="Medicine Reminder"
            time="Today, 8:00 PM"
            important
          />

        </div>

      </div>

    </main>
  )
}