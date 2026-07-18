import type { Difficulty } from '../types/index.ts'

type DifficultyBadgeProps = {
  difficulty: Difficulty
  className?: string
}

const difficultyStyles: Record<Difficulty, { label: string; color: string; bg: string }> = {
  easy: { label: 'Easy', color: '#50BF3A', bg: 'rgba(80,191,58,0.15)' },
  medium: { label: 'Medium', color: '#F4CC50', bg: 'rgba(244,204,80,0.15)' },
  hard: { label: 'Hard', color: '#E9243D', bg: 'rgba(233,36,61,0.15)' },
  all: { label: 'All', color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
}

/**
 * Small badge showing difficulty level with matching color.
 */
export function DifficultyBadge({ difficulty, className = '' }: DifficultyBadgeProps) {
  const { label, color, bg } = difficultyStyles[difficulty]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
      style={{
        color,
        backgroundColor: bg,
        border: `1px solid ${color}40`,
        textShadow: `0 0 8px ${color}40`,
      }}
    >
      {label}
    </span>
  )
}
