import { GameContextProvider, useGameContext } from './state/GameContext'
import StartScreen from './screens/StartScreen'
import SetupScreen from './screens/SetupScreen'
import FingerSelectionScreen from './screens/FingerSelectionScreen'
import RouletteScreen from './screens/RouletteScreen'
import PlayerSelectedScreen from './screens/PlayerSelectedScreen'
import TruthDareChoiceScreen from './screens/TruthDareChoiceScreen'
import CardRevealScreen from './screens/CardRevealScreen'
import NextRoundScreen from './screens/NextRoundScreen'

export function ActiveScreen() {
  const { state } = useGameContext()

  switch (state.phase) {
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
    case 'next-round':
      return <NextRoundScreen />
    default: {
      const _exhaustiveCheck: never = state.phase
      return _exhaustiveCheck
    }
  }
}

function App() {
  return (
    <GameContextProvider>
      <ActiveScreen />
    </GameContextProvider>
  )
}

export default App
