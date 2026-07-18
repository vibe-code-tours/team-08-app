import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { useSound } from '../hooks/useSound.ts'
import { PlayerDot } from '../components/PlayerDot.tsx'
import { selectEligiblePlayers } from '../utils/selectPlayer.ts'
import type { PlayerTouch } from '../types/index.ts'

/**
 * Roulette screen — spins through player dots and selects one.
 *
 * Animation: highlight cycles through dots in a circle, then slows down
 * to land on the pre-selected winner.
 */
export default function RouletteScreen() {
  const { players, settings, selectedHistory } = useGame()
  const { play } = useSound()
  const dispatch = useGameDispatch()
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<PlayerTouch | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [eliminated, setEliminated] = useState(false)

  // Calculate circular positions around center
  const getCirclePositions = useCallback((count: number) => {
    const radius = 120
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2 - 40

    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      }
    })
  }, [])

  const positions = getCirclePositions(players.length)

  // Run the roulette animation — all impure logic lives inside this effect
  useEffect(() => {
    if (players.length < 2) return

    // Pre-select winner — exclude previously selected players when noRepeat is on
    const pool = selectEligiblePlayers(players, selectedHistory, settings.noRepeat)
    const selectedWinner = pool[Math.floor(Math.random() * pool.length)]
    const targetIndex = players.indexOf(selectedWinner)
    const totalSteps = 25 + Math.floor(Math.random() * 8)
    const slowDownStart = totalSteps - 7

    // Defer state update to avoid cascading render
    const spinTimer = setTimeout(() => setSpinning(true), 0)

    let step = 0
    let delay = 55
    let timerId = 0

    const tick = () => {
      const currentIndex = step % players.length
      setHighlightIndex(currentIndex)
      play('roulette-tick')
      step++

      if (step >= totalSteps) {
        setHighlightIndex(targetIndex)
        setSpinning(false)
        setWinner(selectedWinner)
        return
      }

      if (step >= slowDownStart) {
        delay += 45 + (step - slowDownStart) * 30
      }

      timerId = window.setTimeout(tick, delay)
    }

    timerId = window.setTimeout(tick, 450)

    return () => {
      clearTimeout(spinTimer)
      if (timerId) clearTimeout(timerId)
    }
  }, [players, dispatch, settings.noRepeat, selectedHistory, play])

  // Post-spin sequence: eliminate non-winners → show result → dispatch
  useEffect(() => {
    if (!winner || spinning) return

    const eliminateTimer = setTimeout(() => setEliminated(true), 300)
    const resultTimer = setTimeout(() => {
      setShowResult(true)
      play('winner')
      dispatch({ type: 'SELECT_PLAYER', player: winner })
    }, 2000)

    return () => {
      clearTimeout(eliminateTimer)
      clearTimeout(resultTimer)
    }
  }, [winner, spinning, dispatch])

  return (
    <div
      className="relative w-full h-dvh overflow-hidden select-none"
      style={{ touchAction: 'none' }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />

      {/* Title */}
      <div className="absolute inset-x-0 top-12 flex justify-center z-10 pointer-events-none">
        <h1
          className="text-2xl font-bold text-white/90"
          style={{ textShadow: '0 0 20px rgba(168,85,247,0.5)' }}
        >
          {spinning ? 'ရွေးနေပါပြီ..' : eliminated && winner ? 'The chosen one!' : winner ? 'Selected!' : 'Ready...'}
        </h1>
      </div>

      {/* Player dots in circle */}
      {players.map((player, i) => {
        const isWinner = winner?.identifier === player.identifier
        const isEliminated = eliminated && !isWinner
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2 - 40

        return (
          <motion.div
            key={player.identifier}
            initial={{ x: positions[i].x, y: positions[i].y, opacity: 1, scale: 1 }}
            animate={
              isEliminated
                ? { opacity: 0, scale: 0 }
                : isWinner && eliminated
                  ? { x: centerX, y: centerY, scale: 1.5 }
                  : { x: positions[i].x, y: positions[i].y, opacity: 1, scale: 1 }
            }
            transition={
              isEliminated
                ? { duration: 0.4, ease: 'easeIn' }
                : isWinner && eliminated
                  ? { type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }
                  : { type: 'spring', stiffness: 300, damping: 15 }
            }
            className="absolute"
            style={{ left: -28, top: -28 }}
          >
            <PlayerDot
              color={player.color}
              x={28}
              y={28}
              label={player.label}
              active={highlightIndex === i || !spinning}
              size={isWinner && eliminated ? 72 : highlightIndex === i ? 64 : 48}
            />
            {/* Crown above the winner */}
            {isWinner && eliminated && (
              <motion.div
                initial={{ y: 10, opacity: 0, scale: 0 }}
                animate={{ y: -40, opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.3 }}
                className="absolute text-3xl pointer-events-none"
                style={{ left: 28 - 16, top: 28 - 16 }}
              >
                👑
              </motion.div>
            )}
          </motion.div>
        )
      })}

      {/* Highlight ring on current spinning dot */}
      {spinning && highlightIndex >= 0 && (
        <motion.div
          key={`ring-${highlightIndex}`}
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: positions[highlightIndex].x - 32,
            top: positions[highlightIndex].y - 32,
            width: 64,
            height: 64,
            border: `2px solid ${players[highlightIndex].color}`,
            boxShadow: `0 0 24px ${players[highlightIndex].color}`,
          }}
        />
      )}

      {/* Winner reveal */}
      <AnimatePresence>
        {showResult && winner && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="absolute inset-x-0 bottom-24 flex flex-col items-center gap-4 z-10"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="text-center"
            >
              <p className="text-lg text-white/70 mb-2">The chosen one is...</p>
              <h2
                className="text-4xl font-black"
                style={{
                  color: winner.color,
                  textShadow: `0 0 30px ${winner.color}, 0 0 60px ${winner.color}80`,
                }}
              >
                {winner.label}
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
