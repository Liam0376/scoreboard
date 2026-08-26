import type { Team } from '../types'

export function BarChart({ teams }: { teams: Team[] }) {
  const max = Math.max(1, ...teams.map((t) => t.score))
  return (
    <div className="space-y-3">
      {teams.map((t) => (
        <div key={t.id} className="flex items-center gap-3">
          <span className="w-28 truncate text-sm text-neutral-300">
            {t.name}
          </span>
          <div className="flex-1 h-6 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(t.score / max) * 100}%`,
                background: t.color,
              }}
            />
          </div>
          <span className="w-10 text-right font-mono text-sm text-neutral-300">
            {t.score}
          </span>
        </div>
      ))}
    </div>
  )
}
