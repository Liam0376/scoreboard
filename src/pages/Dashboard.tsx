import { useTeams } from '../hooks/useTeams'
import { TeamCard } from '../components/TeamCard'
import { BarChart } from '../components/BarChart'

export function Dashboard() {
  const { teams } = useTeams()
  const ranked = [...teams].sort((a, b) => b.score - a.score)

  if (teams.length === 0) {
    return (
      <div className="p-8 text-center text-neutral-400">
        No hay equipos todavía. Andá a{' '}
        <a href="/admin" className="underline text-white">
          Admin
        </a>{' '}
        para crear uno.
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Clasificación</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ranked.map((t, i) => (
          <TeamCard key={t.id} team={t} rank={i} />
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-neutral-200 mb-4">
          Comparación de puntajes
        </h2>
        <BarChart teams={ranked} />
      </div>
    </div>
  )
}
