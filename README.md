# Academia - José Pisconte

Plataforma académica para ~60 alumnos con tablets Android (8,7", 4 GB RAM, horizontal), más paneles web para docentes y administradores.

Estado: **scaffolding base** con entorno local verificado (API, web, PostgreSQL, migración `init`, Metro). Solo hay pantallas de demostración y `GET /health`; la app móvil aún no se ha probado en un dispositivo Android. Ver [docs/PENDIENTES.md](docs/PENDIENTES.md).

## Requisitos

- Node.js 24.22.2 (ver `.node-version`)
- pnpm 10 (`corepack enable` y `corepack prepare pnpm@10.28.0 --activate`, o `npm i -g pnpm@10`)
- Docker + Docker Compose (solo para PostgreSQL)
- Para la app móvil en emulador/dispositivo: Android Studio + JDK 21 (ver `docs/DEVELOPMENT.md`)

## Primeros pasos

```bash
pnpm install                 # un único pnpm-lock.yaml en la raíz
cp .env.example .env         # opcional: personaliza credenciales de Postgres
cp apps/api/.env.example apps/api/.env
pnpm db:up                   # PostgreSQL en Docker (puerto 5432)
pnpm build:packages          # compila @academy/shared y @academy/api-client
pnpm dev                     # API (3000) + Web (5173) en paralelo
pnpm dev:mobile              # Expo (en otra terminal)
```

Comprobación rápida: `curl http://localhost:3000/health` → `{"status":"ok",...}`

## Estructura

```text
apps/
  api/      @academy/api         NestJS (REST) + Prisma
  web/      @academy/web         React + Vite + Tailwind (docentes/admin)
  mobile/   @academy/mobile      Expo + Expo Router (alumnos, Android)
packages/
  shared/      @academy/shared      Tipos y contratos (zod), sin dependencias nativas
  api-client/  @academy/api-client  Cliente HTTP mínimo (fetch) para web y móvil
docs/                              ARCHITECTURE, DEVELOPMENT, DECISIONS, SETUP, PENDIENTES, HANDOFF
compose.yaml                       Solo PostgreSQL
```

## Scripts (desde la raíz)

| Comando                                   | Qué hace                             |
| ----------------------------------------- | ------------------------------------ |
| `pnpm dev`                                | Compila paquetes y levanta API + Web |
| `pnpm dev:api` / `dev:web` / `dev:mobile` | Cada app por separado                |
| `pnpm build`                              | Paquetes + API + Web                 |
| `pnpm lint` / `pnpm typecheck`            | Todos los workspaces                 |
| `pnpm format` / `pnpm format:check`       | Prettier                             |
| `pnpm db:up` / `pnpm db:down`             | Inicia / detiene PostgreSQL          |

Excepción: `@academy/mobile` no tiene build de producción propio en este scaffold; `pnpm --filter @academy/mobile build` exporta el bundle JS de Android (comprobación). Los APK/AAB se generarán con EAS o Android Studio en una fase posterior.

## Puertos

| Servicio   | Puerto |
| ---------- | ------ |
| API        | 3000   |
| Web (Vite) | 5173   |
| PostgreSQL | 5432   |
| Expo Metro | 8081   |

## Variables de entorno

- **Servidor** (`apps/api/.env`, `.env`): `DATABASE_URL`, `API_PORT`, credenciales de Postgres. Nunca llegan al cliente.
- **Públicas del cliente**: `VITE_*` (web) y `EXPO_PUBLIC_*` (móvil) quedan **embebidas en el bundle**. No pongas secretos en ellas.

Más detalle en [DEVELOPMENT](docs/DEVELOPMENT.md), [ARCHITECTURE](docs/ARCHITECTURE.md), [DECISIONS](docs/DECISIONS.md), [SETUP](docs/SETUP.md) (estado del entorno), [PENDIENTES](docs/PENDIENTES.md) y [HANDOFF](docs/HANDOFF.md) (relevo entre agentes).
