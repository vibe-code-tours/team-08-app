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
  lg: 'px-10 py-4 text-lg',
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
      whileHover={disabled ? undefined : { scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative rounded-2xl font-bold text-white transition-all overflow-hidden
        ${sizeClasses[size]}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
        boxShadow: disabled
          ? 'none'
          : `0 4px 20px ${color}50, 0 0 40px ${color}20, inset 0 1px 0 rgba(255,255,255,0.15)`,
      }}
    >
      {/* Inner shine */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
        }}
      />
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
