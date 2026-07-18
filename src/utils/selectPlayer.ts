import type { PlayerTouch } from '../types/index.ts'

/**
 * Selects an eligible player for the roulette, respecting the noRepeat setting.
 * When noRepeat is on, excludes only the most recently selected player (no consecutive picks).
 * Falls back to the full pool when only one player remains.
 */
export function selectEligiblePlayers(
  players: PlayerTouch[],
  lastSelectedPlayerId: number | null,
  noRepeat: boolean,
): PlayerTouch[] {
  if (!noRepeat || lastSelectedPlayerId === null) return players

  const eligible = players.filter((p) => p.identifier !== lastSelectedPlayerId)
  return eligible.length > 0 ? eligible : players
}
