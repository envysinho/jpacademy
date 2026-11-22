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

### 2026-11-12 UTC — Claude (guía de estilo visual)

- Nuevo `docs/ESTILO_VISUAL.md`: paleta (`brand`, neutros, colores del escudo como referencia), reglas de uso del naranja y del azul, contraste WCAG medido, escala tipográfica (incluido el bloque de marca del sidebar), forma/espaciado y checklist para pantallas nuevas.
- Ajustes previos del sidebar: "Reforzamiento Académico" (A mayúscula), subtítulo 9,5 / `lineHeight` 13 / `letterSpacing` -0,05 para igualar el ancho de "José Pisconte" (18 / `lineHeight` 20), `includeFontPadding: false`. Verificado en el emulador.
- Enlazado desde `README.md`, `DASHBOARD.md` §0.1, `DECISIONS.md` D-12 y `PENDIENTES.md`.
- **Antes de crear o cambiar una pantalla, leer `ESTILO_VISUAL.md`** y documentar ahí cualquier color o tamaño nuevo.

### 2026-11-21 UTC — Claude (Inicio del alumno, visual)

- Nuevos: `apps/mobile/src/components/{Card,FadeIn,IconChip,ProgressBar,ProgressRing}.tsx`; `src/features/dashboard/components/home/{CardHeader,ResumeCard,StreakCard,CoursesCard,DurationsCard,AchievementsCard}.tsx`; `screens/StudentHome.tsx`; `mocks/student.ts`; `docs/CODEX_INICIO_RESPONSIVE.md`.
- Modificados: `theme/index.ts` (tokens `brand.blueSoft`, `brand.onBlueBorder`, `colors.track`, `colors.trackFill`, `categories`, `radius` 20/14/pill, `shadows.card`, `typography.title`); `DashboardScreen.tsx` (muestra `StudentHome`, rol `STUDENT` fijo); `docs/ESTILO_VISUAL.md`.
- `DashboardShell.tsx` y `Sidebar.tsx` sin cambios (se probó un fondo azul completo y se revirtió por decisión del usuario).
- Diseño calcado de la referencia del usuario ("Learning streak" / "Achievements"), adaptado a la marca. Sin cabecera (saludo y notificaciones quedan para después). Solo visual, sin lógica.
- Verificado: `@academy/mobile typecheck` y `lint` sin errores; Prettier limpio en lo nuevo (avisos previos en `LoginScreen.tsx` y `MathBackground.tsx`). Revisado en `Tablet_Academy_8_7` (emulador en Windows, Metro en WSL, `exp://10.0.2.2:8081`) con sidebar plegado y desplegado.
- Siguiente acción: pulir el responsive con el sidebar desplegado → encargo para Codex en `docs/CODEX_INICIO_RESPONSIVE.md`.

### 2026-11-21 UTC — Codex (responsive del Inicio del alumno)

- Archivos modificados: `StudentHome.tsx`; `ResumeCard.tsx`, `StreakCard.tsx`, `CoursesCard.tsx`, `DurationsCard.tsx` y `AchievementsCard.tsx` dentro de `components/home`; `docs/HANDOFF.md`.
- Resultado: `StudentHome` mide el ancho del contenido y activa el modo compacto por debajo de 1000 dp. En ese modo se elimina la decoración `π` que invadía el título, se recolocan los otros símbolos, se acortan los textos secundarios de racha y cursos sin truncarlos, y se contrae la pila decorativa de logros. El diseño ancho permanece sin cambios.
- Verificado: `pnpm --filter @academy/mobile typecheck`, `pnpm --filter @academy/mobile lint` y `npx prettier@3 --check apps/mobile/src/features/dashboard apps/mobile/src/components`, todos correctos. Revisado en `Tablet_Academy_8_7` con sidebar desplegado y plegado; sin recortes ni solapamientos visibles.
- Pendiente: el AVD disponible deja aproximadamente 1070 dp de contenido al desplegar el sidebar, así que no permitió observar directamente el umbral compacto de 900 dp; el umbral y las variantes están implementados y cubiertos por typecheck/lint.

### 2026-11-21 UTC — Claude (Mis cursos del alumno, visual)

- Nuevos: `screens/StudentCourses.tsx`; `components/courses/{CourseGridCard,CourseListRow,CourseBanner,courseVisuals}.ts(x)`; `mocks/studentCourses.ts` (sin docente: los cursos vendrán de la BD).
- Modificados: `Sidebar.tsx` y `DashboardShell.tsx` (la sección activa se recibe por props `activeKey`/`onSelect`; sin cambio visual); `DashboardScreen.tsx` (estado local de sección: Inicio, Cursos y "Sección en diseño" para el resto); `docs/ESTILO_VISUAL.md` (§2.3 paleta por materia, §6.1 patrones).
- Vista: pestañas Todos/En progreso/Completados/Favoritos con conteo (filtran el mock), selector cuadrícula/lista, desplegables Categoría/Nivel/Ordenar (solo visual), cuadrícula de 3 columnas (2 si el contenido < 820 dp) y vista de lista. Sin cabecera (buscador, notificaciones y avatar quedan para después).
- Verificado: typecheck y lint sin errores; en `Tablet_Academy_8_7` con sidebar plegado y desplegado, cuadrícula, lista y filtros.
- Siguiente acción: vista de Tareas cuando el usuario pase la referencia.

### 2026-11-21 UTC — Codex (selector de Mis cursos)

- Modificados: `screens/StudentCourses.tsx`, `docs/ESTILO_VISUAL.md` y `docs/HANDOFF.md`.
- Resultado: estados agrupados en una barra con contador y selección claros; filtros secundarios, orden y vista en una segunda fila adaptable. Los estados siguen filtrando los datos ficticios; categoría, nivel y orden siguen siendo controles visuales pendientes de funcionalidad.
- Verificado: `pnpm --filter @academy/mobile typecheck` y `lint`; Prettier aplicado al archivo. Revisado en el emulador con sidebar desplegado y plegado y con el filtro «En progreso» activo.
- Pendiente: conectar los filtros secundarios y el orden cuando existan sus datos y reglas.

### 2026-11-21 UTC — Codex (barra compacta de cursos)

- Modificados: `screens/StudentCourses.tsx`, `docs/ESTILO_VISUAL.md` y `docs/HANDOFF.md`.
- La barra de estados, el acceso a filtros y el selector de vista comparten una fila; el panel de filtros informa de que categoría, nivel y orden aún no están disponibles.
- Verificado: typecheck y lint de `@academy/mobile`; formato con Prettier; barra revisada en el emulador con sidebar desplegado.
- Pendiente: implementar categoría, nivel y orden con datos y reglas reales.

### 2026-11-21 UTC — Claude (Calendario del alumno, visual)

- Nuevos: `screens/StudentCalendar.tsx`; `components/calendar/{calendarVisuals,StatTile,MiniCalendar,DayAgenda,NextCallCard,UpcomingEventsCard}.ts(x)`; `mocks/studentCalendar.ts`.
- Modificados: `DashboardScreen.tsx` (sección `calendar`); `docs/ESTILO_VISUAL.md` §6.1 (tipos de evento, resumen, mini calendario, agenda, responsive).
- Vista según la referencia del usuario, sin cabecera (título, buscador, notificaciones y avatar quedan para después): 4 resúmenes por tipo, mes con puntos por tipo + leyenda, agenda del día con selector Diaria/Semanal/Mensual (solo visual), próxima videollamada con «Unirme ahora» (sin marca de terceros) y próximos eventos. Responsive: la tercera columna baja si el contenido < 1000 dp.
- Verificado: typecheck y lint sin errores; en `Tablet_Academy_8_7` con sidebar plegado y desplegado.
- Pendiente: contenido de las vistas semanal y mensual; navegación entre días y meses.

### 2026-11-21 UTC — Codex (ajustes de Calendario)

- Modificados: `screens/StudentCalendar.tsx`, `components/calendar/{MiniCalendar,DayAgenda}.tsx`, `docs/ESTILO_VISUAL.md` y `docs/HANDOFF.md`.
- Resultado: cuando el espacio es menor de 1120 dp, la videollamada queda bajo el mes y los próximos eventos bajo la agenda; así se elimina el hueco que provocaba poner ambas tarjetas después de toda la fila. Por debajo de 760 dp, mes, agenda y auxiliares se apilan. Se ajustaron las celdas del mes, la leyenda, los selectores de vista y las tarjetas de agenda para conservar una cuadrícula regular y objetivos táctiles de 48 dp en los controles.
- Verificado: `pnpm --filter @academy/mobile typecheck`, `lint` y Prettier para dashboard, todos correctos. Revisado en `Tablet_Academy_8_7` con sidebar desplegado, arriba y tras scroll: sin recortes ni desbordamiento horizontal.
- Pendiente: contenido real de las vistas semanal y mensual; navegación entre días y meses.

### 2026-11-21 UTC — Codex (flujo compacto del Calendario)

- Modificados: `screens/StudentCalendar.tsx`, `components/calendar/{DayAgenda,UpcomingEventsCard}.tsx`, `docs/ESTILO_VISUAL.md` y `docs/HANDOFF.md`.
- Resultado: en el layout compacto, la videollamada continúa bajo el calendario mensual y los próximos eventos bajo la agenda; se elimina el vacío que quedaba entre la leyenda y las tarjetas auxiliares.
- Verificado: typecheck y lint de `@academy/mobile`, con Prettier aplicado; revisión en `Tablet_Academy_8_7` con sidebar desplegado y scroll: las dos columnas continúan sin huecos ni recortes.
- Pendiente: contenido real de las vistas semanal y mensual; navegación entre días y meses.

### 2026-11-21 UTC — Claude (Calendario premium 3D, sin videollamadas)

- Nuevos: `apps/mobile/src/components/{Clay3DIcon,SoftScene}.tsx` (kit de iconos 3D: cámara, portapapeles, libro, insignia, matraz, calendario; y fondo de escena 3D).
- Modificados: `components/calendar/{calendarVisuals,StatTile,MiniCalendar,DayAgenda,UpcomingEventsCard}.ts(x)`, `screens/StudentCalendar.tsx`, `mocks/studentCalendar.ts`, `docs/ESTILO_VISUAL.md` §6.1.
- Eliminado: `components/calendar/NextCallCard.tsx` y todo lo de videollamadas (tipo `videocall`, resumen, puntos, evento grupal; la asesoría ya no es llamada), por decisión del usuario.
- Resultado: resúmenes, mes, agenda y próximos eventos con escena 3D e iconos 3D; hoy como botón 3D. Layout de 2 columnas (mes + leyenda + próximos eventos · agenda), apilado < 760 dp.
- Verificado: typecheck, lint y Prettier sin errores; revisado en `Tablet_Academy_8_7` con sidebar plegado y desplegado.

### 2026-11-21 UTC — Claude (controles 3D en Mis cursos)

- Nuevo: `apps/mobile/src/components/Raised3D.tsx` (superficie con canto: variantes `primary`, `soft` y `white`).
- Modificados: `components/ProgressBar.tsx` (degradado de marca con brillo, 10 dp), `features/dashboard/components/courses/{CourseGridCard,CourseListRow}.tsx` (acciones y favorito 3D, píldora y favorito con sombra), `features/dashboard/screens/StudentCourses.tsx` (pestaña y vista activas 3D, Filtros 3D blanco; se conserva la estructura de Codex), `docs/ESTILO_VISUAL.md` §6.1.
- Verificado: typecheck y lint sin errores, Prettier aplicado; revisado en `Tablet_Academy_8_7` en cuadrícula y lista.
- Nota: la barra de progreso nueva también se ve en Inicio y Calendario (mismo componente).

### 2026-11-21 UTC — Claude (Inicio con estilo 3D)

- Modificados: `components/Clay3DIcon.tsx` (nuevas figuras: llama, reloj, trofeo, monitor), `features/dashboard/components/courses/CourseIllustration.tsx` (exporta `CourseObject`), `features/dashboard/components/home/{CardHeader,ResumeCard,StreakCard,CoursesCard,DurationsCard,AchievementsCard}.tsx`, `docs/ESTILO_VISUAL.md` §6.1.
- Resultado: misma estructura y responsive de Codex; se añade el estilo 3D (iconos 3D en cabeceras, π 3D en la tarjeta destacada, libros y medallas con volumen, botones `Raised3D`, gráfica con área y sombra).
- Verificado: typecheck y lint sin errores, Prettier aplicado; revisado en `Tablet_Academy_8_7` con sidebar plegado y desplegado.

### 2026-11-21 UTC — Claude (Tareas del alumno, visual)

- Nuevos: `apps/mobile/src/components/SceneStatTile.tsx`; `features/dashboard/screens/StudentTasks.tsx`; `features/dashboard/components/tasks/{TaskList,TaskDetail,taskVisuals}.ts(x)`; `features/dashboard/mocks/studentTasks.ts`.
- Modificados: `components/calendar/StatTile.tsx` (usa `SceneStatTile`), `screens/DashboardScreen.tsx` (sección `tasks`), `docs/ESTILO_VISUAL.md` §6.1.
- Vista elegida por el usuario: lista + detalle. Resúmenes 3D, pestañas Pendientes/Entregadas/Calificadas/Vencidas (filtran el mock), lista agrupada Hoy/Esta semana/Más adelante, detalle con portada 3D, material, avance o nota y acciones 3D. Solo visual: las acciones no hacen nada.
- Verificado: typecheck y lint sin errores, Prettier aplicado; revisado en `Tablet_Academy_8_7` (pendientes, lista y detalle). No se revisó en pantalla el detalle de una tarea calificada.
- Pendiente: vista de Progreso.

### 2026-11-21 UTC — Claude (detalle de curso: roadmap, lección, asistente IA y docente)

- Nuevos: `features/dashboard/screens/CourseDetail.tsx`; `features/dashboard/components/course-detail/{RoadmapCard,LessonPanel,ChatPanel,SidePanels}.tsx`; `features/dashboard/mocks/courseDetail.ts`.
- Modificados: `screens/StudentCourses.tsx` (estado `openCourseId`: «Continuar» abre el detalle; volver regresa a la cuadrícula), `components/courses/{CourseGridCard,CourseListRow}.tsx` (prop `onOpen`), `docs/ESTILO_VISUAL.md` §6.1.
- Resultado: curso de muestra (mismo contenido para cualquier curso) con modo Lección (video con portada 3D, recursos/ejercicios/notas y roadmap con línea de avance) y modo Asistente IA (chat con IA, tarea y paso al docente mediante solicitud de ayuda; sin videollamadas, por la decisión anterior del usuario). Solo visual: enviar, subir y descargar no hacen nada.
- Verificado: typecheck y lint sin errores, Prettier aplicado; revisado en `Tablet_Academy_8_7`: Lección, roadmap, Asistente IA y flujo «Pedir ayuda» → pestaña Docente.
- Pendiente: vista de Progreso; navegación con rutas reales (DASHBOARD.md §6); sesión y datos de la API.
