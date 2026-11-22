# Encargo para Codex — pulir el responsive del Inicio del alumno

Fecha: 2026-11-21 (UTC). Encarga: Claude (sesión del dashboard móvil). Ejecuta: Codex.

## Contexto

El Inicio del alumno (`apps/mobile`) ya está terminado a nivel visual, con datos ficticios y sin lógica. Se ve bien con el **sidebar plegado** (72 dp). Al **desplegar el sidebar** (240 dp), el área de contenido pasa de ~1070 dp a ~900 dp de ancho y algunas tarjetas se deforman. El encargo es **solo pulir eso**: no rediseñar, no cambiar contenido, colores ni estructura.

Lee antes de tocar nada:

- [`docs/ESTILO_VISUAL.md`](ESTILO_VISUAL.md): tokens, radios, tipografía y la checklist de §8.
- [`docs/HANDOFF.md`](HANDOFF.md): reglas de relevo.

## Reglas

- Trabaja **solo en WSL**: `~/jpacademy`. No edites `d:\jpacademy` (copia de Windows).
- **No hagas commits, push ni PR.**
- No añadas dependencias. Animaciones solo con `Animated` nativo (D-04).
- Colores, radios y espaciado solo desde `@/theme`; **ningún hex suelto**. Si necesitas un valor nuevo, documéntalo en `ESTILO_VISUAL.md`.
- No toques `Sidebar.tsx`, `DashboardShell.tsx`, `LoginScreen.tsx` ni `MathBackground.tsx`.

## Archivos en alcance

| Archivo                                                      | Qué es                                                                                                                                                   |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/mobile/src/features/dashboard/screens/StudentHome.tsx` | Composición: fila 1 = `ResumeCard` (flex 1,75) + `StreakCard` (flex 1); fila 2 = `CoursesCard` + `DurationsCard` + `AchievementsCard` (flex 1 cada una). |
| `apps/mobile/src/features/dashboard/components/home/*.tsx`   | `ResumeCard`, `StreakCard`, `CoursesCard`, `DurationsCard`, `AchievementsCard`, `CardHeader`.                                                            |
| `apps/mobile/src/components/*.tsx`                           | `Card`, `FadeIn`, `IconChip`, `ProgressBar`, `ProgressRing` (solo si hace falta).                                                                        |
| `apps/mobile/src/features/dashboard/mocks/student.ts`        | Datos ficticios (no cambies los textos salvo para acortar uno que no quepa).                                                                             |

## Problemas a corregir (sidebar desplegado)

1. **`ResumeCard`**: los símbolos decorativos (`∑`, `π`, `√`) usan posiciones absolutas fijas (`right: 40/230/190`). Con la tarjeta más estrecha, la `π` queda **detrás del título "Matemática"**. Deben quedar siempre a la derecha, sin solaparse con el texto (escalar por ancho, recolocar u ocultar `π` en modo estrecho).
2. **`StreakCard`**: el texto "Solo 3 más para desbloquear tu próximo logro." pasa a dos líneas y la tarjeta crece más que la destacada. Ajustar para que la fila 1 mantenga una altura equilibrada (p. ej. una línea con `numberOfLines`/texto ajustable, o reducir el espacio vertical).
3. **Fila 2 (~280 dp por tarjeta)**:
   - `CoursesCard`: el pie "Estás en el 10 % superior de tu grupo este mes." pasa a dos líneas; los avatares de cabecera quedan justos.
   - `DurationsCard`: comprobar que la cabecera (título "Horas" + "Meta 40 h" con su barra) y el pie no se corten, y que la gráfica conserve proporción.
   - `AchievementsCard`: la pila de tarjetas (fantasmas rotados ±10° con `translateX ±44`) y la fila de 5 medallas no deben salirse del borde de la tarjeta.
4. **Alturas**: en cada fila, las tarjetas deben quedar con la misma altura y sin espacio vacío raro al fondo.

Enfoque sugerido: medir el ancho del área de contenido con `onLayout` en `StudentHome` (ya se hizo antes con un umbral de 1000 dp) y pasar un `isCompact` a las tarjetas que lo necesiten. Evita tamaños de letra por debajo de 11.

## Criterio de aceptación

- Con el sidebar **plegado**, el aspecto es **idéntico** al actual (no lo empeores).
- Con el sidebar **desplegado**: ningún texto cortado con "…" que antes no lo estuviera, nada que se salga de su tarjeta, nada solapado con la decoración y las filas con alturas iguales.
- `ESTILO_VISUAL.md` §8 cumplido (objetivos táctiles ≥ 48 dp, contraste ≥ 4,5:1).

## Cómo verificar

Entorno (WSL, Node vía nvm, pnpm vía corepack):

```bash
export NVM_DIR=~/.nvm; . ~/.nvm/nvm.sh; cd ~/jpacademy
corepack pnpm --filter @academy/mobile typecheck
corepack pnpm --filter @academy/mobile lint
npx prettier@3 --check apps/mobile/src/features/dashboard apps/mobile/src/components
```

Emulador: el AVD `Tablet_Academy_8_7` corre en **Windows**, no en WSL (el `adb` de WSL no lo ve). Metro corre en WSL en el puerto 8081 y la app se abre en Expo Go con:

```powershell
& "C:\Users\lilyc\AppData\Local\Android\Sdk\platform-tools\adb.exe" shell am start -a android.intent.action.VIEW -d "exp://10.0.2.2:8081"
```

Con ese mismo `adb.exe`:

- Captura: `adb exec-out screencap -p > captura.png` (desde un directorio de Windows, no UNC).
- Plegar/desplegar el sidebar: `adb shell input tap 41 80` (el escudo).
- Volver arriba: `adb shell input swipe 900 200 900 750 300`.

Compara capturas **plegado y desplegado**, arriba y con scroll. El engranaje gris arriba a la derecha es el menú de Expo Go, no es parte de la app.

## Al terminar

Añade una entrada al final de [`docs/HANDOFF.md`](HANDOFF.md) con fecha UTC, archivos modificados, comandos ejecutados y su resultado, y qué queda pendiente.
