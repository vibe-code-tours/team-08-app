import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { GameContextProvider, useGameContext } from './state/GameContext'
import ErrorBoundary from './components/ErrorBoundary'
import { SettingsButton } from './components/SettingsButton'
import { UpdateToast } from './components/UpdateToast'
import PhaseMusic from './components/PhaseMusic'
import { useTouchCapability } from './hooks/useTouchCapability'
import type { GamePhase } from './types/index.ts'
import StartScreen from './screens/StartScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import SetupScreen from './screens/SetupScreen'
import FingerSelectionScreen from './screens/FingerSelectionScreen'
import RouletteScreen from './screens/RouletteScreen'
import PlayerSelectedScreen from './screens/PlayerSelectedScreen'
import TruthDareChoiceScreen from './screens/TruthDareChoiceScreen'
import CardRevealScreen from './screens/CardRevealScreen'
import VotingScreen from './screens/VotingScreen'
import ResultScreen from './screens/ResultScreen'
import NextRoundScreen from './screens/NextRoundScreen'
import DesktopGateScreen from './screens/DesktopGateScreen'

/** Phases that require touch input; desktop/non-touch devices are gated here. */
const TOUCH_REQUIRED_PHASES: GamePhase[] = ['finger-selection', 'roulette']

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
  const { isTouchCapable } = useTouchCapability()
  const [gateDismissed, setGateDismissed] = useState(false)

  const showGate =
    TOUCH_REQUIRED_PHASES.includes(state.phase) && !isTouchCapable && !gateDismissed

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={showGate ? 'desktop-gate' : state.phase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full h-dvh"
      >
        {showGate ? (
          <DesktopGateScreen onContinueAnyway={() => setGateDismissed(true)} />
        ) : (
          <ScreenContent phase={state.phase} />
        )}
      </motion.div>
    </AnimatePresence>
  )
}

function AppShell() {
  const { dispatch } = useGameContext()

  return (
    <>
      <PhaseMusic />
      <ErrorBoundary dispatch={dispatch}>
        <ActiveScreen />
      </ErrorBoundary>
      <SettingsButton />
      <UpdateToast />
    </>
  )
}

function App() {
  return (
    <GameContextProvider>
      <AppShell />
    </GameContextProvider>
  )
}

export default App
