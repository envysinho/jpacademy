# Prototipo de login móvil

Documento técnico y visual del prototipo de inicio de sesión de la aplicación Android para alumnos. El prototipo se considera **finalizado a nivel de frontend visual**; la autenticación, recuperación de contraseña y creación de cuentas todavía no están conectadas al API.

Última revisión: 2026-11-11 (UTC).

## 1. Alcance actual

La aplicación abre directamente la pantalla `/login`. El prototipo incluye:

- Diseño horizontal para las tablets institucionales.
- Tarjeta de inicio de sesión alineada a la derecha.
- Fondo matemático vectorial y responsivo.
- Campos controlados de correo electrónico y contraseña.
- Botón para mostrar u ocultar la contraseña.
- Acciones visuales para iniciar sesión, recuperar contraseña y registrarse.
- Tipografía Inter y set de iconos Lucide.
- Adaptación básica para anchos inferiores a 768 px.
- Respeto de áreas seguras, teclado y barra de estado.

Excepción temporal: el botón principal "Iniciar sesión" navega a `/dashboard` (ver [`../DASHBOARD.md`](../DASHBOARD.md)); se reemplazará por el flujo real de autenticación. El resto de acciones del formulario son intencionalmente inertes. No muestran mensajes temporales ni errores rojos hasta que exista el flujo real de autenticación.

## 2. Estructura de carpetas

Los archivos se mantienen separados por responsabilidad: `src/app` solo declara rutas y navegación; `src/features/auth` contiene la implementación del dominio de autenticación.

```text
apps/mobile/
├── app.json
├── package.json
└── src/
    ├── app/
    │   ├── (auth)/
    │   │   ├── _layout.tsx
    │   │   └── login.tsx
    │   ├── _layout.tsx
    │   └── index.tsx
    ├── features/
    │   └── auth/
    │       ├── components/
    │       │   └── MathBackground.tsx
    │       └── screens/
    │           └── LoginScreen.tsx
    └── theme/
        └── index.ts
```

### Responsabilidad de cada archivo

| Archivo                                           | Responsabilidad                                                                                                   |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `src/app/index.tsx`                               | Punto de entrada. Redirige a `/login`. En el futuro decidirá entre autenticación y dashboard según la sesión.     |
| `src/app/(auth)/_layout.tsx`                      | Stack de rutas de autenticación sin encabezado visible.                                                           |
| `src/app/(auth)/login.tsx`                        | Declara la ruta `/login` y renderiza `LoginScreen`. No contiene lógica visual.                                    |
| `src/app/_layout.tsx`                             | Carga Inter, mantiene el splash hasta que las fuentes estén listas, configura la barra de estado y el Stack raíz. |
| `src/features/auth/screens/LoginScreen.tsx`       | Composición del formulario, estado local de los campos, comportamiento visual y estilos de la tarjeta.            |
| `src/features/auth/components/MathBackground.tsx` | Fondo SVG matemático, decorativo y sin interacción.                                                               |
| `src/theme/index.ts`                              | Tokens compartidos de color, espaciado, radio y familias tipográficas.                                            |

El grupo `(auth)` organiza las rutas, pero no forma parte de la URL. Por eso `src/app/(auth)/login.tsx` corresponde a `/login` y no a `/auth/login`.

## 3. Flujo de navegación

```text
Inicio de Expo Router
        │
        ▼
src/app/index.tsx
        │ Redirect
        ▼
      /login
        │
        ▼
src/app/(auth)/login.tsx
        │
        ▼
LoginScreen
```

La separación permite que, cuando exista una sesión persistida, `index.tsx` pueda redirigir a un grupo futuro como `(student)` sin modificar la pantalla de login.

## 4. Composición visual

### Fondo

`MathBackground` ocupa toda la pantalla con un SVG de `viewBox="0 0 1200 700"` y `preserveAspectRatio="xMidYMid slice"`. Esto evita bitmaps pesados y mantiene nitidez en distintas densidades.

Incluye:

- Degradado principal azul: `#1F1FFF` → `#0B0BC4` → `#06065E`.
- Resplandor cian y resplandor violeta mediante gradientes radiales.
- Cuadrícula matemática con líneas principales y secundarias.
- Ejes cartesianos con indicadores `x` e `y`.
- Curva senoidal generada por código.
- Parábola discontinua y punto de vértice.
- Círculo con radio, triángulo rectángulo y transportador.
- Símbolos matemáticos decorativos: `π`, `∑`, `∫`, `√x`, `∞`, `Δ`, `θ`, `÷`, `x²` y `≈`.

El componente usa `pointerEvents="none"`, por lo que nunca bloquea los controles, y está envuelto con `memo` para evitar renderizados innecesarios. Las rutas de las funciones y las colecciones de líneas se calculan fuera del componente.

### Distribución responsiva

`LoginScreen` consulta el ancho mediante `useWindowDimensions()`:

- `width >= 768`: se reserva un panel visual a la izquierda y la tarjeta se alinea a la derecha.
- `width < 768`: se oculta el espacio de presentación y la tarjeta queda centrada con padding reducido.

La configuración principal de Expo fija orientación horizontal, pero este ajuste evita que la interfaz se rompa en ventanas o dispositivos más estrechos.

### Tarjeta de login

Valores principales del prototipo:

| Propiedad                            | Valor                                  |
| ------------------------------------ | -------------------------------------- |
| Ancho máximo                         | `520` px                               |
| Padding interno                      | `40` px                                |
| Radio                                | `32` px                                |
| Fondo                                | `#ffffffe2`                            |
| Elevación Android                    | `16`                                   |
| Sombra                               | `#020230`, opacidad `0.35`, radio `40` |
| Separación horizontal de la pantalla | `64` px                                |

Los campos tienen 62 px de altura, radio de 18 px y borde `#878894`. El botón principal utiliza naranja `#f67700`, con estado presionado `#b55800`. La recuperación de contraseña usa el mismo naranja como acento.

## 5. Controles y comportamiento

### Estado local

La pantalla conserva únicamente el estado visual necesario:

- `email`: contenido del campo de correo.
- `password`: contenido del campo de contraseña.
- `showPassword`: alterna `secureTextEntry` y los iconos `Eye`/`EyeOff`.

### Acciones pendientes

`handlePendingAction` es una acción vacía común para:

- Enviar el formulario.
- Presionar “¿Olvidaste tu contraseña?”.
- Presionar “Regístrate aquí”.
- Enviar desde el teclado en el campo de contraseña.

No se muestran validaciones provisionales ni mensajes como “disponible próximamente”. Al integrar el backend, estas acciones deben reemplazarse por navegación o casos de uso reales.

### Accesibilidad actual

- Los botones principales declaran `accessibilityRole="button"`.
- El control de contraseña cambia su `accessibilityLabel` entre “Mostrar contraseña” y “Ocultar contraseña”.
- `SafeAreaView` evita superposición con áreas del sistema.
- `KeyboardAvoidingView` deja preparado el ajuste por teclado.
- La barra de estado usa iconos claros sobre el fondo azul oscuro.

## 6. Tipografía

Inter es la tipografía oficial de producto, registrada también como decisión D-10 en [`../DECISIONS.md`](../DECISIONS.md).

Se cargan antes de renderizar la navegación los siguientes pesos:

| Token                  | Fuente               |
| ---------------------- | -------------------- |
| `fontFamily.regular`   | `Inter_400Regular`   |
| `fontFamily.medium`    | `Inter_500Medium`    |
| `fontFamily.semibold`  | `Inter_600SemiBold`  |
| `fontFamily.bold`      | `Inter_700Bold`      |
| `fontFamily.extrabold` | `Inter_800ExtraBold` |

`SplashScreen.preventAutoHideAsync()` mantiene la pantalla de arranque hasta completar la carga, evitando que aparezca primero la fuente del sistema y luego cambie a Inter.

## 7. Iconos

Se utiliza `lucide-react-native` para mantener un lenguaje visual consistente y vectorial:

| Icono            | Uso                          |
| ---------------- | ---------------------------- |
| `Mail`           | Campo de correo electrónico  |
| `LockKeyhole`    | Campo de contraseña          |
| `Eye` / `EyeOff` | Mostrar u ocultar contraseña |
| `ArrowRight`     | Acción de iniciar sesión     |
| `UserPlus`       | Acción de registro           |

Lucide se apoya en `react-native-svg`. No se usan símbolos Unicode como sustitutos de iconos.

## 8. Dependencias incorporadas durante el prototipo

| Dependencia                | Uso actual                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| `@expo-google-fonts/inter` | Archivos y nombres de los pesos de Inter                                                                  |
| `expo-font`                | Carga de las fuentes al iniciar la app                                                                    |
| `lucide-react-native`      | Iconos del formulario                                                                                     |
| `react-native-svg`         | Render de Lucide y del fondo matemático                                                                   |
| `expo-linear-gradient`     | No lo usa el login (usa gradientes de `react-native-svg`), pero sí el sidebar del dashboard. Se mantiene. |

## 9. Evolución del diseño

Durante el prototipado se realizaron estas iteraciones:

1. Se reemplazó la pantalla de scaffold por una ruta de login real.
2. Se separó la ruta (`src/app`) de la interfaz (`src/features/auth`).
3. Se creó un diseño inicial de dos columnas para tablet.
4. Se exploraron fondos con círculos, cintas lavanda y un arco editorial azul.
5. Los símbolos provisionales fueron reemplazados por Lucide.
6. Se incorporó Inter como regla global de producto.
7. El botón secundario de Google se convirtió en una acción de registro.
8. Se retiraron mensajes temporales de error y acciones “próximamente”.
9. El fondo final se convirtió en una composición matemática SVG azul, más alineada con la identidad educativa.
10. Se añadió respuesta básica por ancho para conservar la tarjeta usable fuera del formato principal.

## 10. Cómo modificar el prototipo

### Tarjeta, campos y botones

Editar `src/features/auth/screens/LoginScreen.tsx`:

- `formPanel`: alineación y separación respecto del borde.
- `formCard`: ancho, padding, fondo, radio y sombra.
- `inputRow`: borde, altura y radio de los campos.
- `submitButton`: color y dimensiones del botón principal.
- `submitButtonPressed`: color durante la pulsación.
- `registerButton`: apariencia de la acción de registro.

### Fondo matemático

Editar `src/features/auth/components/MathBackground.tsx`:

- Gradiente `bg`: paleta principal.
- `glowCyan` y `glowViolet`: luces ambientales.
- `GRID`: densidad de la cuadrícula.
- `sinePath` y `parabolaPath`: funciones dibujadas.
- `symbols`: símbolo, posición, tamaño, opacidad y rotación.

### Tipografía y tokens

Editar `src/theme/index.ts`. Las pantallas nuevas deben consumir `fontFamily` en lugar de escribir nombres de fuente manualmente.

## 11. Integración futura de autenticación

El prototipo visual no debe conectarse directamente a código de `apps/api`. Debe respetarse este orden:

1. Definir esquemas Zod de solicitud y respuesta en `packages/shared/src/auth.ts`.
2. Exportarlos desde `packages/shared/src/index.ts`.
3. Crear `apps/api/src/modules/auth/` con módulo, controlador y servicio.
4. Añadir los métodos validados en `packages/api-client`.
5. Crear en móvil `features/auth/services/auth.service.ts` y, si procede, un hook de sesión.
6. Sustituir `handlePendingAction` por los casos reales.
7. Hacer que `src/app/index.tsx` redirija según la sesión.

No se deben guardar secretos en variables `EXPO_PUBLIC_*`, porque quedan embebidas en el bundle. La URL del API del emulador es `http://10.0.2.2:3000`.

## 12. Pendientes funcionales

- Definir si el identificador de acceso será correo, código de estudiante o ambos.
- Implementar validación real y mensajes accesibles.
- Implementar endpoint de inicio de sesión y almacenamiento seguro de sesión.
- Definir navegación posterior al login.
- Crear pantallas y rutas de recuperación y registro.
- Definir estados de carga, bloqueo y error del API.
- Probar el diseño en una tablet física.

## 13. Verificación

Comandos utilizados para validar el frontend móvil:

```bash
pnpm --filter @academy/mobile typecheck
pnpm --filter @academy/mobile lint
pnpm dev:mobile
```

La comprobación visual se realiza en el AVD `Tablet_Academy_8_7` en orientación horizontal.

## 14. Documentos relacionados

- [`../ARCHITECTURE.md`](../ARCHITECTURE.md): reglas generales del monorepo.
- [`../DECISIONS.md`](../DECISIONS.md): decisiones técnicas, incluida la tipografía Inter.
- [`../DEVELOPMENT.md`](../DEVELOPMENT.md): flujo de desarrollo y ejecución en Android.
- [`../PENDIENTES.md`](../PENDIENTES.md): funcionalidades generales pendientes.
