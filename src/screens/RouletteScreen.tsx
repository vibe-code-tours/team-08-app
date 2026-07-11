import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { PlayerDot } from '../components/PlayerDot.tsx'
import type { PlayerTouch } from '../types/index.ts'

/**
 * Roulette screen — spins through player dots and selects one.
 *
 * Animation: highlight cycles through dots in a circle, then slows down
 * to land on the pre-selected winner.
 */
export default function RouletteScreen() {
  const { players } = useGame()
  const dispatch = useGameDispatch()
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<PlayerTouch | null>(null)
  const [showResult, setShowResult] = useState(false)

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

    // Pre-select winner and animation params (impure — OK inside effect)
    const selectedWinner = players[Math.floor(Math.random() * players.length)]
    const targetIndex = players.indexOf(selectedWinner)
    const totalSteps = 20 + Math.floor(Math.random() * 10)
    const slowDownStart = totalSteps - 8

    // Defer state update to avoid cascading render
    const spinTimer = setTimeout(() => setSpinning(true), 0)

    let step = 0
    let delay = 60
    let timerId = 0

    const tick = () => {
      const currentIndex = step % players.length
      setHighlightIndex(currentIndex)
      step++

      if (step >= totalSteps) {
        setHighlightIndex(targetIndex)
        setSpinning(false)
        setWinner(selectedWinner)
        setTimeout(() => {
          setShowResult(true)
          dispatch({ type: 'SELECT_PLAYER', player: selectedWinner })
        }, 1200)
        return
      }

      if (step >= slowDownStart) {
        delay += 80 + (step - slowDownStart) * 40
      }

      timerId = window.setTimeout(tick, delay)
    }

    timerId = window.setTimeout(tick, 500)

    return () => {
      clearTimeout(spinTimer)
      if (timerId) clearTimeout(timerId)
    }
  }, [players, dispatch])

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
          {spinning ? 'Spinning...' : winner ? 'Selected!' : 'Ready...'}
        </h1>
      </div>

      {/* Player dots in circle */}
      {players.map((player, i) => (
        <PlayerDot
          key={player.identifier}
          color={player.color}
          x={positions[i].x}
          y={positions[i].y}
          label={player.label}
          active={highlightIndex === i || !spinning}
          size={highlightIndex === i ? 64 : 48}
        />
      ))}

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
