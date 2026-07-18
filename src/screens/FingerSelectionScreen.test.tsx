import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useEffect } from 'react'
import FingerSelectionScreen from './FingerSelectionScreen'
import { GameContextProvider, useGameDispatch } from '../state/GameContext'
import type { CardPack } from '../types'

// Helper to dispatch custom touch events
function fireTouchEvent(el: HTMLElement, type: string, touches: { identifier: number; clientX: number; clientY: number }[]) {
  const event = new CustomEvent(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'changedTouches', { value: touches })
  el.dispatchEvent(event)
}

// Test helper to seed settings dynamically after mount
function SettingsSeeder({ pack }: { pack: CardPack }) {
  const dispatch = useGameDispatch()
  useEffect(() => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { pack } })
  }, [dispatch, pack])
  return null
}

describe('FingerSelectionScreen', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('limits finger selection to 2 players when "couple" pack is selected', async () => {
    render(
      <GameContextProvider>
        <SettingsSeeder pack="couple" />
        <FingerSelectionScreen />
      </GameContextProvider>,
    )

    const container = screen.getByText('ဖုန်းစခရင်ပေါ်ကို လက်ချောင်းလေးတွေတင်လိုက်ကြပါ။').closest('.select-none') as HTMLElement

    // Place 1st finger
    fireTouchEvent(container, 'touchstart', [{ identifier: 1, clientX: 100, clientY: 100 }])
    await waitFor(() => {
      expect(screen.getByText('ကစားသမား 1 ယောက်')).toBeInTheDocument()
    })

    // Place 2nd finger
    fireTouchEvent(container, 'touchstart', [{ identifier: 2, clientX: 150, clientY: 150 }])
    await waitFor(() => {
      expect(screen.getByText('ကစားသမား 2 ယောက်')).toBeInTheDocument()
    })

    // Try to place a 3rd finger (should be ignored)
    fireTouchEvent(container, 'touchstart', [{ identifier: 3, clientX: 200, clientY: 200 }])

    // Wait to ensure no additional player is registered (count stays 2)
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(screen.getByText('ကစားသမား 2 ယောက်')).toBeInTheDocument()
    expect(screen.queryByText('ကစားသမား 3 ယောက်')).not.toBeInTheDocument()
  })

  it('allows up to 10 players for other packs (e.g. classic)', async () => {
    render(
      <GameContextProvider>
        <SettingsSeeder pack="classic" />
        <FingerSelectionScreen />
      </GameContextProvider>,
    )

    const container = screen.getByText('ဖုန်းစခရင်ပေါ်ကို လက်ချောင်းလေးတွေတင်လိုက်ကြပါ။').closest('.select-none') as HTMLElement

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
      expect(screen.getByText('ကစားသမား 3 ယောက်')).toBeInTheDocument()
    })
  })
})

