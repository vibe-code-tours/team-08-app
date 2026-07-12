import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { NeonButton } from '../components/NeonButton.tsx'
import { GlassPanel } from '../components/GlassPanel.tsx'
import type { CardType } from '../types/index.ts'

const TRUTH_COLOR = '#3b82f6' // blue
const DARE_COLOR = '#ec4899' // pink
const RANDOM_COLOR = '#eab308' // gold

/**
 * Truth / Dare choice screen.
 * Shows the selected player's name and three options: Truth, Dare, Random.
 * Random triggers a coin-flip animation before auto-selecting.
 */
export default function TruthDareChoiceScreen() {
  const { selectedPlayer } = useGame()
  const dispatch = useGameDispatch()
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipResult, setFlipResult] = useState<CardType | null>(null)
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current)
    }
  }, [])

  const handleChoice = useCallback(
    (type: CardType) => {
      dispatch({ type: 'CHOOSE_TRUTH_OR_DARE', payload: type })
    },
    [dispatch],
  )

  const handleRandom = useCallback(() => {
    if (isFlipping) return
    setIsFlipping(true)
    setFlipResult(null)

    // Randomly pick truth or dare
    const result: CardType = Math.random() < 0.5 ? 'truth' : 'dare'
    setFlipResult(result)

    // After flip animation completes (transition duration: 1.2s, see overlay below), dispatch the choice
    flipTimeoutRef.current = setTimeout(() => {
      setIsFlipping(false)
      dispatch({ type: 'CHOOSE_TRUTH_OR_DARE', payload: result })
    }, 1200)
  }, [isFlipping, dispatch])

  if (!selectedPlayer) return null

  return (
    <div className="relative w-full h-dvh overflow-hidden select-none flex flex-col items-center justify-center">
      {/* Background with player-colored glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${selectedPlayer.color}40 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <GlassPanel className="relative z-10 mx-4 p-8 w-full max-w-sm">
        {/* Player name */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="text-center mb-8"
        >
          <p className="text-white/50 text-sm mb-2">သင့်အလှည့်ပါ</p>
          <h1
            className="text-3xl font-black"
            style={{
              color: selectedPlayer.color,
              textShadow: `0 0 20px ${selectedPlayer.color}80`,
            }}
          >
            {selectedPlayer.label}
          </h1>
        </motion.div>

        {/* Choice buttons */}
        <div className="flex flex-col gap-4">
          {/* Truth button */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
          >
            <NeonButton
              color={TRUTH_COLOR}
              size="lg"
              className="w-full"
              onClick={() => handleChoice('truth')}
              disabled={isFlipping}
            >
              💙 Truth
            </NeonButton>
          </motion.div>

          {/* Dare button */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.4 }}
          >
            <NeonButton
              color={DARE_COLOR}
              size="lg"
              className="w-full"
              onClick={() => handleChoice('dare')}
              disabled={isFlipping}
            >
              💗 Dare
            </NeonButton>
          </motion.div>

          {/* Random button with coin-flip */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 }}
          >
            <NeonButton
              color={RANDOM_COLOR}
              size="lg"
              className="w-full"
              onClick={handleRandom}
              disabled={isFlipping}
            >
              {isFlipping ? '🪙' : '🎲'} {isFlipping ? 'Flipping...' : 'Random'}
            </NeonButton>
          </motion.div>
        </div>

        {/* Coin flip animation overlay */}
        <AnimatePresence>
          {isFlipping && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 1],
                opacity: [0, 1, 1],
                rotateY: [0, 1800],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${RANDOM_COLOR}, ${RANDOM_COLOR}cc)`,
                  boxShadow: `0 0 40px ${RANDOM_COLOR}80, 0 0 80px ${RANDOM_COLOR}40`,
                }}
              >
                {flipResult === 'truth' ? '💙' : '💗'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassPanel>
    </div>
  )
}
