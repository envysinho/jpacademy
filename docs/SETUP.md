# Estado del setup local — EdTech Academy OS

Última actualización: 2026-11-11 (UTC). Checklist verificado del entorno. No marques un paso como completado sin registrar el comando y resultado en [`HANDOFF.md`](HANDOFF.md). Lo que falta por hacer vive en [`PENDIENTES.md`](PENDIENTES.md).

## Verificado

| Paso                       | Estado | Evidencia                                                                                                                                                          |
| -------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dependencias del workspace | OK     | Lockfile único en la raíz.                                                                                                                                         |
| Node y pnpm                | OK     | Node `v24.22.2` (fijado en `.node-version`); pnpm `10.28.0`.                                                                                                       |
| Docker                     | OK     | `envy` pertenece al grupo `docker`; acceso sin sudo comprobado.                                                                                                    |
| PostgreSQL                 | OK     | `pnpm db:up`; `academy-postgres-1` `healthy` en el puerto 5432.                                                                                                    |
| Prisma                     | OK     | Cliente generado; migración `20261111084100_init` aplicada, sin pendientes.                                                                                        |
| Calidad                    | OK     | `pnpm typecheck`, `lint`, `build` y `format:check` correctos.                                                                                                      |
| API y web                  | OK     | `GET :3000/health` y `HEAD :5173` responden 200.                                                                                                                   |
| Metro/Expo                 | OK     | `pnpm --filter @academy/mobile dev` inicia Metro en `http://localhost:8081`.                                                                                       |
| Android SDK / adb          | OK     | `ANDROID_HOME=/home/envy/Android/Sdk` (en `~/.zshrc`); `adb` en `/usr/bin/adb`; `emulator` en PATH.                                                                |
| Emulador (AVD)             | OK     | AVD `Tablet_Academy_8_7` (1340x800, 180 dpi, 4 GB RAM, horizontal, Android 37 Play Store): arranca y `sys.boot_completed=1`; `adb devices` lo lista como `device`. |
| Entornos cliente           | OK     | Web usa `http://localhost:3000`; móvil (emulador) usa `http://10.0.2.2:3000`.                                                                                      |

## No verificado

- No hay tablet física conectada. La app móvil se abrió correctamente en el AVD `Tablet_Academy_8_7` mediante Expo Go; no se creó `apps/mobile/android/`.

## Notas operativas

- Si una terminal abierta antes del cambio de grupo no reconoce Docker, abre una sesión nueva.
- Los `.env` locales se ignoran en Git; no incluir secretos en `VITE_*` ni `EXPO_PUBLIC_*`.
- El build web pasa con una advertencia no bloqueante de Vite: bundle inicial ~709 kB sin comprimir.
- No ejecutar commit, push ni PR sin instrucción explícita del usuario.
