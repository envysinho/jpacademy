# Assets de marca (logos)

Última revisión: 2026-11-12 (UTC).

## Dónde está cada cosa

| Ruta                               | Contenido                                                                                 | Se empaqueta en la app |
| ---------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------- |
| `assets/brand/logos/`              | **Originales** (fuente de verdad): PNG a tamaño completo, WebP y variantes `@1x/@2x/@3x`. | No                     |
| `apps/mobile/assets/images/logos/` | Solo las variantes `@1x`, `@2x`, `@3x` en PNG (12 archivos).                              | Sí (Metro)             |
| `apps/mobile/src/theme/logos.ts`   | Mapa tipado `logos` con `require()` de cada logo.                                         | —                      |

## Variantes disponibles

| Nombre                 | Archivo base             | Uso sugerido                                               |
| ---------------------- | ------------------------ | ---------------------------------------------------------- |
| `logos.horizontal`     | `logo_horizontal`        | Sidebar, cabeceras, topbar.                                |
| `logos.horizontalWide` | `logo_horizontal_amplio` | Pantallas con margen amplio (splash, login).               |
| `logos.vertical`       | `logo_vertical`          | Tarjetas de bienvenida, pantallas centradas.               |
| `logos.shield`         | `escudo`                 | Espacios pequeños o cuadrados (avatar, sidebar colapsado). |

Tamaños en píxeles (ancho × alto): `@1x` / `@2x` / `@3x`.

- `logo_horizontal`: 600×221 / 1200×442 / 1800×663 (original 2083×767)
- `logo_horizontal_amplio`: 500×283 / 1000×566 / 1500×849 (original 1719×972)
- `logo_vertical`: 320×391 / 640×782 / 960×1173 (original 1093×1336)
- `escudo`: 320×288 / 640×576 / 960×864 (original 1252×1126)

Todos son PNG/WebP con transparencia (RGBA), salvo `logo_horizontal_amplio.webp` que no declara alfa.

## Uso en móvil

```tsx
import { Image } from 'react-native';
import { logos } from '@/theme/logos';

<Image
  source={logos.horizontal}
  style={{ width: 160, aspectRatio: 600 / 221 }}
  resizeMode="contain"
/>;
```

- Define siempre el **ancho** y la relación de aspecto (o `height`); React Native no usa el tamaño intrínseco como tamaño en pantalla de forma fiable.
- No importes los PNG a mano con rutas relativas: añade la entrada a `logos.ts` para que haya un único punto de uso.
- Cada logo debe tener `@1x`, `@2x` y `@3x` en la carpeta de la app; RN elige la densidad. **No copies a esa carpeta los archivos sin sufijo** (`logo_horizontal.png`): Metro los trataría como escala 1 y chocarían con `@1x`.
- La tablet objetivo tiene densidad ~1,1 (180 dpi), por lo que normalmente se usará `@2x`.

## Uso en web (aún no implementado)

`apps/web` no tiene carpeta `public/` ni usa logos todavía. Al necesitarlos, copia los **WebP** de `assets/brand/logos/` (más ligeros) a `apps/web/public/logos/` o impórtalos desde `src/assets/` con Vite. Decide entonces cuál de las dos formas se usa y regístralo en `DECISIONS.md`.

## Añadir o actualizar un logo

1. Guarda el original en `assets/brand/logos/` (mismo esquema de nombres).
2. Genera o copia las variantes `@1x/@2x/@3x` en PNG a `apps/mobile/assets/images/logos/`.
3. Añade la entrada a `apps/mobile/src/theme/logos.ts`.
4. Actualiza las tablas de este documento.

## Pendiente

- Los logos aún **no se usan** en pantallas: el sidebar del dashboard sigue mostrando el texto "Logo" (ver [DASHBOARD.md](DASHBOARD.md) §0).
- El icono de la app, el splash y el icono adaptativo de Android siguen siendo los del template de Expo (`apps/mobile/assets/images/icon.png`, `splash-icon.png`, `android-icon-*.png`). Sustituirlos por la marca requiere decidir qué variante usar.
- Originales pesados (~8 MB entre PNG y WebP en `assets/brand/logos/`): evaluar Git LFS o conservar solo un formato si el repositorio crece.
