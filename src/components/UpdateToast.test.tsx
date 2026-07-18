import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { UpdateToast } from './UpdateToast'

const setNeedRefresh = vi.fn()
const updateServiceWorker = vi.fn()
let needRefresh = false

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [false, vi.fn()],
    updateServiceWorker,
  }),
}))

describe('UpdateToast', () => {
  beforeEach(() => {
    needRefresh = false
    setNeedRefresh.mockClear()
    updateServiceWorker.mockClear()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders nothing when no update is available', () => {
    render(<UpdateToast />)
    expect(screen.queryByText('ပြန်ဖွင့်မည်')).not.toBeInTheDocument()
  })

  it('shows the tap-to-reload prompt when an update is ready', () => {
    needRefresh = true
    render(<UpdateToast />)
    expect(screen.getByText('ပြန်ဖွင့်မည်')).toBeInTheDocument()
  })

  it('activates the waiting service worker when the reload button is tapped', () => {
    needRefresh = true
    render(<UpdateToast />)

    fireEvent.click(screen.getByText('ပြန်ဖွင့်မည်'))

    expect(updateServiceWorker).toHaveBeenCalledWith(true)
  })

  it('dismisses the prompt without reloading when the close button is tapped', () => {
    needRefresh = true
    render(<UpdateToast />)

    fireEvent.click(screen.getByText('✕'))

    expect(setNeedRefresh).toHaveBeenCalledWith(false)
    expect(updateServiceWorker).not.toHaveBeenCalled()
  })
})
