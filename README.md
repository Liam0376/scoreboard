# Scoreboard

Marcador para competencias entre equipos. Varios dispositivos se conectan
al mismo servidor y los puntajes se actualizan en tiempo real.

## Requisitos

- [Node.js](https://nodejs.org/) (v18 o superior) — incluye `npm`

## Instalación

```bash
git clone https://github.com/Liam0376/scoreboard.git
cd scoreboard
npm install
```

## Iniciar

```bash
npm start
```

Esto levanta el servidor en **http://localhost:3001**.

Cuando inicies, vas a ver algo como:

```
  ┌─────────────────────────────────────────────┐
  │           Scoreboard Server Listo            │
  ├─────────────────────────────────────────────┤
  │  Local:    http://localhost:3001            │
  │  Red:      http://192.168.1.XX:3001        │
  │                                             │
  │  Abrí la URL de "Red" en los celulares      │
  │  para registrar puntos desde otros           │
  │  dispositivos.                              │
  └─────────────────────────────────────────────┘
```

**Para usar desde otros dispositivos** (celulares, tabletas, otra compu),
abri la URL que dice "Red" en el navegador de cada dispositivo. Todos
muestran los mismos equipos y puntajes.

## Rutas

| Ruta          | Uso                                                     |
| ------------- | ------------------------------------------------------- |
| `/`           | Dashboard — ranking y gráfica de barras                 |
| `/mesas`      | Mesas — botones `+` / `−` para sumar/restar puntos     |
| `/proyeccion` | Vista para TV/proyector, sin controles, letras grandes  |
| `/admin`      | Crear/editar/eliminar equipos, reiniciar puntajes       |

**Tip:** Abrí `/proyeccion` en la pantalla del proyector o TV, y usá
`/mesas` en los celulares para registrar puntos.

## Cómo funciona

- El servidor (`server.ts`) guarda los equipos en un archivo `data.json`.
- Los dispositivos se conectan por WebSocket — los cambios se ven al
  instante en todos lados.
- Si se corta la conexión, se reconecta solo.
- Los datos persisten: si apagás y prendés el servidor, los puntajes
  siguen ahí.

## Desarrollo (para programadores)

Si querés modificar el código y ver los cambios al instante:

```bash
# Terminal 1 — el servidor
npm run server

# Terminal 2 — el dev server de Vite (hot reload)
npm run dev
```

Abrí http://localhost:5173 en el navegador.

## Build de producción

```bash
npm run build    # genera dist/
npm start        # levanta el servidor sirviendo dist/
```

## Stack

Vite + React 19 + TypeScript + Tailwind CSS v4 + React Router + WebSocket (ws)
