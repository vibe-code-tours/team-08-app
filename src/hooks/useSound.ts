import { useCallback } from 'react'
import { useGame } from '../state/GameContext.tsx'

// ─── Web Audio API SFX manager ──────────────────────────────────────────────
// Fully self-contained — no external audio library dependency.

const BASE = import.meta.env.BASE_URL as string

const SFX_FILES: Record<string, string> = {
  tap: `${BASE}sounds/tap.mp3`,
  countdown: `${BASE}sounds/countdown.mp3`,
  'roulette-tick': `${BASE}sounds/roulette-tick.mp3`,
  winner: `${BASE}sounds/winner.mp3`,
  'coin-flip': `${BASE}sounds/coin-flip.mp3`,
  'card-flip': `${BASE}sounds/card-flip.mp3`,
  'timer-tick': `${BASE}sounds/timer-tick.mp3`,
  'time-up': `${BASE}sounds/time-up.mp3`,
  vote: `${BASE}sounds/vote.mp3`,
  celebrate: `${BASE}sounds/celebrate.mp3`,
  fail: `${BASE}sounds/fail.mp3`,
  fanfare: `${BASE}sounds/fanfare.mp3`,
}

let audioCtx: AudioContext | null = null
const audioBuffers = new Map<string, AudioBuffer>()
const activeSources = new Set<AudioBufferSourceNode>()
/** In-flight fetch+decode promises — deduplicates rapid calls for the same sound */
const inflight = new Map<string, Promise<AudioBuffer | null>>()

/**
 * Returns the shared AudioContext, creating it lazily on first call.
 * Also exported so PhaseMusic can share the same context.
 */
export function getSharedAudioContext(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

/** Unlock AudioContext on first user gesture — call from any click/touch handler */
export function unlockSfx() {
  const ctx = getSharedAudioContext()
  if (!ctx) return
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
}

/** Preload and decode all SFX into memory (call once at app startup) */
export async function preloadSfx(): Promise<void> {
  const ctx = getSharedAudioContext()
  if (!ctx) return
  const entries = Object.entries(SFX_FILES)

  await Promise.allSettled(
    entries.map(async ([id, src]) => {
      if (audioBuffers.has(id)) return
      try {
        const res = await fetch(src)
        if (!res.ok) return
        const arrayBuf = await res.arrayBuffer()
        const buf = await ctx.decodeAudioData(arrayBuf)
        audioBuffers.set(id, buf)
      } catch {
        // Silently skip — will retry on next play attempt
      }
    }),
  )
}

/** Fetch + decode a single SFX file, with in-flight dedup */
async function fetchAndDecode(id: string): Promise<AudioBuffer | null> {
  // Return cached buffer immediately
  const cached = audioBuffers.get(id)
  if (cached) return cached

  // Return existing in-flight request (dedup)
  const existing = inflight.get(id)
  if (existing) return existing

  const src = SFX_FILES[id]
  if (!src) return null

  const ctx = getSharedAudioContext()
  if (!ctx) return null

  const promise = (async (): Promise<AudioBuffer | null> => {
    try {
      if (ctx.state === 'suspended') await ctx.resume()
      const res = await fetch(src)
      if (!res.ok) return null
      const arrayBuf = await res.arrayBuffer()
      const buffer = await ctx.decodeAudioData(arrayBuf)
      audioBuffers.set(id, buffer)
      return buffer
    } catch {
      return null
    } finally {
      inflight.delete(id)
    }
  })()

  inflight.set(id, promise)
  return promise
}

/** Play a decoded SFX buffer */
function playBuffer(id: string, volume = 1.0) {
  const ctx = getSharedAudioContext()
  if (!ctx) return
  const buffer = audioBuffers.get(id)
  if (!buffer) {
    // Not preloaded yet — fetch+decode+play asynchronously
    void fetchAndDecode(id).then((buf) => {
      if (buf) playBufferFromBuf(ctx, buf, volume)
    })
    return
  }

  playBufferFromBuf(ctx, buffer, volume)
}

function playBufferFromBuf(ctx: AudioContext, buffer: AudioBuffer, volume: number) {
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

function stopAllSfx() {
  for (const source of activeSources) {
    try { source.stop() } catch { /* already stopped */ }
  }
  activeSources.clear()
}

// ─── Preload on import (runs once when module is first loaded) ──────────────

/** Delay before starting SFX preload (lets AudioContext settle) */
const PRELOAD_DELAY_MS = 50

setTimeout(() => { void preloadSfx() }, PRELOAD_DELAY_MS)

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
      unlockSfx()
      playBuffer(id, volume)
    },
    [soundEnabled],
  )

  const stop = useCallback(() => {
    stopAllSfx()
  }, [])

  return { play, stop }
}
