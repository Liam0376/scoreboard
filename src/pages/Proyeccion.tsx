import { useState } from 'react'
import { useTeams } from '../hooks/useTeams'

export function Proyeccion() {
  const { teams } = useTeams()
  const ranked = [...teams].sort((a, b) => b.score - a.score)
  const [isFullscreen, setIsFullscreen] = useState(false)

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col p-10">
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 text-neutral-500 hover:text-white text-sm px-3 py-1 rounded-lg border border-neutral-800"
      >
        {isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
      </button>

      <div className="flex-1 flex flex-col justify-center gap-6 max-w-6xl mx-auto w-full">
        {ranked.map((t, i) => (
          <div
            key={t.id}
            className="flex items-center gap-8 rounded-2xl px-10 py-6 transition-all duration-500"
            style={{
              background: `${t.color}22`,
              borderLeft: `10px solid ${t.color}`,
            }}
          >
            <span className="text-5xl font-black text-neutral-500 w-16 tabular-nums">
              {i + 1}
            </span>
            <span
              className="inline-block rounded-full shrink-0"
              style={{ width: 32, height: 32, background: t.color }}
            />
            <span className="flex-1 text-6xl font-bold text-white truncate">
              {t.name}
            </span>
            <span
              className="text-8xl font-black tabular-nums"
              style={{ color: t.color }}
            >
              {t.score}
            </span>
          </div>
        ))}
        {ranked.length === 0 && (
          <p className="text-center text-4xl text-neutral-600">
            Sin equipos todavía
          </p>
        )}
      </div>
    </div>
  )
}
