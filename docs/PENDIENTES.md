# Pendientes — EdTech Academy OS

Lista única de trabajo pendiente. Estado del entorno: [`SETUP.md`](SETUP.md). Decisiones tomadas: [`DECISIONS.md`](DECISIONS.md). Última revisión: 2026-11-11.

## 1. Inmediato (entorno)

- [x] Abrir la app en el emulador `Tablet_Academy_8_7`; Expo Go instaló y Metro completó el bundle Android sin errores.
- [x] Abrir la app móvil en Android (`pnpm dev:mobile`, tecla `a`) y registrar el resultado en `HANDOFF.md`.
- [ ] Hacer el primer commit del scaffold (hoy todo está sin versionar salvo `README.md`). Requiere instrucción explícita del usuario.

## 2. Deuda técnica del scaffold

- [ ] Prisma en runtime: añadir `PrismaService` y `@prisma/adapter-pg` junto con el primer módulo que use base de datos (D-06).
- [ ] Restringir CORS antes de producción (D-09).
- [ ] Bundle web ~709 kB: evaluar `zod/mini` o división de chunks.
- [ ] Decidir si se versiona `apps/mobile/android/` al empezar Kotlin (D-05).
- [ ] Versiones muy recientes (TS 6, Vite 8, Nest 12, Prisma 7, Expo 58): actualizar con cuidado.
- [ ] Credenciales de `compose.yaml`: solo desarrollo, cambiar para producción.
- [ ] Crear `infrastructure/docker/` con los Dockerfiles de despliegue de API y web.
- [ ] Builds APK/AAB (EAS o Android Studio).

## 3. Funcionalidades (fases futuras)

Cada una sigue el orden de `HANDOFF.md`.

- [ ] Autenticación real y roles (alumno, docente, administrador).
- [ ] Cursos y temas, videos de YouTube.
- [ ] Tareas con fotos y progreso.
- [ ] Tutor IA.
- [ ] Chat y WebSockets.
- [ ] Solicitud de ayuda docente con enlace de Google Meet.
- [ ] Monitoreo académico.
- [ ] Diseño UX/UI: dashboard con grid y sidebar, esquinas ~12 px, colores contenidos.
- [ ] `api-client` con casos reales (hoy solo `/health`).
- [ ] Kotlin nativo: MediaProjection, WebRTC, modo kiosco (solo con consentimiento y dispositivos institucionales).
