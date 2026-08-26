import { useTeams } from '../hooks/useTeams'
import { TeamCard } from '../components/TeamCard'
import { ScoreButtons } from '../components/ScoreButtons'

export function Mesas() {
  const { teams, addScore } = useTeams()

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Registro de puntos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {teams.map((t) => (
          <TeamCard key={t.id} team={t}>
            <ScoreButtons onChange={(delta) => addScore(t.id, delta)} />
          </TeamCard>
        ))}
      </div>
    </div>
  )
}
