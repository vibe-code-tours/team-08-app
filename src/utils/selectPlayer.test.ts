import { describe, it, expect } from 'vitest'
import { selectEligiblePlayers } from './selectPlayer'
import type { PlayerTouch } from '../types/index.ts'

const makePlayer = (id: number, label = `Player ${id + 1}`): PlayerTouch => ({
  identifier: id,
  color: '#a855f7',
  x: 0,
  y: 0,
  label,
})

const players = [makePlayer(0), makePlayer(1), makePlayer(2)]

describe('selectEligiblePlayers', () => {
  it('returns all players when noRepeat is false', () => {
    const result = selectEligiblePlayers(players, [0, 1], false)
    expect(result).toEqual(players)
  })

  it('returns all players when noRepeat is true and history is empty', () => {
    const result = selectEligiblePlayers(players, [], true)
    expect(result).toEqual(players)
  })

  it('excludes previously selected players when noRepeat is true', () => {
    const result = selectEligiblePlayers(players, [0, 1], true)
    expect(result).toHaveLength(1)
    expect(result[0].identifier).toBe(2)
  })

  it('falls back to full pool when all players have been selected', () => {
    const result = selectEligiblePlayers(players, [0, 1, 2], true)
    expect(result).toEqual(players)
  })

  it('returns empty array when players is empty', () => {
    const result = selectEligiblePlayers([], [0], true)
    expect(result).toEqual([])
  })
})
