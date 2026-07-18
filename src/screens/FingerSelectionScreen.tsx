import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { useMultiTouch } from '../hooks/useMultiTouch.ts'
import { useTouchCapability } from '../hooks/useTouchCapability.ts'
import { PlayerDot } from '../components/PlayerDot.tsx'
import { PLAYER_COLORS } from '../types/index.ts'
import type { PlayerTouch } from '../types/index.ts'

/** How long to wait (ms) after fingers stabilize before auto-starting */
const STABLE_DELAY = 2000
/** How long (ms) to flash the player number when a finger is placed */
const FLASH_DURATION = 1500

/**
 * Screen where all players place their fingers on the screen.
 * Touch devices: auto-starts roulette after countdown.
 * Desktop: click anywhere to add players, then click "Start".
 */
export default function FingerSelectionScreen() {
  const dispatch = useGameDispatch()
  const { settings } = useGame()
  const containerRef = useRef<HTMLDivElement>(null)
  const { isTouchCapable } = useTouchCapability()

  // Cap at 2 players for couple pack, otherwise default to 10
  const maxPlayers = settings.pack === 'couple' ? 2 : 10
  const { players: touchPlayers } = useMultiTouch(containerRef, maxPlayers)

  const [counting, setCounting] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [flashingIds, setFlashingIds] = useState<Set<number>>(new Set())
  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tickIdRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const rafRef = useRef(0)
  const playersRef = useRef(touchPlayers)
  const prevCountRef = useRef(0)

  // Desktop click-to-add state
  const isDesktop = !isTouchCapable
  const [clickPlayers, setClickPlayers] = useState<PlayerTouch[]>([])
  const clickIdCounter = useRef(0)
  const [showDesktopTip, setShowDesktopTip] = useState(!isTouchCapable)

  // Use touch players on mobile, click players on desktop
  const players = isDesktop ? clickPlayers : touchPlayers

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

  // Auto-start countdown when finger count changes (touch only)
  useEffect(() => {
    if (isDesktop) return

    if (countdownRef.current) {
      clearTimeout(countdownRef.current)
      countdownRef.current = null
    }
    if (tickIdRef.current) {
      clearInterval(tickIdRef.current)
      tickIdRef.current = null
    }

    if (players.length >= 2) {
      rafRef.current = requestAnimationFrame(() => {
        setCounting(true)
        setCountdown(Math.ceil(STABLE_DELAY / 1000))
      })
      // Tick countdown every second
      tickIdRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (tickIdRef.current) {
              clearInterval(tickIdRef.current)
              tickIdRef.current = null
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
      countdownRef.current = setTimeout(() => {
        if (tickIdRef.current) {
          clearInterval(tickIdRef.current)
          tickIdRef.current = null
        }
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
      if (tickIdRef.current) {
        clearInterval(tickIdRef.current)
        tickIdRef.current = null
      }
    }
  }, [players.length, dispatch, isDesktop])

  // Desktop: handle click to add player
  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isDesktop) return

      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      clickIdCounter.current++
      const newId = clickIdCounter.current

      setClickPlayers((prev) => {
        if (prev.length >= maxPlayers) return prev
        const updated = [...prev, {
          identifier: newId,
          color: PLAYER_COLORS[prev.length % PLAYER_COLORS.length],
          x,
          y,
          label: '',
        }]
        // Renumber all players
        return updated.map((p, i) => ({
          ...p,
          label: `Player ${i + 1}`,
          color: PLAYER_COLORS[i % PLAYER_COLORS.length],
        }))
      })
    },
    [isDesktop, maxPlayers],
  )

  // Desktop: handle right-click to remove last player
  const handleContainerContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (!isDesktop) return
      e.preventDefault()
      setClickPlayers((prev) => {
        if (prev.length === 0) return prev
        const updated = prev.slice(0, -1)
        return updated.map((p, i) => ({
          ...p,
          label: `Player ${i + 1}`,
          color: PLAYER_COLORS[i % PLAYER_COLORS.length],
        }))
      })
    },
    [isDesktop],
  )

  // Desktop: handle start game
  const handleStart = useCallback(() => {
    if (players.length < 2) return
    dispatch({ type: 'SET_FINGERS', players: playersRef.current })
  }, [dispatch, players.length])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-dvh overflow-hidden select-none"
      style={{ touchAction: 'none' }}
      onClick={isDesktop ? handleContainerClick : undefined}
      onContextMenu={isDesktop ? handleContainerContextMenu : undefined}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />

      {/* Instruction text */}
      <div className="absolute left-0 right-0 top-24 px-6 flex flex-col items-center gap-2 z-10 pointer-events-none">
        <h1 className="text-2xl font-bold text-white/90"
          style={{ textShadow: '0 0 20px rgba(168,85,247,0.5)' }}
        >
          {isDesktop ? 'ကစားသမားတွေထပ်ထည့်ဖို့ ကြိုက်ရနေရာမှာ click လုပ်လိုက်ပါ' : 'ဖုန်းစခရင်ပေါ်ကို လက်ချောင်းလေးတွေတင်လိုက်ကြပါ။'}
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
            ကစားသမား {players.length} ယောက်
          </motion.div>
        )}
        <p className="text-sm text-white/50">
          {isDesktop
            ? players.length < 2
              ? 'ကစားသမား ၂ ယောက်ထက်မနည်း ထည့်ပါ'
              : '"Start" ကိုနှိပ်ပြီး စတင်ပါ'
            : players.length === 0
              ? 'ကစားသမားတွေကို စောင့်နေပါတယ်...'
              : counting
                ? 'ခနစောင့်ပါ…'
                : 'ထပ်ထားပါ!'}
        </p>
        {isDesktop && (
          <p className="text-xs text-white/40">
            ပြန်ဖြုတ်ဖို့အတွက် right click ကိုသုံးပါ
          </p>
        )}
      </div>

      {/* Desktop: Start button */}
      {isDesktop && players.length >= 2 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-20 inset-x-0 flex justify-center z-20"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={(e) => {
              e.stopPropagation()
              handleStart()
            }}
            className="px-10 py-4 rounded-full text-xl font-bold text-white
              bg-gradient-to-r from-purple-600 to-pink-600
              shadow-[0_0_30px_rgba(168,85,247,0.5)]
              active:scale-95 transition-transform"
          >
            ▶ စတင်
          </motion.button>
        </motion.div>
      )}

      {/* Countdown ring — pulsing circle in the center (touch only) */}
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

      {/* Desktop floating tip — dismissable suggestion to play on mobile */}
      <AnimatePresence>
        {showDesktopTip && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[85%] max-w-xs p-3 rounded-xl"
            style={{
              background: 'linear-gradient(165deg, #1a0a2e 0%, #0d0521 100%)',
              border: '1.5px solid rgba(168,85,247,0.4)',
              boxShadow: '0 0 30px rgba(168,85,247,0.25), 0 10px 40px rgba(0,0,0,0.4)',
            }}
          >
            <div className="flex items-start gap-2">
              <span className="text-base shrink-0 mt-0.5">💡</span>
              <p className="text-white/70 text-[11px] leading-relaxed flex-1">
                ပိုမိုကောင်းမွန်သော အတွေ့အကြုံအတွက် ဤဂိမ်းကို Mobile Phone ဖြင့် ဆော့ကစားရန် အကြံပြုပါသည်။ Desktop တွင် Multi-touch အသုံးပြု၍ မရသောကြောင့် ဤအဆင့်ကို Click ဖြင့် Player များထည့်သွင်းနိုင်သည့် ပုံစံသို့ ပြောင်းလဲထားပါသည်။
              </p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowDesktopTip(false) }}
                className="shrink-0 text-white/40 hover:text-white/70 transition-colors text-sm leading-none"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
