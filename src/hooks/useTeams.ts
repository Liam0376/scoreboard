import { useCallback, useEffect, useState } from 'react'
import type { Team } from '../types'

const STORAGE_KEY = 'scoreboard:teams'

const SEED_TEAMS: Team[] = [
  { id: crypto.randomUUID(), name: 'Rojo', color: '#ef4444', score: 0 },
  { id: crypto.randomUUID(), name: 'Azul', color: '#3b82f6', score: 0 },
  { id: crypto.randomUUID(), name: 'Verde', color: '#22c55e', score: 0 },
  { id: crypto.randomUUID(), name: 'Amarillo', color: '#eab308', score: 0 },
]

function loadTeams(): Team[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return SEED_TEAMS
    const parsed = JSON.parse(raw) as Team[]
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED_TEAMS
    return parsed
  } catch {
    return SEED_TEAMS
  }
}

function saveTeams(teams: Team[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams))
}

/**
 * Single source of truth for team data, backed by localStorage.
 * Syncs across tabs/windows via the `storage` event — that's how
 * dashboard, mesas, and proyección all stay live without a server.
 */
export function useTeams() {
  const [teams, setTeams] = useState<Team[]>(() => loadTeams())

  useEffect(() => {
    saveTeams(teams)
  }, [teams])

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY || e.newValue === null) return
      try {
        setTeams(JSON.parse(e.newValue) as Team[])
      } catch {
        // ignore malformed writes from elsewhere
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addScore = useCallback((id: string, delta: number) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, score: Math.max(0, t.score + delta) } : t,
      ),
    )
  }, [])

  const addTeam = useCallback((name: string, color: string) => {
    setTeams((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, color, score: 0 },
    ])
  }, [])

  const updateTeam = useCallback(
    (id: string, patch: Partial<Pick<Team, 'name' | 'color'>>) => {
      setTeams((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      )
    },
    [],
  )

  const removeTeam = useCallback((id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const resetScores = useCallback(() => {
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })))
  }, [])

  return { teams, addScore, addTeam, updateTeam, removeTeam, resetScores }
}
