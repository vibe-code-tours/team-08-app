import type { PlayerTouch } from '../types/index.ts'

/**
 * Selects an eligible player for the roulette, respecting the noRepeat setting.
 * Falls back to the full pool when all players have been selected already.
 */
export function selectEligiblePlayers(
  players: PlayerTouch[],
  selectedHistory: number[],
  noRepeat: boolean,
): PlayerTouch[] {
  if (!noRepeat) return players

  const eligible = players.filter((p) => !selectedHistory.includes(p.identifier))
  return eligible.length > 0 ? eligible : players
}
