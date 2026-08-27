import { createServer } from 'http'
import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { networkInterfaces } from 'os'
import { execSync } from 'child_process'
import { WebSocketServer, WebSocket } from 'ws'

// ─── Paths ───────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = resolve(__dirname, 'data.json')
const DIST_DIR = resolve(__dirname, 'dist')

// ─── Auto-build if dist/ is missing ──────────────────────────────────
if (!existsSync(DIST_DIR) || !existsSync(resolve(DIST_DIR, 'index.html'))) {
  console.log('  ⏳ dist/ no encontrado — construyendo...')
  execSync('npm run build', { cwd: __dirname, stdio: 'inherit' })
}

// ─── Data ────────────────────────────────────────────────────────────
type Team = { id: string; name: string; color: string; score: number }

const SEED: Team[] = [
  { id: crypto.randomUUID(), name: 'Rojo', color: '#ef4444', score: 0 },
  { id: crypto.randomUUID(), name: 'Azul', color: '#3b82f6', score: 0 },
  { id: crypto.randomUUID(), name: 'Verde', color: '#22c55e', score: 0 },
  { id: crypto.randomUUID(), name: 'Amarillo', color: '#eab308', score: 0 },
]

let teams: Team[] = SEED

async function loadData() {
  try {
    if (existsSync(DATA_FILE)) {
      const raw = await readFile(DATA_FILE, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) teams = parsed
    }
  } catch {
    console.log('  No se pudo leer data.json — usando datos de ejemplo')
  }
}

async function saveData() {
  await writeFile(DATA_FILE, JSON.stringify(teams, null, 2))
}

// ─── HTTP server (serves dist/) ──────────────────────────────────────
const http = createServer(async (req, res) => {
  // Status endpoint — useful for debugging
  if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ teams: teams.length, ok: true }))
    return
  }

  // Serve static files from dist/
  let filePath = resolve(DIST_DIR, req.url === '/' ? 'index.html' : req.url!)
  if (!existsSync(filePath)) {
    filePath = resolve(DIST_DIR, 'index.html') // SPA fallback
  }
  try {
    const content = await readFile(filePath)
    const ext = filePath.split('.').pop() || 'html'
    const types: Record<string, string> = {
      html: 'text/html',
      js: 'application/javascript',
      css: 'text/css',
      json: 'application/json',
      svg: 'image/svg+xml',
      png: 'image/png',
    }
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' })
    res.end(content)
  } catch {
    res.writeHead(404)
    res.end('Not found')
  }
})

// ─── WebSocket server ────────────────────────────────────────────────
const wss = new WebSocketServer({ server: http })

function broadcast() {
  const msg = JSON.stringify({ type: 'update', teams })
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg)
    }
  }
}

wss.on('connection', (ws) => {
  console.log(`  + Cliente conectado (${wss.clients.size} total)`)

  // Send current state immediately
  ws.send(JSON.stringify({ type: 'init', teams }))

  ws.on('message', async (raw) => {
    try {
      const msg = JSON.parse(raw.toString())

      switch (msg.type) {
        case 'addScore': {
          const t = teams.find((t) => t.id === msg.teamId)
          if (t) t.score = Math.max(0, t.score + msg.delta)
          break
        }
        case 'addTeam': {
          teams.push({
            id: crypto.randomUUID(),
            name: msg.name,
            color: msg.color,
            score: 0,
          })
          break
        }
        case 'updateTeam': {
          const t = teams.find((t) => t.id === msg.teamId)
          if (t && msg.patch) {
            if (msg.patch.name !== undefined) t.name = msg.patch.name
            if (msg.patch.color !== undefined) t.color = msg.patch.color
          }
          break
        }
        case 'removeTeam': {
          teams = teams.filter((t) => t.id !== msg.teamId)
          break
        }
        case 'resetScores': {
          teams = teams.map((t) => ({ ...t, score: 0 }))
          break
        }
        default:
          console.log('  Mensaje desconocido:', msg.type)
      }

      await saveData()
      broadcast()
    } catch (err) {
      console.error('  Error procesando mensaje:', err)
    }
  })

  ws.on('close', () => {
    console.log(`  - Cliente desconectado (${wss.clients.size} total)`)
  })
})

// ─── Start ───────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3001

await loadData()

http.listen(PORT, '0.0.0.0', () => {
  // Show local network IP so other devices can connect
  const nets = Object.values(networkInterfaces())
    .flat()
    .filter((n): n is NonNullable<typeof n> => !!n && n.family === 'IPv4' && !n.internal)
    .map((n) => n.address)

  console.log('')
  console.log('  ┌─────────────────────────────────────────────┐')
  console.log('  │           Scoreboard Server Listo            │')
  console.log('  ├─────────────────────────────────────────────┤')
  console.log(`  │  Local:    http://localhost:${PORT}            │`)
  if (nets.length > 0) {
    console.log(`  │  Red:      http://${nets[0]}:${PORT}   │`)
  }
  console.log('  │                                             │')
  console.log('  │  Abrí la URL de "Red" en los celulares     │')
  console.log('  │  para registrar puntos desde otros          │')
  console.log('  │  dispositivos.                              │')
  console.log('  └─────────────────────────────────────────────┘')
  console.log('')
})
