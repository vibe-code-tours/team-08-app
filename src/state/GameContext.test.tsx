import { describe, it, expect, beforeEach } from 'vitest'
import {
  gameReducer,
  loadSettings,
  saveSettings,
  defaultSettings,
} from './GameContext'
import type { GameState, GameSettings, PlayerTouch } from '../types'

const baseState: GameState = {
  phase: 'start',
  players: [],
  selectedPlayer: null,
  selectedCard: null,
  chosenType: null,
  voteResult: null,
  settings: defaultSettings,
}

const samplePlayer: PlayerTouch = {
  identifier: 0,
  color: '#a855f7',
  x: 10,
  y: 20,
  label: 'Player 1',
}

beforeEach(() => {
  localStorage.clear()
})

describe('gameReducer', () => {
  it('START_GAME transitions phase from start to onboarding', () => {
    const result = gameReducer(baseState, { type: 'START_GAME' })
    expect(result.phase).toBe('onboarding')
  })

  it('START_GAME from onboarding transitions to setup', () => {
    const result = gameReducer({ ...baseState, phase: 'onboarding' }, { type: 'START_GAME' })
    expect(result.phase).toBe('setup')
  })

  it('START_GAME from setup transitions to finger-selection', () => {
    const result = gameReducer({ ...baseState, phase: 'setup' }, { type: 'START_GAME' })
    expect(result.phase).toBe('finger-selection')
  })

  it('SET_FINGERS stores players and transitions to roulette', () => {
    const players: PlayerTouch[] = [
      { ...samplePlayer, identifier: 0 },
      { ...samplePlayer, identifier: 1, label: 'Player 2', color: '#ec4899' },
    ]
    const result = gameReducer(
      { ...baseState, phase: 'finger-selection' },
      { type: 'SET_FINGERS', players },
    )
    expect(result.phase).toBe('roulette')
    expect(result.players).toEqual(players)
  })

  it('SELECT_PLAYER sets phase to player-selected and stores the player', () => {
    const result = gameReducer(baseState, {
      type: 'SELECT_PLAYER',
      player: samplePlayer,
    })
    expect(result.phase).toBe('player-selected')
    expect(result.selectedPlayer).toEqual(samplePlayer)
  })

  it('NEXT_ROUND transitions to next-round and clears player/card/state', () => {
    const midRoundState: GameState = {
      ...baseState,
      phase: 'card-reveal',
      selectedPlayer: samplePlayer,
      selectedCard: {
        id: 'c1',
        type: 'truth',
        difficulty: 'easy',
        pack: 'classic',
        text: 'some card text',
      },
    }
    const result = gameReducer(midRoundState, { type: 'NEXT_ROUND' })
    expect(result.phase).toBe('next-round')
    expect(result.selectedPlayer).toBeNull()
    expect(result.selectedCard).toBeNull()
    expect(result.players).toEqual([])
  })

  it('START_NEXT_ROUND transitions to finger-selection and clears all game state', () => {
    const result = gameReducer(
      { ...baseState, phase: 'next-round', selectedPlayer: samplePlayer, voteResult: 'pass' },
      { type: 'START_NEXT_ROUND' },
    )
    expect(result.phase).toBe('finger-selection')
    expect(result.selectedPlayer).toBeNull()
    expect(result.voteResult).toBeNull()
    expect(result.players).toEqual([])
  })

  it('GO_TO_SETUP transitions to setup phase', () => {
    const result = gameReducer(baseState, { type: 'GO_TO_SETUP' })
    expect(result.phase).toBe('setup')
  })

  it('RESTART resets entire state to initial (keeps settings)', () => {
    const result = gameReducer(
      { ...baseState, phase: 'next-round', selectedPlayer: samplePlayer, voteResult: 'pass' },
      { type: 'RESTART' },
    )
    expect(result.phase).toBe('start')
    expect(result.selectedPlayer).toBeNull()
    expect(result.voteResult).toBeNull()
    expect(result.players).toEqual([])
    expect(result.settings).toEqual(defaultSettings)
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
      soundEnabled: false,
      musicEnabled: false,
    }
    saveSettings(settings)
    expect(loadSettings()).toEqual(settings)
  })
})
