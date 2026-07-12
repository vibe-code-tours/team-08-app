import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import FingerSelectionScreen from './FingerSelectionScreen'
import { GameContextProvider } from '../state/GameContext'

// Helper to dispatch custom touch events
function fireTouchEvent(el: HTMLElement, type: string, touches: { identifier: number; clientX: number; clientY: number }[]) {
  const event = new CustomEvent(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'changedTouches', { value: touches })
  el.dispatchEvent(event)
}

describe('FingerSelectionScreen', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('limits finger selection to 2 players when "couple" pack is selected', async () => {
    // Set selected pack to 'couple' in localStorage
    localStorage.setItem(
      'truthOrDare:gameSettings',
      JSON.stringify({ pack: 'couple', difficulty: 'all', timerEnabled: true }),
    )

    render(
      <GameContextProvider>
        <FingerSelectionScreen />
      </GameContextProvider>,
    )

    const container = screen.getByText('Place your fingers!').closest('.select-none') as HTMLElement

    // Place 1st finger
    fireTouchEvent(container, 'touchstart', [{ identifier: 1, clientX: 100, clientY: 100 }])
    await waitFor(() => {
      expect(screen.getByText(/1.*ကစားသမား/)).toBeInTheDocument()
    })

    // Place 2nd finger
    fireTouchEvent(container, 'touchstart', [{ identifier: 2, clientX: 150, clientY: 150 }])
    await waitFor(() => {
      expect(screen.getByText(/2.*ကစားသမား/)).toBeInTheDocument()
    })

    // Try to place a 3rd finger (should be ignored)
    fireTouchEvent(container, 'touchstart', [{ identifier: 3, clientX: 200, clientY: 200 }])
    // The player count should still be 2
    await waitFor(() => {
      expect(screen.getByText(/2.*ကစားသမား/)).toBeInTheDocument()
    })
  })

  it('allows up to 10 players for other packs (e.g. classic)', async () => {
    // Set selected pack to 'classic' (default) in localStorage
    localStorage.setItem(
      'truthOrDare:gameSettings',
      JSON.stringify({ pack: 'classic', difficulty: 'all', timerEnabled: true }),
    )

    render(
      <GameContextProvider>
        <FingerSelectionScreen />
      </GameContextProvider>,
    )

    const container = screen.getByText('Place your fingers!').closest('.select-none') as HTMLElement

    // Place 3 fingers
    fireTouchEvent(container, 'touchstart', [
      { identifier: 1, clientX: 100, clientY: 100 },
    ])
    fireTouchEvent(container, 'touchstart', [
      { identifier: 2, clientX: 150, clientY: 150 },
    ])
    fireTouchEvent(container, 'touchstart', [
      { identifier: 3, clientX: 200, clientY: 200 },
    ])

    // The player count should be 3
    await waitFor(() => {
      expect(screen.getByText(/3.*ကစားသမား/)).toBeInTheDocument()
    })
  })
})
