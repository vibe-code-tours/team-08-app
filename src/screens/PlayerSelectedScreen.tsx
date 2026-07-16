import { useEffect } from 'react'
import { motion } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { useSound } from '../hooks/useSound.ts'

/**
 * Shows the selected player with a crown and glow effect.
 * Placeholder for now — will be polished in Phase 4.
 */
export default function PlayerSelectedScreen() {
  const { selectedPlayer } = useGame()
  const dispatch = useGameDispatch()
  const { play } = useSound()

  useEffect(() => {
    play('fanfare')
  }, [play])

  if (!selectedPlayer) return null

  return (
    <div className="relative w-full h-dvh overflow-hidden select-none flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />

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
        className="text-white/50 mt-2 z-10"
      >
        သင့်အလှည့်ပါ!
      </motion.p>

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => { play('tap'); dispatch({ type: 'GO_TO_TRUTH_DARE' }) }}
        className="mt-10 px-8 py-3 rounded-full text-white font-bold
          bg-gradient-to-r from-purple-600 to-pink-600
          shadow-[0_0_20px_rgba(168,85,247,0.4)]
          active:scale-95 transition-transform z-10"
      >
        ဆက်လက်ဆော့ကစားမယ်
      </motion.button>
    </div>
  )
}