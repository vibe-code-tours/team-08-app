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
        src={`${import.meta.env.BASE_URL}images/TheChosenOneLogo.png`}
        alt="The Chosen One"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-64 h-auto z-10 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
      />

      {/* Tagline */}
      <div className="mt-6 text-center z-10 flex flex-col items-center gap-3">
        {/* First phrase - staggered word reveal */}
        <div className="overflow-hidden">
          {"Place Your Finger".split(" ").map((word, i) => (
            <motion.span
              key={`first-${i}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
              className="inline-block mx-1 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 tracking-widest uppercase opacity-80"
              style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Glowing divider line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-40 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
          style={{ animation: 'glow-line 2s ease-in-out infinite' }}
        />

        {/* Second phrase - staggered word reveal */}
        <div className="overflow-hidden">
          {"Face Your Fate".split(" ").map((word, i) => (
            <motion.span
              key={`second-${i}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.12, duration: 0.5 }}
              className="inline-block mx-2 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-white to-pink-100 tracking-widest uppercase drop-shadow-[0_0_25px_rgba(236,72,153,0.9)]"
              style={{ animation: 'pulse-glow 2.5s ease-in-out infinite 0.5s' }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>

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
