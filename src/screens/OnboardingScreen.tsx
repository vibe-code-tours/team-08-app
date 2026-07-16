import { useState, useRef } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'motion/react'
import { useGameDispatch } from '../state/GameContext.tsx'

const slides = [
  {
    image: '/images/OnboardingScreens/Welcome.png',
    title: 'The Chosen One',
    subtitle: 'မဟာကံထူးရှင်ရွေးကြမယ်!',
    desc: 'သူငယ်ချင်းတွေနဲ့အတူ ဖုန်းမျက်နှာပြင်ပေါ်မှာ လက်ညှိုးတွေထားပြီး ကံစမ်းကြမယ်!',
    color: '#a855f7',
  },
  {
    image: '/images/OnboardingScreens/FingerRoulette.png',
    title: 'မဟာကံထူးရှင်ရွေးကြမယ်!',
    subtitle: 'လက်ညှိုးတွေကို ဖုန်းပေါ်တင်လိုက်ပါ',
    desc: 'ကစားသမားတွေက ဖုန်းမျက်နှာပြင်ပေါ်မှာ လက်ညှိုးတွေတင်လိုက်ပါ။ မဟာကံထူးရှင်ကို ရွေးချယ်ပေးပါ့မယ်!',
    color: '#ec4899',
  },
  {
    image: '/images/OnboardingScreens/TruthOrDare.png',
    title: 'Truth or Dare',
    subtitle: 'ရွေးချယ်စရာများ',
    desc: 'ရွေးချယ်ခံရတဲ့ကစားသမားက Truth or Dare or Random ကိုရွေးရမယ်!',
    color: '#40A1E9',
  },
  {
    image: '/images/OnboardingScreens/CardReveal.png',
    title: 'ရွေးပါ',
    subtitle: 'ကံစမ်းကြည့်ပါ',
    desc: 'ပေးထားတဲ့ ကတ်၁၀ခုထဲက တစ်ခုကို ရွေးပြီး စိန်ခေါ်မှုကို လက်ခံလိုက်ပါ',
    color: '#E02B96',
  },
  {
    emoji: '🔥',
    title: 'အဆင်သင့်ဖြစ်ပြီလား?',
    subtitle: 'စလိုက်ကြရအောင်!',
    desc: 'သူငယ်ချင်းတွေနဲ့အတူ ပျော်ရွှင်စရာအချိန်ကောင်းကို ဖြတ်သန်းကြမယ်!',
    color: '#F4CC50',
  },
]

/**
 * Onboarding screen — 5 swipeable slides explaining the game.
 * Shows every time the game starts.
 */
export default function OnboardingScreen() {
  const dispatch = useGameDispatch()
  const [current, setCurrent] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const isLast = current === slides.length - 1

  const handleNext = () => {
    if (isLast) {
      dispatch({ type: 'START_GAME' })
    } else {
      setCurrent((p) => p + 1)
    }
  }

  const handlePrev = () => {
    setCurrent((p) => Math.max(0, p - 1))
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50 && !isLast) {
      setCurrent((p) => p + 1)
    } else if (info.offset.x > 50 && current > 0) {
      setCurrent((p) => p - 1)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-dvh overflow-hidden select-none flex flex-col"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => dispatch({ type: 'START_GAME' })}
        className="absolute top-4 left-4 z-20 px-4 py-1.5 rounded-full text-sm text-white/50
          border border-white/10 hover:text-white/80 hover:border-white/20 transition-colors"
      >
        ⏭️ ကျော်မယ်
      </motion.button>

      {/* Slide content */}
      <div className="flex-1 flex items-center justify-center z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            className="flex flex-col items-center text-center px-8 max-w-sm"
          >
            {/* Image or Emoji */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
              className="mb-6"
            >
              {'image' in slides[current] && slides[current].image ? (
                <img
                  src={slides[current].image}
                  alt={slides[current].title || 'Game Onboarding Slide'}
                  className="w-56 h-56 object-contain"
                  style={{ filter: `drop-shadow(0 0 20px ${slides[current].color}40)` }}
                />
              ) : (
                <span
                  className="text-7xl"
                  style={{ filter: `drop-shadow(0 0 20px ${slides[current].color}60)` }}
                >
                  {'emoji' in slides[current] ? slides[current].emoji : '🎯'}
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-black mb-2"
              style={{
                color: slides[current].color,
                textShadow: `0 0 20px ${slides[current].color}50`,
              }}
            >
              {slides[current].title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/80 font-medium mb-4"
            >
              {slides[current].subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-sm text-white/50 leading-relaxed"
            >
              {slides[current].desc}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col items-center gap-4 pb-12 z-10">
        {/* Dot indicators */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === current ? 24 : 8,
                backgroundColor: i === current ? slides[current].color : 'rgba(255,255,255,0.2)',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="h-2 rounded-full"
              style={{
                boxShadow: i === current ? `0 0 8px ${slides[current].color}60` : 'none',
              }}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {current > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="px-6 py-3 rounded-full text-sm font-semibold text-white/60
                border border-white/10 hover:border-white/20 transition-colors"
            >
              နောက်သို့
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="px-8 py-3 rounded-full text-sm font-bold text-white
              transition-all"
            style={{
              background: `linear-gradient(135deg, ${slides[current].color}, ${slides[current].color}cc)`,
              boxShadow: `0 0 20px ${slides[current].color}60`,
            }}
          >
            {isLast ? 'စလိုက်မယ်!' : 'ရှေ့သို့'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
