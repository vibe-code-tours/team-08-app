import { AnimatePresence, motion } from 'motion/react'
import { useRegisterSW } from 'virtual:pwa-register/react'

/**
 * Tap-to-reload toast — appears when a new service worker has taken over
 * and is ready to activate. Deliberately NOT a silent auto-reload: reloading
 * mid-round would interrupt a live game, so the player must confirm.
 */
export function UpdateToast() {
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW()

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm
            flex items-center justify-between gap-3 px-4 py-3 rounded-2xl
            bg-white/10 backdrop-blur-md border border-white/20
            shadow-[0_0_20px_rgba(139,47,226,0.3)]"
        >
          <span className="text-sm text-white/90">
            အသစ်ထွက်ပါပြီ — ပြန်ဖွင့်ရန် နှိပ်ပါ
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setNeedRefresh(false)}
              className="text-xs text-white/60 hover:text-white/90 transition-colors px-1"
            >
              ✕
            </button>
            <button
              onClick={() => updateServiceWorker(true)}
              className="px-3 py-1.5 rounded-xl text-sm font-bold text-white
                cursor-pointer transition-all"
              style={{
                background: 'linear-gradient(135deg, #8B2FE2 0%, #8B2FE2cc 100%)',
                boxShadow: '0 0 12px rgba(139,47,226,0.5)',
              }}
            >
              ပြန်ဖွင့်မည်
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
