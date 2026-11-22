import { StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { colors } from '@/theme';

import type { CourseIcon } from '../../mocks/studentCourses';

/**
 * Portadas "3D" de las materias (estilo de la referencia), dibujadas en SVG: cara frontal
 * en el color de la materia, lateral en `ink`, brillo blanco degradado y sombra en el suelo.
 * Todo sale de la paleta de la materia con opacidades; sin hex nuevos.
 * Lienzo de 200 × 120; el objeto ocupa la mitad derecha (x 95–200).
 */

type Palette = { base: string; ink: string; soft: string };

const WHITE = colors.surface;

function Gradients({ uid, base }: { uid: string; base: string }) {
  return (
    <Defs>
      {/* Brillo diagonal sobre las caras frontales. */}
      <LinearGradient id={`${uid}-hl`} x1="0" x2="1" y1="0" y2="1">
        <Stop offset="0" stopColor={WHITE} stopOpacity="0.6" />
        <Stop offset="0.55" stopColor={WHITE} stopOpacity="0.08" />
        <Stop offset="1" stopColor={WHITE} stopOpacity="0" />
      </LinearGradient>
      {/* Brillo esférico. */}
      <RadialGradient cx="0.35" cy="0.3" id={`${uid}-sphere`} r="0.7">
        <Stop offset="0" stopColor={WHITE} stopOpacity="0.75" />
        <Stop offset="0.6" stopColor={WHITE} stopOpacity="0.05" />
        <Stop offset="1" stopColor={WHITE} stopOpacity="0" />
      </RadialGradient>
      {/* Fondo: luz suave arriba a la derecha. */}
      <RadialGradient cx="0.78" cy="0.2" id={`${uid}-glow`} r="0.6">
        <Stop offset="0" stopColor={WHITE} stopOpacity="0.7" />
        <Stop offset="1" stopColor={WHITE} stopOpacity="0" />
      </RadialGradient>
      <LinearGradient id={`${uid}-liquid`} x1="0" x2="0" y1="0" y2="1">
        <Stop offset="0" stopColor={base} stopOpacity="0.75" />
        <Stop offset="1" stopColor={base} stopOpacity="1" />
      </LinearGradient>
    </Defs>
  );
}

/** Forma extruida: lateral desplazado en `ink`, cara en `base` y brillo encima. */
function Extruded({
  d,
  depth = 6,
  palette,
  uid,
}: {
  d: string;
  depth?: number;
  palette: Palette;
  uid: string;
}) {
  return (
    <G>
      <Path
        d={d}
        fill={palette.ink}
        opacity={0.9}
        transform={`translate(${depth * 0.5} ${depth})`}
      />
      <Path d={d} fill={palette.base} />
      <Path d={d} fill={`url(#${uid}-hl)`} />
    </G>
  );
}

/** Cubo isométrico con tres caras sombreadas. */
function Cube({ cx, cy, palette, s }: { cx: number; cy: number; palette: Palette; s: number }) {
  const w = s * 0.87;
  return (
    <G>
      <Polygon
        fill={palette.base}
        opacity={0.5}
        points={`${cx},${cy - s} ${cx + w},${cy - s / 2} ${cx},${cy} ${cx - w},${cy - s / 2}`}
      />
      <Polygon
        fill={WHITE}
        opacity={0.35}
        points={`${cx},${cy - s} ${cx + w},${cy - s / 2} ${cx},${cy} ${cx - w},${cy - s / 2}`}
      />
      <Polygon
        fill={palette.base}
        opacity={0.8}
        points={`${cx - w},${cy - s / 2} ${cx},${cy} ${cx},${cy + s} ${cx - w},${cy + s / 2}`}
      />
      <Polygon
        fill={palette.ink}
        opacity={0.85}
        points={`${cx},${cy} ${cx + w},${cy - s / 2} ${cx + w},${cy + s / 2} ${cx},${cy + s}`}
      />
    </G>
  );
}

/** Burbuja con reflejo. */
function Bubble({ cx, cy, palette, r }: { cx: number; cy: number; palette: Palette; r: number }) {
  return (
    <G>
      <Circle cx={cx} cy={cy} fill={palette.base} opacity={0.45} r={r} />
      <Circle cx={cx - r * 0.35} cy={cy - r * 0.35} fill={WHITE} opacity={0.8} r={r * 0.3} />
    </G>
  );
}

function Mathematics({ palette, uid }: { palette: Palette; uid: string }) {
  return (
    <G>
      <Ellipse cx={150} cy={106} fill={palette.ink} opacity={0.14} rx={46} ry={6} />
      <Cube cx={104} cy={92} palette={palette} s={14} />
      <Cube cx={190} cy={98} palette={palette} s={9} />
      {/* π */}
      <Extruded
        d="M112 30 Q112 22 120 22 H180 Q188 22 188 30 Q188 38 180 38 H120 Q112 38 112 30 Z"
        palette={palette}
        uid={uid}
      />
      <Extruded
        d="M132 36 H146 L141 92 Q140 99 133 99 Q126 99 127 91 Z"
        palette={palette}
        uid={uid}
      />
      <Extruded
        d="M158 36 H172 V83 Q172 89 177 89 Q181 89 183 85 L188 87 Q186 100 174 100 Q158 100 158 86 Z"
        palette={palette}
        uid={uid}
      />
    </G>
  );
}

function Science({ palette, uid }: { palette: Palette; uid: string }) {
  const body = 'M140 18 H160 V44 L182 92 Q186 102 175 102 H125 Q114 102 118 92 L140 44 Z';
  return (
    <G>
      <Ellipse cx={150} cy={106} fill={palette.ink} opacity={0.14} rx={40} ry={5} />
      <Bubble cx={108} cy={44} palette={palette} r={7} />
      <Bubble cx={122} cy={26} palette={palette} r={4.5} />
      <Bubble cx={100} cy={70} palette={palette} r={4} />
      <Bubble cx={190} cy={36} palette={palette} r={5} />
      {/* Vidrio */}
      <Path d={body} fill={WHITE} opacity={0.55} />
      {/* Líquido */}
      <Path
        d="M127 72 H173 L180 92 Q183 99 175 99 H125 Q117 99 120 92 Z"
        fill={`url(#${uid}-liquid)`}
      />
      <Path
        d="M127 72 H173 L180 92 Q183 99 175 99 H125 Q117 99 120 92 Z"
        fill={`url(#${uid}-hl)`}
      />
      <Circle cx={146} cy={84} fill={WHITE} opacity={0.75} r={4} />
      <Circle cx={160} cy={90} fill={WHITE} opacity={0.6} r={2.5} />
      <Path d={body} fill="none" stroke={WHITE} strokeOpacity={0.95} strokeWidth={2.5} />
      <Path
        d="M146 26 V46 L128 86"
        fill="none"
        stroke={WHITE}
        strokeLinecap="round"
        strokeOpacity={0.9}
        strokeWidth={3}
      />
      <Rect fill={WHITE} height={8} opacity={0.95} rx={4} width={30} x={135} y={13} />
    </G>
  );
}

function Reasoning({ palette, uid }: { palette: Palette; uid: string }) {
  return (
    <G>
      <Ellipse cx={150} cy={106} fill={palette.ink} opacity={0.14} rx={44} ry={6} />
      <Cube cx={104} cy={90} palette={palette} s={12} />
      <Bubble cx={190} cy={28} palette={palette} r={5} />
      <Extruded
        d="M120 46 Q120 38 128 38 H138 Q136 26 147 26 Q158 26 156 38 H166 Q174 38 174 46 V56 Q186 54 186 65 Q186 76 174 74 V86 Q174 94 166 94 H128 Q120 94 120 86 V74 Q108 76 108 65 Q108 54 120 56 Z"
        depth={8}
        palette={palette}
        uid={uid}
      />
    </G>
  );
}

function Reading({ palette, uid }: { palette: Palette; uid: string }) {
  return (
    <G>
      <Ellipse cx={150} cy={108} fill={palette.ink} opacity={0.14} rx={50} ry={6} />
      {/* Tapa y grosor */}
      <Path
        d="M104 42 V98 Q128 92 150 102 Q172 92 196 98 V42 Q172 38 150 48 Q128 38 104 42 Z"
        fill={palette.ink}
      />
      <Path
        d="M104 38 V94 Q128 88 150 98 Q172 88 196 94 V38 Q172 34 150 44 Q128 34 104 38 Z"
        fill={palette.base}
      />
      {/* Páginas */}
      <Path d="M150 40 Q130 28 108 32 V86 Q130 82 150 92 Z" fill={WHITE} />
      <Path d="M150 40 Q170 28 192 32 V86 Q170 82 150 92 Z" fill={WHITE} opacity={0.92} />
      <Path d="M150 40 Q170 28 192 32 V86 Q170 82 150 92 Z" fill={palette.base} opacity={0.08} />
      {[46, 56, 66].map((y) => (
        <G key={y}>
          <Path
            d={`M116 ${y} Q130 ${y - 3} 143 ${y + 3}`}
            fill="none"
            stroke={palette.base}
            strokeLinecap="round"
            strokeOpacity={0.35}
            strokeWidth={2.5}
          />
          <Path
            d={`M157 ${y + 3} Q170 ${y - 3} 184 ${y}`}
            fill="none"
            stroke={palette.base}
            strokeLinecap="round"
            strokeOpacity={0.35}
            strokeWidth={2.5}
          />
        </G>
      ))}
      <Path d="M150 40 V92" stroke={palette.ink} strokeOpacity={0.25} strokeWidth={1.5} />
    </G>
  );
}

function History({ palette, uid }: { palette: Palette; uid: string }) {
  const columns = [116, 135, 155, 174];
  return (
    <G>
      <Ellipse cx={150} cy={108} fill={palette.ink} opacity={0.14} rx={52} ry={6} />
      <Rect fill={palette.ink} height={7} rx={2} width={104} x={98} y={98} />
      <Rect fill={palette.base} height={7} rx={2} width={92} x={104} y={91} />
      {columns.map((x) => (
        <G key={x}>
          <Rect fill={WHITE} height={38} rx={2} width={11} x={x} y={52} />
          <Rect fill={palette.base} height={38} opacity={0.28} rx={2} width={4} x={x + 7} y={52} />
        </G>
      ))}
      <Rect fill={palette.ink} height={8} rx={2} width={88} x={106} y={46} />
      <Extruded d="M150 14 L198 40 H102 Z" depth={5} palette={palette} uid={uid} />
    </G>
  );
}

function Geography({ palette, uid }: { palette: Palette; uid: string }) {
  return (
    <G>
      <Ellipse cx={150} cy={110} fill={palette.ink} opacity={0.18} rx={22} ry={4} />
      <Rect fill={palette.ink} height={12} rx={2} width={8} x={146} y={92} />
      <Ellipse cx={150} cy={106} fill={palette.ink} rx={18} ry={5} />
      <Path
        d="M114 24 A40 40 0 0 0 150 96"
        fill="none"
        stroke={palette.ink}
        strokeLinecap="round"
        strokeWidth={5}
      />
      <Circle cx={152} cy={54} fill={palette.base} r={33} />
      <Path d="M132 38 Q142 28 152 34 Q158 44 148 50 Q138 54 132 38 Z" fill={WHITE} opacity={0.6} />
      <Path d="M158 58 Q170 50 178 62 Q174 78 160 76 Q152 70 158 58 Z" fill={WHITE} opacity={0.6} />
      <Path d="M128 62 Q138 58 141 70 Q134 80 127 72 Z" fill={WHITE} opacity={0.5} />
      <Circle cx={152} cy={54} fill={`url(#${uid}-sphere)`} r={33} />
      <Circle
        cx={152}
        cy={54}
        fill="none"
        r={33}
        stroke={palette.ink}
        strokeOpacity={0.35}
        strokeWidth={2}
      />
      <Bubble cx={102} cy={36} palette={palette} r={5} />
    </G>
  );
}

const ILLUSTRATIONS: Record<
  CourseIcon,
  (props: { palette: Palette; uid: string }) => React.JSX.Element
> = {
  book: Reading,
  flask: Science,
  globe: Geography,
  landmark: History,
  puzzle: Reasoning,
  sigma: Mathematics,
};

/**
 * Solo el objeto 3D de la materia, encuadrado y sin fondo (p. ej. sobre la tarjeta azul del
 * Inicio). Ocupa su contenedor, centrado.
 */
export function CourseObject({
  icon,
  palette,
  uid,
}: {
  icon: CourseIcon;
  palette: Palette;
  uid: string;
}) {
  const Illustration = ILLUSTRATIONS[icon];

  return (
    <Svg height="100%" preserveAspectRatio="xMidYMid meet" viewBox="92 8 112 108" width="100%">
      <Gradients base={palette.base} uid={uid} />
      <Illustration palette={palette} uid={uid} />
    </Svg>
  );
}

/**
 * Portada completa: fondo con luz y colinas suaves + objeto 3D.
 * `compact` encuadra solo el objeto (miniatura de la vista de lista).
 */
export function CourseIllustration({
  compact = false,
  icon,
  palette,
  uid,
}: {
  compact?: boolean;
  icon: CourseIcon;
  palette: Palette;
  uid: string;
}) {
  const Illustration = ILLUSTRATIONS[icon];

  return (
    <>
      {/* Fondo estirado a toda la portada: luz arriba a la derecha y colinas suaves. */}
      <Svg
        height="100%"
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}
        viewBox="0 0 200 120"
        width="100%"
      >
        <Gradients base={palette.base} uid={`${uid}-bg`} />
        <Rect fill={`url(#${uid}-bg-glow)`} height={120} width={200} x={0} y={0} />
        <Ellipse cx={50} cy={128} fill={WHITE} opacity={0.4} rx={90} ry={30} />
        <Ellipse cx={170} cy={132} fill={WHITE} opacity={0.3} rx={80} ry={26} />
      </Svg>
      {/* Objeto sin deformar, alineado a la derecha (o centrado en miniatura). */}
      <Svg
        height="100%"
        preserveAspectRatio={compact ? 'xMidYMid meet' : 'xMaxYMid meet'}
        style={StyleSheet.absoluteFill}
        // Margen a la derecha y arriba para no chocar con el borde ni con el marcador.
        viewBox={compact ? '92 8 112 108' : '0 -12 244 140'}
        width="100%"
      >
        <Gradients base={palette.base} uid={uid} />
        <Illustration palette={palette} uid={uid} />
      </Svg>
    </>
  );
}
