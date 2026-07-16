import { motion } from 'motion/react'
import { useGameDispatch } from '../state/GameContext.tsx'
import { GlassPanel } from './GlassPanel.tsx'
import { NeonButton } from './NeonButton.tsx'
import type { GameState } from '../types/index.ts'

type VoteResult = NonNullable<GameState['voteResult']>

const voteOptions: Array<{
  result: VoteResult
  label: string
  color: string
}> = [
  { result: 'fail', label: '❌ Fail', color: '#E9243D' },
  { result: 'pass', label: '✅ Pass', color: '#10b981' },
  { result: 'excellent', label: '⭐ Excellent', color: '#facc15' },
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
        {voteOptions.map((option) => (
          <NeonButton
            key={option.result}
            color={option.color}
            size="lg"
            className="w-full"
            onClick={() => dispatch({ type: 'VOTE', payload: option.result })}
          >
            {option.label}
          </NeonButton>
        ))}
      </motion.div>
    </GlassPanel>
  )
}
