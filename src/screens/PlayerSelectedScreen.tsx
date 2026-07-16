import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { useSound } from '../hooks/useSound.ts'
import { GlassPanel } from '../components/GlassPanel.tsx'
import type { CardType } from '../types/index.ts'

const TRUTH_COLOR = '#3b82f6'
const DARE_COLOR = '#ec4899'
const RANDOM_COLOR = '#eab308'

/**
 * Shows the selected player with crown, glow, and Truth/Dare/Random choice buttons.
 * Combines player reveal + choice into a single screen.
 */
export default function PlayerSelectedScreen() {
  const { selectedPlayer } = useGame()
  const dispatch = useGameDispatch()
  const { play } = useSound()
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipResult, setFlipResult] = useState<CardType | null>(null)
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showChoices, setShowChoices] = useState(false)

  useEffect(() => {
    play('fanfare')
    // Show choices after player name animation
    const timer = setTimeout(() => setShowChoices(true), 800)
    return () => clearTimeout(timer)
  }, [play])

  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current)
    }
  }, [])

  const handleChoice = useCallback(
    (type: CardType) => {
      play('tap')
      dispatch({ type: 'CHOOSE_TRUTH_OR_DARE', payload: type })
    },
    [dispatch, play],
  )

  const handleRandom = useCallback(() => {
    if (isFlipping) return
    setIsFlipping(true)
    setFlipResult(null)
    play('coin-flip')

    const result: CardType = Math.random() < 0.5 ? 'truth' : 'dare'
    setFlipResult(result)

    flipTimeoutRef.current = setTimeout(() => {
      setIsFlipping(false)
      dispatch({ type: 'CHOOSE_TRUTH_OR_DARE', payload: result })
    }, 1200)
  }, [isFlipping, dispatch, play])

  if (!selectedPlayer) return null

  return (
    <div className="relative w-full h-dvh overflow-hidden select-none flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${selectedPlayer.color}40 0%, transparent 60%)`,
        }}
      />

      {/* Crown */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
        className="text-5xl mb-2 z-10"
      >
        👑
      </motion.div>

      {/* Player dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="rounded-full z-10"
        style={{
          width: 96,
          height: 96,
          backgroundColor: selectedPlayer.color,
          boxShadow: `0 0 32px ${selectedPlayer.color}, 0 0 64px ${selectedPlayer.color}60`,
          border: `3px solid ${selectedPlayer.color}`,
        }}
      />

      {/* Name */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-black mt-4 z-10"
        style={{
          color: selectedPlayer.color,
          textShadow: `0 0 20px ${selectedPlayer.color}80`,
        }}
      >
        {selectedPlayer.label}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/50 mt-2 mb-2 z-10"
      >
        ကိုရွေးချယ်ခံရပါတယ်
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-white/40 text-sm mb-6 z-10"
      >
        Truth လား Dare လားရွေးပါ။
      </motion.p>

      {/* Choice buttons */}
      <AnimatePresence>
        {showChoices && (
          <GlassPanel className="relative z-10 mx-4 p-6 w-full max-w-sm">
            <div className="flex flex-col gap-4">
              {/* Truth button */}
              <motion.button
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleChoice('truth')}
                disabled={isFlipping}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-lg font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${TRUTH_COLOR}, ${TRUTH_COLOR}cc)`,
                  boxShadow: `0 0 24px ${TRUTH_COLOR}60, inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
              >
                <span className="text-2xl">💡</span>
                <span>Truth</span>
              </motion.button>

              {/* Dare button */}
              <motion.button
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleChoice('dare')}
                disabled={isFlipping}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-lg font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${DARE_COLOR}, ${DARE_COLOR}cc)`,
                  boxShadow: `0 0 24px ${DARE_COLOR}60, inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
              >
                <span className="text-2xl">🔥</span>
                <span>Dare</span>
              </motion.button>

              {/* Random button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleRandom}
                disabled={isFlipping}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-lg font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${RANDOM_COLOR}, ${RANDOM_COLOR}cc)`,
                  boxShadow: `0 0 24px ${RANDOM_COLOR}60, inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
              >
                <motion.span
                  className="text-2xl"
                  animate={isFlipping ? { rotate: 360 } : {}}
                  transition={{ duration: 0.5, repeat: isFlipping ? Infinity : 0 }}
                >
                  🎲
                </motion.span>
                <span>{isFlipping ? 'Flipping...' : 'Random'}</span>
              </motion.button>
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
                    {flipResult === 'truth' ? '💡' : '🔥'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>
        )}
      </AnimatePresence>
    </div>
  )
}
