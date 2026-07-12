import { AnimatePresence, motion } from 'motion/react'
import { GameContextProvider, useGameContext } from './state/GameContext'
import StartScreen from './screens/StartScreen'
import SetupScreen from './screens/SetupScreen'
import FingerSelectionScreen from './screens/FingerSelectionScreen'
import RouletteScreen from './screens/RouletteScreen'
import PlayerSelectedScreen from './screens/PlayerSelectedScreen'
import TruthDareChoiceScreen from './screens/TruthDareChoiceScreen'
import CardRevealScreen from './screens/CardRevealScreen'
import VotingScreen from './screens/VotingScreen'
import ResultScreen from './screens/ResultScreen'
import NextRoundScreen from './screens/NextRoundScreen'

function ScreenContent({ phase }: { phase: string }) {
  switch (phase) {
    case 'start':
      return <StartScreen />
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
    case 'voting':
      return <VotingScreen />
    case 'result':
      return <ResultScreen />
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
    </GameContextProvider>
  )
}

export default App
