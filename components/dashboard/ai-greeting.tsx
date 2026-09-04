'use client'

import { AnimatePresence, motion } from 'motion/react'
import type { Greeting } from '@/data/mock-greetings'

export function AIGreeting({ greeting }: { greeting: Greeting }) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center text-center sm:min-h-32">
      <AnimatePresence mode="wait">
        <motion.div
          key={greeting.title}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="text-balance font-serif text-4xl font-semibold tracking-tight text-foreground drop-shadow-sm sm:text-5xl">
            {greeting.title}
          </h1>

          <p className="mt-3 text-balance text-lg font-medium text-foreground/75 sm:text-xl">
            {greeting.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}