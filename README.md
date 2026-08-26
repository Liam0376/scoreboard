# Scoreboard

Marcador local para competencias entre equipos. Sin servidor, sin login —
todo corre en el navegador y los puntajes se guardan en `localStorage`.

## Instalación

```bash
npm install
```

## Ejecutar en local

```bash
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

## Rutas

| Ruta          | Uso                                                      |
| ------------- | --------------------------------------------------------- |
| `/`           | Dashboard — ranking, tarjetas y gráfica de barras         |
| `/mesas`      | Mesas — botones grandes `+` / `−` para sumar/restar puntos |
| `/proyeccion` | Vista para TV/proyector, sin controles, letras grandes    |
| `/admin`      | Crear/editar/eliminar equipos, reiniciar puntajes          |

Abrí `/mesas` y `/proyeccion` en pestañas o ventanas separadas — los
puntajes se sincronizan solos entre ellas (evento `storage` del navegador).
Si abrís `/proyeccion` en una segunda pantalla, usá el botón "Pantalla
completa" de esa vista.

## Datos

Los equipos se guardan bajo la clave `scoreboard:teams` en `localStorage`
del navegador. Se cargan 4 equipos de ejemplo la primera vez. Borrar el
`localStorage` del sitio reinicia todo desde cero.

## Compartir por WhatsApp (sin instalar nada)

```bash
npm run build
```

Genera **un solo archivo**: `dist/index.html` (todo el JS/CSS va
embebido adentro). Mandá ese archivo por WhatsApp — tus colegas lo
abren haciendo doble clic, sin `npm install`, sin terminal, sin
servidor. Las rutas usan `#/mesas`, `#/admin`, etc. (hash routing),
necesario para que funcione desde `file://`.

Los puntajes siguen guardándose en `localStorage`, así que solo se
sincronizan entre pestañas abiertas del **mismo archivo en el mismo
navegador** — igual que corriendo `npm run dev`, no hay sync entre
distintas compus/celulares.

## Build de producción (con servidor)

```bash
npm run build
npm run preview
```

## Stack

Vite + React 18 + TypeScript + Tailwind CSS v4 + React Router (HashRouter).
