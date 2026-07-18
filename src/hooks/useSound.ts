import { useCallback } from 'react'
import { Howler } from 'howler'
import { useGame } from '../state/GameContext.tsx'

// ─── Web Audio API SFX manager ──────────────────────────────────────────────
// Bypasses howler for sound effects to avoid AudioContext lifecycle issues.
// Howler is still used for BGM (music tracks) via PhaseMusic.

const SFX_FILES: Record<string, string> = {
  tap: '/sounds/tap.mp3',
  countdown: '/sounds/countdown.mp3',
  'roulette-tick': '/sounds/roulette-tick.mp3',
  winner: '/sounds/winner.mp3',
  'coin-flip': '/sounds/coin-flip.mp3',
  'card-flip': '/sounds/card-flip.mp3',
  'timer-tick': '/sounds/timer-tick.mp3',
  'time-up': '/sounds/time-up.mp3',
  vote: '/sounds/vote.mp3',
  celebrate: '/sounds/celebrate.mp3',
  fail: '/sounds/fail.mp3',
  fanfare: '/sounds/fanfare.mp3',
}

// Increase howler's HTML5 Audio pool for music tracks (BGM uses html5: true)
Howler.html5PoolSize = 8
Howler.autoSuspend = false

let audioCtx: AudioContext | null = null
const audioBuffers = new Map<string, AudioBuffer>()
const activeSources = new Set<AudioBufferSourceNode>()

function getCtx(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

/** Unlock AudioContext on first user gesture — call from any click/touch handler */
export function unlockSfx() {
  const ctx = getCtx()
  if (!ctx) return
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
}

/** Preload and decode all SFX into memory (call once at app startup) */
export async function preloadSfx(): Promise<void> {
  const ctx = getCtx()
  if (!ctx) return
  const entries = Object.entries(SFX_FILES)

  await Promise.allSettled(
    entries.map(async ([id, src]) => {
      if (audioBuffers.has(id)) return
      try {
        const res = await fetch(src)
        if (!res.ok) return
        const arrayBuf = await res.arrayBuffer()
        // decodeAudioData works even when context is suspended
        const buf = await ctx.decodeAudioData(arrayBuf)
        audioBuffers.set(id, buf)
      } catch {
        // Silently skip — will retry on next play attempt
      }
    }),
  )
}

/** Play a decoded SFX buffer */
function playBuffer(id: string, volume = 1.0) {
  const ctx = getCtx()
  if (!ctx) return
  const buffer = audioBuffers.get(id)
  if (!buffer) {
    // Not preloaded yet — try a quick fetch+decode+play
    void quickPlay(id, volume)
    return
  }

  // Resume context if suspended (must be inside user gesture)
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  const source = ctx.createBufferSource()
  const gain = ctx.createGain()
  source.buffer = buffer
  gain.gain.value = volume
  source.connect(gain).connect(ctx.destination)

  activeSources.add(source)
  source.onended = () => {
    activeSources.delete(source)
    source.disconnect()
    gain.disconnect()
  }
  source.start()
}

/** Quick fetch + decode + play for sounds not yet preloaded */
async function quickPlay(id: string, volume: number) {
  const src = SFX_FILES[id]
  if (!src) return

  const ctx = getCtx()
  if (!ctx) return
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }

  try {
    const res = await fetch(src)
    if (!res.ok) return
    const arrayBuf = await res.arrayBuffer()
    const buffer = await ctx.decodeAudioData(arrayBuf)
    audioBuffers.set(id, buffer)

    // Play immediately
    const source = ctx.createBufferSource()
    const gain = ctx.createGain()
    source.buffer = buffer
    gain.gain.value = volume
    source.connect(gain).connect(ctx.destination)
    activeSources.add(source)
    source.onended = () => {
      activeSources.delete(source)
      source.disconnect()
      gain.disconnect()
    }
    source.start()
  } catch {
    // Fail silently
  }
}

function stopAllSfx() {
  for (const source of activeSources) {
    try { source.stop() } catch { /* already stopped */ }
  }
  activeSources.clear()
}

// ─── Preload on import (runs once when module is first loaded) ──────────────
// Uses the same AudioContext as howler (via Howler.ctx) if available,
// otherwise creates its own. This ensures SFX and BGM share a context
// that gets unlocked together on user gesture.

/** Delay before retrying Howler context share (Howler initializes lazily) */
const HOWLER_CTX_RETRY_MS = 100
/** Delay before starting SFX preload (lets AudioContext settle) */
const PRELOAD_DELAY_MS = 50

;(function initSharedCtx() {
  // Tap into howler's AudioContext if it exists, so SFX and BGM share the
  // same context — one unlock resumes both.
  const tryShareCtx = () => {
    try {
      const howlerCtx = Howler.ctx
      if (howlerCtx && !audioCtx) {
        audioCtx = howlerCtx as AudioContext
      }
    } catch { /* ignore */ }
  }
  // Try immediately (howler may not be initialized yet)
  tryShareCtx()
  // Also try after a short delay (howler initializes lazily)
  setTimeout(tryShareCtx, HOWLER_CTX_RETRY_MS)
  // Kick off preload after a brief delay to let context settle
  setTimeout(() => { void preloadSfx() }, PRELOAD_DELAY_MS)
})()

/**
 * Hook for playing game sound effects via Web Audio API.
 *
 * Usage:
 *   const { play, stop } = useSound()
 *   play('winner')
 *   stop('roulette-tick')
 *
 * Sounds are silent when `settings.soundEnabled` is false.
 * Missing audio files fail gracefully.
 */
export function useSound() {
  const { settings } = useGame()
  const soundEnabled = settings.soundEnabled

  const play = useCallback(
    (id: string, volume = 1.0) => {
      if (!soundEnabled) return
      // Ensure context is running (must be inside user gesture)
      unlockSfx()
      playBuffer(id, volume)
    },
    [soundEnabled],
  )

  const stop = useCallback(() => {
    stopAllSfx()
  }, [])

  const stopAll = useCallback(() => {
    stopAllSfx()
    Howler.stop()
  }, [])

  return { play, stop, stopAll }
}
