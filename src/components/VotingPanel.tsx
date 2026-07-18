import { motion } from 'motion/react'
import { useGameDispatch } from '../state/GameContext.tsx'
import { GlassPanel } from './GlassPanel.tsx'
import type { GameState } from '../types/index.ts'

type VoteResult = NonNullable<GameState['voteResult']>

const voteOptions: Array<{
  result: VoteResult
  label: string
  sublabel: string
  icon: string
  color: string
}> = [
  { result: 'fail', label: 'မအောင်မြင်', sublabel: 'Fail', icon: '❌', color: '#E9243D' },
  { result: 'pass', label: 'အောင်မြင်', sublabel: 'Pass', icon: '✅', color: '#10b981' },
  { result: 'excellent', label: 'အကောင်းဆုံး', sublabel: 'Excellent', icon: '⭐', color: '#facc15' },
]

type VotingPanelProps = {
  className?: string
}

export function VotingPanel({ className = '' }: VotingPanelProps) {
  const dispatch = useGameDispatch()

  return (
    <GlassPanel className={`w-full max-w-sm p-5 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-3"
      >
        {voteOptions.map((option, index) => (
          <motion.button
            key={option.result}
            initial={{ x: index === 0 ? -20 : index === 2 ? 20 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 + index * 0.1 }}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => dispatch({ type: 'VOTE', payload: option.result })}
            className="relative flex items-center gap-4 w-full p-4 rounded-2xl text-left transition-all overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${option.color}20 0%, ${option.color}10 100%)`,
              border: `1.5px solid ${option.color}40`,
              boxShadow: `0 4px 20px ${option.color}20, inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
          >
            {/* Icon */}
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl"
              style={{
                background: `linear-gradient(135deg, ${option.color}30 0%, ${option.color}15 100%)`,
                boxShadow: `0 0 16px ${option.color}30`,
              }}
            >
              {option.icon}
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="text-white font-bold text-base">{option.label}</p>
              <p className="text-white/50 text-xs">{option.sublabel}</p>
            </div>

            {/* Arrow */}
            <div className="text-white/30 text-lg">›</div>

            {/* Inner shine */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
              }}
            />
          </motion.button>
        ))}
      </motion.div>
    </GlassPanel>
  )
}
