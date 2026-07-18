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
    const result = selectEligiblePlayers(players, 0, false)
    expect(result).toEqual(players)
  })

  it('returns all players when noRepeat is true and lastSelectedPlayerId is null', () => {
    const result = selectEligiblePlayers(players, null, true)
    expect(result).toEqual(players)
  })

  it('excludes the last selected player when noRepeat is true', () => {
    const result = selectEligiblePlayers(players, 0, true)
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.identifier !== 0)).toBe(true)
  })

  it('falls back to full pool when only one player remains', () => {
    const singlePlayer = [makePlayer(0)]
    const result = selectEligiblePlayers(singlePlayer, 0, true)
    expect(result).toEqual(singlePlayer)
  })

  it('returns empty array when players is empty', () => {
    const result = selectEligiblePlayers([], 0, true)
    expect(result).toEqual([])
  })
})
