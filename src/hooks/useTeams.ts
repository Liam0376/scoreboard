import { useCallback, useEffect, useRef, useState } from 'react'
import type { Team } from '../types'

/**
 * Detect where the WebSocket server is.
 *
 * - Vite dev server runs on :5173, WebSocket server on :3001 → use localhost:3001
 * - Production: server serves both HTTP and WS on the same port → use current host
 */
function getWsUrl(): string {
  const loc = window.location
  if (loc.hostname === 'localhost' || loc.hostname === '127.0.0.1') {
    return 'ws://localhost:3001'
  }
  const proto = loc.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${loc.hostname}:3001`
}

/**
 * Hook that connects to the scoreboard server via WebSocket.
 *
 * Same API as the old localStorage-based hook — every page that called
 * `useTeams()` works unchanged.
 */
export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  // ── Connect ────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true
    let reconnectTimer: ReturnType<typeof setTimeout>

    function connect() {
      if (!alive) return

      const ws = new WebSocket(getWsUrl())
      wsRef.current = ws

      ws.onopen = () => {
        console.log('[scoreboard] Conectado al servidor')
      }

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data)
          if (msg.type === 'init' || msg.type === 'update') {
            setTeams(msg.teams)
          }
        } catch {
          // ignore malformed messages
        }
      }

      ws.onclose = () => {
        if (!alive) return
        console.log('[scoreboard] Desconectado — reconectando en 2 s…')
        reconnectTimer = setTimeout(connect, 2000)
      }

      ws.onerror = () => {
        ws.close()
      }
    }

    connect()

    return () => {
      alive = false
      clearTimeout(reconnectTimer)
      wsRef.current?.close()
    }
  }, [])

  // ── Helpers ────────────────────────────────────────────────────────
  function send(msg: object) {
    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg))
    }
  }

  // ── Actions (same signature as the old hook) ───────────────────────
  const addScore = useCallback((id: string, delta: number) => {
    send({ type: 'addScore', teamId: id, delta })
  }, [])

  const addTeam = useCallback((name: string, color: string) => {
    send({ type: 'addTeam', name, color })
  }, [])

  const updateTeam = useCallback(
    (id: string, patch: Partial<Pick<Team, 'name' | 'color'>>) => {
      send({ type: 'updateTeam', teamId: id, patch })
    },
    [],
  )

  const removeTeam = useCallback((id: string) => {
    send({ type: 'removeTeam', teamId: id })
  }, [])

  const resetScores = useCallback(() => {
    send({ type: 'resetScores' })
  }, [])

  return { teams, addScore, addTeam, updateTeam, removeTeam, resetScores }
}
