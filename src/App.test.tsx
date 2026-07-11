import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the start screen', () => {
    render(<App />)
    expect(screen.getByText('Truth or Dare')).toBeInTheDocument()
    expect(screen.getByText('Start Game')).toBeInTheDocument()
  })
})
