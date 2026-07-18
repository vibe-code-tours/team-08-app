import { ResultDisplay } from '../components/ResultDisplay.tsx'

function ResultScreen() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900" />
      <div className="z-10 w-full max-w-md">
        <ResultDisplay />
      </div>
    </main>
  )
}

export default ResultScreen
