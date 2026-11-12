# Guía de estilo visual

Reglas de color, tipografía y estados para mantener la misma línea visual en todas las pantallas (login, dashboard y las que vengan). Si algo no está aquí, se toma como referencia el login y el sidebar del dashboard, y luego se documenta en este archivo.

Última revisión: 2026-11-12 (UTC). Código de referencia: [`theme/index.ts`](../apps/mobile/src/theme/index.ts), [`Sidebar.tsx`](../apps/mobile/src/features/dashboard/components/Sidebar.tsx), [`LoginScreen.tsx`](../apps/mobile/src/features/auth/screens/LoginScreen.tsx).

## 1. Principio

Dos superficies con funciones distintas:

| Superficie          | Dónde                                                 | Carácter                                                 |
| ------------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| **Marca (azul)**    | Fondo del login, sidebar del dashboard.               | Expresiva: degradado azul, texto blanco, acento naranja. |
| **Trabajo (clara)** | Área de contenido del dashboard y pantallas internas. | Sobria: fondo `#F8FAFC`, tarjetas blancas, texto slate.  |

El azul de marca **enmarca** el contenido (fondo, barra lateral); no se usa como fondo de tarjetas ni de bloques grandes dentro del área de trabajo.

## 2. Paleta

Todos los colores se consumen desde `@/theme`. **No escribir hexadecimales sueltos en las pantallas**; si hace falta un color nuevo, se añade como token y se documenta aquí.

### 2.1 Marca (`brand`)

| Token                 | Valor                    | Uso                                                                 |
| --------------------- | ------------------------ | ------------------------------------------------------------------- |
| `brand.blue`          | `#1F1FFF`                | Inicio del degradado (arriba/izquierda).                            |
| `brand.blueDeep`      | `#0B0BC4`                | Tramo medio del degradado; texto del ítem activo sobre blanco.      |
| `brand.blueNight`     | `#06065E`                | Final del degradado; color de sombras sobre azul.                   |
| `brand.accent`        | `#F67700`                | Acento: botón principal, icono del ítem activo.                     |
| `brand.accentPressed` | `#B55800`                | Estado presionado del acento; **texto naranja sobre fondo blanco**. |
| `brand.onBlue`        | `#FFFFFF`                | Texto e iconos principales sobre azul; píldora activa.              |
| `brand.onBlueMuted`   | `rgba(255,255,255,0.72)` | Texto e iconos secundarios o inactivos sobre azul.                  |
| `brand.onBlueSubtle`  | `rgba(255,255,255,0.14)` | Fondos translúcidos sobre azul: presionado, avatar, separadores.    |

Degradado de marca (igual en login y sidebar):

```ts
colors={[brand.blue, brand.blueDeep, brand.blueNight]}
locations={[0, 0.45, 1]}
start={{ x: 0, y: 0 }}
end={{ x: 0.6, y: 1 }}
```

### 2.2 Neutros de trabajo (`colors`)

| Token               | Valor     | Uso                                        |
| ------------------- | --------- | ------------------------------------------ |
| `colors.background` | `#F8FAFC` | Fondo del área de contenido.               |
| `colors.surface`    | `#FFFFFF` | Tarjetas y paneles.                        |
| `colors.border`     | `#E2E8F0` | Bordes de tarjetas y separadores en claro. |
| `colors.text`       | `#0F172A` | Texto principal.                           |
| `colors.textMuted`  | `#64748B` | Texto secundario, placeholders.            |
| `colors.danger`     | `#B91C1C` | Errores.                                   |

`colors.primary` (`#2563EB`), `primaryPressed` y `primarySoft` son del scaffold inicial y **no forman parte de la línea actual**. No usarlos en pantallas nuevas; se decidirá si se retiran o se igualan a `brand`.

### 2.3 Colores del escudo (solo referencia)

Valores aproximados medidos sobre `escudo.png`. **No son tokens**; sirven si en el futuro se necesitan colores por categoría (p. ej. por curso o materia) coherentes con el logo.

| Cuadrante         | Aprox.    |
| ----------------- | --------- |
| Naranja (cerebro) | `#F89800` |
| Azul (A)          | `#0040A0` |
| Rojo (+)          | `#C00000` |
| Verde (mundo)     | `#00A018` |
| Borde             | `#002858` |

Si se adoptan, se crean como tokens (`categories.*`) y se documentan aquí.

## 3. Reglas de uso del color

1. **Naranja = una acción por zona.** Es el color de "lo importante ahora" (botón principal, ítem activo). No usarlo para decorar ni para varias acciones a la vez en la misma vista.
2. **Sobre azul, solo blanco** (opaco, `onBlueMuted` u `onBlueSubtle`). No poner texto naranja ni gris sobre el azul.
3. **Estado activo = blanco + naranja + azul.** Píldora `brand.onBlue`, icono `brand.accent`, texto `brand.blueDeep` en negrita. Es el patrón para cualquier selector o navegación sobre azul.
4. **Presionado sobre azul** = fondo `brand.onBlueSubtle`. **Presionado sobre claro** = oscurecer el color (como `accent` → `accentPressed`).
5. **Logo a color solo sobre fondos que lo respeten.** El escudo funciona sobre azul y sobre blanco. Los logos con texto (`logo_horizontal`, `logo_vertical`) tienen texto azul marino y rojo: solo sobre fondo blanco o claro. Sobre azul se usa escudo + nombre en texto blanco (ver §5).

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

| Uso                              | Peso                     | Tamaño | `lineHeight` | Otros                                       |
| -------------------------------- | ------------------------ | ------ | ------------ | ------------------------------------------- |
| Título de pantalla (login)       | `extrabold` (800)        | 36     | —            | `letterSpacing: -0.8`                       |
| Marca: "José Pisconte"           | `extrabold` (800)        | 18     | 20           | `letterSpacing: -0.4`                       |
| Marca: "Reforzamiento Académico" | `medium` (500)           | 9,5    | 13           | `letterSpacing: -0.05`, color `onBlueMuted` |
| Botón principal                  | `bold` (700)             | 18     | —            |                                             |
| Ítem de navegación               | `medium` / `bold` activo | 16     | —            |                                             |
| Campo de formulario              | `regular` (400)          | 17     | —            |                                             |
| Nombre en pie del sidebar        | `semibold` (600)         | 15     | —            |                                             |
| Texto secundario / ayuda         | `regular` (400)          | 12     | —            | color atenuado                              |

Regla del bloque de marca: el subtítulo se ajusta para que **termine a la misma anchura que "José Pisconte"** (alineados a la izquierda, sin espacio extra entre líneas). Si se cambia el tamaño del título, escalar el subtítulo en la misma proporción (≈ 0,53 × el tamaño del título) y comprobarlo en el emulador. Se escribe "Reforzamiento Académico" con **A mayúscula**.

## 6. Forma, espaciado y elevación

| Elemento                     | Valor                                                                   |
| ---------------------------- | ----------------------------------------------------------------------- |
| Tarjeta del login            | Radio 32, padding 40, `elevation` 16                                    |
| Sidebar                      | Esquinas derechas 28, `elevation` 12; 72 dp plegado / 240 dp desplegado |
| Tarjetas del área de trabajo | Radio 12 (`radius.card`)                                                |
| Campos y botones del login   | Alto 62, radio 18                                                       |
| Ítems de navegación          | Alto 48 (objetivo táctil mínimo), píldora (radio 24)                    |
| Espaciado                    | Escala `spacing`: 4 · 8 · 16 · 24 · 32 · 48                             |
| Sombras                      | Color `brand.blueNight` (o `#020230` en login), nunca negro puro        |

## 7. Iconos y decoración

- Iconos: **Lucide** (`lucide-react-native`), tamaño 22, trazo 2 (2,4 en estado activo). Nada de emojis ni símbolos Unicode como iconos.
- Decoración matemática (`∑`, `π`, cuadrícula, curvas): eco del fondo del login. Siempre `pointerEvents="none"`, blanca y muy tenue (opacidad ≈ 0,06 en el sidebar). No colocarla donde quede cortada en el borde de forma que parezca un error; en el sidebar plegado se oculta.

## 8. Checklist para una pantalla o componente nuevo

- [ ] Colores solo desde `brand` / `colors`; ningún hex suelto.
- [ ] ¿Es superficie de marca (azul) o de trabajo (clara)? Aplicar §1.
- [ ] Una sola acción naranja por zona.
- [ ] Contraste de texto ≥ 4,5:1 (§4).
- [ ] Inter vía `fontFamily`; tamaños de la tabla §5 o justificar uno nuevo y añadirlo.
- [ ] Objetivos táctiles ≥ 48 dp.
- [ ] Revisado en `Tablet_Academy_8_7` (horizontal).
- [ ] Si se introduce un valor nuevo (color, tamaño, radio), documentarlo aquí.

## 9. Deuda pendiente

- `LoginScreen.tsx` usa hexadecimales fijos equivalentes a `brand`; migrarlos sin cambio visual.
- Retirar o reasignar `colors.primary*` del scaffold.
- Contraste del naranja en el login (§4).
