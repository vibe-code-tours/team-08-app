import { useState, useEffect, useCallback, useRef } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Detects whether the app is already installed (running in standalone mode).
 */
function getIsInstalled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (window.matchMedia('(display-mode: standalone)').matches) return true
  } catch { /* matchMedia not available (e.g. jsdom) */ }
  return (navigator as { standalone?: boolean }).standalone === true
}

/**
 * Detects iOS Safari (where beforeinstallprompt never fires).
 */
function getIsIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

/**
 * Custom hook for PWA install prompt.
 *
 * Captures the browser's `beforeinstallprompt` event and exposes
 * an `install()` function. On iOS (where the event never fires),
 * returns `isIOS: true` so the UI can show manual instructions.
 */
export function usePwaInstall() {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)
  // In dev mode, show the button by default so the UI can be tested locally.
  // In production, only show after beforeinstallprompt fires.
  const [isInstallable, setIsInstallable] = useState(
    () => import.meta.env.DEV && !getIsInstalled(),
  )
  const [isInstalled, setIsInstalled] = useState(getIsInstalled)
  const isIOS = getIsIOS()

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e as BeforeInstallPromptEvent
      setIsInstallable(true)
    }

    const handleInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      deferredPrompt.current = null
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const install = useCallback(async () => {
    const prompt = deferredPrompt.current
    if (!prompt) {
      // Dev mode fallback — no real prompt available
      if (import.meta.env.DEV) {
        console.info('[PWA] Install prompt not available in dev mode. Deploy to HTTPS to test.')
      }
      return
    }

    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setIsInstalled(true)
    }
    deferredPrompt.current = null
    setIsInstallable(false)
  }, [])

  return { install, isInstallable, isInstalled, isIOS }
}
