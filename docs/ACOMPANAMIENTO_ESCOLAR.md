# Fase visual — Acompañamiento escolar y calendario asincrónico

Última revisión: 2026-11-26 (UTC). Responsable: Claude (UX/UI). Fuente: [EdTech_Fase_Visual_Claude_Codex.md](EdTech_Fase_Visual_Claude_Codex.md). Autenticación demo y rutas: Codex ([AUTH_DEMO.md](AUTH_DEMO.md)).

Todo es **frontend con datos simulados**: no hay backend, OCR, IA, cámara ni subida de archivos. Ninguna cifra ni regla de esta fase es definitiva (ver §6).

## 1. Cómo probarlo

1. `apps/mobile/.env` → `EXPO_PUBLIC_DEMO_AUTH_ENABLED=true` (solo desarrollo; reiniciar Metro si no lo toma).
2. `pnpm dev:mobile` y abrir en el emulador.
3. Cuentas (ver [AUTH_DEMO.md](AUTH_DEMO.md)):
   - `student.refuerzo@demo.test` / `DemoRefuerzo26!` → reforzamiento (dashboard aprobado).
   - `student.escolar@demo.test` / `DemoEscolar26!` → acompañamiento escolar.
   - `teacher.demo@demo.test` y `admin.demo@demo.test` → shells provisionales de Codex.

## 2. Calendario asincrónico (ambas modalidades)

- Sin clases diarias ni fechas de lecciones: cada alumno avanza a su ritmo.
- Tipos de evento: **Entrega** (naranja), **Asesoría** agendada (verde) y **Simulacro / actividad** especial (azul de marca). Las solicitudes de ayuda inmediatas **no** van al calendario (irán en Atenciones).
- Tarjetas superiores: Entregas · Simulacros y actividades · Asesorías del mes (no seleccionables).
- Tocar un día muestra su agenda; flechas para día anterior/siguiente. Día sin eventos → estado vacío con acción (Reforzamiento: «Continuar aprendiendo»; Acompañamiento: «Escanear una tarea»).
- Un solo viewport; la agenda se desplaza por dentro. Vistas semanal y mensual: siguen pendientes.
- Reforzamiento: las entregas salen de las tareas con `dueDate` (misma fuente que Tareas). Asesorías y actividades: `mocks/studentCalendar.ts`. Acompañamiento: `schoolCalendarEvents`.

## 3. Acompañamiento escolar (`SCHOOL_SUPPORT`)

Ruta `/student-school-support` (de Codex) → `SchoolSupportScreen`. Mismo shell y sidebar que reforzamiento con su propia lista: **Inicio · Aprender · Mis tareas · Calendario · Progreso** (`schoolSupportNavigation`). La navegación de reforzamiento no cambia.

| Vista                    | Qué hace                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inicio**               | «¿Qué vamos a aprender hoy?» con **Escanear tarea** y **Buscar tema**; racha; sesiones recientes; mis tareas; temas aprendidos. Un viewport.                                                                                                                                                                                                                                                                      |
| **Subir tarea** (modal)  | Origen (Cámara / Galería / PDF) → vista previa → «Subir tarea» → **se abre el chat de la tarea**. Galería simula una imagen ilegible (error en el modal).                                                                                                                                                                                                                                                         |
| **Aprender**             | Arriba, la tarjeta destacada «Lo que estás aprendiendo» (tema de la última sesión) con «Continuar». Debajo, buscador sobre el catálogo de ejemplo (sin tildes ni mayúsculas), resultados en cuadrícula, estado sin coincidencias y acceso a escanear. Elegir un tema **no** matricula en un curso.                                                                                                                |
| **Sesión personalizada** | Reutiliza reproductor + resumen (`LessonPanel`). Derecha: tarea original (si viene de un escaneo) con «Resolver tarea», ruta corta, ejemplos resueltos y práctica similar.                                                                                                                                                                                                                                        |
| **Mis tareas**           | Historial de tareas del colegio con estado, fecha opcional y bloques con «Ver sesión del tema». **«Entrar a la tarea»** abre su chat. Aviso: la revisión es interna, no es la nota oficial del colegio. Un viewport.                                                                                                                                                                                              |
| **Chat de la tarea**     | Mismo `TaskWorkspace` de reforzamiento (pestañas Asistente IA / Docente, intentos, ayuda docente). Al entrar por primera vez, el asistente (simulado) responde con los temas encontrados y botones «Ver video: tema» (abre la sesión) y «No es ese tema» (corregir el tema de cada bloque). Entradas: subir tarea, «Entrar a la tarea», tarjeta Mis tareas del Inicio e «Ir al chat de la tarea» desde la sesión. |
| **Progreso**             | Temas practicados, tareas resueltas, sesiones de la semana, temas y competencias (sin % de currículo) y práctica por semana. Ranking de esta modalidad: pendiente. Un viewport.                                                                                                                                                                                                                                   |

Estado en memoria por sesión: tareas escaneadas, temas practicados e historial de chat. Al cerrar sesión se desmonta (lo garantiza el flujo de Codex).

## 4. Componentes reutilizados

`DashboardShell` / `Sidebar` (nueva prop `items`), `StreakCard`, `CardHeader`, `CourseBanner` / `CourseIllustration`, `LessonPanel`, `TaskActionButton`, `TaskWorkspace` + `ChatPanel` + `StudentSessionProvider`, `StudentCalendar` (`MiniCalendar`, `DayAgenda`), `SceneStatTile`, `Raised3D`, `Clay3DIcon`, `SoftScene`, `Card`, `FadeIn`, `normalizeText`.

## 5. Contratos para la integración

**Sesión (de Codex, se consume tal cual):** `DemoSession` en `features/auth/contracts.ts`. La UI solo usa `role` y `activeModality` a través de `getPortalPath`; la ruta `/student-school-support` monta `SchoolSupportScreen` con `onSignOut`. No hay condicionales de rol en las pantallas.

**Datos (forma mínima que esperan las vistas; hoy en `features/school-support/mocks/schoolSupport.ts`):**

```ts
type Topic = {
  id: string;
  title: string;
  area: string;
  color: CourseColor;
  icon: CourseIcon;
  summary: { text: string; objectives: string[]; concepts: string[] };
  steps: string[]; // ruta corta
  examples: { problem: string; solution: string }[];
  practice: string[]; // práctica similar
};
type TaskBlock = { topicId: string; exercises: string[] }; // un tema detectado
type ChatMessage = { /* … */ actions?: { id: string; label: string }[] }; // botones en mensajes: 'topic:<id>' | 'fix'
type ScanResult = { subject: string; fileName: string; blocks: TaskBlock[] } | null; // null = ilegible
type SchoolTask = {
  id: string;
  title: string;
  subject: string;
  fileName: string;
  createdLabel: string;
  dueLabel?: string;
  status: 'new' | 'studying' | 'solved';
  blocks: TaskBlock[];
};
type CalendarEvent = {
  // features/dashboard/mocks/studentCalendar.ts
  id: string;
  date: string /* AAAA-MM-DD */;
  time: string;
  type: 'task' | 'help' | 'activity';
  title: string;
  subtitle: string;
  duration?: string;
  status?: string;
};
```

Servicios futuros (sustituyen a los mocks sin cambiar las pantallas): catálogo de temas con búsqueda, análisis de tarea (imagen/PDF → `ScanResult`), tareas escolares del alumno, sesión personalizada por tema, eventos de calendario y progreso de práctica. La subida de archivos y la cámara requieren añadir `expo-image-picker` / `expo-document-picker` (no instalados).

## 6. Flujo objetivo (lógica en diciembre)

Subir tarea → chat → video del tema (base de datos) → ejercicio generado (LaTeX) → el alumno lo resuelve y sube su solución al chat → el asistente valida (sí/no) con pistas → si sigue con dudas, pestaña Docente. Hoy están simulados los primeros pasos; faltan el ejercicio en LaTeX, el adjunto real en el chat y la respuesta de validación (propuesta visual pendiente de aprobación).

## 7. Decisiones pendientes (no inventadas)

Modalidad combinada; denominación Calendario/Agenda (se mantiene «Calendario»); métricas definitivas y ranking de acompañamiento; reglas de evaluación interna; qué reemplaza a Logros en el Inicio de reforzamiento; videollamadas (fuera, D-17); portal docente y administrador.
