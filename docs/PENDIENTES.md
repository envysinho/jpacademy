# Pendientes — EdTech Academy OS

Lista única de trabajo pendiente. Estado del entorno: [`SETUP.md`](SETUP.md). Decisiones tomadas: [`DECISIONS.md`](DECISIONS.md). Última revisión: 2026-11-26.

## 1. Inmediato (entorno)

- [x] Abrir la app en el emulador `Tablet_Academy_8_7`; Expo Go instaló y Metro completó el bundle Android sin errores.
- [x] Abrir la app móvil en Android (`pnpm dev:mobile`, tecla `a`) y registrar el resultado en `HANDOFF.md`.
- [x] Primer commit del scaffold hecho (el repositorio ya tiene historial).
- [ ] Probar la app en una tablet física (solo se ha visto en el AVD).

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
- [ ] Solicitud de ayuda docente (el flujo visual existe en el detalle de curso). **Sin videollamadas ni enlace de Meet**, por decisión del usuario (2026-11-21); revisar este punto si cambia.
- [ ] Monitoreo académico.
- [ ] Diseño UX/UI: dashboard con grid y sidebar, esquinas ~12 px, colores contenidos. Especificación en [`DASHBOARD.md`](DASHBOARD.md); fases A–D en §7 de ese documento.
  - [x] Base del shell móvil: `/dashboard` con sidebar y logo.
  - [x] Vistas visuales del alumno con datos ficticios: Inicio, Cursos, Detalle de curso (lección, roadmap, asistente IA, paso al docente), Calendario y Tareas. Tokens de marca y `categories` en `theme`.
  - [x] Refinamiento del alumno según [`ESTUDIANTE_UX.md`](ESTUDIANTE_UX.md) (2026-11-26): Inicio, Cursos, detalle de curso, espacio de resolución, Tareas, Calendario y Progreso.
  - [ ] Reglas académicas pendientes de la academia (ESTUDIANTE_UX §12): fórmula, ámbito y periodo del ranking; condición de desbloqueo de lecciones; nota aprobatoria (hoy 11 provisional, `PROVISIONAL_PASSING_GRADE`); reapertura de intentos; catálogo oficial.
  - [ ] Integraciones: API de cursos/lecciones/tareas/entregas/ranking, asistente IA, chat docente, generación de prácticas con IA, apertura/descarga de PDF y **cámara/archivos** (requiere añadir `expo-image-picker`/`expo-document-picker`; no instalado).
  - [ ] Validar en servidor el avance secuencial y los intentos (hoy solo cliente).
  - [ ] Registro de tareas vencidas: hoy se muestran en el historial de Tareas como «Vencida», sin nota (no se inventa un cero) y sin posibilidad de resolverlas. Definir cómo cuentan en el registro académico.
  - [ ] Calcular «Hoy / Esta semana / Más adelante» con la fecha límite en la zona horaria de la academia (hoy es un campo fijo del mock).
  - [ ] Topbar / cabecera de página (saludo, buscador, notificaciones, avatar).
  - [x] Calendario asincrónico (D-22): eventos con fecha, día seleccionable, estado vacío.
  - [ ] Calendario: vistas semanal y mensual y navegación entre meses (deben caber en el viewport).
  - [x] Acompañamiento escolar visual con datos simulados ([`ACOMPANAMIENTO_ESCOLAR.md`](ACOMPANAMIENTO_ESCOLAR.md)).
  - [ ] Acompañamiento: servicios reales (catálogo, análisis de tareas, cámara/archivos, progreso) y métricas/ranking definitivos.
  - [ ] Reemplazo de Logros en el Inicio de reforzamiento (decisión del usuario pendiente).
  - [ ] Acciones aún sin backend: favoritos, descargar/abrir material, reproducir video, enviar al chat (solo queda en memoria) y entregar (solo demo en memoria).
  - [ ] Fase A restante: topbar y navegación por rutas reales.
  - [ ] Fase B: `roleSchema` en `@academy/shared` y navegación de los tres roles.
  - [ ] Fase C: shell web con `react-router` (docente y administrador).
  - [ ] Fase D: rol desde la sesión y guard (depende de autenticación).
  - [ ] Responder las preguntas abiertas Q3 y Q4 de `DASHBOARD.md` §9.
  - [x] Sidebar con logo y estética del login (ver `DASHBOARD.md` §0.1).
  - [ ] Conectar los ítems del sidebar a rutas reales de Expo Router (hoy `DashboardScreen` guarda la sección activa en estado local).
  - [ ] Vistas de docente y administrador (hoy solo hay navegación provisional).
  - [ ] Migrar los colores fijos de `LoginScreen` a los tokens `brand` (ver [`ESTILO_VISUAL.md`](ESTILO_VISUAL.md) §9).
  - [ ] Revisar contraste del naranja del login (2,8:1, ver `ESTILO_VISUAL.md` §4).
  - [ ] Sustituir icono, splash e icono adaptativo de Expo por la marca.
  - [ ] Quitar la navegación temporal login → `/dashboard` al implementar autenticación.
- [ ] `api-client` con casos reales (hoy solo `/health`).
- [ ] Kotlin nativo: MediaProjection, WebRTC, modo kiosco (solo con consentimiento y dispositivos institucionales).
