import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { useSound } from '../hooks/useSound.ts'

/** Apple-style toggle switch */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-11 h-6 rounded-full transition-colors duration-200"
      style={{
        backgroundColor: on ? '#8B2FE2' : 'rgba(255,255,255,0.15)',
        boxShadow: on ? '0 0 10px rgba(139,47,226,0.4)' : 'none',
      }}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
        animate={{ left: on ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

/**
 * Floating settings button — opens a menu with sound toggle, music toggle,
 * and home button. Available on all screens.
 */
export function SettingsButton() {
  const [open, setOpen] = useState(false)
  const { settings } = useGame()
  const dispatch = useGameDispatch()
  const { play } = useSound()
  const soundOn = settings.soundEnabled
  const musicOn = settings.musicEnabled

  return (
    <>
      {/* Floating gear button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => { play('vote', 0.5); setOpen(!open) }}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full
          flex items-center justify-center text-lg
          bg-white/10 backdrop-blur-md border border-white/20
          shadow-[0_0_12px_rgba(168,85,247,0.3)]
          active:scale-95 transition-transform"
      >
        {open ? '✕' : '⚙️'}
      </motion.button>

      {/* Settings menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40"
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="fixed top-16 right-4 z-50 w-56
                rounded-2xl border border-white/10
                bg-slate-900/95 backdrop-blur-md
                shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                overflow-hidden"
            >
              {/* Sound toggle */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-white/80">{soundOn ? '🔊' : '🔇'} အသံ</span>
                <Toggle on={soundOn} onToggle={() => {
                  // Force-play even when sound is being turned off
                  play('vote', 0.6)
                  dispatch({ type: 'UPDATE_SETTINGS', payload: { soundEnabled: !soundOn } })
                }} />
              </div>

              {/* Music toggle */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
                <span className="text-sm text-white/80">{musicOn ? '🎵' : '🔕'} သီချင်း</span>
                <Toggle on={musicOn} onToggle={() => {
                  play('vote', 0.6)
                  dispatch({ type: 'UPDATE_SETTINGS', payload: { musicEnabled: !musicOn } })
                }} />
              </div>

              {/* Divider */}
              <div className="h-px bg-white/5" />

              {/* Home button */}
              <button
                onClick={() => {
                  play('vote', 0.5)
                  setOpen(false)
                  dispatch({ type: 'RESTART' })
                }}
                className="w-full flex items-center gap-2 px-4 py-3
                  text-sm text-white/80 hover:bg-white/5 transition-colors"
              >
                <span>🏠</span>
                <span>ပင်မစာမျက်နှာ</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
