'use client'

import { motion, useReducedMotion } from 'motion/react'

const BIRDS = [
  { top: '20%', delay: 0, duration: 28, scale: 0.8 },
  { top: '24%', delay: 5, duration: 32, scale: 0.65 },
  { top: '27%', delay: 12, duration: 30, scale: 0.7 },
]

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 17 + 5) % 100}%`,
  top: `${55 + ((i * 13) % 40)}%`,
  size: 4 + (i % 4) * 3,
  delay: i * 0.7,
}))

const LEAVES = [
  {
    left: '-5%',
    top: '45%',
    size: 55,
    delay: 0,
    duration: 12,
  },
  {
    left: '15%',
    top: '58%',
    size: 45,
    delay: 3,
    duration: 15,
  },
  {
    left: '82%',
    top: '42%',
    size: 50,
    delay: 6,
    duration: 13,
  },
  {
    left: '92%',
    top: '70%',
    size: 65,
    delay: 2,
    duration: 17,
  },
]

export function DynamicBackground() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >

      {/* ========================================
          MAIN REALISTIC BACKGROUND IMAGE
      ======================================== */}

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/mountain-background.jpg')",
        }}
      />


      {/* ========================================
          DEPTH / CINEMATIC OVERLAY
      ======================================== */}

      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10" />


      {/* ========================================
          MOVING MIST LAYER 1
      ======================================== */}

      {!prefersReducedMotion && (
        <motion.div
          className="
            absolute
            left-[-20%]
            top-[40%]
            h-40
            w-[140%]
            rounded-full
            bg-white/25
            blur-3xl
          "
          animate={{
            x: ['0%', '12%', '0%'],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}


      {/* ========================================
          MOVING MIST LAYER 2
      ======================================== */}

      {!prefersReducedMotion && (
        <motion.div
          className="
            absolute
            left-[-30%]
            bottom-[15%]
            h-32
            w-[160%]
            rounded-full
            bg-white/20
            blur-3xl
          "
          animate={{
            x: ['0%', '-10%', '0%'],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}


      {/* ========================================
          DEPTH MIST / FOG
      ======================================== */}

      {!prefersReducedMotion && (
        <motion.div
          className="
            absolute
            bottom-[30%]
            left-[-20%]
            h-24
            w-[150%]
            rounded-full
            bg-slate-100/20
            blur-[80px]
          "
          animate={{
            x: ['-5%', '8%', '-5%'],
            scaleX: [1, 1.08, 1],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}


      {/* ========================================
          FLYING BIRDS
      ======================================== */}

      {!prefersReducedMotion &&
        BIRDS.map((bird, index) => (
          <motion.div
            key={`bird-${index}`}
            className="absolute"
            style={{
              top: bird.top,
              left: '-10%',
            }}
            initial={{
              x: '-10vw',
              opacity: 0,
              scale: bird.scale,
            }}
            animate={{
              x: '120vw',
              opacity: [0, 0.75, 0.75, 0],
              y: [0, -15, 8, -8, 0],
            }}
            transition={{
              duration: bird.duration,
              delay: bird.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >

            {/* Bird silhouette */}
            <div
              className="text-2xl text-slate-700/60"
              style={{
                transform: 'rotate(-5deg)',
              }}
            >
              🕊
            </div>

          </motion.div>
        ))}


      {/* ========================================
          FLOATING LIGHT PARTICLES
      ======================================== */}

      {!prefersReducedMotion &&
        PARTICLES.map((particle, index) => (
          <motion.div
            key={`particle-${index}`}
            className="
              absolute
              rounded-full
              bg-yellow-100/80
              blur-[1px]
            "
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, 8, -4, 0],
              opacity: [0.15, 0.8, 0.2],
              scale: [0.7, 1.3, 0.8],
            }}
            transition={{
              duration: 6 + (index % 5),
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}


      {/* ========================================
          FOREGROUND WIND / LEAVES
      ======================================== */}

      {!prefersReducedMotion &&
        LEAVES.map((leaf, index) => (
          <motion.div
            key={`leaf-${index}`}
            className="
              absolute
              rounded-full
              bg-green-700/60
              blur-sm
            "
            style={{
              left: leaf.left,
              top: leaf.top,
              width: leaf.size,
              height: leaf.size / 2,
            }}
            animate={{
              x: [0, 80, 180],
              y: [0, 30, 100],
              rotate: [0, 160, 320],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: leaf.duration,
              delay: leaf.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}


      {/* ========================================
          SUBTLE CAMERA DEPTH MOTION
      ======================================== */}

      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [1, 1.015, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

    </div>
  )
}