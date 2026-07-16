import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { useSound } from '../hooks/useSound.ts'
import { CardBack } from '../components/CardBack.tsx'
import { DifficultyBadge } from '../components/DifficultyBadge.tsx'
import { PackBadge } from '../components/PackBadge.tsx'
import { NeonButton } from '../components/NeonButton.tsx'
import { randomCards } from '../data/cards.ts'
import type { Card } from '../types/index.ts'

const TRUTH_COLOR = '#3b82f6'
const DARE_COLOR = '#ec4899'
const ROUND_SECONDS = 30
const CARD_RADIUS = 52

/**
 * Card selection grid with 3D flip reveal.
 * Phase 1: Shows 10 face-down cards in a 5×2 grid.
 * Phase 2: After a card is picked, shows only the chosen card centered with full details.
 */
export default function CardRevealScreen() {
  const { chosenType, settings, selectedCard } = useGame()
  const dispatch = useGameDispatch()
  const { play } = useSound()
  const [flippedId, setFlippedId] = useState<string | null>(null)
  const [isRevealing, setIsRevealing] = useState(false)
  const [seconds, setSeconds] = useState(ROUND_SECONDS)
  const revealedCard = isRevealing ? selectedCard : null
  const pickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (selectedCard && !isRevealing) {
      const timer = setTimeout(() => setIsRevealing(true), 850)
      return () => clearTimeout(timer)
    }
  }, [selectedCard, isRevealing])

  useEffect(() => {
    return () => {
      if (pickTimeoutRef.current) clearTimeout(pickTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!revealedCard || !settings.timerEnabled) return

    if (seconds <= 0) {
      play('time-up')
      dispatch({ type: 'GO_TO_VOTING' })
      return
    }

    if (seconds <= 5) {
      play('timer-tick')
    }

    const timerId = window.setTimeout(() => {
      setSeconds((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => clearTimeout(timerId)
  }, [dispatch, revealedCard, seconds, settings.timerEnabled, play])

  const cards = useMemo(
    () =>
      randomCards(10, {
        pack: settings.pack,
        difficulty: settings.difficulty,
        type: chosenType ?? undefined,
      }),
    [settings.pack, settings.difficulty, chosenType],
  )

  const handleCardClick = useCallback(
    (card: Card) => {
      if (flippedId) return
      setFlippedId(card.id)
      play('card-flip')
      setSeconds(ROUND_SECONDS)
      pickTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'PICK_CARD', payload: card })
      }, 800)
    },
    [flippedId, dispatch, play],
  )

  const handleStartVoting = useCallback(() => {
    play('tap')
    dispatch({ type: 'GO_TO_VOTING' })
  }, [dispatch, play])

  const accentColor = chosenType === 'truth' ? TRUTH_COLOR : DARE_COLOR
  const timerProgress = settings.timerEnabled ? (ROUND_SECONDS - seconds) / ROUND_SECONDS : 0

  return (
    <div className="relative w-full h-dvh overflow-hidden select-none flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${accentColor}30 0%, transparent 60%)`,
        }}
      />

      <AnimatePresence mode="wait">
        {!revealedCard ? (
          /* ─── Phase 1: Card Grid ────────────────────────── */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex flex-col items-center w-full"
          >
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-center mb-6 px-4"
            >
              <h1
                className="text-2xl font-black mb-2"
                style={{
                  color: accentColor,
                  textShadow: `0 0 24px ${accentColor}60`,
                }}
              >
                {chosenType === 'truth' ? '💡 Truth' : '🔥 Dare'}
              </h1>
              <p className="text-white/50 text-sm">ကဒ်တစ်ကဒ်ကို ရွေးပါ</p>
            </motion.div>

            {/* Card Grid — 5 columns × 2 rows */}
            <div className="grid grid-cols-5 gap-3 px-5 w-full max-w-md">
              {cards.map((card, index) => (
                <FlipCard
                  key={card.id}
                  card={card}
                  isFlipped={flippedId === card.id}
                  isDisabled={!!flippedId}
                  accentColor={accentColor}
                  index={index}
                  onClick={() => handleCardClick(card)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          /* ─── Phase 2: Single Revealed Card ──────────────── */
          <motion.div
            key="revealed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative z-10 flex flex-col items-center px-6 w-full max-w-sm"
          >
            {/* Timer circle — above the card */}
            {settings.timerEnabled && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative mb-6"
              >
                <svg width="88" height="88" className="drop-shadow-[0_0_16px_rgba(168,85,247,0.5)]">
                  {/* Background circle */}
                  <circle
                    cx="44"
                    cy="44"
                    r={CARD_RADIUS}
                    fill="none"
                    stroke="rgba(168,85,247,0.15)"
                    strokeWidth="4"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="44"
                    cy="44"
                    r={CARD_RADIUS}
                    fill="none"
                    stroke="url(#timer-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * CARD_RADIUS}
                    strokeDashoffset={2 * Math.PI * CARD_RADIUS * (1 - timerProgress)}
                    transform="rotate(-90 44 44)"
                  />
                  <defs>
                    <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white/90">{seconds}</span>
                </div>
              </motion.div>
            )}

            {/* Card container */}
            <div className="relative w-full">
              {/* Glow behind card */}
              <div
                className="absolute -inset-8 rounded-full blur-3xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
                  opacity: 0.5,
                }}
              />

              {/* Revealed card */}
              <motion.div
                initial={{ rotateY: -10 }}
                animate={{ rotateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                className="relative w-full rounded-3xl overflow-hidden"
                style={{
                  aspectRatio: '3/4',
                  background: 'linear-gradient(165deg, #1a0a2e 0%, #0d0521 50%, #1a0828 100%)',
                  border: `2px solid ${accentColor}50`,
                  boxShadow: `0 0 40px ${accentColor}30, 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
              >
                {/* Inner gradient overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(180deg, ${accentColor}08 0%, transparent 40%, ${accentColor}05 100%)`,
                  }}
                />

                {/* Content */}
                <div className="flex flex-col items-center justify-center h-full p-8 text-center relative z-10">
                  {/* Type icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.3, stiffness: 200 }}
                    className="text-5xl mb-4"
                    style={{
                      filter: `drop-shadow(0 0 16px ${accentColor})`,
                    }}
                  >
                    {chosenType === 'truth' ? '💡' : '🔥'}
                  </motion.div>

                  {/* Card text */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="text-white text-base sm:text-lg font-medium leading-relaxed line-clamp-6"
                  >
                    {revealedCard.text}
                  </motion.p>

                  {/* Badges */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-2 justify-center mt-6"
                  >
                    <DifficultyBadge difficulty={revealedCard.difficulty} />
                    <PackBadge pack={revealedCard.pack} />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Action button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
              className="mt-8 w-full"
            >
              {settings.timerEnabled ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={handleStartVoting}
                  className="w-full py-4 rounded-2xl text-lg font-bold text-white
                    bg-gradient-to-r from-purple-600 to-pink-600
                    shadow-[0_0_30px_rgba(168,85,247,0.4),0_8px_32px_rgba(168,85,247,0.3)]
                    transition-all"
                >
                  ✅ ပြီးပြီ
                </motion.button>
              ) : (
                <NeonButton
                  color={accentColor}
                  size="lg"
                  className="w-full"
                  onClick={handleStartVoting}
                >
                  ▶ နောက်တစ်ဆင့်
                </NeonButton>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Flip Card Component ────────────────────────────────

type FlipCardProps = {
  card: Card
  isFlipped: boolean
  isDisabled: boolean
  accentColor: string
  index: number
  onClick: () => void
}

function FlipCard({ card, isFlipped, isDisabled, accentColor, index, onClick }: FlipCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 20,
        delay: 0.1 + index * 0.05,
      }}
      className="relative w-full"
      style={{ perspective: '800px' }}
    >
      <motion.div
        animate={{
          rotateY: isFlipped ? 180 : 0,
          scale: isFlipped ? 1.05 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full"
        style={{
          transformStyle: 'preserve-3d',
          aspectRatio: '2.5/3.5',
        }}
      >
        {/* Back of card */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <CardBack
            onClick={isDisabled ? undefined : onClick}
            size="responsive"
            className="w-full h-full"
          />
        </div>

        {/* Front of card */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(145deg, #1a0a2e 0%, #0d0521 100%)',
            border: `1.5px solid ${accentColor}50`,
            boxShadow: `0 0 16px ${accentColor}25`,
          }}
        >
          <div className="flex flex-col items-center justify-center h-full p-2 text-center">
            <p className="text-white/90 text-[8px] sm:text-[9px] font-medium leading-tight line-clamp-4">
              {card.text}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
