import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { DifficultyBadge } from '../components/DifficultyBadge.tsx'
import { PackBadge } from '../components/PackBadge.tsx'

/**
 * Card reveal screen — shows the selected card with flip animation.
 * Mock version for Phase 2 Task 2 integration.
 */
export default function CardRevealScreen() {
  const { selectedCard, chosenType, selectedPlayer } = useGame()
  const dispatch = useGameDispatch()
  const [flipped, setFlipped] = useState(false)

  // Auto-flip after mount
  useState(() => {
    const timer = setTimeout(() => setFlipped(true), 800)
    return () => clearTimeout(timer)
  })

  if (!selectedPlayer) return null

  const typeColor = chosenType === 'truth' ? '#40A1E9' : '#E02B96'
  const typeLabel = chosenType === 'truth' ? 'Truth' : 'Dare'
  const typeIcon = chosenType === 'truth' ? '💬' : '🔥'

  return (
    <div className="relative w-full h-dvh overflow-hidden flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />

      {/* Player indicator */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-white/50 mb-4 z-10"
      >
        {selectedPlayer.label}
      </motion.p>

      {/* Card */}
      <div className="relative z-10" style={{ perspective: 1000 }}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="w-64 h-96"
        >
          {/* Card Back */}
          <div
            className="absolute inset-0 rounded-2xl flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, #1C0E2E, #0A0414)',
              border: '2px solid rgba(168,85,247,0.4)',
              boxShadow: '0 0 24px rgba(168,85,247,0.3)',
            }}
          >
            <span className="text-6xl font-black text-purple-400/30">?</span>
          </div>

          {/* Card Front */}
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-6 text-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: `linear-gradient(135deg, ${typeColor}20, #0A0414)`,
              border: `2px solid ${typeColor}60`,
              boxShadow: `0 0 24px ${typeColor}40`,
            }}
          >
            <span className="text-4xl mb-3">{typeIcon}</span>
            <span
              className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color: typeColor }}
            >
              {typeLabel}
            </span>

            {selectedCard ? (
              <>
                <p className="text-white text-lg font-medium leading-relaxed mb-4">
                  {selectedCard.text}
                </p>
                <div className="flex gap-2">
                  <DifficultyBadge difficulty={selectedCard.difficulty} />
                  <PackBadge pack={selectedCard.pack} />
                </div>
              </>
            ) : (
              <p className="text-white/50">Card content loading...</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Next button — only shown after flip */}
      <AnimatePresence>
        {flipped && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => dispatch({ type: 'NEXT_ROUND' })}
            className="mt-8 px-8 py-3 rounded-full text-white font-bold
              bg-gradient-to-r from-purple-600 to-pink-600
              shadow-[0_0_20px_rgba(168,85,247,0.4)]
              active:scale-95 transition-transform z-10"
          >
            နောက်တစ်ဆင့်
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
