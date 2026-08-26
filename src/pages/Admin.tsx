import { useState } from 'react'
import { useTeams } from '../hooks/useTeams'
import type { Team } from '../types'

const DEFAULT_COLOR = '#8b5cf6'

export function Admin() {
  const { teams, addTeam, updateTeam, removeTeam, resetScores } = useTeams()
  const [name, setName] = useState('')
  const [color, setColor] = useState(DEFAULT_COLOR)
  const [confirmingReset, setConfirmingReset] = useState(false)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addTeam(name.trim(), color)
    setName('')
    setColor(DEFAULT_COLOR)
  }

  function handleReset() {
    resetScores()
    setConfirmingReset(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Administración</h1>

      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-end gap-3 bg-neutral-900 border border-neutral-800 rounded-2xl p-5"
      >
        <div className="flex-1 min-w-[160px]">
          <label className="block text-sm text-neutral-400 mb-1">
            Nombre del equipo
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Los Halcones"
            className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-400 mb-1">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-16 rounded-lg bg-neutral-800 border border-neutral-700"
          />
        </div>
        <button
          type="submit"
          className="h-10 px-5 rounded-lg bg-white text-neutral-900 font-semibold"
        >
          Agregar equipo
        </button>
      </form>

      <div className="space-y-3">
        {teams.map((t) => (
          <TeamRow
            key={t.id}
            team={t}
            onUpdate={(patch) => updateTeam(t.id, patch)}
            onRemove={() => removeTeam(t.id)}
          />
        ))}
        {teams.length === 0 && (
          <p className="text-neutral-500">No hay equipos todavía.</p>
        )}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        {!confirmingReset ? (
          <button
            onClick={() => setConfirmingReset(true)}
            className="text-red-400 hover:text-red-300 font-medium"
          >
            Reiniciar todos los puntajes
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-neutral-200">
              ¿Seguro? Esto pone todos los puntajes en 0.
            </span>
            <button
              onClick={handleReset}
              className="px-4 py-1.5 rounded-lg bg-red-500 text-white font-semibold"
            >
              Sí, reiniciar
            </button>
            <button
              onClick={() => setConfirmingReset(false)}
              className="px-4 py-1.5 rounded-lg bg-neutral-800 text-neutral-300"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function TeamRow({
  team,
  onUpdate,
  onRemove,
}: {
  team: Team
  onUpdate: (patch: Partial<Pick<Team, 'name' | 'color'>>) => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3">
      <input
        type="color"
        value={team.color}
        onChange={(e) => onUpdate({ color: e.target.value })}
        className="h-9 w-9 rounded-md bg-neutral-800 border border-neutral-700 shrink-0"
      />
      <input
        value={team.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        className="flex-1 rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-white"
      />
      <span className="font-mono text-neutral-400 w-12 text-right">
        {team.score}
      </span>
      <button
        onClick={onRemove}
        className="text-neutral-500 hover:text-red-400 px-2"
        aria-label="Eliminar equipo"
      >
        ✕
      </button>
    </div>
  )
}
