import { motion } from 'motion/react'
import { useGameDispatch } from '../state/GameContext.tsx'

/**
 * Landing page — minimal placeholder for now.
 */
export default function StartScreen() {
  const dispatch = useGameDispatch()

  return (
    <div className="relative w-full h-dvh overflow-hidden flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />

      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="text-4xl font-black text-white z-10"
        style={{ textShadow: '0 0 30px rgba(168,85,247,0.6)' }}
      >
        Truth or Dare
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white/50 mt-2 z-10"
      >
        Finger Roulette Edition
      </motion.p>

      {/* Start button */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
        onClick={() => dispatch({ type: 'START_GAME' })}
        className="mt-12 px-10 py-4 rounded-full text-xl font-bold text-white
          bg-gradient-to-r from-purple-600 to-pink-600
          shadow-[0_0_30px_rgba(168,85,247,0.5)]
          active:scale-95 transition-transform z-10"
      >
        ဂိမ်းစတင်ရန်
      </motion.button>
    </div>
  )
}
