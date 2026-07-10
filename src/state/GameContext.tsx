/* eslint-disable react-refresh/only-export-components -- this module intentionally
   co-locates the reducer, settings-persistence helpers, and the useGameContext hook
   alongside GameContextProvider (RESEARCH.md Pattern 2/3, 01-PATTERNS.md); splitting
   them into separate files would break the Task 1/3 test import contract. */
import { createContext, useContext, useEffect, useReducer } from 'react'
import type { ReactNode, Dispatch } from 'react'
import type { GameSettings, GameState, GameAction } from '../types'

const STORAGE_KEY = 'truthOrDare:gameSettings'

export const defaultSettings: GameSettings = {
  difficulty: 'all',
  pack: 'classic',
  timerEnabled: true,
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings
  } catch {
    return defaultSettings // private browsing / quota / parse errors fall back silently
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // localStorage unavailable (private browsing, quota exceeded) -- fail silently, in-memory state still works
  }
}

const initialState: GameState = {
  phase: 'start',
  players: [],
  activePlayer: null,
  selectedCard: null,
  settings: loadSettings(),
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, phase: 'touchSelection' }
    case 'SELECT_PLAYER':
      return { ...state, phase: 'selectedPlayer', activePlayer: action.payload }
    case 'CHOOSE_TRUTH_OR_DARE':
      return { ...state, phase: 'cardReveal' }
    case 'PICK_CARD':
      return { ...state, selectedCard: action.payload }
    case 'VOTE':
      return { ...state }
    case 'NEXT_ROUND':
      return {
        ...state,
        phase: 'touchSelection',
        activePlayer: null,
        selectedCard: null,
      }
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    default:
      return state
  }
}

type GameContextValue = { state: GameState; dispatch: Dispatch<GameAction> }
const GameContext = createContext<GameContextValue | null>(null)

export function GameContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  useEffect(() => {
    saveSettings(state.settings)
  }, [state.settings])

  return <GameContext value={{ state, dispatch }}>{children}</GameContext>
}

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGameContext must be used within GameContextProvider')
  return ctx
}
