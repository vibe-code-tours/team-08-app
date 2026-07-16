import { motion } from 'motion/react'

type NeonButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  color?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-8 py-3 text-base',
  lg: 'px-10 py-4 text-xl',
}

/**
 * Reusable neon-glow button with gradient background and spring press animation.
 */
export function NeonButton({
  children,
  onClick,
  color = '#8B2FE2',
  size = 'md',
  disabled = false,
  className = '',
}: NeonButtonProps) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.95 }}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full font-bold text-white transition-all
        ${sizeClasses[size]}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        boxShadow: disabled
          ? 'none'
          : `0 0 20px ${color}80, 0 0 40px ${color}30`,
      }}
    >
      {children}
    </motion.button>
  )
}
