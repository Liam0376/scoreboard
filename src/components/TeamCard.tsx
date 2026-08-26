import type { Team } from '../types'

type Props = {
  team: Team
  rank?: number
  large?: boolean
  children?: React.ReactNode
}

const RANK_BADGE = ['🥇', '🥈', '🥉']

export function TeamCard({ team, rank, large, children }: Props) {
  return (
    <div
      className={`relative rounded-2xl border border-neutral-800 bg-neutral-900 shadow-lg overflow-hidden transition-transform ${
        large ? 'p-8' : 'p-5'
      }`}
      style={{ borderLeft: `6px solid ${team.color}` }}
    >
      {rank !== undefined && rank < 3 && (
        <span className="absolute top-3 right-4 text-2xl">
          {RANK_BADGE[rank]}
        </span>
      )}
      <div className="flex items-center gap-3 mb-2">
        <span
          className="inline-block rounded-full"
          style={{
            width: large ? 20 : 14,
            height: large ? 20 : 14,
            background: team.color,
          }}
        />
        <h3
          className={`font-semibold text-neutral-100 truncate ${
            large ? 'text-3xl' : 'text-lg'
          }`}
        >
          {team.name}
        </h3>
      </div>
      <p
        className={`font-black tabular-nums ${large ? 'text-7xl' : 'text-4xl'}`}
        style={{ color: team.color }}
      >
        {team.score}
      </p>
      {children}
    </div>
  )
}
