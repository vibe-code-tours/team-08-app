import { motion } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { useSound } from '../hooks/useSound.ts'
import { GlassPanel } from '../components/GlassPanel.tsx'

/**
 * Next round transition screen — shows options after a round completes.
 * Player can continue, change settings, or restart.
 */
export default function NextRoundScreen() {
  const { voteResult, selectedPlayer } = useGame()
  const dispatch = useGameDispatch()
  const { play } = useSound()

  return (
    <div className="relative w-full h-dvh overflow-hidden flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />

      {/* Vote result display */}
      {voteResult && selectedPlayer && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="text-center mb-6 z-10"
        >
          <span className="text-5xl">{voteResult === 'pass' ? '😎' : '😢'}</span>
          <p
            className="text-lg font-bold mt-2"
            style={{
              color: selectedPlayer.color,
              textShadow: `0 0 12px ${selectedPlayer.color}60`,
            }}
          >
            {selectedPlayer.label}
          </p>
          <p className="text-sm text-white/50 mt-1">
            {voteResult === 'pass' ? 'အောင်မြင်ပါတယ်!' : 'ကြိုးစားပါသေး!'}
          </p>
        </motion.div>
      )}

      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="text-2xl font-bold text-white mb-6 z-10"
        style={{ textShadow: '0 0 20px rgba(168,85,247,0.5)' }}
      >
        ဘာဆက်လုပ်မလဲ?
      </motion.h1>

      {/* Options */}
      <GlassPanel className="w-[85%] max-w-sm p-4 z-10 space-y-3">
        {/* Next Round */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { play('vote'); dispatch({ type: 'START_NEXT_ROUND' }) }}
          className="w-full flex items-center gap-3 p-4 rounded-xl
            bg-gradient-to-r from-purple-600/20 to-purple-600/10
            border border-purple-500/30 text-white font-semibold
            hover:border-purple-400/50 transition-colors"
        >
          <span className="text-xl">▶️</span>
          <span>နောက်တစ်ပွဲဆော့မယ်</span>
        </motion.button>

        {/* Change Settings */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { play('vote'); dispatch({ type: 'GO_TO_SETUP' }) }}
          className="w-full flex items-center gap-3 p-4 rounded-xl
            bg-gradient-to-r from-pink-600/20 to-pink-600/10
            border border-pink-500/30 text-white font-semibold
            hover:border-pink-400/50 transition-colors"
        >
          <span className="text-xl">⚙️</span>
          <span>ဂိမ်းပြင်ဆင်ချက်များ ပြောင်းမည်</span>
        </motion.button>

        {/* Restart */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { play('vote'); dispatch({ type: 'RESTART' }) }}
          className="w-full flex items-center gap-3 p-4 rounded-xl
            bg-gradient-to-r from-red-600/20 to-red-600/10
            border border-red-500/30 text-white font-semibold
            hover:border-red-400/50 transition-colors"
        >
          <span className="text-xl">🔄</span>
          <span>အစကနေပြန်ကစားမည်</span>
        </motion.button>
      </GlassPanel>
    </div>
  )
}
