import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { GlassPanel } from './GlassPanel.tsx'
import { NeonButton } from './NeonButton.tsx'

const resultCopy = {
  pass: {
    icon: '✅',
    title: 'Challenge cleared!',
    message: 'The group accepts this glorious performance.',
    points: '+10',
    color: '#10b981',
  },
  excellent: {
    icon: '⭐',
    title: 'Excellent!',
    message: 'Legendary delivery. Maximum sparkle awarded.',
    points: '+25',
    color: '#facc15',
  },
  fail: {
    icon: '😭',
    title: 'Beautiful disaster',
    message: 'A noble attempt. The floor has filed a complaint.',
    color: '#E9243D',
  },
} as const

export function ResultDisplay() {
  const { voteResult, selectedPlayer } = useGame()
  const dispatch = useGameDispatch()

  useEffect(() => {
    if (voteResult !== 'pass' && voteResult !== 'excellent') return

    confetti({
      particleCount: voteResult === 'excellent' ? 140 : 90,
      spread: voteResult === 'excellent' ? 90 : 70,
      origin: { y: 0.65 },
      colors:
        voteResult === 'excellent'
          ? ['#facc15', '#ec4899', '#a855f7', '#ffffff']
          : ['#10b981', '#06b6d4', '#a855f7', '#ffffff'],
    })
  }, [voteResult])

  if (!voteResult) return null

  const copy = resultCopy[voteResult]
  const isFail = voteResult === 'fail'

  return (
    <GlassPanel className="relative w-full max-w-md overflow-hidden p-8 text-center">
      <motion.div
        initial={isFail ? undefined : { scale: 0, y: 20, opacity: 0 }}
        animate={
          isFail
            ? { y: [0, -8, 0], rotate: [-4, 4, -4] }
            : { scale: 1, y: 0, opacity: 1 }
        }
        transition={
          isFail
            ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 220, damping: 12 }
        }
        className="mb-4 text-6xl"
      >
        {copy.icon}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-sm font-semibold uppercase text-white/50"
      >
        {selectedPlayer?.label ?? 'Player'}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="mt-2 text-4xl font-black text-white"
        style={{ textShadow: `0 0 24px ${copy.color}80` }}
      >
        {copy.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28 }}
        className="mx-auto mt-3 max-w-xs text-base text-white/70"
      >
        {copy.message}
      </motion.p>

      {!isFail && 'points' in copy && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0, y: 18 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.38 }}
          className="mx-auto mt-6 w-fit rounded-full border border-white/15 px-6 py-2 text-2xl font-black"
          style={{
            color: copy.color,
            boxShadow: `0 0 24px ${copy.color}40`,
            textShadow: `0 0 16px ${copy.color}90`,
          }}
        >
          {copy.points} pts
        </motion.div>
      )}

      <NeonButton
        color={isFail ? '#8B2FE2' : copy.color}
        size="md"
        className="mt-8"
        onClick={() => dispatch({ type: 'NEXT_ROUND' })}
      >
        Next Round
      </NeonButton>
    </GlassPanel>
  )
}
