import { GameContextProvider, useGameContext } from './state/GameContext'
import StartScreen from './screens/StartScreen'
import SetupScreen from './screens/SetupScreen'
import TouchSelectionScreen from './screens/TouchSelectionScreen'
import SelectedPlayerScreen from './screens/SelectedPlayerScreen'
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
    case 'touchSelection':
      return <TouchSelectionScreen />
    case 'selectedPlayer':
      return <SelectedPlayerScreen />
    case 'truthDareChoice':
      return <TruthDareChoiceScreen />
    case 'cardReveal':
      return <CardRevealScreen />
    case 'nextRound':
      return <NextRoundScreen />
    default:
      return null // exhaustive per noFallthroughCasesInSwitch -- TS narrows state.phase to never here
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
