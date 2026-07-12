import { motion } from 'motion/react'

type CardBackProps = {
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg' | 'responsive'
  className?: string
}

const sizeMap = {
  sm: { w: 100, h: 140 },
  md: { w: 130, h: 180 },
  lg: { w: 160, h: 220 },
  responsive: { w: undefined, h: undefined },
}

/**
 * Face-down card with neon border and mystery pattern.
 * Used in the card selection grid.
 */
export function CardBack({ onClick, size = 'md', className = '' }: CardBackProps) {
  const { w, h } = sizeMap[size]

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${className}`}
      style={w !== undefined && h !== undefined ? { width: w, height: h } : undefined}
    >
      {/* Background */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, #1C0E2E, #0A0414)',
          border: '2px solid rgba(168, 85, 247, 0.4)',
          boxShadow: '0 0 16px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1)',
        }}
      />

      {/* Pattern — question marks */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-4xl font-black opacity-30"
          style={{ color: '#a855f7', textShadow: '0 0 12px rgba(168,85,247,0.5)' }}
        >
          ?
        </span>
      </div>

      {/* Corner accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-purple-400/40 rounded-tl" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-purple-400/40 rounded-tr" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-purple-400/40 rounded-bl" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-purple-400/40 rounded-br" />
    </motion.div>
  )
}
