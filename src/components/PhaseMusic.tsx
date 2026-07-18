import { useEffect, useRef } from 'react'
import { Howler } from 'howler'
import { useGame } from '../state/GameContext.tsx'
import type { GamePhase } from '../types/index.ts'

/**
 * Background music tracks mapped to file paths under public/sounds/.
 * Add entries here when adding new BGM files.
 */
const MUSIC_FILES: Record<string, string> = {
  menu: '/sounds/bgm-menu.mp3',
  tension: '/sounds/bgm-tension.mp3',
  gameplay: '/sounds/bgm-gameplay.mp3',
}

/** Maps each game phase to a music track ID */
const PHASE_TO_TRACK: Record<GamePhase, string> = {
  start: 'menu',
  onboarding: 'menu',
  setup: 'menu',
  'finger-selection': 'tension',
  roulette: 'tension',
  'player-selected': 'tension',
  'truth-dare-choice': 'gameplay',
  'card-reveal': 'gameplay',
  voting: 'gameplay',
  result: 'gameplay',
  'next-round': 'menu',
}

const FADE_DURATION_MS = 1500
const MAX_VOLUME = 0.35

/**
 * Crossfade an Audio element from its current volume to `targetVol`
 * over FADE_DURATION_MS using requestAnimationFrame.
 * Returns a cancel function.
 */
function fadeAudio(
  audio: HTMLAudioElement,
  targetVol: number,
  durationMs: number,
): () => void {
  const startVol = audio.volume
  const startTime = performance.now()
  let raf: number

  const tick = () => {
    const elapsed = performance.now() - startTime
    const t = Math.min(elapsed / durationMs, 1)
    audio.volume = startVol + (targetVol - startVol) * t
    if (t < 1) {
      raf = requestAnimationFrame(tick)
    }
  }

  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}

// ─── Module-level singleton state (persists across PhaseMusic remounts) ─────

/** Cached Audio elements, one per track */
const audioEls = new Map<string, HTMLAudioElement>()

function getAudio(trackId: string): HTMLAudioElement | null {
  const src = MUSIC_FILES[trackId]
  if (!src) return null

  let audio = audioEls.get(trackId)
  if (!audio) {
    audio = new Audio(src)
    audio.loop = true
    audio.volume = 0
    audio.preload = 'auto'
    audioEls.set(trackId, audio)
  }
  return audio
}

/** Currently playing track (or null) */
let currentTrackId: string | null = null
/** Cancel function for the current fade animation */
let cancelFade: (() => void) | null = null

/**
 * Switch to a new track. Fades out the old one and fades in the new one.
 * If the same track is already playing, does nothing.
 */
function switchTrack(newTrackId: string, enabled: boolean) {
  // Same track already active — nothing to do
  if (currentTrackId === newTrackId) return

  // Cancel any in-progress fade
  if (cancelFade) {
    cancelFade()
    cancelFade = null
  }

  const oldTrackId = currentTrackId
  const oldAudio = oldTrackId ? audioEls.get(oldTrackId) : null

  // Fade out old track
  if (oldAudio && !oldAudio.paused) {
    fadeAudio(oldAudio, 0, FADE_DURATION_MS)
    const fadeId = newTrackId // capture for stale check
    setTimeout(() => {
      // Only stop if we haven't switched to yet another track
      if (currentTrackId !== fadeId) return
      oldAudio.pause()
      oldAudio.currentTime = 0
      oldAudio.volume = 0
    }, FADE_DURATION_MS + 50)
    // Don't override cancelFade — the old fade runs independently
  }

  currentTrackId = newTrackId

  if (!enabled) return

  const newAudio = getAudio(newTrackId)
  if (!newAudio) return

  // Start new track
  newAudio.volume = 0
  const playPromise = newAudio.play()
  if (playPromise) {
    playPromise.catch(() => {
      // Autoplay blocked — will be retried on next user gesture
    })
  }

  // Fade in
  cancelFade = fadeAudio(newAudio, MAX_VOLUME, FADE_DURATION_MS)
}

/**
 * Ensures the current track is playing (resumes after AudioContext unlock).
 * Called from the global gesture listener on the first user interaction.
 */
function ensureCurrentTrackPlaying(enabled: boolean) {
  if (!enabled || !currentTrackId) return
  const audio = getAudio(currentTrackId)
  if (!audio || !audio.paused) return

  audio.volume = 0
  audio.play().catch(() => {})
  cancelFade = fadeAudio(audio, MAX_VOLUME, FADE_DURATION_MS)
}

/**
 * Stops all music immediately (no fade).
 */
function stopAll() {
  if (cancelFade) {
    cancelFade()
    cancelFade = null
  }
  for (const audio of audioEls.values()) {
    audio.pause()
    audio.currentTime = 0
    audio.volume = 0
  }
  currentTrackId = null
}

/**
 * Manages background music based on the current game phase.
 * Uses raw HTML5 Audio elements with manual crossfading — no Howler
 * state machine to fight with.
 *
 * Module-level state persists across remounts so music doesn't stop
 * when PhaseMusic unmounts and remounts (e.g. round restart).
 *
 * Renders nothing — mount inside GameContextProvider.
 */
export function PhaseMusic() {
  const { phase, settings } = useGame()
  const musicEnabled = settings.musicEnabled

  // Refs for the gesture listener (registered once, reads latest values)
  const phaseRef = useRef(phase)
  const musicEnabledRef = useRef(musicEnabled)

  // No deps: must run every render to keep refs current for the gesture listener
  useEffect(() => {
    phaseRef.current = phase
    musicEnabledRef.current = musicEnabled
  })

  // Phase / musicEnabled changes → switch tracks
  useEffect(() => {
    const targetTrackId = PHASE_TO_TRACK[phase]
    if (targetTrackId) {
      switchTrack(targetTrackId, musicEnabled)
    }
  }, [phase, musicEnabled])

  // Stop all when music is disabled
  useEffect(() => {
    if (!musicEnabled) {
      stopAll()
    }
  }, [musicEnabled])

  // Global gesture listener — unlocks AudioContext and starts music on first interaction
  useEffect(() => {
    const handleGesture = () => {
      // Resume Howler's AudioContext (shared with SFX)
      try {
        const ctx = Howler.ctx
        if (ctx && ctx.state === 'suspended') {
          ctx.resume()
        }
      } catch { /* ignore */ }

      ensureCurrentTrackPlaying(musicEnabledRef.current)
    }

    const events = ['click', 'touchstart', 'pointerdown', 'keydown'] as const
    for (const event of events) {
      document.addEventListener(event, handleGesture, { passive: true })
    }

    return () => {
      for (const event of events) {
        document.removeEventListener(event, handleGesture)
      }
    }
  }, []) // Empty deps — registered once

  return null
}
