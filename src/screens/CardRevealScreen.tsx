import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { CardBack } from '../components/CardBack.tsx'
import { DifficultyBadge } from '../components/DifficultyBadge.tsx'
import { PackBadge } from '../components/PackBadge.tsx'
import { NeonButton } from '../components/NeonButton.tsx'
import { randomCards } from '../data/cards.ts'
import type { Card } from '../types/index.ts'

const TRUTH_COLOR = '#3b82f6'
const DARE_COLOR = '#ec4899'

/**
 * Card selection grid with 3D flip reveal.
 * Phase 1: Shows 10 face-down cards in a 5×2 grid.
 * Phase 2: After a card is picked, shows only the chosen card centered with full details.
 */
export default function CardRevealScreen() {
  const { chosenType, settings, selectedCard } = useGame()
  const dispatch = useGameDispatch()
  const [flippedId, setFlippedId] = useState<string | null>(null)
  const [revealedCard, setRevealedCard] = useState<Card | null>(null)

  // When selectedCard changes (after PICK_CARD dispatch), show single card view
  useEffect(() => {
    if (selectedCard && !revealedCard) {
      // Small delay so the flip animation plays first
      const timer = setTimeout(() => setRevealedCard(selectedCard), 850)
      return () => clearTimeout(timer)
    }
  }, [selectedCard, revealedCard])

  // Generate 10 random cards based on game settings
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
      if (flippedId) return // Already flipping
      setFlippedId(card.id)

      // Dispatch after flip animation completes
      setTimeout(() => {
        dispatch({ type: 'PICK_CARD', payload: card })
      }, 800)
    },
    [flippedId, dispatch],
  )

  const handleNextRound = useCallback(() => {
    dispatch({ type: 'NEXT_ROUND' })
  }, [dispatch])

  const accentColor = chosenType === 'truth' ? TRUTH_COLOR : DARE_COLOR

  return (
    <div className="relative w-full h-dvh overflow-hidden select-none flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${accentColor}40 0%, transparent 50%)`,
        }}
      />

      <AnimatePresence mode="wait">
        {!revealedCard ? (
          /* ─── Phase 1: Card Grid ────────────────────────── */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex flex-col items-center w-full"
          >
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="text-center mb-6 px-4"
            >
              <h1
                className="text-2xl font-black mb-2"
                style={{
                  color: accentColor,
                  textShadow: `0 0 20px ${accentColor}60`,
                }}
              >
                {chosenType === 'truth' ? '💙 Truth' : '💗 Dare'} — ကိုရွေးပါ
              </h1>
              <p className="text-white/50 text-sm">ကဒ်တစ်ကဒ်ကို နှိပ်ပါ</p>
            </motion.div>

            {/* Card Grid — 5 columns × 2 rows */}
            <div className="grid grid-cols-5 gap-2 px-3 w-full max-w-lg">
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
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
            className="relative z-10 flex flex-col items-center px-4 w-full max-w-sm"
          >
            {/* Revealed card */}
            <div
              className="relative w-full rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '2.5/3.5',
                background: 'linear-gradient(135deg, #1C0E2E, #0A0414)',
                border: `2px solid ${accentColor}80`,
                boxShadow: `0 0 30px ${accentColor}50, inset 0 0 40px ${accentColor}15`,
              }}
            >
              <div className="flex flex-col items-center justify-between h-full p-6 text-center">
                {/* Card text */}
                <p className="text-white text-base sm:text-lg font-medium leading-relaxed mt-4 line-clamp-8">
                  {revealedCard.text}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <DifficultyBadge difficulty={revealedCard.difficulty} />
                  <PackBadge pack={revealedCard.pack} />
                </div>
              </div>
            </div>

            {/* Next button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
              className="mt-6 w-full"
            >
              <NeonButton
                color={accentColor}
                size="lg"
                className="w-full"
                onClick={handleNextRound}
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.2 + index * 0.05,
      }}
      className="relative w-full"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full"
        style={{
          transformStyle: 'preserve-3d',
          aspectRatio: '2.5/3.5',
        }}
      >
        {/* Back of card (face-down) */}
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

        {/* Front of card (face-up) */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #1C0E2E, #0A0414)',
            border: `2px solid ${accentColor}80`,
            boxShadow: `0 0 20px ${accentColor}40, inset 0 0 30px ${accentColor}10`,
          }}
        >
          <div className="flex flex-col items-center justify-between h-full p-3 text-center">
            {/* Card text */}
            <p className="text-white text-[10px] sm:text-xs font-medium leading-snug mt-1 line-clamp-5">
              {card.text}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 justify-center mb-2">
              <DifficultyBadge difficulty={card.difficulty} />
              <PackBadge pack={card.pack} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
