import { AnimatePresence, motion } from 'motion/react'
import { GameContextProvider, useGame } from './state/GameContext.tsx'

// Screens — lazy imports for code splitting
import StartScreen from './screens/StartScreen.tsx'
import FingerSelectionScreen from './screens/FingerSelectionScreen.tsx'
import RouletteScreen from './screens/RouletteScreen.tsx'
import PlayerSelectedScreen from './screens/PlayerSelectedScreen.tsx'

function ScreenRouter() {
  const { phase } = useGame()

  const screens: Record<string, React.ComponentType> = {
    start: StartScreen,
    'finger-selection': FingerSelectionScreen,
    roulette: RouletteScreen,
    'player-selected': PlayerSelectedScreen,
  }

  const Screen = screens[phase] ?? StartScreen

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full h-dvh"
      >
        <Screen />
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <GameContextProvider>
      <ScreenRouter />
    </GameContextProvider>
  )
}