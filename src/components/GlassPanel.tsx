import { motion } from 'motion/react'

type GlassPanelProps = {
  children: React.ReactNode
  className?: string
}

/**
 * Glassmorphism container with backdrop blur and soft border.
 * Used for settings panels, modals, and card containers.
 */
export function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`rounded-2xl border border-white/10
        bg-white/5 backdrop-blur-md
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        ${className}`}
    >
      {children}
    </motion.div>
  )
}
