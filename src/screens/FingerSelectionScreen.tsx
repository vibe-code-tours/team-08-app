import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameDispatch } from '../state/GameContext.tsx'
import { useMultiTouch } from '../hooks/useMultiTouch.ts'
import { PlayerDot } from '../components/PlayerDot.tsx'

/** How long to wait (ms) after fingers stabilize before auto-starting */
const STABLE_DELAY = 2000
/** How long (ms) to flash the player number when a finger is placed */
const FLASH_DURATION = 1500

/**
 * Screen where all players place their fingers on the screen.
 * After 2+ fingers are placed and held steady for a short countdown,
 * the roulette starts automatically — no button needed.
 */
export default function FingerSelectionScreen() {
  const dispatch = useGameDispatch()
  const containerRef = useRef<HTMLDivElement>(null)
  const { players } = useMultiTouch(containerRef, 10)

  const [counting, setCounting] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [flashingIds, setFlashingIds] = useState<Set<number>>(new Set())
  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef(0)
  const playersRef = useRef(players)
  const prevCountRef = useRef(0)

  // Keep playersRef in sync (read by setTimeout callback)
  useEffect(() => {
    playersRef.current = players
  })

  // Flash new player numbers
  useEffect(() => {
    if (players.length > prevCountRef.current) {
      // New player added — flash their number
      const newPlayer = players[players.length - 1]
      setFlashingIds((prev) => new Set(prev).add(newPlayer.identifier))
      setTimeout(() => {
        setFlashingIds((prev) => {
          const next = new Set(prev)
          next.delete(newPlayer.identifier)
          return next
        })
      }, FLASH_DURATION)
    }
    prevCountRef.current = players.length
  }, [players])

  // Auto-start countdown when finger count changes
  useEffect(() => {
    if (countdownRef.current) {
      clearTimeout(countdownRef.current)
      countdownRef.current = null
    }

    if (players.length >= 2) {
      rafRef.current = requestAnimationFrame(() => {
        setCounting(true)
        setCountdown(Math.ceil(STABLE_DELAY / 1000))
      })
      // Tick countdown every second
      const tickId = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(tickId)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      countdownRef.current = setTimeout(() => {
        clearInterval(tickId)
        setCounting(false)
        dispatch({ type: 'SET_FINGERS', players: playersRef.current })
      }, STABLE_DELAY)
    } else {
      rafRef.current = requestAnimationFrame(() => {
        setCounting(false)
        setCountdown(0)
      })
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      if (countdownRef.current) clearTimeout(countdownRef.current)
    }
  }, [players.length, dispatch])

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
        {/* Player count badge */}
        {players.length > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-4 py-1.5 rounded-full text-sm font-bold text-white/90
              bg-white/10 border border-white/20"
            style={{ boxShadow: '0 0 12px rgba(168,85,247,0.3)' }}
          >
            {players.length} ကစားသမား
          </motion.div>
        )}
        <p className="text-sm text-white/50">
          {players.length === 0
            ? 'Waiting for players...'
            : counting
              ? 'Hold still…'
              : 'ထပ်ထားပါ!'}
        </p>
      </div>

      {/* Countdown ring — pulsing circle in the center */}
      <AnimatePresence>
        {counting && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            <svg width="120" height="120" className="drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(168,85,247,0.15)" strokeWidth="4" />
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#countdown-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 52 }}
                transition={{ duration: STABLE_DELAY / 1000, ease: 'linear' }}
                transform="rotate(-90 60 60)"
              />
              <defs>
                <linearGradient id="countdown-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <motion.p
              className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ textShadow: '0 0 16px rgba(168,85,247,0.8)' }}
            >
              {countdown}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player dots */}
      <AnimatePresence>
        {players.map((player) => (
          <div key={player.identifier}>
            <PlayerDot
              color={player.color}
              x={player.x}
              y={player.y}
              label={player.label}
            />
            {/* Flash number overlay when finger is first placed */}
            <AnimatePresence>
              {flashingIds.has(player.identifier) && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.8, opacity: 1 }}
                  exit={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="absolute z-20 pointer-events-none"
                  style={{
                    left: player.x - 30,
                    top: player.y - 30,
                    width: 60,
                    height: 60,
                  }}
                >
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-2xl font-black"
                    style={{
                      color: player.color,
                      textShadow: `0 0 20px ${player.color}, 0 0 40px ${player.color}80`,
                    }}
                  >
                    {player.label.split(' ')[1]}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
