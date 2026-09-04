'use client'

import { motion } from 'motion/react'

export function DynamicBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden"
    >
      {/* MAIN BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/mountain-background.jpg')",
        }}
      />

      {/* CINEMATIC MOVING MIST */}
      <motion.div
        className="absolute z-[1] pointer-events-none"
        style={{
          top: '32%',
          left: '-30%',
          width: '180%',
          height: '70%',
          backgroundImage: "url('/images/mist-overlay.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.47,
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
    </div>
  )
}