import { useState } from 'react'

type Props = {
  onChange: (delta: number) => void
  step?: number
}

export function ScoreButtons({ onChange, step = 1 }: Props) {
  const [pulse, setPulse] = useState<'up' | 'down' | null>(null)

  function fire(delta: number, dir: 'up' | 'down') {
    onChange(delta)
    setPulse(dir)
    window.setTimeout(() => setPulse(null), 200)
  }

  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={() => fire(-step, 'down')}
        className={`flex-1 h-14 rounded-xl text-2xl font-bold bg-neutral-800 text-neutral-100 active:scale-95 transition-transform ${
          pulse === 'down' ? 'ring-2 ring-red-400' : ''
        }`}
        aria-label="Restar punto"
      >
        −
      </button>
      <button
        onClick={() => fire(step, 'up')}
        className={`flex-1 h-14 rounded-xl text-2xl font-bold bg-white text-neutral-900 active:scale-95 transition-transform ${
          pulse === 'up' ? 'ring-2 ring-emerald-400' : ''
        }`}
        aria-label="Sumar punto"
      >
        +
      </button>
    </div>
  )
}
