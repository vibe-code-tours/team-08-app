import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { useSound } from '../hooks/useSound.ts'
import { CardBack } from '../components/CardBack.tsx'
import { DifficultyBadge } from '../components/DifficultyBadge.tsx'
import { PackBadge } from '../components/PackBadge.tsx'
import { NeonButton } from '../components/NeonButton.tsx'
import { TimerDisplay } from '../components/TimerDisplay.tsx'
import { randomCards } from '../data/cards.ts'
import type { Card } from '../types/index.ts'

const TRUTH_COLOR = '#3b82f6'
const DARE_COLOR = '#ec4899'
const ROUND_SECONDS = 30

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

  return (
    <div className="relative w-full h-dvh overflow-hidden select-none flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${accentColor}35 0%, transparent 60%)`,
        }}
      />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <AnimatePresence mode="wait">
        {!revealedCard ? (
          /* ─── Phase 1: Card Grid ────────────────────────── */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex flex-col items-center w-full"
          >
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="text-center mb-5 px-4"
            >
              <h1
                className="text-2xl font-black mb-1.5 tracking-wide"
                style={{
                  color: accentColor,
                  textShadow: `0 0 30px ${accentColor}50, 0 2px 4px rgba(0,0,0,0.3)`,
                }}
              >
                {chosenType === 'truth' ? '💙 Truth' : '💗 Dare'}
              </h1>
              <p className="text-white/40 text-xs tracking-widest uppercase">ကဒ်တစ်ကဒ်ကို နှိပ်ပါ</p>
            </motion.div>

            {/* Card Grid — 5 columns × 2 rows */}
            <div className="grid grid-cols-5 gap-2.5 px-4 w-full max-w-lg">
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
            initial={{ opacity: 0, scale: 0.7, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.1 }}
            className="relative z-10 flex flex-col items-center px-5 w-full max-w-sm"
          >
            {settings.timerEnabled && (
              <div className="flex flex-col items-center gap-2 z-20 mb-4 shrink-0">
                <TimerDisplay seconds={seconds} total={ROUND_SECONDS} />
                <button
                  onClick={handleStartVoting}
                  className="px-5 py-1.5 rounded-full text-xs text-white/40
                    border border-white/10 hover:text-white/70 hover:border-white/20 transition-colors"
                >
                  ✅ ပြီးပြီ
                </button>
              </div>
            )}

            {/* Glow behind card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.4, scale: 1.2 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -inset-10 rounded-full blur-3xl pointer-events-none"
              style={{ background: `radial-gradient(circle, ${accentColor}60 0%, transparent 70%)` }}
            />

            {/* Revealed card */}
            <motion.div
              initial={{ boxShadow: `0 0 0px ${accentColor}00` }}
              animate={{ boxShadow: `0 0 40px ${accentColor}30, 0 0 80px ${accentColor}15` }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="relative w-full rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '2.5/3.5',
                background: 'linear-gradient(145deg, #1a0a2e 0%, #0d0521 50%, #1a0a2e 100%)',
                border: `1.5px solid ${accentColor}50`,
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-4 right-4 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }}
              />

              {/* Content */}
              <div className="flex flex-col items-center justify-between h-full p-6 pt-8 text-center relative z-10">
                {/* Type icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.5, stiffness: 300 }}
                  className="text-3xl mb-2"
                >
                  {chosenType === 'truth' ? '💙' : '💗'}
                </motion.div>

                {/* Card text */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="text-white text-sm sm:text-base font-medium leading-relaxed line-clamp-7 flex-1 flex items-center"
                >
                  {revealedCard.text}
                </motion.p>

                {/* Badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap gap-2 justify-center"
                >
                  <DifficultyBadge difficulty={revealedCard.difficulty} />
                  <PackBadge pack={revealedCard.pack} />
                </motion.div>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-4 right-4 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }}
              />
            </motion.div>

            {/* Next button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 200, damping: 15 }}
              className={`mt-5 w-full ${settings.timerEnabled ? 'hidden' : ''}`}
            >
              <NeonButton
                color={accentColor}
                size="lg"
                className="w-full"
                onClick={handleStartVoting}
              >
                ▶ နောက်တစ်ဆင့်
              </NeonButton>
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
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 20,
        delay: 0.15 + index * 0.06,
      }}
      className="relative w-full"
      style={{ perspective: '800px' }}
    >
      <motion.div
        animate={{
          rotateY: isFlipped ? 180 : 0,
          scale: isFlipped ? 1.1 : 1,
        }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
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
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(145deg, #1a0a2e 0%, #0d0521 50%, #1a0a2e 100%)',
            border: `1.5px solid ${accentColor}60`,
            boxShadow: `0 0 20px ${accentColor}30, inset 0 0 20px ${accentColor}08`,
          }}
        >
          <div className="flex flex-col items-center justify-between h-full p-2.5 pt-3 text-center">
            <p className="text-white/90 text-[9px] sm:text-[10px] font-medium leading-snug mt-0.5 line-clamp-5">
              {card.text}
            </p>
            <div className="flex flex-wrap gap-1 justify-center mb-1.5">
              <DifficultyBadge difficulty={card.difficulty} className="!text-[7px] !px-1.5 !py-0" />
              <PackBadge pack={card.pack} className="!text-[7px] !px-1.5 !py-0" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
