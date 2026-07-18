declare module 'canvas-confetti' {
  type ConfettiOptions = {
    particleCount?: number
    spread?: number
    origin?: {
      x?: number
      y?: number
    }
    colors?: string[]
  }

  function confetti(options?: ConfettiOptions): void

  export default confetti
}
