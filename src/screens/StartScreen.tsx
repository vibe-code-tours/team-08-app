import { motion } from 'motion/react'
import { useGameDispatch } from '../state/GameContext.tsx'
import { useSound } from '../hooks/useSound.ts'

/**
 * Landing page — minimal placeholder for now.
 */
export default function StartScreen() {
  const dispatch = useGameDispatch()
  const { play } = useSound()

  return (
    <div className="relative w-full h-dvh overflow-hidden flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />

      {/* Logo */}
      <motion.img
        src="/images/TheChosenOneLogo.png"
        alt="The Chosen One"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-64 h-auto z-10 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
      />

      {/* Start button */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
        onClick={() => { play('tap'); dispatch({ type: 'START_GAME' }) }}
        className="mt-12 px-10 py-4 rounded-full text-xl font-bold text-white
          bg-gradient-to-r from-purple-600 to-pink-600
          shadow-[0_0_30px_rgba(168,85,247,0.5)]
          active:scale-95 transition-transform z-10"
      >
        စမယ်
      </motion.button>
    </div>
  )
}
