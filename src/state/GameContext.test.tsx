import { describe, it, expect, beforeEach } from 'vitest'
import {
  gameReducer,
  loadSettings,
  saveSettings,
  defaultSettings,
} from './GameContext'
import type { GameState, GameSettings } from '../types'

const baseState: GameState = {
  phase: 'start',
  players: [],
  activePlayer: null,
  selectedCard: null,
  settings: defaultSettings,
}

beforeEach(() => {
  localStorage.clear()
})

describe('gameReducer', () => {
  it('START_GAME transitions phase from start to touchSelection', () => {
    const result = gameReducer(baseState, { type: 'START_GAME' })
    expect(result.phase).toBe('touchSelection')
  })

  it('SELECT_PLAYER sets phase to selectedPlayer and stores the PlayerTouch payload in activePlayer', () => {
    const player = { id: 'p1', touchIdentifier: 0, x: 10, y: 20 }
    const result = gameReducer(baseState, {
      type: 'SELECT_PLAYER',
      payload: player,
    })
    expect(result.phase).toBe('selectedPlayer')
    expect(result.activePlayer).toEqual(player)
  })

  it('NEXT_ROUND resets phase to touchSelection and clears activePlayer and selectedCard to null', () => {
    const midRoundState: GameState = {
      ...baseState,
      phase: 'cardReveal',
      activePlayer: { id: 'p1', touchIdentifier: 0, x: 10, y: 20 },
      selectedCard: {
        id: 'c1',
        type: 'truth',
        difficulty: 'easy',
        pack: 'classic',
        text: 'some card text',
      },
    }
    const result = gameReducer(midRoundState, { type: 'NEXT_ROUND' })
    expect(result.phase).toBe('touchSelection')
    expect(result.activePlayer).toBeNull()
    expect(result.selectedCard).toBeNull()
  })

  it('UPDATE_SETTINGS merges a Partial GameSettings payload into state.settings without touching phase', () => {
    const result = gameReducer(baseState, {
      type: 'UPDATE_SETTINGS',
      payload: { timerEnabled: false },
    })
    expect(result.phase).toBe('start')
    expect(result.settings).toEqual({
      ...defaultSettings,
      timerEnabled: false,
    })
  })
})

describe('loadSettings', () => {
  it('returns defaultSettings when localStorage is empty', () => {
    expect(loadSettings()).toEqual(defaultSettings)
  })

  it('returns defaultSettings (does not throw) when the stored value is malformed non-JSON', () => {
    localStorage.setItem('truthOrDare:gameSettings', 'not-valid-json{{{')
    expect(() => loadSettings()).not.toThrow()
    expect(loadSettings()).toEqual(defaultSettings)
  })
})

describe('saveSettings + loadSettings', () => {
  it('round-trips a GameSettings object through localStorage', () => {
    const settings: GameSettings = {
      difficulty: 'hard',
      pack: 'couple',
      timerEnabled: false,
    }
    saveSettings(settings)
    expect(loadSettings()).toEqual(settings)
  })
})
