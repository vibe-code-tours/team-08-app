// All shared types in a single barrel file per CONVENTIONS.md
// No enums (erasableSyntaxOnly) -- const objects + union types instead

export type GamePhase =
  | 'start'
  | 'onboarding'
  | 'setup'
  | 'finger-selection'
  | 'roulette'
  | 'player-selected'
  | 'truth-dare-choice'
  | 'card-reveal'
  | 'voting'
  | 'result'
  | 'next-round'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'all'
export type CardPack = 'friends' | 'couple' | 'family' | 'classic'
export type CardType = 'truth' | 'dare'

/** Neon colors assigned to players in order of touch */
export const PLAYER_COLORS = [
  '#a855f7', // purple
  '#ec4899', // pink
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#eab308', // yellow
  '#f97316', // orange
  '#10b981', // emerald
  '#ef4444', // red
  '#8b5cf6', // violet
  '#14b8a6', // teal
] as const

export interface PlayerTouch {
  identifier: number // keyed by touch.identifier per multitouch-spike-result.md -- NOT array index
  color: string
  x: number
  y: number
  label: string
}

export interface Card {
  id: string
  type: CardType
  difficulty: Difficulty
  pack: CardPack
  text: string
}

export interface GameSettings {
  difficulty: Difficulty
  pack: CardPack
  timerEnabled: boolean
  soundEnabled: boolean
  musicEnabled: boolean
}

export interface GameState {
  phase: GamePhase
  players: PlayerTouch[]
  selectedPlayer: PlayerTouch | null
  selectedCard: Card | null
  chosenType: CardType | null
  voteResult: 'pass' | 'excellent' | 'fail' | null
  settings: GameSettings
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SET_FINGERS'; players: PlayerTouch[] }
  | { type: 'SELECT_PLAYER'; player: PlayerTouch }
  | { type: 'GO_TO_TRUTH_DARE_CHOICE' }
  | { type: 'GO_TO_TRUTH_DARE' }
  | { type: 'CHOOSE_TRUTH_OR_DARE'; payload: CardType }
  | { type: 'PICK_CARD'; payload: Card }
  | { type: 'GO_TO_VOTING' }
  | { type: 'VOTE'; payload: 'pass' | 'excellent' | 'fail' }
  | { type: 'NEXT_ROUND' }
  | { type: 'START_NEXT_ROUND' }
  | { type: 'GO_TO_SETUP' }
  | { type: 'RESTART' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> }
