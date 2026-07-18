import { motion } from 'motion/react'

type PlayerDotProps = {
  color: string
  x: number
  y: number
  label: string
  active?: boolean
  size?: number
}

/**
 * Colored player dot with neon glow.
 * Used in FingerSelectionScreen and RouletteScreen.
 */
export function PlayerDot({ color, x, y, label, active = true, size = 56 }: PlayerDotProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: active ? 1 : 0.3,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="absolute flex flex-col items-center gap-1"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
      }}
    >
      {/* Dot circle */}
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: active
            ? `0 0 16px ${color}, 0 0 32px ${color}80`
            : `0 0 8px ${color}40`,
          border: `2px solid ${color}`,
        }}
      />
      {/* Label */}
      <span
        className="text-xs font-medium whitespace-nowrap"
        style={{ color, textShadow: `0 0 8px ${color}60` }}
      >
        {label}
      </span>
    </motion.div>
  )
}