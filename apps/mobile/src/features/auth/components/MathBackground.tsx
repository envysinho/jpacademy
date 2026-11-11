import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { fontFamily } from '@/theme';

const VIEW_W = 1200;
const VIEW_H = 700;
const GRID = 30;

// Origin of the decorative cartesian plane.
const ORIGIN_X = 120;
const ORIGIN_Y = 470;

const minorLines = {
  vertical: Array.from({ length: Math.ceil(VIEW_W / GRID) + 1 }, (_, i) => i * GRID),
  horizontal: Array.from({ length: Math.ceil(VIEW_H / GRID) + 1 }, (_, i) => i * GRID),
};

function buildPath(fn: (x: number) => number, from: number, to: number, step = 6) {
  let d = '';
  for (let x = from; x <= to; x += step) {
    d += `${x === from ? 'M' : 'L'}${x.toFixed(1)},${fn(x).toFixed(1)} `;
  }
  return d.trim();
}

const sinePath = buildPath((x) => ORIGIN_Y - 70 * Math.sin((x - ORIGIN_X) / 58), ORIGIN_X, 760);
const parabolaPath = buildPath(
  (x) => ORIGIN_Y - 330 + ((x - 470) * (x - 470)) / 260,
  210,
  730,
);

const symbols: { char: string; x: number; y: number; size: number; opacity: number; rotate?: number }[] = [
  { char: 'π', x: 610, y: 120, size: 64, opacity: 0.22, rotate: -8 },
  { char: '∑', x: 70, y: 150, size: 54, opacity: 0.16 },
  { char: '∫', x: 1090, y: 210, size: 80, opacity: 0.14, rotate: 6 },
  { char: '√x', x: 560, y: 640, size: 44, opacity: 0.18 },
  { char: '∞', x: 380, y: 95, size: 46, opacity: 0.14 },
  { char: 'Δ', x: 1040, y: 640, size: 48, opacity: 0.13, rotate: -10 },
  { char: 'θ', x: 330, y: 610, size: 40, opacity: 0.18 },
  { char: '÷', x: 690, y: 400, size: 42, opacity: 0.12 },
  { char: 'x²', x: 800, y: 70, size: 38, opacity: 0.14 },
  { char: '≈', x: 40, y: 640, size: 40, opacity: 0.14 },
];

function MathBackgroundComponent() {
  return (
    <Svg
      pointerEvents="none"
      preserveAspectRatio="xMidYMid slice"
      style={StyleSheet.absoluteFill}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
    >
      <Defs>
        <LinearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#1F1FFF" />
          <Stop offset="0.55" stopColor="#0B0BC4" />
          <Stop offset="1" stopColor="#06065E" />
        </LinearGradient>
        <RadialGradient id="glowCyan" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#38BDF8" stopOpacity="0.45" />
          <Stop offset="1" stopColor="#38BDF8" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="glowViolet" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#A78BFA" stopOpacity="0.4" />
          <Stop offset="1" stopColor="#A78BFA" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      <Rect fill="url(#bg)" height={VIEW_H} width={VIEW_W} x={0} y={0} />
      <Circle cx={260} cy={160} fill="url(#glowCyan)" r={340} />
      <Circle cx={1050} cy={620} fill="url(#glowViolet)" r={380} />

      {/* Graph-paper texture */}
      <G stroke="#FFFFFF">
        {minorLines.vertical.map((x) => (
          <Line
            key={`v${x}`}
            strokeOpacity={x % (GRID * 5) === 0 ? 0.12 : 0.05}
            strokeWidth={x % (GRID * 5) === 0 ? 1.2 : 0.8}
            x1={x}
            x2={x}
            y1={0}
            y2={VIEW_H}
          />
        ))}
        {minorLines.horizontal.map((y) => (
          <Line
            key={`h${y}`}
            strokeOpacity={y % (GRID * 5) === 0 ? 0.12 : 0.05}
            strokeWidth={y % (GRID * 5) === 0 ? 1.2 : 0.8}
            x1={0}
            x2={VIEW_W}
            y1={y}
            y2={y}
          />
        ))}
      </G>

      {/* Cartesian axes */}
      <G stroke="#FFFFFF" strokeLinecap="round" strokeOpacity={0.35} strokeWidth={2}>
        <Line x1={ORIGIN_X - 40} x2={780} y1={ORIGIN_Y} y2={ORIGIN_Y} />
        <Line x1={ORIGIN_X} x2={ORIGIN_X} y1={ORIGIN_Y + 60} y2={90} />
        <Path d={`M772,${ORIGIN_Y - 7} L782,${ORIGIN_Y} L772,${ORIGIN_Y + 7}`} fill="none" />
        <Path d={`M${ORIGIN_X - 7},98 L${ORIGIN_X},88 L${ORIGIN_X + 7},98`} fill="none" />
      </G>
      <G fill="#FFFFFF" fillOpacity={0.45} fontFamily={fontFamily.medium} fontSize={18}>
        <SvgText x={790} y={ORIGIN_Y + 6}>x</SvgText>
        <SvgText x={ORIGIN_X - 5} y={78}>y</SvgText>
      </G>

      {/* Plotted functions */}
      <Path d={sinePath} fill="none" stroke="#7DD3FC" strokeLinecap="round" strokeOpacity={0.75} strokeWidth={3} />
      <Path
        d={parabolaPath}
        fill="none"
        stroke="#FCD34D"
        strokeDasharray="10 8"
        strokeLinecap="round"
        strokeOpacity={0.6}
        strokeWidth={2.5}
      />
      <Circle cx={470} cy={ORIGIN_Y - 330} fill="#FCD34D" fillOpacity={0.85} r={5} />

      {/* Geometry: circle with radius */}
      <G fill="none" stroke="#FFFFFF" strokeOpacity={0.22} strokeWidth={1.6}>
        <Circle cx={930} cy={130} r={95} />
        <Line x1={930} x2={1012} y1={130} y2={83} />
        <Circle cx={930} cy={130} fill="#FFFFFF" fillOpacity={0.4} r={3} />
      </G>
      <SvgText
        fill="#FFFFFF"
        fillOpacity={0.35}
        fontFamily={fontFamily.medium}
        fontSize={18}
        x={968}
        y={98}
      >
        r
      </SvgText>

      {/* Geometry: right triangle */}
      <G fill="none" stroke="#FFFFFF" strokeLinejoin="round" strokeOpacity={0.2} strokeWidth={1.6}>
        <Path d="M150,620 L320,620 L150,520 Z" />
        <Path d="M150,602 L168,602 L168,620" />
      </G>

      {/* Geometry: protractor arc */}
      <G fill="none" stroke="#FFFFFF" strokeOpacity={0.16} strokeWidth={1.4}>
        <Path d="M820,560 A110,110 0 0 1 1040,560 Z" />
        {[30, 60, 90, 120, 150].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <Line
              key={deg}
              x1={930 + 92 * Math.cos(rad)}
              x2={930 + 110 * Math.cos(rad)}
              y1={560 - 92 * Math.sin(rad)}
              y2={560 - 110 * Math.sin(rad)}
            />
          );
        })}
      </G>

      {/* Floating symbols */}
      {symbols.map(({ char, x, y, size, opacity, rotate = 0 }) => (
        <SvgText
          fill="#FFFFFF"
          fillOpacity={opacity}
          fontFamily={fontFamily.bold}
          fontSize={size}
          key={char}
          origin={`${x}, ${y}`}
          rotation={rotate}
          x={x}
          y={y}
        >
          {char}
        </SvgText>
      ))}
    </Svg>
  );
}

export const MathBackground = memo(MathBackgroundComponent);
