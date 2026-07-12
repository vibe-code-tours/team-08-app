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
 * Premium face-down card with animated shimmer, diamond pattern, and neon glow.
 */
export function CardBack({ onClick, size = 'md', className = '' }: CardBackProps) {
  const { w, h } = sizeMap[size]

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.08, y: -6 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${className}`}
      style={w !== undefined && h !== undefined ? { width: w, height: h } : undefined}
    >
      {/* Base gradient */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, #1a0a2e 0%, #0d0521 40%, #1a0a2e 100%)',
        }}
      />

      {/* Animated shimmer overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-20"
        style={{
          background: 'linear-gradient(110deg, transparent 30%, rgba(168,85,247,0.4) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      />

      {/* Diamond pattern */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Central diamond */}
          <div
            className="w-10 h-10 rotate-45 rounded-sm"
            style={{
              border: '1.5px solid rgba(168,85,247,0.3)',
              boxShadow: '0 0 20px rgba(168,85,247,0.2), inset 0 0 12px rgba(168,85,247,0.1)',
            }}
          />
          {/* Inner diamond */}
          <div
            className="absolute inset-1.5 rotate-45 rounded-sm"
            style={{
              border: '1px solid rgba(168,85,247,0.2)',
            }}
          />
          {/* Center dot */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)',
              boxShadow: '0 0 8px rgba(168,85,247,0.4)',
            }}
          />
        </div>
      </div>

      {/* Neon border */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          border: '1.5px solid rgba(168,85,247,0.25)',
          boxShadow: '0 0 12px rgba(168,85,247,0.15), inset 0 0 16px rgba(168,85,247,0.08)',
        }}
      />

      {/* Corner accents — premium L-shapes */}
      <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-[1.5px] border-l-[1.5px] border-purple-400/30 rounded-tl-sm" />
      <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-[1.5px] border-r-[1.5px] border-purple-400/30 rounded-tr-sm" />
      <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-[1.5px] border-l-[1.5px] border-purple-400/30 rounded-bl-sm" />
      <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-[1.5px] border-r-[1.5px] border-purple-400/30 rounded-br-sm" />

      {/* Top/bottom decorative lines */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
    </motion.div>
  )
}
