'use client'

import { AnimatePresence, motion } from 'motion/react'
import type { Greeting } from '@/data/mock-greetings'

export function AIGreeting({ greeting }: { greeting: Greeting }) {
  return (
    <div className="flex min-h-24 flex-col items-center gap-1 text-center sm:min-h-28">
      <AnimatePresence mode="wait">
        <motion.div
          key={greeting.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="text-balance font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            {greeting.title}
          </h1>
          <p className="mt-2 text-balance text-xl text-muted-foreground sm:text-2xl">
            {greeting.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
