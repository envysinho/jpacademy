# Relevo de trabajo — Codex y Claude

## Fuente de verdad y coordinación

- [`SETUP.md`](SETUP.md) contiene el estado verificable del entorno. Solo se actualiza tras ejecutar y comprobar un paso.
- Antes de ceder una tarea, añade al final de este archivo una entrada con fecha UTC, agente, archivos modificados, comandos/verificaciones, resultado y siguiente acción concreta.
- Un agente declara su archivo Markdown objetivo antes de editarlo. No se edita simultáneamente el mismo Markdown; quien toma el relevo revisa primero `git status` y la última entrada.
- No se hacen commits, push ni PR salvo instrucción explícita del usuario.

## Entorno esperado

- Node 24.22.2 (definido también en `.node-version`), pnpm 10.28.0 y Docker accesible por el grupo `docker`.
- PostgreSQL se levanta con `pnpm db:up`. API y web usan `pnpm dev`; móvil usa `pnpm dev:mobile`.
- Web usa `VITE_API_URL=http://localhost:3000`. El emulador Android usa `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`.
- Las variables de `.env` son locales e ignoradas. No poner secretos en variables públicas de Vite ni Expo.

## Orden seguro para implementar una funcionalidad

1. Definir el esquema Zod y los tipos inferidos en `packages/shared/src`; exportarlo desde el índice del paquete.
2. Añadir el módulo, controlador y servicio NestJS en `apps/api/src/modules/<dominio>` y registrar el módulo en `app.module.ts`.
3. Añadir el método validado al cliente compartido en `packages/api-client/src`.
4. Implementar la feature en `apps/web/src/features/<dominio>` y/o `apps/mobile/src/features/<dominio>`; las apps no importan código de `apps/api`.
5. Tras modificar paquetes compartidos, ejecutar `pnpm build:packages`; antes del relevo ejecutar `pnpm lint` y `pnpm typecheck`.

## Comandos de verificación

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm db:up
pnpm --filter @academy/api db:migrate --name <nombre>
pnpm dev
pnpm dev:mobile
```

## Pendientes actuales

Ver [`PENDIENTES.md`](PENDIENTES.md) (lista única).

## Registro de relevos

### 2026-11-11 UTC — Codex (resumen)

- Dejó verificados Node 24.22.2, pnpm 10.28.0, Docker, PostgreSQL, migración `init`, typecheck/lint/build, API, Vite, Metro y rutas Android.
- Pendiente que dejó: ningún dispositivo en `adb devices`.

### 2026-11-11 UTC — Claude

- Archivos modificados: `docs/SETUP_PENDIENTE.md` → renombrado a `docs/SETUP.md`; nuevo `docs/PENDIENTES.md`; `.prettierignore`; `README.md`, `docs/DEVELOPMENT.md`, `docs/DECISIONS.md`, `docs/HANDOFF.md`.
- Verificado: `ANDROID_HOME` en zsh, `adb` en `/usr/bin/adb`, AVD `Medium_Phone_API_37.0`, `/dev/kvm`, `adb devices` vacío, migración `init` presente, sin `@prisma/adapter-pg`.
- Resultado: documentación reorganizada; pendientes centralizados en `PENDIENTES.md`.
- Siguiente acción: arrancar el emulador o conectar una tablet (ver `PENDIENTES.md`, sección 1).

### 2026-11-11 UTC — Claude (limpieza y emulador)

- Eliminados: `José_Pisconte_Academy_Prompt_Claude_Arquitecto.md` (brief original) y `infrastructure/docker/README.md` (carpeta vacía; se recreará con los Dockerfiles).
- Creado fuera del repo: AVD `Tablet_Academy_8_7` en `~/.android/avd/`.
- Verificado: arranque headless, `wm size` 1340x800, densidad 180, `MemTotal` ~4 GB, `adb devices` = `device`. Emulador apagado después.
- Siguiente acción: abrir la app móvil en el emulador (`pnpm dev:mobile`, tecla `a`).

### 2026-11-11 UTC — Codex (validación Expo Android)

- Verificado: Expo Go se descargó e instaló en `Tablet_Academy_8_7`; Expo abrió `exp://192.168.1.58:8081` en el AVD.
- Resultado: Metro completó el bundle Android de 1,379 módulos sin errores.
- Estado: la validación de la app móvil en el emulador está completada; Expo queda ejecutándose para inspección visual.

### 2026-11-11 UTC — Claude (análisis del dashboard por rol)

- Archivos modificados: nuevo `docs/DASHBOARD.md`; `docs/DECISIONS.md` (D-11 a D-15), `docs/PENDIENTES.md`, `docs/ARCHITECTURE.md`, `README.md`.
- Sin cambios de código ni comandos de verificación; solo documentación.
- Resultado: especificación del shell común, configuración por rol, rutas, componentes y fases A–D. Las decisiones D-11 a D-15 son **propuestas** hasta que el usuario responda las preguntas Q1–Q5.
- Siguiente acción: resolver Q1–Q5 y empezar la Fase A (shell móvil, rol alumno, datos mock).

### 2026-11-11 UTC — Claude (base del dashboard móvil)

- Archivos nuevos: `apps/mobile/src/app/(app)/{_layout,dashboard}.tsx`, `src/features/dashboard/{screens/DashboardScreen,components/DashboardShell,components/Sidebar}.tsx`.
- Modificados: `LoginScreen.tsx` (botón principal → `/dashboard`, temporal); `docs/DASHBOARD.md` (§0 estado y respuestas Q1/Q2/Q5), `docs/PENDIENTES.md`, `docs/mobile/LOGIN.md`.
- Verificado: `pnpm --filter @academy/mobile typecheck` y `lint` sin errores. Los tipos de rutas (`.expo/types`) se regeneraron arrancando Expo brevemente. No se probó visualmente en el emulador.
- Siguiente acción: probar en `Tablet_Academy_8_7` y empezar a añadir contenido al dashboard según indique el usuario.

### 2026-11-12 UTC — Claude (logos)

- Movido `logos/` → `assets/brand/logos/` (originales). Copiadas las 12 variantes `@1x/@2x/@3x` PNG a `apps/mobile/assets/images/logos/`.
- Nuevos: `apps/mobile/src/theme/logos.ts` (mapa `logos`), `docs/ASSETS.md`. Modificados: `README.md`, `docs/PENDIENTES.md`.
- Los logos aún no se usan en ninguna pantalla. Uso y reglas en `docs/ASSETS.md`.
- Siguiente acción: usar `logos.horizontal` en `Sidebar.tsx` cuando el usuario lo indique.

### 2026-11-12 UTC — Claude (sidebar con estética del login)

- Modificados: `apps/mobile/src/features/dashboard/components/Sidebar.tsx` (rediseño visual; se conserva rol, navegación y plegado), `apps/mobile/src/theme/index.ts` (tokens `brand`), `apps/mobile/src/theme/logos.ts` (corregido: `require` con nombre base, no `@1x`).
- Docs: `DASHBOARD.md` §0/§0.1, `ASSETS.md` (regla de `require` corregida), `DECISIONS.md` D-12, `PENDIENTES.md`, `mobile/LOGIN.md` (`expo-linear-gradient` ahora en uso).
- Verificado: typecheck y lint; captura en `Tablet_Academy_8_7` en modo plegado y desplegado.
- Nota: `MathBackground.tsx` tiene un aviso de Prettier previo, no tocado.
- Siguiente acción: conectar los ítems del sidebar a rutas de `(app)`.
