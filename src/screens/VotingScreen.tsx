import { motion } from 'motion/react'
import { VotingPanel } from '../components/VotingPanel.tsx'
import { useGame } from '../state/GameContext.tsx'

function VotingScreen() {
  const { selectedPlayer } = useGame()

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 mb-6 text-center"
      >
        <p className="text-sm font-semibold uppercase text-white/50">
          {selectedPlayer?.label ?? 'Player'}
        </p>
        <h1
          className="mt-2 text-3xl font-black"
          style={{ textShadow: '0 0 24px rgba(168,85,247,0.65)' }}
        >
          Vote the result
        </h1>
      </motion.div>

      <VotingPanel className="z-10" />
    </main>
  )
}

export default VotingScreen
