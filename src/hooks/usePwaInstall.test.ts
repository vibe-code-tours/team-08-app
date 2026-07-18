import { act, renderHook } from '@testing-library/react'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { usePwaInstall } from './usePwaInstall'

/** Restore navigator.userAgent, navigator.platform, and navigator.maxTouchPoints */
function restoreGlobals(
  originalUserAgent: PropertyDescriptor | undefined,
  originalPlatform: PropertyDescriptor | undefined,
  originalMaxTouchPoints: PropertyDescriptor | undefined,
) {
  if (originalUserAgent) {
    Object.defineProperty(navigator, 'userAgent', originalUserAgent)
  }
  if (originalPlatform) {
    Object.defineProperty(navigator, 'platform', originalPlatform)
  }
  if (originalMaxTouchPoints) {
    Object.defineProperty(navigator, 'maxTouchPoints', originalMaxTouchPoints)
  }
}

function setUserAgent(value: string) {
  Object.defineProperty(navigator, 'userAgent', { value, configurable: true })
}

function makeBeforeInstallPromptEvent(outcome: 'accepted' | 'dismissed' = 'accepted') {
  const event = new Event('beforeinstallprompt') as Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  }
  event.prompt = vi.fn().mockResolvedValue(undefined)
  event.userChoice = Promise.resolve({ outcome })
  return event
}

describe('usePwaInstall', () => {
  const originalUserAgent = Object.getOwnPropertyDescriptor(navigator, 'userAgent')
  const originalPlatform = Object.getOwnPropertyDescriptor(navigator, 'platform')
  const originalMaxTouchPoints = Object.getOwnPropertyDescriptor(navigator, 'maxTouchPoints')

  afterEach(() => {
    restoreGlobals(originalUserAgent, originalPlatform, originalMaxTouchPoints)
  })

  it('is installable by default in dev mode', () => {
    const { result } = renderHook(() => usePwaInstall())

    expect(result.current.isInstallable).toBe(true)
    expect(result.current.isInstalled).toBe(false)
  })

  it('detects iOS via userAgent', () => {
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')

    const { result } = renderHook(() => usePwaInstall())

    expect(result.current.isIOS).toBe(true)
  })

  it('does not report iOS for a standard desktop userAgent', () => {
    setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')

    const { result } = renderHook(() => usePwaInstall())

    expect(result.current.isIOS).toBe(false)
  })

  it('captures beforeinstallprompt and sets isInstallable', () => {
    const { result } = renderHook(() => usePwaInstall())
    const event = makeBeforeInstallPromptEvent()
    const preventDefault = vi.spyOn(event, 'preventDefault')

    act(() => {
      window.dispatchEvent(event)
    })

    expect(preventDefault).toHaveBeenCalled()
    expect(result.current.isInstallable).toBe(true)
  })

  it('marks the app installed and clears installability on appinstalled', () => {
    const { result } = renderHook(() => usePwaInstall())

    act(() => {
      window.dispatchEvent(makeBeforeInstallPromptEvent())
    })
    expect(result.current.isInstallable).toBe(true)

    act(() => {
      window.dispatchEvent(new Event('appinstalled'))
    })

    expect(result.current.isInstalled).toBe(true)
    expect(result.current.isInstallable).toBe(false)
  })

  it('install() prompts the captured event and marks installed on acceptance', async () => {
    const { result } = renderHook(() => usePwaInstall())
    const event = makeBeforeInstallPromptEvent('accepted')

    act(() => {
      window.dispatchEvent(event)
    })

    await act(async () => {
      await result.current.install()
    })

    expect(event.prompt).toHaveBeenCalled()
    expect(result.current.isInstalled).toBe(true)
    expect(result.current.isInstallable).toBe(false)
  })

  it('install() does not mark installed when the user dismisses the prompt', async () => {
    const { result } = renderHook(() => usePwaInstall())
    const event = makeBeforeInstallPromptEvent('dismissed')

    act(() => {
      window.dispatchEvent(event)
    })

    await act(async () => {
      await result.current.install()
    })

    expect(result.current.isInstalled).toBe(false)
    expect(result.current.isInstallable).toBe(false)
  })

  it('install() is a safe no-op when no prompt has been captured', async () => {
    const { result } = renderHook(() => usePwaInstall())

    await act(async () => {
      await result.current.install()
    })

    expect(result.current.isInstalled).toBe(false)
  })
})
