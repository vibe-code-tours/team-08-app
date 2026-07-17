import { renderHook } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import { useTouchCapability } from './useTouchCapability'

/** Restore navigator.maxTouchPoints and window.ontouchstart to their original state */
function restoreGlobals(
  originalMaxTouchPoints: PropertyDescriptor | undefined,
  hadOntouchstart: boolean,
) {
  if (originalMaxTouchPoints) {
    Object.defineProperty(navigator, 'maxTouchPoints', originalMaxTouchPoints)
  }
  if (!hadOntouchstart) {
    delete (window as unknown as { ontouchstart?: unknown }).ontouchstart
  }
}

describe('useTouchCapability', () => {
  const originalMaxTouchPoints = Object.getOwnPropertyDescriptor(navigator, 'maxTouchPoints')
  const hadOntouchstart = 'ontouchstart' in window

  afterEach(() => {
    restoreGlobals(originalMaxTouchPoints, hadOntouchstart)
  })

  it('reports touch-capable = true when navigator.maxTouchPoints > 0', () => {
    delete (window as unknown as { ontouchstart?: unknown }).ontouchstart
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 5,
      configurable: true,
    })

    const { result } = renderHook(() => useTouchCapability())

    expect(result.current.isTouchCapable).toBe(true)
  })

  it('reports touch-capable = false when ontouchstart is absent and maxTouchPoints is 0', () => {
    delete (window as unknown as { ontouchstart?: unknown }).ontouchstart
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
    })

    const { result } = renderHook(() => useTouchCapability())

    expect(result.current.isTouchCapable).toBe(false)
  })

  it('reports touch-capable = true when ontouchstart is present (touch laptop case)', () => {
    Object.defineProperty(window, 'ontouchstart', {
      value: null,
      configurable: true,
    })
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
    })

    const { result } = renderHook(() => useTouchCapability())

    expect(result.current.isTouchCapable).toBe(true)
  })
})
