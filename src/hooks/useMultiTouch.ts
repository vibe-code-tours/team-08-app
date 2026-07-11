import { useRef, useCallback, useState, useEffect, type RefObject } from 'react'
import type { PlayerTouch } from '../types/index.ts'
import { PLAYER_COLORS } from '../types/index.ts'

/**
 * Multi-touch tracking hook.
 *
 * CRITICAL: Touches are keyed by touch.identifier (NEVER array index).
 * Positions are stored in a ref (not state) because touch events fire at 60fps.
 * Attaches native touch listeners via ref for maximum performance.
 */
export function useMultiTouch(
  containerRef: RefObject<HTMLElement | null>,
  maxPlayers: number = 10,
) {
  /** All active touches keyed by touch.identifier (fast reads for event handlers) */
  const touchesRef = useRef<Map<number, PlayerTouch>>(new Map())
  /** Player list in state — triggers re-renders for UI */
  const [players, setPlayers] = useState<PlayerTouch[]>([])
  /** Next player number for label assignment */
  const playerNumRef = useRef(1)

  /** Sync ref → state after structural changes (add/remove) */
  const syncPlayers = useCallback(() => {
    setPlayers(Array.from(touchesRef.current.values()))
  }, [])

  /** Get the color for a new player */
  const getNextColor = useCallback((count: number): string => {
    return PLAYER_COLORS[count % PLAYER_COLORS.length]
  }, [])

  // Attach native touch listeners (bypasses React synthetic events — faster)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      let changed = false

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i]
        if (touchesRef.current.size >= maxPlayers) break
        if (touchesRef.current.has(touch.identifier)) continue

        const color = getNextColor(touchesRef.current.size)
        const label = `Player ${playerNumRef.current++}`

        touchesRef.current.set(touch.identifier, {
          identifier: touch.identifier,
          color,
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
          label,
        })
        changed = true
      }
      if (changed) syncPlayers()
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i]
        const player = touchesRef.current.get(touch.identifier)
        if (player) {
          player.x = touch.clientX - rect.left
          player.y = touch.clientY - rect.top
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      for (let i = 0; i < e.changedTouches.length; i++) {
        touchesRef.current.delete(e.changedTouches[i].identifier)
      }
      syncPlayers()
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: false })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: false })
    el.addEventListener('touchcancel', handleTouchEnd, { passive: false })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
      el.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [containerRef, maxPlayers, getNextColor, syncPlayers])

  /** Get the current players array from the ref (for event handlers) */
  const getPlayers = useCallback((): PlayerTouch[] => {
    return Array.from(touchesRef.current.values())
  }, [])

  /** Reset all touches and player counter */
  const reset = useCallback(() => {
    touchesRef.current.clear()
    playerNumRef.current = 1
    setPlayers([])
  }, [])

  return {
    touchesRef,
    players,
    getPlayers,
    reset,
  }
}
