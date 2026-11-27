import { memo, useEffect, useMemo, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
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

/*
 * Fondo matemático del login.
 *
 * Capas (de atrás hacia delante):
 *   1. Degradado base (SVG estático).
 *   2. Resplandores que "respiran" (Animated.View).
 *   3. Cuadrícula y geometría (SVG estático). Sin ejes ni curvas: no compiten con el logo
 *      ni con los objetos 3D del login.
 *   4. Símbolos flotantes (Animated.View).
 *
 * Todas las animaciones usan `Animated` con `useNativeDriver: true` (solo transform/opacity),
 * así corren en el hilo nativo sin trabajo de JS por fotograma y sin reanimated (D-04).
 * Si el sistema tiene activado "reducir movimiento", el fondo queda estático.
 */

const VIEW_W = 1200;
const VIEW_H = 700;
const GRID = 30;

const minorLines = {
  vertical: Array.from({ length: Math.ceil(VIEW_W / GRID) + 1 }, (_, i) => i * GRID),
  horizontal: Array.from({ length: Math.ceil(VIEW_H / GRID) + 1 }, (_, i) => i * GRID),
};

type MathSymbol = { char: string; x: number; y: number; size: number; opacity: number; rotate?: number };

const symbols: MathSymbol[] = [
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

const glows = [
  { id: 'cyan', color: '#38BDF8', stopOpacity: 0.45, cx: 260, cy: 160, r: 340, duration: 7000 },
  { id: 'violet', color: '#A78BFA', stopOpacity: 0.4, cx: 1050, cy: 620, r: 380, duration: 9000 },
];

/** Traduce coordenadas del viewBox a dp, replicando `preserveAspectRatio="xMidYMid slice"`. */
type Frame = { scale: number; offsetX: number; offsetY: number };

function getFrame(width: number, height: number): Frame {
  const scale = Math.max(width / VIEW_W, height / VIEW_H);
  return {
    scale,
    offsetX: (width - VIEW_W * scale) / 2,
    offsetY: (height - VIEW_H * scale) / 2,
  };
}

function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}

/** Valor 0 → 1 → 0 en bucle con curva senoidal (movimiento de "flotar"). */
function usePingPong(duration: number, delay: number, enabled: boolean) {
  const [value] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!enabled) {
      value.setValue(0);
      return;
    }
    const ease = Easing.inOut(Easing.sin);
    const animation = Animated.sequence([
      Animated.delay(delay),
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, { duration, easing: ease, toValue: 1, useNativeDriver: true }),
          Animated.timing(value, { duration, easing: ease, toValue: 0, useNativeDriver: true }),
        ]),
      ),
    ]);
    animation.start();
    return () => animation.stop();
  }, [delay, duration, enabled, value]);

  return value;
}

function Glow({ glow, frame, animate }: { glow: (typeof glows)[number]; frame: Frame; animate: boolean }) {
  const progress = usePingPong(glow.duration, 0, animate);
  const size = glow.r * 2 * frame.scale;

  return (
    <Animated.View
      style={[
        styles.absolute,
        {
          height: size,
          left: frame.offsetX + (glow.cx - glow.r) * frame.scale,
          opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
          top: frame.offsetY + (glow.cy - glow.r) * frame.scale,
          transform: [
            { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.08] }) },
            { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [-12, 12] }) },
          ],
          width: size,
        },
      ]}
    >
      <Svg height="100%" viewBox={`0 0 ${glow.r * 2} ${glow.r * 2}`} width="100%">
        <Defs>
          <RadialGradient cx="0.5" cy="0.5" id={glow.id} r="0.5">
            <Stop offset="0" stopColor={glow.color} stopOpacity={glow.stopOpacity} />
            <Stop offset="1" stopColor={glow.color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={glow.r} cy={glow.r} fill={`url(#${glow.id})`} r={glow.r} />
      </Svg>
    </Animated.View>
  );
}

function FloatingSymbol({
  symbol,
  index,
  frame,
  animate,
}: {
  symbol: MathSymbol;
  index: number;
  frame: Frame;
  animate: boolean;
}) {
  // Duraciones y retrasos distintos para que no se muevan al unísono.
  const progress = usePingPong(3800 + (index % 4) * 700, index * 350, animate);
  const rotate = symbol.rotate ?? 0;
  const fontSize = symbol.size * frame.scale;
  const drift = 10 * frame.scale;

  return (
    <Animated.Text
      style={[
        styles.absolute,
        styles.symbol,
        {
          fontSize,
          left: frame.offsetX + symbol.x * frame.scale,
          opacity: symbol.opacity,
          // En SVG `y` es la línea base; en RN `top` es el borde superior de la caja.
          top: frame.offsetY + (symbol.y - symbol.size * 0.95) * frame.scale,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [drift, -drift],
              }),
            },
            {
              rotate: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [`${rotate - 4}deg`, `${rotate + 4}deg`],
              }),
            },
          ],
        },
      ]}
    >
      {symbol.char}
    </Animated.Text>
  );
}

function MathBackgroundComponent() {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const reduceMotion = useReduceMotion();
  const animate = !reduceMotion;
  const frame = useMemo(() => (size ? getFrame(size.width, size.height) : null), [size]);

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const { width, height } = nativeEvent.layout;
    setSize((current) =>
      current?.width === width && current.height === height ? current : { width, height },
    );
  };

  return (
    <View onLayout={handleLayout} pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* 1. Degradado base */}
      <Svg
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      >
        <Defs>
          <LinearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#1F1FFF" />
            <Stop offset="0.55" stopColor="#0B0BC4" />
            <Stop offset="1" stopColor="#06065E" />
          </LinearGradient>
        </Defs>
        <Rect fill="url(#bg)" height={VIEW_H} width={VIEW_W} x={0} y={0} />
      </Svg>

      {/* 2. Resplandores */}
      {frame ? glows.map((glow) => <Glow animate={animate} frame={frame} glow={glow} key={glow.id} />) : null}

      {/* 3. Cuadrícula, ejes y geometría estática */}
      <Svg
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      >
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

        {/* Círculo con radio */}
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

        {/* Triángulo rectángulo */}
        <G fill="none" stroke="#FFFFFF" strokeLinejoin="round" strokeOpacity={0.2} strokeWidth={1.6}>
          <Path d="M150,620 L320,620 L150,520 Z" />
          <Path d="M150,602 L168,602 L168,620" />
        </G>

        {/* Transportador */}
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
      </Svg>

      {/* 4. Elementos animados */}
      {frame ? (
        <>
          {symbols.map((symbol, index) => (
            <FloatingSymbol
              animate={animate}
              frame={frame}
              index={index}
              key={symbol.char}
              symbol={symbol}
            />
          ))}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  absolute: { position: 'absolute' },
  symbol: { color: '#FFFFFF', fontFamily: fontFamily.bold, includeFontPadding: false },
});

export const MathBackground = memo(MathBackgroundComponent);
