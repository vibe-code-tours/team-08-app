import { useEffect } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import App, { ActiveScreen } from './App'
import { GameContextProvider, useGameContext, loadSettings } from './state/GameContext'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the start screen by default', () => {
    render(<App />)
    expect(screen.getByText('Truth or Dare')).toBeInTheDocument()
  })

  it('routes to finger-selection screen after START_GAME', () => {
    function Harness() {
      const { dispatch } = useGameContext()
      useEffect(() => {
        dispatch({ type: 'START_GAME' })
      }, [dispatch])
      return null
    }

    render(
      <GameContextProvider>
        <Harness />
        <ActiveScreen />
      </GameContextProvider>,
    )

    expect(screen.getByText('Place your fingers!')).toBeInTheDocument()
  })

  it('persists a GameSettings change to localStorage across a simulated reload', () => {
    function Harness() {
      const { dispatch } = useGameContext()
      useEffect(() => {
        dispatch({ type: 'UPDATE_SETTINGS', payload: { difficulty: 'hard' } })
      }, [dispatch])
      return null
    }

    render(
      <GameContextProvider>
        <Harness />
      </GameContextProvider>,
    )

    // Simulate a fresh page reload: a brand new call to loadSettings() must
    // reflect the persisted change (round-trip through localStorage).
    const reloaded = loadSettings()
    expect(reloaded.difficulty).toBe('hard')
  })
})
