import { useCallback, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import { useGameDispatch } from '../state/GameContext.tsx'
import { useMultiTouch } from '../hooks/useMultiTouch.ts'
import { PlayerDot } from '../components/PlayerDot.tsx'

/**
 * Screen where all players place their fingers on the screen.
 * Once enough players are touching, a "Start Roulette" button appears.
 */
export default function FingerSelectionScreen() {
  const dispatch = useGameDispatch()
  const containerRef = useRef<HTMLDivElement>(null)
  const { players } = useMultiTouch(containerRef, 10)

  const canStart = players.length >= 2

  const handleStartRoulette = useCallback(() => {
    if (players.length >= 2) {
      dispatch({ type: 'SET_FINGERS', players })
    }
  }, [dispatch, players])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-dvh overflow-hidden select-none"
      style={{ touchAction: 'none' }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />

      {/* Instruction text */}
      <div className="absolute inset-x-0 top-12 flex flex-col items-center gap-2 z-10 pointer-events-none">
        <h1 className="text-2xl font-bold text-white/90"
          style={{ textShadow: '0 0 20px rgba(168,85,247,0.5)' }}
        >
          Place your fingers!
        </h1>
        <p className="text-sm text-white/50">
          {players.length === 0
            ? 'Waiting for players...'
            : `${players.length} player${players.length > 1 ? 's' : ''} ready`}
        </p>
      </div>

      {/* Player dots */}
      <AnimatePresence>
        {players.map((player) => (
          <PlayerDot
            key={player.identifier}
            color={player.color}
            x={player.x}
            y={player.y}
            label={player.label}
          />
        ))}
      </AnimatePresence>

      {/* Start button */}
      {canStart && (
        <div className="absolute inset-x-0 bottom-16 flex justify-center z-10">
          <button
            onClick={handleStartRoulette}
            className="px-8 py-4 rounded-full text-lg font-bold text-white
              bg-gradient-to-r from-purple-600 to-pink-600
              shadow-[0_0_24px_rgba(168,85,247,0.6)]
              active:scale-95 transition-transform"
          >
            Start Roulette
          </button>
        </div>
      )}
    </div>
  )
}
