import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGame, useGameDispatch } from '../state/GameContext.tsx'
import { useSound } from '../hooks/useSound.ts'
import { GlassPanel } from '../components/GlassPanel.tsx'
import type { CardPack, Difficulty } from '../types/index.ts'

const packs: { key: CardPack; icon: string; label: string; color: string }[] = [
  { key: 'friends', icon: '👫', label: 'သူငယ်ချင်း', color: '#40A1E9' },
  { key: 'couple', icon: '❤️', label: 'သမီးရည်းစား', color: '#E02B96' },
  { key: 'family', icon: '👨‍👩‍👧', label: 'မိသားစု', color: '#50BF3A' },
  { key: 'classic', icon: '🎯', label: 'ရိုးရိုး', color: '#a855f7' },
]

const difficulties: { key: Difficulty; label: string; color: string }[] = [
  { key: 'easy', label: 'လွယ်', color: '#50BF3A' },
  { key: 'medium', label: 'အလယ်အလတ်', color: '#F4CC50' },
  { key: 'hard', label: 'ခက်', color: '#E9243D' },
  { key: 'all', label: 'အားလုံး', color: '#a855f7' },
]

/**
 * Setup screen — configure game settings before playing.
 * Pack selection, difficulty, and timer toggle.
 */
export default function SetupScreen() {
  const { settings } = useGame()
  const dispatch = useGameDispatch()
  const { play } = useSound()
  const [showTimerTooltip, setShowTimerTooltip] = useState(false)

  return (
    <div className="relative w-full h-dvh overflow-hidden flex flex-col items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />

      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="text-2xl font-bold text-white mt-12 mb-6 z-10"
        style={{ textShadow: '0 0 20px rgba(168,85,247,0.5)' }}
      >
        ဂိမ်းအပြင်အဆင်
      </motion.h1>

      <GlassPanel className="w-[90%] max-w-sm p-6 z-10 space-y-6">
        {/* Pack selection */}
        <div>
          <p className="text-sm text-white/60 mb-3">ဘယ်သူတွေနဲ့ ဆော့မှာလည်းရွေးပါ</p>
          <div className="grid grid-cols-2 gap-3">
            {packs.map((pack) => {
              const selected = settings.pack === pack.key
              return (
                <motion.button
                  key={pack.key}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { play('vote'); dispatch({ type: 'UPDATE_SETTINGS', payload: { pack: pack.key } }) }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold transition-all
                    ${selected ? 'border-2' : 'border border-white/10 bg-white/5'}`}
                  style={selected ? {
                    borderColor: pack.color,
                    backgroundColor: `${pack.color}20`,
                    boxShadow: `0 0 16px ${pack.color}40`,
                    color: pack.color,
                  } : { color: 'rgba(255,255,255,0.7)' }}
                >
                  <span className="text-xl">{pack.icon}</span>
                  <span>{pack.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Difficulty selection */}
        <div>
          <p className="text-sm text-white/60 mb-3">အဆင့်</p>
          <div className="flex gap-2">
            {difficulties.map((diff) => {
              const selected = settings.difficulty === diff.key
              return (
                <motion.button
                  key={diff.key}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { play('vote'); dispatch({ type: 'UPDATE_SETTINGS', payload: { difficulty: diff.key } }) }}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all
                    ${selected ? 'border-2' : 'border border-white/10 bg-white/5'}`}
                  style={selected ? {
                    borderColor: diff.color,
                    backgroundColor: `${diff.color}20`,
                    boxShadow: `0 0 12px ${diff.color}40`,
                    color: diff.color,
                  } : { color: 'rgba(255,255,255,0.7)' }}
                >
                  {diff.label}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Timer toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">အချိန်အကန့်အသတ်</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTimerTooltip(!showTimerTooltip)}
                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-white/50 text-xs active:bg-white/20 active:text-white/70 transition-colors"
              >
                ?
              </button>
              <AnimatePresence>
                {showTimerTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute right-0 bottom-full mb-2 w-64 p-3 rounded-xl bg-slate-800 border border-white/10 text-xs text-white/70 leading-relaxed z-50"
                  >
                    အချိန်အကန့်အသတ်ကို ဖွင့်ထားမယ်ဆိုရင် challenge လုပ်ရတဲ့ player ဟာ သတ်မှတ်အချိန်အတွင်း challenge ကို ပြီးမြောက်အောင်လုပ်ရမှာဖြစ်ပါတယ်။
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { play('vote'); dispatch({ type: 'UPDATE_SETTINGS', payload: { timerEnabled: !settings.timerEnabled } }) }}
            className="relative w-12 h-6 rounded-full transition-colors"
            style={{
              backgroundColor: settings.timerEnabled ? '#8B2FE2' : 'rgba(255,255,255,0.15)',
              boxShadow: settings.timerEnabled ? '0 0 12px rgba(139,47,226,0.5)' : 'none',
            }}
          >
            <motion.div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
              animate={{ left: settings.timerEnabled ? 26 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>
      </GlassPanel>

      {/* Start button */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
        onClick={() => { play('tap'); dispatch({ type: 'START_GAME' }) }}
        className="mt-8 px-10 py-4 rounded-full text-xl font-bold text-white
          bg-gradient-to-r from-purple-600 to-pink-600
          shadow-[0_0_30px_rgba(168,85,247,0.5)]
          active:scale-95 transition-transform z-10"
      >
        ကစားမည်
      </motion.button>
    </div>
  )
}