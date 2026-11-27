import { useId } from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { colors } from '@/theme';

/**
 * Iconos 3D estilo "arcilla" (mismo lenguaje que las portadas de Cursos): cara en `base`,
 * lateral desplazado en `ink`, brillo blanco degradado y sombra en el suelo.
 * Lienzo 100 × 100. Colores solo desde la paleta recibida (sin hex nuevos).
 */

export type Clay3DKind =
  | 'camera'
  | 'clipboard'
  | 'book'
  | 'badge'
  | 'flask'
  | 'calendar'
  | 'flame'
  | 'clock'
  | 'trophy'
  | 'monitor'
  | 'student';
export type ClayPalette = { base: string; ink: string; soft: string };

const WHITE = colors.surface;

type PartProps = { hl: string; palette: ClayPalette };

/** Forma con volumen: lateral en `ink` desplazado, cara en `base` y brillo encima. */
function Solid({ d, depth = 6, hl, palette }: PartProps & { d: string; depth?: number }) {
  return (
    <G>
      <Path d={d} fill={palette.ink} transform={`translate(${depth * 0.4} ${depth})`} />
      <Path d={d} fill={palette.base} />
      <Path d={d} fill={`url(#${hl})`} />
    </G>
  );
}

const rr = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;

function Camera({ hl, palette }: PartProps) {
  return (
    <G>
      <Solid d="M66 44 L88 32 Q92 30 92 35 V65 Q92 70 88 68 L66 56 Z" hl={hl} palette={palette} />
      <Solid d={rr(10, 28, 58, 46, 13)} hl={hl} palette={palette} />
      <Circle cx={26} cy={42} fill={WHITE} opacity={0.85} r={5} />
    </G>
  );
}

function Clipboard({ hl, palette }: PartProps) {
  return (
    <G>
      <Solid d={rr(20, 14, 60, 76, 12)} hl={hl} palette={palette} />
      <Path d={rr(28, 26, 44, 54, 7)} fill={WHITE} />
      <Path d={rr(36, 8, 28, 14, 6)} fill={palette.ink} />
      <Path d={rr(36, 6, 28, 13, 6)} fill={WHITE} opacity={0.95} />
      <Path
        d="M37 52 L46 61 L63 42"
        fill="none"
        stroke={palette.base}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={7}
      />
    </G>
  );
}

function Book({ hl, palette }: PartProps) {
  return (
    <G>
      {/* Canto de páginas */}
      <Path d={rr(26, 20, 56, 66, 8)} fill={WHITE} transform="translate(4 6)" />
      <Path d="M30 84 H82" stroke={palette.ink} strokeOpacity={0.2} strokeWidth={2} />
      <Solid d={rr(20, 14, 56, 66, 9)} depth={4} hl={hl} palette={palette} />
      <Rect fill={palette.ink} height={66} opacity={0.35} rx={3} width={8} x={26} y={14} />
      <Path d="M56 14 H66 V36 L61 32 L56 36 Z" fill={WHITE} opacity={0.95} />
    </G>
  );
}

function Badge({ hl, palette }: PartProps) {
  return (
    <G>
      <Circle cx={52} cy={54} fill={palette.ink} r={34} />
      <Circle cx={50} cy={48} fill={palette.base} r={34} />
      <Circle cx={50} cy={48} fill={`url(#${hl})`} r={34} />
      <Path
        d="M34 49 L46 61 L67 37"
        fill="none"
        stroke={WHITE}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={9}
      />
    </G>
  );
}

function Flask({ hl, palette }: PartProps) {
  const body = 'M40 10 H60 V34 L82 76 Q86 88 74 88 H26 Q14 88 18 76 L40 34 Z';
  return (
    <G>
      <Path d={body} fill={WHITE} opacity={0.7} />
      <Path d="M28 58 H72 L80 76 Q83 85 74 85 H26 Q17 85 20 76 Z" fill={palette.base} />
      <Path d="M28 58 H72 L80 76 Q83 85 74 85 H26 Q17 85 20 76 Z" fill={`url(#${hl})`} />
      <Circle cx={44} cy={72} fill={WHITE} opacity={0.8} r={4} />
      <Circle cx={58} cy={78} fill={WHITE} opacity={0.65} r={2.5} />
      <Path d={body} fill="none" stroke={palette.ink} strokeOpacity={0.35} strokeWidth={2.5} />
      <Path d={rr(36, 5, 28, 9, 4.5)} fill={palette.ink} />
    </G>
  );
}

function Calendar({ hl, palette }: PartProps) {
  return (
    <G>
      <Path d={rr(14, 22, 72, 64, 12)} fill={palette.ink} transform="translate(3 6)" />
      <Path d={rr(14, 22, 72, 64, 12)} fill={WHITE} />
      <Path d="M14 34 Q14 22 26 22 H74 Q86 22 86 34 V40 H14 Z" fill={palette.base} />
      <Path d="M14 34 Q14 22 26 22 H74 Q86 22 86 34 V40 H14 Z" fill={`url(#${hl})`} />
      {[32, 68].map((x) => (
        <Path key={x} d={rr(x - 4, 12, 8, 18, 4)} fill={palette.ink} />
      ))}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <Rect
            key={`${row}-${col}`}
            fill={row === 1 && col === 2 ? palette.base : palette.soft}
            height={8}
            rx={2.5}
            width={10}
            x={24 + col * 14}
            y={48 + row * 12}
          />
        )),
      )}
    </G>
  );
}

function Flame({ hl, palette }: PartProps) {
  const outer =
    'M50 8 Q60 26 72 38 Q86 52 82 70 Q78 90 50 92 Q22 90 18 70 Q15 54 28 42 Q30 54 38 58 Q34 36 50 8 Z';
  return (
    <G>
      <Solid d={outer} hl={hl} palette={palette} />
      <Path
        d="M50 46 Q58 58 64 66 Q70 80 50 84 Q32 82 36 68 Q38 60 44 56 Q44 64 48 66 Q46 54 50 46 Z"
        fill={WHITE}
        opacity={0.75}
      />
    </G>
  );
}

function Clock({ hl, palette }: PartProps) {
  return (
    <G>
      <Circle cx={53} cy={56} fill={palette.ink} r={36} />
      <Circle cx={50} cy={50} fill={palette.base} r={36} />
      <Circle cx={50} cy={50} fill={`url(#${hl})`} r={36} />
      <Circle cx={50} cy={50} fill={WHITE} r={25} />
      <Path
        d="M50 34 V50 L61 58"
        fill="none"
        stroke={palette.ink}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={6}
      />
      <Circle cx={50} cy={50} fill={palette.ink} r={4} />
    </G>
  );
}

function Trophy({ hl, palette }: PartProps) {
  return (
    <G>
      {/* Asas */}
      <Path
        d="M28 24 Q8 24 12 42 Q16 56 32 56"
        fill="none"
        stroke={palette.ink}
        strokeLinecap="round"
        strokeWidth={7}
      />
      <Path
        d="M72 24 Q92 24 88 42 Q84 56 68 56"
        fill="none"
        stroke={palette.ink}
        strokeLinecap="round"
        strokeWidth={7}
      />
      <Solid d="M26 14 H74 V36 Q74 64 50 66 Q26 64 26 36 Z" hl={hl} palette={palette} />
      <Path d={rr(44, 64, 12, 12, 2)} fill={palette.ink} />
      <Solid d={rr(30, 76, 40, 12, 5)} depth={4} hl={hl} palette={palette} />
      <Path
        d="M44 30 L50 24 V50"
        fill="none"
        stroke={WHITE}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={6}
        opacity={0.9}
      />
    </G>
  );
}

function Monitor({ hl, palette }: PartProps) {
  return (
    <G>
      <Path d={rr(40, 72, 20, 14, 3)} fill={palette.ink} />
      <Path d={rr(28, 82, 44, 8, 4)} fill={palette.ink} />
      <Solid d={rr(8, 14, 84, 60, 12)} hl={hl} palette={palette} />
      <Path d={rr(16, 22, 68, 44, 7)} fill={WHITE} />
      <Path
        d="M44 34 L60 44 L44 54 Z"
        fill={palette.base}
        stroke={palette.base}
        strokeLinejoin="round"
        strokeWidth={4}
      />
    </G>
  );
}

/**
 * Estudiante: cuerpo y cabeza con volumen y birrete. Marcador de posición del avatar hasta que
 * exista la foto del alumno.
 */
function Student({ hl, palette }: PartProps) {
  return (
    <G>
      <Solid d="M16 92 Q16 60 50 60 Q84 60 84 92 Z" depth={4} hl={hl} palette={palette} />
      <Solid
        d="M32 40 A18 18 0 1 0 68 40 A18 18 0 1 0 32 40 Z"
        depth={4}
        hl={hl}
        palette={palette}
      />
      <Circle cx={43} cy={42} fill={WHITE} opacity={0.9} r={2.6} />
      <Circle cx={57} cy={42} fill={WHITE} opacity={0.9} r={2.6} />
      {/* Birrete */}
      <Path d="M24 22 L50 11 L76 22 L50 33 Z" fill={palette.ink} transform="translate(0 3)" />
      <Path d="M24 22 L50 11 L76 22 L50 33 Z" fill={palette.base} />
      <Path d="M24 22 L50 11 L76 22 L50 33 Z" fill={`url(#${hl})`} />
      <Path d="M70 24 V36" stroke={palette.ink} strokeLinecap="round" strokeWidth={3} />
      <Circle cx={70} cy={38} fill={palette.ink} r={3} />
    </G>
  );
}

const PARTS: Record<Clay3DKind, (props: PartProps) => React.JSX.Element> = {
  badge: Badge,
  book: Book,
  calendar: Calendar,
  camera: Camera,
  clipboard: Clipboard,
  clock: Clock,
  flame: Flame,
  flask: Flask,
  monitor: Monitor,
  student: Student,
  trophy: Trophy,
};

/** Icono 3D a tamaño libre (cuadrado). */
export function Clay3DIcon({
  kind,
  palette,
  shadow = true,
  size = 56,
}: {
  kind: Clay3DKind;
  palette: ClayPalette;
  shadow?: boolean;
  size?: number;
}) {
  const hl = `clay${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const Part = PARTS[kind];

  return (
    <Svg height={size} viewBox="0 0 100 100" width={size}>
      <Defs>
        <LinearGradient id={hl} x1="0" x2="1" y1="0" y2="1">
          <Stop offset="0" stopColor={WHITE} stopOpacity="0.62" />
          <Stop offset="0.5" stopColor={WHITE} stopOpacity="0.08" />
          <Stop offset="1" stopColor={WHITE} stopOpacity="0" />
        </LinearGradient>
        <RadialGradient cx="0.5" cy="0.5" id={`${hl}-shadow`} r="0.5">
          <Stop offset="0" stopColor={palette.ink} stopOpacity="0.28" />
          <Stop offset="1" stopColor={palette.ink} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      {shadow && <Ellipse cx={52} cy={94} fill={`url(#${hl}-shadow)`} rx={38} ry={6} />}
      <Part hl={hl} palette={palette} />
    </Svg>
  );
}
