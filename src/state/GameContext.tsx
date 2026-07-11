/* eslint-disable react-refresh/only-export-components -- this module intentionally
   co-locates the reducer, settings-persistence helpers, and the useGame/useGameDispatch hooks
   alongside GameContextProvider; splitting them into separate files would break the
   Task 1/3 test import contract. */
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
    return defaultSettings
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // localStorage unavailable -- fail silently
  }
}

const initialState: GameState = {
  phase: 'start',
  players: [],
  selectedPlayer: null,
  selectedCard: null,
  chosenType: null,
  voteResult: null,
  settings: loadSettings(),
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, phase: 'finger-selection' }
    case 'SET_FINGERS':
      return { ...state, phase: 'roulette', players: action.players }
    case 'SELECT_PLAYER':
      return { ...state, phase: 'player-selected', selectedPlayer: action.player }
    case 'CHOOSE_TRUTH_OR_DARE':
      return { ...state, phase: 'card-reveal', chosenType: action.payload }
    case 'PICK_CARD':
      return { ...state, phase: 'card-reveal', selectedCard: action.payload }
    case 'VOTE':
      return { ...state, voteResult: action.payload }
    case 'NEXT_ROUND':
      return {
        ...state,
        phase: 'next-round',
        players: [],
        selectedPlayer: null,
        selectedCard: null,
        chosenType: null,
        voteResult: null,
      }
    case 'START_NEXT_ROUND':
      return {
        ...state,
        phase: 'finger-selection',
        players: [],
        selectedPlayer: null,
        selectedCard: null,
        chosenType: null,
        voteResult: null,
      }
    case 'GO_TO_SETUP':
      return { ...state, phase: 'setup' }
    case 'RESTART':
      return { ...initialState, settings: state.settings }
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

/** Access full game state */
export function useGame(): GameState {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameContextProvider')
  return ctx.state
}

/** Access dispatch to trigger game actions */
export function useGameDispatch(): Dispatch<GameAction> {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGameDispatch must be used within GameContextProvider')
  return ctx.dispatch
}

/** Legacy export — returns both state and dispatch */
export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGameContext must be used within GameContextProvider')
  return ctx
}
