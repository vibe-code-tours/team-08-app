import type { CardPack } from '../types/index.ts'

type PackBadgeProps = {
  pack: CardPack
  className?: string
}

const packStyles: Record<CardPack, { label: string; icon: string; color: string; bg: string }> = {
  friends: { label: 'သူငယ်ချင်း', icon: '👫', color: '#40A1E9', bg: 'rgba(64,161,233,0.15)' },
  couple: { label: 'သမီးရည်းစား', icon: '❤️', color: '#E02B96', bg: 'rgba(224,43,150,0.15)' },
  family: { label: 'မိသားစု', icon: '👨‍👩‍👧', color: '#50BF3A', bg: 'rgba(80,191,58,0.15)' },
  classic: { label: 'ရိုးရိုး', icon: '🎯', color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
}

/**
 * Small badge showing card pack with icon and color.
 */
export function PackBadge({ pack, className = '' }: PackBadgeProps) {
  const { label, icon, color, bg } = packStyles[pack]

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
      style={{
        color,
        backgroundColor: bg,
        border: `1px solid ${color}40`,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  )
}
