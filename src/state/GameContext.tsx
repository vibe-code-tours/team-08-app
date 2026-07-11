/* eslint-disable react-refresh/only-export-components */
// Hooks (useGame, useGameDispatch) are co-located with the provider by design.
import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { GameState, GameAction, GameSettings } from '../types'

// --- Default settings ---

const DEFAULT_SETTINGS: GameSettings = {
  difficulty: 'medium',
  pack: 'classic',
  maxPlayers: 10,
}

const INITIAL_STATE: GameState = {
  phase: 'start',
  players: [],
  selectedPlayer: null,
  settings: DEFAULT_SETTINGS,
  round: 1,
}

// --- localStorage persistence ---

const SETTINGS_KEY = 'truth-dare-settings'

function loadSettings(): GameSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS
}

function saveSettings(settings: GameSettings): void {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)) } catch { /* ignore */ }
}

// --- Reducer ---

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...INITIAL_STATE, settings: state.settings, phase: 'finger-selection' }

    case 'SET_FINGERS':
      return { ...state, players: action.players, phase: 'roulette' }

    case 'SELECT_PLAYER':
      return { ...state, selectedPlayer: action.player, phase: 'player-selected' }

    case 'NEXT_ROUND':
      return {
        ...state,
        players: [],
        selectedPlayer: null,
        round: state.round + 1,
        phase: 'finger-selection',
      }

    case 'RESTART':
      return { ...INITIAL_STATE, settings: state.settings }

    case 'CHANGE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.settings }
      saveSettings(newSettings)
      return { ...state, settings: newSettings }
    }

    default:
      return state
  }
}

// --- Split Context (critical for 60fps touch perf) ---

const GameStateContext = createContext<GameState>(INITIAL_STATE)
const GameDispatchContext = createContext<React.Dispatch<GameAction>>(() => {})

// --- Provider ---

type GameContextProviderProps = {
  children: ReactNode
}

export function GameContextProvider({ children }: GameContextProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, {
    ...INITIAL_STATE,
    settings: loadSettings(),
  })

  // Sync settings changes to localStorage
  useEffect(() => {
    saveSettings(state.settings)
  }, [state.settings])

  return (
    <GameStateContext value={state}>
      <GameDispatchContext value={dispatch}>
        {children}
      </GameDispatchContext>
    </GameStateContext>
  )
}

// --- Hooks ---

export function useGame(): GameState {
  return useContext(GameStateContext)
}

export function useGameDispatch(): React.Dispatch<GameAction> {
  return useContext(GameDispatchContext)
}
