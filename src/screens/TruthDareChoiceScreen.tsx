import { motion } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { GlassPanel } from '../components/GlassPanel.tsx'
import { randomCard } from '../data/cards.ts'
import type { CardType } from '../types/index.ts'

/**
 * Truth/Dare choice screen — player picks Truth, Dare, or Random.
 * Mock version for Phase 2 Task 1 integration.
 */
export default function TruthDareChoiceScreen() {
  const { selectedPlayer, settings } = useGame()
  const dispatch = useGameDispatch()

  const handleChoice = (type: CardType) => {
    // Pick a random card matching the choice and settings
    const card = randomCard({ type, difficulty: settings.difficulty, pack: settings.pack })
    dispatch({ type: 'CHOOSE_TRUTH_OR_DARE', payload: type })
    if (card) {
      dispatch({ type: 'PICK_CARD', payload: card })
    }
  }

  const handleRandom = () => {
    const type: CardType = Math.random() < 0.5 ? 'truth' : 'dare'
    handleChoice(type)
  }

  if (!selectedPlayer) return null

  const choices = [
    { type: 'truth' as const, label: 'အမှန်ပြော', icon: '💬', color: '#40A1E9', desc: 'Truth' },
    { type: 'dare' as const, label: 'စိတ်ကူးကစား', icon: '🔥', color: '#E02B96', desc: 'Dare' },
  ]

  return (
    <div className="relative w-full h-dvh overflow-hidden flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />

      {/* Player indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="mb-6 z-10 text-center"
      >
        <div
          className="w-16 h-16 rounded-full mx-auto mb-2"
          style={{
            backgroundColor: selectedPlayer.color,
            boxShadow: `0 0 24px ${selectedPlayer.color}, 0 0 48px ${selectedPlayer.color}60`,
          }}
        />
        <h2
          className="text-xl font-bold"
          style={{ color: selectedPlayer.color, textShadow: `0 0 12px ${selectedPlayer.color}60` }}
        >
          {selectedPlayer.label}
        </h2>
      </motion.div>

      {/* Question */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-white/70 mb-6 z-10"
      >
        ဘာရွေးမလဲ?
      </motion.p>

      {/* Choice buttons */}
      <GlassPanel className="w-[80%] max-w-sm p-4 z-10 space-y-3">
        {choices.map((choice, i) => (
          <motion.button
            key={choice.type}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleChoice(choice.type)}
            className="w-full flex items-center gap-4 p-4 rounded-xl font-semibold text-white transition-all"
            style={{
              background: `linear-gradient(135deg, ${choice.color}30, ${choice.color}15)`,
              border: `2px solid ${choice.color}50`,
            }}
          >
            <span className="text-2xl">{choice.icon}</span>
            <div className="text-left">
              <span className="block text-lg">{choice.label}</span>
              <span className="block text-xs text-white/50">{choice.desc}</span>
            </div>
          </motion.button>
        ))}

        {/* Random button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleRandom}
          className="w-full flex items-center gap-4 p-4 rounded-xl font-semibold text-white transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(234,179,8,0.3), rgba(234,179,8,0.15))',
            border: '2px solid rgba(234,179,8,0.5)',
          }}
        >
          <span className="text-2xl">🎲</span>
          <div className="text-left">
            <span className="block text-lg">ကံစမ်းမယ်</span>
            <span className="block text-xs text-white/50">Random</span>
          </div>
        </motion.button>
      </GlassPanel>
    </div>
  )
}
