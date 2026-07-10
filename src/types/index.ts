// All shared types in a single barrel file per CONVENTIONS.md
// No enums (erasableSyntaxOnly) -- const objects + union types instead

export type GamePhase =
  | 'start'
  | 'setup'
  | 'touchSelection'
  | 'selectedPlayer'
  | 'truthDareChoice'
  | 'cardReveal'
  | 'nextRound'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'all'
export type CardPack = 'friends' | 'couple' | 'family' | 'classic'
export type CardType = 'truth' | 'dare'

export interface PlayerTouch {
  id: string
  touchIdentifier: number // keyed by touch.identifier per multitouch-spike-result.md -- NOT array index
  x: number
  y: number
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
}

export interface GameState {
  phase: GamePhase
  players: PlayerTouch[]
  activePlayer: PlayerTouch | null
  selectedCard: Card | null
  settings: GameSettings
}

// Action union for the reducer -- covers exactly the 7 actions in D-05 (plus UPDATE_SETTINGS for PLAT-02)
export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SELECT_PLAYER'; payload: PlayerTouch }
  | { type: 'CHOOSE_TRUTH_OR_DARE'; payload: CardType }
  | { type: 'PICK_CARD'; payload: Card }
  | { type: 'VOTE'; payload: 'pass' | 'fail' }
  | { type: 'NEXT_ROUND' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> }
