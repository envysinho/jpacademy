# Guía de desarrollo

## Flujo diario

```bash
pnpm db:up            # base de datos
pnpm dev              # API + Web (compila paquetes antes)
pnpm dev:mobile       # Expo; pulsa "a" para abrir en Android
```

Si editas `packages/shared` o `packages/api-client` mientras corre `pnpm dev`, ejecuta en otra terminal `pnpm --filter @academy/shared dev` (tsc en modo watch).

## Base de datos y Prisma

```bash
cp apps/api/.env.example apps/api/.env
pnpm --filter @academy/api db:generate   # genera el cliente en apps/api/generated/prisma
pnpm --filter @academy/api db:migrate    # crea/aplica migraciones (requiere Postgres arriba)
```

Las credenciales de `compose.yaml` son de ejemplo para desarrollo local y **no son seguras para producción**.

## Verificar el API

```bash
pnpm --filter @academy/api build && pnpm --filter @academy/api start
curl http://localhost:3000/health
```

## Móvil (Android)

- Usa `pnpm dev:mobile` (Expo Metro). La carpeta `apps/mobile/android/` **no se versiona ni se crea a mano**: se genera con `pnpm --filter @academy/mobile exec expo prebuild --platform android` o `expo run:android` cuando se necesite código Kotlin nativo.
- Cuando exista `android/`, decide con el equipo si se versiona (ver `docs/DECISIONS.md`, D-05).
- URL del API desde el emulador: `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`. Desde una tablet física usa la IP LAN de tu PC.

### Entorno Android (Arch)

Configuración verificada en esta máquina (ver [`SETUP.md`](SETUP.md)):

- `ANDROID_HOME=/home/envy/Android/Sdk`, con `platform-tools` y `emulator` en el `PATH` (bloque en `~/.zshrc`).
- `adb` del host en `/usr/bin/adb`; `/dev/kvm` disponible para el emulador.
- AVD de tablet: `Tablet_Academy_8_7` (`emulator -avd Tablet_Academy_8_7`), 8,7" aprox., 1340x800, 4 GB RAM, horizontal. Se creó a mano en `~/.android/avd/` porque no hay `cmdline-tools`/`avdmanager`. También existe `Medium_Phone_API_37.0` (teléfono).
- Si Android Studio (Flatpak) no ve dispositivos USB, usa el `adb` del host y mantén la misma versión que el SDK. `JAVA_HOME` debe apuntar al JDK 21.

## Calidad

`pnpm lint`, `pnpm typecheck`, `pnpm format:check`. ESLint (flat config) en la raíz para API/Web/paquetes; el móvil usa `expo lint` con `eslint-config-expo`.

## Agregar funcionalidad (handoff)

1. **Contrato nuevo**: esquema zod en `packages/shared/src/<dominio>.ts`, exportarlo en `index.ts`.
2. **Endpoint**: módulo en `apps/api/src/modules/<dominio>/` (module + controller + service), importarlo en `app.module.ts`; tipar la respuesta con el tipo de `shared`.
3. **Cliente**: añadir el método en `packages/api-client/src/index.ts` validando con el esquema.
4. **Web**: carpeta `apps/web/src/features/<dominio>/`. **Móvil**: `apps/mobile/src/features/<dominio>/` y rutas en `apps/mobile/src/app/`.
5. Tras tocar paquetes: `pnpm build:packages`. Antes de terminar: `pnpm lint && pnpm typecheck`.
6. Nombres de workspaces: `@academy/{api,web,mobile,shared,api-client}`. Dependencias internas siempre `workspace:*`.
