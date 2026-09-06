'use client'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  onDark?: boolean
  className?: string
}

const SIZE_MAP = {
  sm: { mark: 32, text: 'text-lg' },
  md: { mark: 40, text: 'text-2xl' },
  lg: { mark: 56, text: 'text-3xl' },
}

export function Logo({
  size = 'md',
  onDark = false,
  className = '',
}: LogoProps) {
  const { mark, text } = SIZE_MAP[size]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={mark}
        height={mark}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="20"
          cy="20"
          r="19"
          fill={onDark ? 'rgba(234,242,239,0.10)' : '#EAF2EF'}
        />

        <path
          d="M13 24c0-6 4-10.5 9-10.5S27 15 27 21c0 3.5-2.4 5.5-5 5.5-2 0-3.5-1.2-3.5-3 0-1.4 1-2.3 2.2-2.3"
          stroke="#2F6F62"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />

        <circle
          cx="14"
          cy="24.5"
          r="2.1"
          fill="#D98E3F"
        />
      </svg>

      <span
        className={`
          font-display font-semibold tracking-tight
          ${text}
          ${onDark ? 'text-white' : 'text-[#1F3B33]'}
        `}
      >
        Smriti<span className="text-[#2F6F62]"> Sahayak</span>
      </span>
    </div>
  )
}