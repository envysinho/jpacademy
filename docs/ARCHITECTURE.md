# Arquitectura

Monorepo pnpm con tres aplicaciones y dos paquetes compartidos.

```text
 mobile (Expo) ─┐                      ┌─> shared (zod: contratos, tipos)
                ├─> api-client ───────>│
 web (Vite) ────┘        │             └──────────────┐
                         ▼ HTTP                       │
                   api (NestJS) ──> Prisma ──> PostgreSQL
                         └───────── usa shared ───────┘
```

## Reglas de dependencias

- `apps/*` pueden depender de `packages/*`. Los paquetes **nunca** dependen de apps.
- `@academy/shared` solo contiene TypeScript y `zod`: sin NestJS, Node-only ni React Native. Es seguro importarlo desde móvil, web y API.
- `@academy/api-client` usa `fetch` (disponible en navegador y React Native). No depende de NestJS.
- La app móvil y la web **no** importan de `apps/api`; comparten solo contratos vía `@academy/shared`.

## Contratos

Los contratos se definen una vez como esquema `zod` en `packages/shared/src` y el tipo TS se infiere (`z.infer`). Ejemplo: `healthResponseSchema` / `HealthResponse`. El API tipa su respuesta con el tipo; el cliente valida la respuesta con el esquema.

## Paquetes compartidos: formato de salida

`shared` y `api-client` se compilan con `tsc` a **CommonJS + `.d.ts`** en `dist/`, porque NestJS (CJS) los ejecuta con Node. Metro (Expo) los consume sin ajustes. Vite los pre-empaqueta en dev (`optimizeDeps.include`). Tras cambiar un paquete hay que recompilar (`pnpm build:packages`) o ejecutar su `dev` (`tsc --watch`).

## API (`apps/api`)

- `src/modules/<dominio>/` un módulo NestJS por dominio (hoy solo `health`). Crea `auth`, `users`, `courses`, etc. aquí cuando se implementen.
- `src/common/` filtros, guards, interceptores transversales. `src/config/` lectura de entorno.
- `prisma/schema.prisma` esquema; el cliente se genera en `apps/api/generated/prisma` (no versionado). `prisma.config.ts` define la URL de base de datos (Prisma 7).
- Aún no hay conexión a base de datos en tiempo de ejecución: `/health` no depende de Postgres.

## Web (`apps/web`)

`src/app` (raíz), `src/layouts`, `src/features/<dominio>`, `src/services` (clientes de API), `src/components` (UI reutilizable), `src/styles`. Tailwind v4 vía `@tailwindcss/vite`.

## Móvil (`apps/mobile`)

Expo Router con directorio de rutas `src/app` (convención del template oficial actual). `src/components`, `src/features`, `src/hooks`, `src/services`, `src/theme`, `src/utils`. Solo Android, orientación horizontal. Dependencias recortadas al mínimo para cuidar la memoria en tablets de 4 GB.

## Dashboard por rol

Tras el login, las tres personas (`STUDENT`, `TEACHER`, `ADMIN`) comparten un mismo shell (sidebar + topbar + contenido) con navegación y pantallas configuradas por rol. Móvil: grupo de rutas `(app)`; web: `layouts/DashboardShell`. El rol se define una vez en `@academy/shared`. Diseño y fases en [`DASHBOARD.md`](DASHBOARD.md).

## Fuera de alcance del scaffold

Autenticación, RBAC, IA, WebSockets, WebRTC, monitoreo, modo kiosco, Kotlin nativo, Redis y microservicios.
