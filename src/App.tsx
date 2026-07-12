import { AnimatePresence, motion } from 'motion/react'
import { GameContextProvider, useGameContext } from './state/GameContext'
import { SettingsButton } from './components/SettingsButton'
import StartScreen from './screens/StartScreen'
import SetupScreen from './screens/SetupScreen'
import FingerSelectionScreen from './screens/FingerSelectionScreen'
import RouletteScreen from './screens/RouletteScreen'
import PlayerSelectedScreen from './screens/PlayerSelectedScreen'
import TruthDareChoiceScreen from './screens/TruthDareChoiceScreen'
import CardRevealScreen from './screens/CardRevealScreen'
import NextRoundScreen from './screens/NextRoundScreen'
import OnboardingScreen from './screens/OnboardingScreen'

function ScreenContent({ phase }: { phase: string }) {
  switch (phase) {
    case 'start':
      return <StartScreen />
    case 'onboarding':
      return <OnboardingScreen />
    case 'setup':
      return <SetupScreen />
    case 'finger-selection':
      return <FingerSelectionScreen />
    case 'roulette':
      return <RouletteScreen />
    case 'player-selected':
      return <PlayerSelectedScreen />
    case 'truth-dare-choice':
      return <TruthDareChoiceScreen />
    case 'card-reveal':
      return <CardRevealScreen />
    case 'next-round':
      return <NextRoundScreen />
    default:
      return <StartScreen />
  }
}

export function ActiveScreen() {
  const { state } = useGameContext()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.phase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full h-dvh"
      >
        <ScreenContent phase={state.phase} />
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <GameContextProvider>
      <ActiveScreen />
      <SettingsButton />
    </GameContextProvider>
  )
}

export default App
