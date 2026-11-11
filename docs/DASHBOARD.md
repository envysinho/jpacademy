# Dashboard base (shell por rol)

Especificación del mockup general que se muestra **después del login** y que se reutiliza para los tres roles: alumno (`STUDENT`), docente (`TEACHER`) y administrador (`ADMIN`). Primero se construye el shell y la vista de un rol; los otros dos solo añaden configuración y contenido.

Estado: **base móvil creada, contenido en blanco** (ver §0). Última revisión: 2026-11-11 (UTC).

## 0. Estado actual y decisiones del usuario

Implementado en `apps/mobile`:

- Ruta `/dashboard` (`src/app/(app)/dashboard.tsx`) → `DashboardScreen` → `DashboardShell`.
- `Sidebar` de 240 dp con el **texto "Logo"** (sin logo real, sin navegación todavía).
- Área de contenido **en blanco**, a la espera de diseño.
- Sin topbar, sin roles, sin datos. Todo lo descrito en §3–§7 más allá de esto es **propuesta**, no código.
- Temporal: el botón "Iniciar sesión" del login hace `router.replace('/dashboard')` (no hay autenticación). `src/app/index.tsx` sigue redirigiendo a `/login`.
- La ruta es `/dashboard` y no `/` porque `src/app/index.tsx` ya ocupa `/`; se revisará en la fase de sesión.

Respuestas del usuario a las preguntas abiertas:

- **Q1:** docentes y administradores **también usan web**; por ahora solo se desarrolla móvil.
- **Q2:** colores y acentos se decidirán sobre la marcha. Se usan neutros del `theme` actual, sin tokens nuevos.
- **Q5:** el sidebar muestra solo el texto "Logo" hasta tener el logo.
- **Q3 y Q4** siguen abiertas.

Relacionados: [LOGIN MÓVIL](mobile/LOGIN.md), [ARCHITECTURE](ARCHITECTURE.md), [DECISIONS](DECISIONS.md) (D-11 a D-15), [PENDIENTES](PENDIENTES.md).

## 1. Idea central

Un único **shell** (estructura fija) + **configuración por rol** (navegación y contenido):

```text
┌──────────────────────────────────────────────────────────────┐
│ DashboardShell (igual para todos los roles)                  │
│  ┌─────────┬────────────────────────────────────────────┐    │
│  │ Sidebar │ Topbar (título · acciones · avatar)        │    │
│  │  marca  ├────────────────────────────────────────────┤    │
│  │  nav[]  │ Contenido (slot)                           │    │
│  │  ←rol   │   PageHeader                               │    │
│  │         │   Grid de tarjetas (StatCard, Card, List)  │    │
│  │  perfil │                                            │    │
│  └─────────┴────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

- **Shell**: sidebar, topbar y área de contenido. No conoce nada de cursos, tareas ni usuarios.
- **Configuración de rol**: lista de ítems de navegación (`{ key, label, icon, route }`) y las pantallas que llenan el slot.
- **Componentes de contenido**: tarjetas y listas genéricas que cada rol compone con sus datos.

Cambiar de rol no cambia el layout, solo `nav` y las pantallas hijas. Esto es lo que permite "armar la base y replicar".

## 2. Análisis: puntos a resolver antes de codificar

### 2.1 Reparto de plataformas (decisión pendiente de confirmar)

La arquitectura actual asigna **móvil = alumnos** y **web = docentes y administradores** (README, ARCHITECTURE). El pedido de replicar el dashboard en los tres roles es compatible con eso si se entiende así:

- El **diseño** del shell es único y vale para ambas plataformas (mismas zonas, mismos tokens, mismos nombres de componente).
- La **implementación** es doble: React Native en `apps/mobile` y React + Tailwind en `apps/web`. No hay forma de compartir componentes visuales entre ambas sin añadir dependencias (p. ej. `react-native-web`) que contradicen D-04.
- Se comparte lo que sí es portable: el rol (`Role`), las claves de navegación y los tokens de diseño (ver 2.3).

Plan propuesto: construir primero el shell **móvil con rol alumno** (es lo que ya tiene login y emulador), y después el shell **web con rol docente y administrador**. Ver pregunta abierta Q1.

### 2.2 Navegación móvil sin Drawer

Un sidebar fijo en tablet horizontal no necesita `@react-navigation/drawer`, que requeriría `react-native-gesture-handler` y `react-native-reanimated`, descartados en D-04 por memoria (tablets de 4 GB). Propuesta: layout propio de Expo Router con `<Slot />` en el área de contenido y un `Sidebar` hecho con `Pressable` + `router.push`/`usePathname` para el ítem activo. Es una dependencia menos y control total del diseño.

En anchos `< 768 px` (mismo umbral que el login) el sidebar pasa a una **barra de iconos colapsada** (solo icono, 72 px). No se implementa un menú hamburguesa en el primer paso.

### 2.3 Inconsistencia de tokens entre login y resto de la app

- [`theme/index.ts`](../apps/mobile/src/theme/index.ts) define una paleta neutra slate/azul `#2563EB` y `radius.card = 12`.
- El login usa colores y radios **fijos** en `LoginScreen` (`#1F1FFF`, `#0B0BC4`, `#f67700`, radio 32) que no están en el tema.
- `PENDIENTES.md` ya pide para el dashboard "esquinas ~12 px, colores contenidos".

Decisión propuesta (D-12): el login es una pantalla de **marca** (expresiva); el dashboard es una pantalla de **trabajo** (sobria). Para que ambos convivan:

1. Mover a `theme` los colores de marca del login como tokens (`brand`, `brandDark`, `accent`), sin cambiar su apariencia.
2. El dashboard usa neutros slate para superficies y el azul de marca solo como acento (ítem activo, botón primario, cabecera del sidebar).
3. El naranja `#f67700` queda como acento de **acción principal** puntual (ej. "Entrar a clase"), no como color general.

### 2.4 Rol: fuente única

`schema.prisma` ya define `enum Role { STUDENT TEACHER ADMIN }`. El contrato debe nacer en `packages/shared/src/roles.ts` (`roleSchema = z.enum(['STUDENT','TEACHER','ADMIN'])`) para que API, web y móvil usen los mismos valores. Los ítems de navegación (etiquetas, iconos) **no** van a `shared`, porque los iconos difieren (`lucide-react-native` vs `lucide-react`) y `shared` no depende de React.

### 2.5 Datos: mock primero

Hasta que exista autenticación (ver [LOGIN §11](mobile/LOGIN.md)), el shell se alimenta de datos estáticos locales (`features/dashboard/mocks/`). El rol activo se elige con una constante o parámetro de ruta de desarrollo, no con una sesión real. Esto se retira al implementar auth.

### 2.6 Web sin enrutador

`apps/web` hoy renderiza `AppLayout` + `DashboardPage` sin router. Para navegar entre secciones habrá que añadir `react-router` (decisión D-14, aún no instalada). El `AppLayout` actual (sidebar `w-56` con lista fija) es el germen del shell web y se refactorizará.

## 3. Anatomía del shell

Medidas de referencia para la tablet objetivo (AVD `Tablet_Academy_8_7`: 1340×800 px a 180 dpi ≈ **1190×711 dp**):

| Zona                  | Medida                | Notas                                                               |
| --------------------- | --------------------- | ------------------------------------------------------------------- |
| Sidebar expandido     | 240 dp                | Marca arriba, navegación, tarjeta de usuario + cerrar sesión abajo. |
| Sidebar colapsado     | 72 dp                 | Solo iconos; `width < 768`.                                         |
| Topbar                | 64 dp de alto         | Título de sección, acciones (notificaciones), avatar.               |
| Contenido             | resto (~950×647 dp)   | Padding 24 dp; scroll vertical interno.                             |
| Radio de tarjetas     | 12 dp (`radius.card`) | Consistente con `theme`.                                            |
| Espaciado entre cards | 16 dp (`spacing.md`)  | Grid de 12 columnas lógicas; en la práctica 2–3 tarjetas por fila.  |
| Objetivo táctil       | ≥ 48 dp               | Ítems de sidebar de 52 dp de alto.                                  |

Tipografía: Inter (D-10), con `fontFamily` del tema. Iconos: Lucide. Sin imágenes pesadas; los assets definitivos se añadirán después.

### 3.1 Wireframe (rol alumno)

```text
┌────────────┬─────────────────────────────────────────────────────┐
│ ◆ Academia │ Inicio                         🔔   (JP) Juan Pérez │
│            ├─────────────────────────────────────────────────────┤
│ ▌Inicio    │ Hola, Juan 👋                          [Alumno]     │
│  Mis cursos│                                                     │
│  Tareas    │ ┌───────────┐ ┌───────────┐ ┌───────────┐           │
│  Tutor IA  │ │ Cursos    │ │ Tareas    │ │ Progreso  │           │
│  Chat      │ │    4      │ │ pend. 3   │ │   68 %    │           │
│  Ayuda     │ └───────────┘ └───────────┘ └───────────┘           │
│            │ ┌──────────────────────────┐ ┌──────────────────┐   │
│            │ │ Continuar donde quedé    │ │ Próximas entregas│   │
│            │ │ [Álgebra · Tema 3]  ▶    │ │ • Tarea 5  Vie   │   │
│ ───────    │ │ [Geometría · Tema 1]▶    │ │ • Tarea 6  Lun   │   │
│ (JP) Juan  │ └──────────────────────────┘ └──────────────────┘   │
│  Salir     │                                                     │
└────────────┴─────────────────────────────────────────────────────┘
```

El ítem activo lleva barra lateral de acento (`▌`) y fondo `primarySoft`. Los nombres y cifras son ficticios.

## 4. Configuración por rol

Cada rol define su propia lista de navegación y su pantalla de inicio. Las secciones que dependen de funcionalidades futuras (Tutor IA, Chat, Ayuda) aparecen en el mockup pero deben abrir una pantalla vacía (`EmptyState`) hasta que exista la fase correspondiente de [PENDIENTES](PENDIENTES.md) §3.

| Rol       | Navegación (orden)                                                    | Inicio (tarjetas principales)                                                    |
| --------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `STUDENT` | Inicio · Mis cursos · Tareas · Tutor IA · Chat · Ayuda                | Cursos, tareas pendientes, progreso; continuar curso; próximas entregas.         |
| `TEACHER` | Inicio · Mis grupos · Cursos · Entregas · Chat · Solicitudes de ayuda | Alumnos a cargo, entregas por revisar, solicitudes abiertas; actividad reciente. |
| `ADMIN`   | Inicio · Usuarios · Cursos · Grupos · Reportes · Ajustes              | Totales (alumnos/docentes/cursos), altas recientes, estado del sistema.          |

Reglas:

- "Inicio" siempre es el primer ítem y la ruta por defecto del rol.
- Ningún rol ve ítems de otro; el servidor debe validar el rol de todos modos (el ocultar en la UI no es seguridad).
- La etiqueta del rol (`Alumno`, `Docente`, `Administrador`) aparece como `Badge` junto al saludo y en la tarjeta de usuario del sidebar.

## 5. Inventario de componentes

Todos viven en `src/components/` de cada app (reutilizables) salvo los que son específicos del dashboard.

| Componente         | Ubicación sugerida (móvil)                         | Responsabilidad                                                       |
| ------------------ | -------------------------------------------------- | --------------------------------------------------------------------- |
| `DashboardShell`   | `features/dashboard/components/DashboardShell.tsx` | Compone Sidebar + Topbar + slot. Recibe `role`, `nav`, `children`.    |
| `Sidebar`          | `features/dashboard/components/Sidebar.tsx`        | Marca, lista de `NavItem`, tarjeta de usuario, salir. Maneja colapso. |
| `SidebarItem`      | `features/dashboard/components/SidebarItem.tsx`    | Icono + etiqueta + estado activo/presionado. Alto 52 dp.              |
| `Topbar`           | `features/dashboard/components/Topbar.tsx`         | Título, acciones, avatar.                                             |
| `PageHeader`       | `components/PageHeader.tsx`                        | Saludo/título + descripción + acciones de página.                     |
| `Card`             | `components/Card.tsx`                              | Superficie base (fondo, borde, radio 12).                             |
| `StatCard`         | `components/StatCard.tsx`                          | Cifra + etiqueta + icono opcional.                                    |
| `ListItem`         | `components/ListItem.tsx`                          | Fila con icono/avatar, título, subtítulo, acción.                     |
| `Badge`            | `components/Badge.tsx`                             | Etiqueta de estado o rol.                                             |
| `EmptyState`       | `components/EmptyState.tsx`                        | Pantalla/bloque para secciones aún no implementadas.                  |
| `roleNav` (config) | `features/dashboard/config/nav.ts`                 | `Record<Role, NavItem[]>`.                                            |

Contrato del shell (TypeScript orientativo):

```ts
import type { Role } from '@academy/shared'; // roleSchema, ver §2.4
import type { LucideIcon } from 'lucide-react-native';

export type NavItem = { key: string; label: string; icon: LucideIcon; href: string };

type DashboardShellProps = {
  role: Role;
  nav: NavItem[];
  user: { name: string; email: string };
  children: React.ReactNode;
};
```

## 6. Estructura de rutas

### Móvil (Expo Router, `apps/mobile/src/app/`)

```text
src/app/
├── _layout.tsx                 # raíz (fuentes, splash) — ya existe
├── index.tsx                   # hoy redirige a /login; luego según sesión/rol
├── (auth)/                     # ya existe
│   ├── _layout.tsx
│   └── login.tsx
└── (app)/                      # NUEVO: requiere sesión
    ├── _layout.tsx             # DashboardShell + Slot; en el futuro, guard de sesión
    ├── index.tsx               # Inicio del rol activo
    ├── courses.tsx
    ├── tasks.tsx
    └── ...                     # una ruta por ítem de navegación
```

Se propone **un solo grupo `(app)`** con el shell parametrizado por rol, y no tres grupos `(student)/(teacher)/(admin)` duplicados. Las rutas que solo existen para un rol se protegen con un guard de rol. Si las secciones de cada rol divergen mucho, se divide en subgrupos más adelante sin cambiar el shell.

Fase mock: `index.tsx` seguirá redirigiendo a `/login`; el login, al no tener auth, navegará al dashboard con un rol fijo de desarrollo.

### Web (`apps/web/src/`)

```text
app/App.tsx                     # router (react-router, por añadir)
layouts/DashboardShell.tsx      # evolución de AppLayout
features/dashboard/             # Inicio por rol
features/<dominio>/             # alumnos, cursos, reportes...
components/                     # Card, StatCard, Badge, ...
```

## 7. Plan por fases

1. **Fase A — Shell móvil, rol alumno, datos mock.** Tokens en `theme`; `Card`, `StatCard`, `Badge`, `EmptyState`; `DashboardShell` con `Sidebar`/`Topbar`; ruta `(app)` con Inicio; navegación desde el login (sin auth). Verificar en `Tablet_Academy_8_7`.
2. **Fase B — Rol en `shared`.** `roles.ts` con `roleSchema`; `roleNav` para los tres roles en móvil (mismo shell, otras listas y otro Inicio). Permite ver los tres mockups cambiando una constante.
3. **Fase C — Shell web.** Añadir `react-router`; refactor de `AppLayout` a `DashboardShell`; Inicio de docente y administrador.
4. **Fase D — Sesión y guard.** Cuando exista auth ([LOGIN §11](mobile/LOGIN.md)): el rol viene de la sesión, `index.tsx` redirige según rol, se elimina el rol fijo de desarrollo.

Cada fase debe cerrar con `pnpm lint && pnpm typecheck` y una comprobación visual, y registrarse en [HANDOFF](HANDOFF.md).

## 8. Fuera de alcance de este mockup

Autenticación real, permisos en servidor, datos del API, tutor IA, chat, WebSockets, modo oscuro, internacionalización, animaciones de transición y assets definitivos (ilustraciones, logo, avatares).

## 9. Preguntas abiertas

- ~~**Q1.**~~ (respondida, ver §0) ¿Los docentes y administradores usarán solo web, o también necesitan el panel en tablet? Cambia si el shell móvil debe soportar los tres roles en producción o solo servir de referencia visual.
- ~~**Q2.**~~ (diferida, ver §0) ¿Se mantiene el azul de marca saturado del login como acento del dashboard, o se prefiere un azul más sobrio (`#2563EB` del tema)? Afecta a `theme`.
- **Q3.** Navegación definitiva del alumno: ¿las seis secciones propuestas (Inicio, Mis cursos, Tareas, Tutor IA, Chat, Ayuda) son correctas y están en ese orden?
- **Q4.** ¿Puede un mismo usuario tener más de un rol (p. ej. docente + administrador)? El esquema actual admite uno solo.
- ~~**Q5.**~~ (respondida, ver §0) Nombre visible de la marca en el sidebar: `APP_NAME` ("Academia José Pisconte") es largo para 240 dp; ¿se usa versión corta o logo?
