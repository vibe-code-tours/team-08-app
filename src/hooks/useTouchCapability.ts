import { useState } from 'react'

/**
 * Detects whether the current device supports touch input.
 *
 * Uses feature detection ONLY — never user-agent sniffing:
 *   - `'ontouchstart' in window` catches touch-capable browsers/laptops
 *     that may report `maxTouchPoints === 0`.
 *   - `navigator.maxTouchPoints > 0` catches modern touch devices that
 *     don't expose `ontouchstart`.
 *
 * Result is computed once per mount and stable across re-renders.
 */
function detectTouchCapable(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function useTouchCapability(): { isTouchCapable: boolean } {
  const [isTouchCapable] = useState<boolean>(detectTouchCapable)
  return { isTouchCapable }
}
