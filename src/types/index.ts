/** All game phases in order */
export type GamePhase =
  | 'start'
  | 'setup'
  | 'finger-selection'
  | 'roulette'
  | 'player-selected'
  | 'truth-dare'
  | 'card-grid'
  | 'card-reveal'
  | 'next-round'

/** A player's touch on the screen — keyed by touch.identifier */
export type PlayerTouch = {
  /** Browser touch identifier (NEVER array index) */
  identifier: number
  /** Neon color assigned to this player */
  color: string
  /** Current x position (CSS pixels from viewport) */
  x: number
  /** Current y position (CSS pixels from viewport) */
  y: number
  /** Display label ("Player 1", "Player 2", etc.) */
  label: string
}

/** Card type */
export type CardType = 'truth' | 'dare'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type Pack = 'friends' | 'couple' | 'family' | 'classic'

/** A challenge card */
export type Card = {
  id: string
  type: CardType
  difficulty: Difficulty
  pack: Pack
  text: string
}

/** Configurable game settings */
export type GameSettings = {
  difficulty: Difficulty
  pack: Pack
  maxPlayers: number
}

/** Full game state */
export type GameState = {
  phase: GamePhase
  players: PlayerTouch[]
  selectedPlayer: PlayerTouch | null
  settings: GameSettings
  round: number
}

/** All possible reducer actions */
export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SET_FINGERS'; players: PlayerTouch[] }
  | { type: 'SELECT_PLAYER'; player: PlayerTouch }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESTART' }
  | { type: 'CHANGE_SETTINGS'; settings: Partial<GameSettings> }

/** Neon color palette for player assignment */
export const PLAYER_COLORS = [
  '#a855f7', // purple
  '#ec4899', // pink
  '#3b82f6', // blue
  '#22d3ee', // cyan
  '#facc15', // yellow
  '#f97316', // orange
  '#10b981', // emerald
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // teal
] as const