import { motion } from 'motion/react'

type TimerDisplayProps = {
  seconds: number
  total: number
  className?: string
}

/**
 * Circular countdown timer with neon ring that depletes as time runs out.
 */
export function TimerDisplay({ seconds, total, className = '' }: TimerDisplayProps) {
  const progress = total > 0 ? seconds / total : 0
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  const isLow = seconds <= 5
  const color = isLow ? '#E9243D' : '#a855f7'

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg width="88" height="88" className="drop-shadow-lg">
        {/* Background ring */}
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="5"
        />
        {/* Progress ring */}
        <motion.circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`,
            transform: 'rotate(-90deg)',
            transformOrigin: '44px 44px',
          }}
        />
      </svg>
      {/* Number */}
      <motion.span
        key={seconds}
        initial={{ scale: 1.3, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute text-2xl font-bold"
        style={{
          color,
          textShadow: `0 0 12px ${color}60`,
        }}
      >
        {seconds}
      </motion.span>
    </div>
  )
}
