# Guía de estilo visual

Reglas de color, tipografía y estados para mantener la misma línea visual en todas las pantallas (login, dashboard y las que vengan). Si algo no está aquí, se toma como referencia el login y el sidebar del dashboard, y luego se documenta en este archivo.

Última revisión: 2026-11-21 (UTC). Código de referencia: [`theme/index.ts`](../apps/mobile/src/theme/index.ts), [`Sidebar.tsx`](../apps/mobile/src/features/dashboard/components/Sidebar.tsx), [`LoginScreen.tsx`](../apps/mobile/src/features/auth/screens/LoginScreen.tsx), [`StudentHome.tsx`](../apps/mobile/src/features/dashboard/screens/StudentHome.tsx) (Inicio del alumno, referencia del área de trabajo).

## 1. Principio

Dos superficies con funciones distintas:

| Superficie          | Dónde                                                 | Carácter                                                 |
| ------------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| **Marca (azul)**    | Fondo del login, sidebar del dashboard.               | Expresiva: degradado azul, texto blanco, acento naranja. |
| **Trabajo (clara)** | Área de contenido del dashboard y pantallas internas. | Sobria: fondo `#F8FAFC`, tarjetas blancas, texto slate.  |

El azul de marca **enmarca** el contenido (fondo, barra lateral); no se usa como fondo de tarjetas ni de bloques grandes dentro del área de trabajo. **El fondo del área de trabajo es siempre claro** (`colors.background`): se probó un fondo azul completo (2026-11-21) y se descartó porque el contenido se pierde.

**Excepción — tarjeta destacada (2026-11-21):** cada vista puede tener **una sola** tarjeta con el degradado de marca, como "Continúa aprendiendo" en el Inicio del alumno (`ResumeCard`). Dentro se aplican las reglas de "sobre azul" (§3, regla 2): texto blanco, chips de vidrio (`onBlueSubtle` + borde `onBlueBorder`), decoración `∑`/`π`/`√` tenue en lugar de fotos y como mucho una acción principal (botón circular blanco).

Las vistas del área de trabajo siguen un lenguaje **minimalista**: tarjetas blancas con sombra suave, cifras grandes en peso regular, un solo color de acento (azul de marca) y el naranja reservado para indicadores de avance (§3, regla 6).

## 2. Paleta

Todos los colores se consumen desde `@/theme`. **No escribir hexadecimales sueltos en las pantallas**; si hace falta un color nuevo, se añade como token y se documenta aquí.

### 2.1 Marca (`brand`)

| Token                 | Valor                    | Uso                                                                          |
| --------------------- | ------------------------ | ---------------------------------------------------------------------------- |
| `brand.blue`          | `#1F1FFF`                | Inicio del degradado (arriba/izquierda).                                     |
| `brand.blueDeep`      | `#0B0BC4`                | Tramo medio del degradado; texto del ítem activo sobre blanco.               |
| `brand.blueNight`     | `#06065E`                | Final del degradado; color de sombras sobre azul.                            |
| `brand.accent`        | `#F67700`                | Acento: botón principal, icono del ítem activo.                              |
| `brand.accentPressed` | `#B55800`                | Estado presionado del acento; **texto naranja sobre fondo blanco**.          |
| `brand.onBlue`        | `#FFFFFF`                | Texto e iconos principales sobre azul; píldora activa.                       |
| `brand.onBlueMuted`   | `rgba(255,255,255,0.72)` | Texto e iconos secundarios o inactivos sobre azul.                           |
| `brand.onBlueSubtle`  | `rgba(255,255,255,0.14)` | Fondos translúcidos sobre azul: presionado, avatar, separadores.             |
| `brand.onBlueBorder`  | `rgba(255,255,255,0.24)` | Borde de superficies de vidrio sobre azul (chips de la tarjeta destacada).   |
| `brand.blueSoft`      | `#E8E8FF`                | Fondo suave de marca sobre blanco: `IconChip`, avatares, halo de la gráfica. |

Degradado de marca (igual en login y sidebar):

```ts
colors={[brand.blue, brand.blueDeep, brand.blueNight]}
locations={[0, 0.45, 1]}
start={{ x: 0, y: 0 }}
end={{ x: 0.6, y: 1 }}
```

### 2.2 Neutros de trabajo (`colors`)

| Token               | Valor     | Uso                                                                |
| ------------------- | --------- | ------------------------------------------------------------------ |
| `colors.background` | `#F8FAFC` | Fondo del área de contenido.                                       |
| `colors.surface`    | `#FFFFFF` | Tarjetas y paneles.                                                |
| `colors.border`     | `#E2E8F0` | Bordes de tarjetas y separadores en claro.                         |
| `colors.text`       | `#0F172A` | Texto principal.                                                   |
| `colors.textMuted`  | `#64748B` | Texto secundario, placeholders.                                    |
| `colors.track`      | `#F1F5F9` | Pista de barras; fondo del icono de cabecera de tarjeta.           |
| `colors.trackFill`  | `#CBD5E1` | Relleno neutro: barras inactivas, libros de la racha sin estudiar. |
| `colors.danger`     | `#B91C1C` | Errores.                                                           |

`colors.primary` (`#2563EB`), `primaryPressed` y `primarySoft` son del scaffold inicial y **no forman parte de la línea actual**. No usarlos en pantallas nuevas; se decidirá si se retiran o se igualan a `brand`.

### 2.3 Colores del escudo (`categories`)

Valores aproximados medidos sobre `escudo.png`. **Adoptados como tokens `categories.*` el 2026-11-21**, reservados para identificar materias o categorías cuando haga falta; **no** se usan para decorar (el acento del área de trabajo es el azul de marca). Usos actuales: `categories.orange.soft` como pista de la barra de meta en "Horas" (Inicio) y la **paleta por materia de "Mis cursos"** (`courseVisuals.ts`: `brand` + los cuatro colores del escudo; `soft` = fondo de la ilustración, `base` = círculos decorativos al 12–18 %, `ink` = icono y nombre de la materia). Cada uno tiene `base` (color del escudo), `soft` (fondo, ~10 %) e `ink` (icono o texto sobre `soft`, ≥ 4,5:1).

| Token               | `base`    | `soft`    | `ink`     |
| ------------------- | --------- | --------- | --------- |
| `categories.blue`   | `#0040A0` | `#E6ECF6` | `#0040A0` |
| `categories.orange` | `#F89800` | `#FEF5E6` | `#B55800` |
| `categories.red`    | `#C00000` | `#F9E6E6` | `#C00000` |
| `categories.green`  | `#00A018` | `#E6F6E8` | `#007A12` |

Medición original:

| Cuadrante         | Aprox.    |
| ----------------- | --------- |
| Naranja (cerebro) | `#F89800` |
| Azul (A)          | `#0040A0` |
| Rojo (+)          | `#C00000` |
| Verde (mundo)     | `#00A018` |
| Borde             | `#002858` |

## 3. Reglas de uso del color

1. **Naranja = una acción por zona.** Es el color de "lo importante ahora" (botón principal, ítem activo). No usarlo para decorar ni para varias acciones a la vez en la misma vista.
2. **Sobre azul, solo blanco** (opaco, `onBlueMuted` u `onBlueSubtle`). No poner texto naranja ni gris sobre el azul.
3. **Estado activo = blanco + naranja + azul.** Píldora `brand.onBlue`, icono `brand.accent`, texto `brand.blueDeep` en negrita. Es el patrón para cualquier selector o navegación sobre azul.
4. **Presionado sobre azul** = fondo `brand.onBlueSubtle`. **Presionado sobre claro** = oscurecer el color (como `accent` → `accentPressed`).
5. **Naranja como indicador de avance (área de trabajo).** Además de la acción principal, `brand.accent` marca progreso hacia una meta: anillo de la racha, llama del día de hoy, barra de meta de horas, anillo "Restante" de la tarjeta destacada. No se usa para texto sobre blanco (usar `accentPressed`, §4) ni para botones con texto blanco.
6. **Logo a color solo sobre fondos que lo respeten.** El escudo funciona sobre azul y sobre blanco. Los logos con texto (`logo_horizontal`, `logo_vertical`) tienen texto azul marino y rojo: solo sobre fondo blanco o claro. Sobre azul se usa escudo + nombre en texto blanco (ver §5).

## 4. Contraste (WCAG)

| Combinación                                     | Ratio  | Resultado                                                                  |
| ----------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| Blanco sobre `blue`                             | 7,8:1  | ✅ Texto de cualquier tamaño                                               |
| Blanco sobre `blueDeep`                         | 11,3:1 | ✅                                                                         |
| `onBlueMuted` sobre `blue`                      | 4,5:1  | ✅ Justo en el mínimo AA; no bajar más la opacidad                         |
| `blueDeep` sobre blanco                         | 11,3:1 | ✅                                                                         |
| `accentPressed` sobre blanco                    | 4,8:1  | ✅ Usar para **texto** naranja en fondo blanco                             |
| `accent` sobre blanco (o blanco sobre `accent`) | 2,8:1  | ⚠️ No cumple AA para texto; aceptable solo en iconos grandes o decorativos |

Pendiente conocido: el login usa `#F67700` en "¿Olvidaste tu contraseña?" y como fondo del botón con texto blanco (2,8:1). Se mantiene por decisión de diseño; si se prioriza la accesibilidad, cambiar a `accentPressed` o un naranja más oscuro.

## 5. Tipografía

Familia única: **Inter** (D-10), siempre vía `fontFamily` del tema. En Android, para bloques de texto apilados ajustados se usa `includeFontPadding: false` + `lineHeight` explícito; si no, Inter añade espacio vertical extra.

| Uso                                    | Peso                     | Tamaño | `lineHeight` | Otros                                            |
| -------------------------------------- | ------------------------ | ------ | ------------ | ------------------------------------------------ |
| Título de pantalla (login)             | `extrabold` (800)        | 36     | —            | `letterSpacing: -0.8`                            |
| Marca: "José Pisconte"                 | `extrabold` (800)        | 18     | 20           | `letterSpacing: -0.4`                            |
| Marca: "Reforzamiento Académico"       | `medium` (500)           | 9,5    | 13           | `letterSpacing: -0.05`, color `onBlueMuted`      |
| Botón principal                        | `bold` (700)             | 18     | —            |                                                  |
| Ítem de navegación                     | `medium` / `bold` activo | 16     | —            |                                                  |
| Campo de formulario                    | `regular` (400)          | 17     | —            |                                                  |
| Nombre en pie del sidebar              | `semibold` (600)         | 15     | —            |                                                  |
| Texto secundario / ayuda               | `regular` (400)          | 12     | —            | color atenuado                                   |
| Título de tarjeta (`CardHeader`)       | `bold` (700)             | 16     | —            | junto a icono en círculo `colors.track` (36)     |
| Título de sección (`typography.title`) | `bold` (700)             | 18     | —            | `letterSpacing: -0.2`                            |
| Cifra destacada (racha, cursos, horas) | `regular` (400)          | 40     | —            | `letterSpacing: -1`; unidad 16 `medium` atenuada |
| Título de tarjeta destacada            | `regular` (400)          | 44     | 52           | `letterSpacing: -1`, blanco                      |
| Etiquetas de ejes / chips              | `regular` / `semibold`   | 11–13  | —            |                                                  |

Regla del bloque de marca: el subtítulo se ajusta para que **termine a la misma anchura que "José Pisconte"** (alineados a la izquierda, sin espacio extra entre líneas). Si se cambia el tamaño del título, escalar el subtítulo en la misma proporción (≈ 0,53 × el tamaño del título) y comprobarlo en el emulador. Se escribe "Reforzamiento Académico" con **A mayúscula**.

## 6. Forma, espaciado y elevación

| Elemento                     | Valor                                                                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tarjeta del login            | Arcilla blanca: radio 32, padding 34/40, canto `blueSoft` de 10 dp, `elevation` 16 (ver [LOGIN](mobile/LOGIN.md) §4)                                  |
| Sidebar                      | Esquinas derechas 28, `elevation` 12; 72 dp plegado / 240 dp desplegado                                                                               |
| Tarjetas del área de trabajo | Radio 20 (`radius.card`), padding 24, blancas, sin borde, sombra `shadows.card`                                                                       |
| Tarjeta destacada (azul)     | Igual que una tarjeta (radio 20, `shadows.card`) con el degradado de marca; una por vista (§1)                                                        |
| Chips e iconos en cuadro     | Radio 14 (`radius.chip`); `IconChip` con fondo `brand.blueSoft` e icono `brand.blueDeep`                                                              |
| Píldoras y círculos          | `radius.pill` (999): botones redondeados, avatares, medallas, icono de cabecera de tarjeta                                                            |
| Separación entre tarjetas    | 16 dp (`spacing.md`); padding del área de contenido 24 dp                                                                                             |
| Campos y botones del login   | Alto 60, radio 18; botones `Raised3D` (`accent` y `white`)                                                                                            |
| Ítems de navegación          | Alto 48 (objetivo táctil mínimo), píldora (radio 24)                                                                                                  |
| Espaciado                    | Escala `spacing`: 4 · 8 · 16 · 24 · 32 · 48                                                                                                           |
| Sombras                      | Color `brand.blueNight` (o `#020230` en login), nunca negro puro; token `shadows.card` (opacidad 0,08)                                                |
| Animación                    | Entrada escalonada (`FadeIn`, 420 ms, 90 ms entre bloques); barras y anillos se llenan al aparecer. Solo `Animated` nativo (D-04 descarta reanimated) |

### 6.1 Patrones del área de trabajo

- **Tarjeta de curso** (`CourseGridCard`): tarjeta con padding 12; portada 3D de la materia (120 dp, radio 14; ver §7) con píldora blanca de materia arriba a la izquierda y marcador en círculo blanco arriba a la derecha; título 17 `bold`; meta (lecciones · horas) 12 atenuada; "Progreso"/"Completado" + % y barra `blueDeep` sobre `colors.track`; botón de ancho completo `blueSoft` con texto `blueDeep` ("Continuar", "Empezar" a 0 %, "Repasar" a 100 %). No se muestra docente.
- **Pestañas de filtro**: barra agrupada sobre `colors.track`, desplazable horizontalmente cuando haga falta; opciones de 48 dp con etiqueta y contador separado. La activa usa fondo blanco y texto `blueDeep` semibold; el contador activo usa `blueSoft`.
- **Selector cuadrícula/lista**: contenedor blanco con borde, radio 14; opción activa `blueDeep` con icono blanco.
- **Barra de Cursos**: buscador a la izquierda; estados (Todos/En progreso/Completados/Favoritos, con contador de los cursos que coinciden con la búsqueda) y selector cuadrícula/lista a la derecha. Sin botón Filtros.
- **Cuadrícula responsive**: 3 columnas; 2 si el contenido mide < 820 dp. Huecos invisibles en la última fila para mantener el ancho de columna.
- **Tipos de evento (Calendario asincrónico)** (`calendarVisuals.ts`): Entrega = `categories.orange` (portapapeles), Asesoría = `categories.green` (insignia con check), Simulacro / actividad = marca (`blueSoft`/`blueDeep`, calendario 3D). Sin clases diarias. Día seleccionado = borde `brand.blue` de 2 dp sobre blanco; día sin eventos = estado vacío con calendario 3D y una acción `Raised3D`. El mismo color identifica el tipo en resúmenes, puntos del mes, agenda y leyenda. **No hay videollamadas** (retiradas por decisión del usuario, 2026-11-21).
- **Superficies "premium" con escena 3D**: toda tarjeta o fila de color (`soft`) lleva `SoftScene` detrás (luz blanca en elipses superpuestas, colinas blancas translúcidas y círculo `base` al 10 %) y un `Clay3DIcon` en lugar del icono plano. Usado en resúmenes, mes y agenda; mismo lenguaje que las portadas de Cursos.
- **Controles 3D** (`Raised3D`): botones y selecciones con canto inferior (3–4 dp) y cara encima; al pulsar, la cara baja. Variantes: `accent` (cara naranja `brand.accent` + brillo, canto `accentPressed`) **solo para la acción principal del login**; `primary` (degradado `blue` → `blueDeep` + brillo `onBlueSubtle`, canto `blueNight`) para lo **seleccionado** (pestaña activa, vista activa); `soft` (cara `soft` con `SoftScene`, canto `base` al 28 %) para **acciones** (“Continuar”, “Empezar”, “Repasar”); `white` (cara blanca con borde, canto `colors.border`) para **secundarios** (Filtros, favorito en lista). Los elementos planos que conviven con ellos llevan `marginBottom` igual al canto para alinear alturas.
- **Inicio 3D**: cabeceras de tarjeta con `CardHeader clay` (icono 3D de 40 dp en lugar del círculo gris): llama naranja (racha), monitor de marca (cursos), reloj de marca (horas), trofeo naranja (logros). La tarjeta destacada lleva la π 3D de las portadas en «arcilla» blanca con canto `blueSoft` (`CourseObject`) y el botón ▶ es `Raised3D` blanco. Libros de la racha con canto y brillo; hoy = llama 3D. Medallas, «···» y «Hace 2 días» son `Raised3D` (seleccionada en `primary`). Gráfica de horas: área con degradado `blue` 22 % → 0, sombra de la línea desplazada 4 dp y punto final con volumen.
- **Tareas** (`StudentTasks`): las cuatro tarjetas de resumen (Pendientes, Para hoy, Entregadas, Promedio) son el **selector de vista** (sin barra secundaria ni Filtros); patrón **lista + detalle** (lista 1,15 · detalle 1; se apilan < 760 dp). Fila: miniatura 3D de la materia (`CourseBanner compact`), título, materia · tipo y chip de estado (naranja = vence hoy, rojo = vencida, verde = entregada/calificada, neutro = pendiente). Fila seleccionada: `blueSoft` + escena + sombra. Detalle: portada 3D, chips, instrucciones, material como `Raised3D` blancos, avance o nota (anillo verde con comentario) y acciones `Raised3D` (primaria «Resolver tarea», blanca «Pedir ayuda»; en el historial, la nota y el detalle de la entrega).
- **`SceneStatTile`** (compartido): tarjeta de resumen con escena 3D; la usan Calendario y Tareas.
- **Detalle de curso** (`CourseDetail`, se abre con «Continuar» en Mis cursos o desde «Continúa aprendiendo»): cabecera con volver (`Raised3D` blanco), miniatura 3D, área, curso general y lección actual; a la derecha, progreso del curso y selector 3D «Lección» / «Recursos». La columna izquierda (reproductor + **resumen de la lección** con objetivos y conceptos en píldoras `blueSoft`) no cambia al alternar; ya no hay selector Recursos/Ejercicios/Notas ni chat en esta vista. «Recursos» = material de estudio (chip «Generado con IA» en `blueSoft`) + «Tu tarea» con «Resolver tarea». El temario usa candado en lo bloqueado y no es navegable (avance secuencial).
  - **Lección**: reproductor = portada 3D grande con play `Raised3D` primario y controles sobre vidrio `blueNight` 55 %; pestañas 3D Recursos/Ejercicios/Notas; recursos con chip de color por tipo (PDF rojo, PPTX naranja, XLSX verde) y descarga `Raised3D` blanca.
  - **Roadmap** (`RoadmapCard`): unidades desplegables; nodos 3D (hecho = verde con check, actual = azul con play, pendiente = anillo); línea vertical entre lecciones (verde en el tramo hecho); lección actual en `blueSoft` con escena y píldora «En curso»; la tarea con portapapeles 3D.
  - **Asistente IA** (`ChatPanel`): pestañas Asistente IA / Docente; burbujas del alumno en `blueSoft` a la derecha, de la IA/docente blancas con sombra a la izquierda; avatar de la IA = `Raised3D` primario con destellos. Al final, aviso verde con escena «¿Sigue sin quedar claro?» → «Pedir ayuda».
  - **Paso al docente** (sin videollamadas): «Pedir ayuda al docente» envía una solicitud, abre la pestaña Docente con el aviso «Solicitud de ayuda enviada» y la tarjeta lateral pasa a «Solicitud enviada» + «Ir al chat con el docente».
- **Login 3D** (2026-11-27): misma estructura; tarjeta de arcilla blanca con canto `blueSoft`, cabecera con `Clay3DIcon student` sobre azulejo `blueSoft` + escena, iconos de campo en chips `Raised3D` (`soft` → `primary` al enfocar), botón principal `Raised3D accent` y registro `Raised3D white`. Junto al logo, `FloatingClay` (libro rojo, trofeo naranja, calendario verde) con los colores del escudo. Fondo: solo cuadrícula, geometría tenue, resplandores y símbolos; sin ejes ni curvas.
- **Sidebar del alumno**: misma forma y degradado azul; los ítems usan `Clay3DIcon` de 34 dp (campo `clay` en `roleNavigation.ts`, solo `STUDENT`): Inicio = monitor verde, Cursos = libro rojo, Tareas = portapapeles naranja, Calendario = calendario verde, Progreso = trofeo naranja (colores de `categories`, visibles sobre el azul). El ítem activo pasa a la paleta de marca (azul) sobre la píldora blanca. Docente y administrador conservan los iconos Lucide.
- **Ranking** (`RankingCard`, `RankingDetailCard`): chip 3D dorado con «#3 de 60» (`Raised3D soft` con `categories.orange`) y filas 3D (`RankingRow3D`: tarjeta blanca con canto; la del alumno `soft` dorada con escena, borde `orange.base` y píldora «Tú» naranja con canto). Medallón de posición con canto: dorado en el podio (1–3), neutro en el resto. Sin puntuaciones de terceros. Solo informativo: no hay clasificación completa.
- **Logros (Inicio)**: contador 3D dorado «8/24» en la cabecera; detrás del último logro, halo `orange.soft` y destellos dorados; píldora «materia · cuándo»; barra «Próximo: …» (`brand.accent` sobre `orange.soft`) ligada a la racha; medallas 3D más pequeñas.
- **Tareas en un solo viewport**: resúmenes arriba; lista y detalle ocupan el alto restante. La lista **no se desplaza**: en Pendientes muestra «Hoy» y debajo «Próximas», solo las filas que caben enteras (`fitSections`); lo demás no se muestra. El detalle se desplaza por dentro y sus acciones quedan fijas abajo.
- **Inicio en un solo viewport**: sin scroll vertical; las dos filas se reparten el alto (`flex: 1`) y las tarjetas usan padding 20 con una zona flexible (cuadrícula de la racha, gráfica de horas, pila de logros, filas del ranking).
- **Progreso** (`StudentProgress`) en **un solo viewport**: hero azul (la tarjeta destacada de la vista) con escalones de arcilla blanca y flecha dorada (`categories.orange`); «Mi posición» en `orange.soft` con escena y trofeo 3D; métricas con `SceneStatTile compact` sin chevron; rendimiento por curso en filas de una línea (miniatura 3D, curso, barra de avance, % y promedio /20 o «Sin calificar»); ranking con filas 3D. Sin «Mi evolución académica» ni clasificación completa. La **tarjeta académica** es un modal vertical `blueDeep → blueNight` con borde y cifras doradas.
- **Selector por tarjetas** (Tareas): `SceneStatTile` con `selected` = borde de 2 dp y barra inferior de 5 dp en el `ink` del tipo (no depende solo del color).
- **Espacio de resolución** (`TaskWorkspace`): cabecera con volver, miniatura, curso · unidad/lección, título y píldora de estado; chat (Asistente IA / Docente) a la izquierda con scroll interno; «Tu tarea» (instrucciones, PDF, intentos, «Entregar tarea») y la tarjeta verde del docente a la derecha. Los botones de cámara y archivo se muestran deshabilitados hasta integrar la cámara.
- **Buscador** (Cursos): campo blanco con borde, radio 14, 52 dp, lupa y botón circular para limpiar.
- **Acompañamiento escolar** (`features/school-support`): mismos patrones. Tarjeta destacada azul «¿Qué vamos a aprender hoy?» con cámara 3D en arcilla blanca y dos `Raised3D` blancos (Escanear tarea, Buscar tema); el escaneo es un modal con opciones `Raised3D soft` de radio 20, una «hoja» `orange.soft` ligeramente girada como vista previa y bloques de tema en `colors.background`. Barras de práctica 3D (canto `trackFill`, la semana actual en `blue` con canto `blueNight`).
- **Contactar con docente**: en la tarjeta verde «¿Necesitas a tu docente?», botón `Raised3D` blanco con el icono estilo Google Meet (`components/brand/GoogleMeetIcon.tsx`) y el texto «Contactar con docente» en `green.ink`. Los colores de Google son una **excepción documentada** a la regla de no usar hex sueltos (marca de un tercero); antes de producción usar el recurso oficial según sus normas de marca. En el chat, el aviso dice «¿Sigue sin quedar claro? Un docente puede ayudarte» (sin nombre del docente) con el botón «Pedir ayuda».
- **Kit `Clay3DIcon`**: cámara, portapapeles, libro, insignia, matraz, calendario, llama, reloj, trofeo y monitor. Para una figura nueva: añadir la clave en `Clay3DKind` y su dibujo en `PARTS` (cara `base`, lateral `ink` desplazado, brillo blanco degradado).
- **Barras de progreso**: con el color por defecto, relleno en degradado `blue` → `blueDeep` con brillo; 10 dp de alto. Con color propio (blanco sobre azul, verde) siguen lisas.
- **Píldoras y botones flotantes sobre portadas** (materia, favorito): blancos con `shadows.card`.
- **Tarjeta de resumen por tipo** (`StatTile`): fondo `soft` + escena, sombra `shadows.card`; etiqueta 14 semibold, cifra 34 extrabold, pie 12 con chevron; icono 3D de 68 dp a la derecha. Las etiquetas no se truncan.
- **Mini calendario**: tarjeta `blueSoft` con escena; cabecera con icono 3D de calendario; semana empieza en lunes; hoy = botón 3D (lateral `blueNight` desplazado 4 dp, cara con degradado `blue` → `blueDeep` y brillo `onBlueSubtle`); días de otro mes en `colors.trackFill`; hasta tres puntos de 5 dp por día (blancos sobre hoy).
- **Agenda del día**: selector de vista segmentado (fondo `colors.track`, opción activa blanca con texto `blueDeep`); cada evento con hora a la izquierda y tarjeta `soft` con escena, icono 3D de 42 dp, título bold, subtítulo y píldora blanca de duración o estado.
- **Calendario responsive**: un solo viewport sin scroll global: resúmenes arriba y, en el área flexible, mes + leyenda (360 dp) y agenda con bordes inferiores alineados; las semanas del mes se reparten en el alto disponible y la agenda se desplaza por dentro. Por debajo de 760 dp se apilan (con scroll). Ya no hay «Próximos eventos».
- **Técnica SVG**: dentro de una superficie con padding, el SVG de fondo va dentro de una `View` con `absoluteFill` (si no, su `100 %` se calcula sin el padding y deja un borde sin escena). Para luces estiradas usar formas con opacidad, no `RadialGradient` (Android lo corta en un borde recto).

## 7. Iconos y decoración

- Iconos: **Lucide** (`lucide-react-native`), tamaño 22, trazo 2 (2,4 en estado activo). Nada de emojis ni símbolos Unicode como iconos.
- Excepción: el **libro con marcapáginas** de la racha (`StreakBook` en `StreakCard.tsx`) es un SVG propio (22 × 26, radio 4, cinta blanca) porque Lucide no tiene un equivalente relleno. Estudiado = `brand.blueDeep`, sin estudiar = `colors.trackFill`, hoy = llama Lucide `brand.accent` rellena.
- **Portadas 3D de materias** (`CourseIllustration.tsx`): estilo "arcilla" de la referencia dibujado en SVG, sin imágenes. Cada objeto (π con cubos, matraz con burbujas, pieza de puzle, libro abierto, templo, globo terráqueo) tiene cara frontal en `base`, lateral desplazado en `ink`, brillo blanco degradado y sombra elíptica en el suelo; el fondo lleva luz radial blanca y colinas blancas translúcidas sobre `soft`. Todo sale de la paleta de la materia con opacidades (sin hex nuevos). Para una materia nueva: añadir su clave en `CourseIcon` y su dibujo en `ILLUSTRATIONS`. Si más adelante hay renders PNG definitivos, sustituyen a estos SVG sin cambiar la tarjeta.
- Gráficas con `react-native-svg`: línea `brand.blueDeep` de 3 dp, cuadrícula punteada `colors.border`, último punto resaltado con halo `brand.blueSoft`.
- Decoración matemática (`∑`, `π`, cuadrícula, curvas): eco del fondo del login. Siempre `pointerEvents="none"`, blanca y muy tenue (opacidad ≈ 0,06 en el sidebar). No colocarla donde quede cortada en el borde de forma que parezca un error; en el sidebar plegado se oculta.

## 8. Checklist para una pantalla o componente nuevo

- [ ] Colores solo desde `brand` / `colors`; ningún hex suelto.
- [ ] ¿Es superficie de marca (azul) o de trabajo (clara)? Aplicar §1.
- [ ] Una sola acción naranja por zona.
- [ ] Contraste de texto ≥ 4,5:1 (§4).
- [ ] Inter vía `fontFamily`; tamaños de la tabla §5 o justificar uno nuevo y añadirlo.
- [ ] Objetivos táctiles ≥ 48 dp.
- [ ] Revisado en `Tablet_Academy_8_7` (horizontal), **con el sidebar plegado y desplegado** (el ancho del contenido pasa de ~1070 a ~900 dp): ningún texto cortado ni desbordado.
- [ ] Si se introduce un valor nuevo (color, tamaño, radio), documentarlo aquí.

## 9. Deuda pendiente

- `MathBackground.tsx` usa hexadecimales fijos (degradado, resplandores); `LoginScreen.tsx` ya usa los tokens.
- Retirar o reasignar `colors.primary*` del scaffold.
- Contraste del naranja en el login (§4).
