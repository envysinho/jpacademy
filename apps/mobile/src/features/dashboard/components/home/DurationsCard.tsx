import { Clock } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { Card } from '@/components/Card';
import { brand, categories, colors, fontFamily, spacing } from '@/theme';

import { CardHeader } from './CardHeader';

const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };
/** Alto de las etiquetas del eje X + separación (para alinear el eje Y con la gráfica). */
const X_AXIS_SPACE = 20;
const POINT_RADIUS = 5;

/** Curva suave entre puntos (control horizontal a mitad de cada tramo). */
function smoothPath(points: { x: number; y: number }[]) {
  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const midX = (previous.x + point.x) / 2;
    return `${path} C ${midX} ${previous.y}, ${midX} ${point.y}, ${point.x} ${point.y}`;
  }, '');
}

/** Horas de estudio: total, meta y evolución por semanas. */
export function DurationsCard({
  caption,
  goalHours,
  hours,
  isCompact: _isCompact,
  points,
  weeks,
  yTicks,
}: {
  caption: string;
  goalHours: number;
  hours: number;
  isCompact: boolean;
  points: number[];
  weeks: string[];
  yTicks: number[];
}) {
  const [{ height: chartHeight, width: chartWidth }, setChartSize] = useState({
    height: 0,
    width: 0,
  });
  const maxY = Math.max(...yTicks);
  const pad = POINT_RADIUS + 4;
  const coordinates = points.map((value, index) => ({
    x: pad + (index / (points.length - 1)) * (chartWidth - pad * 2),
    y: pad + (1 - value / maxY) * (chartHeight - pad * 2),
  }));
  const last = coordinates[coordinates.length - 1];
  const goalPercent = Math.min(100, (hours / goalHours) * 100);

  return (
    <Card style={styles.card}>
      <CardHeader
        clay={{ kind: 'clock', palette: BRAND_PALETTE }}
        icon={Clock}
        right={
          <View style={styles.goal}>
            <Text style={styles.goalText}>Meta {goalHours} h</Text>
            <View style={styles.goalTrack}>
              <View style={[styles.goalFill, { width: `${goalPercent}%` }]} />
            </View>
          </View>
        }
        title="Horas"
      />

      <View>
        <Text style={styles.value}>
          {hours} <Text style={styles.unit}>horas</Text>
        </Text>
        <Text numberOfLines={1} style={styles.caption}>
          {caption}
        </Text>
      </View>

      <View style={styles.chart}>
        <View style={styles.yAxis}>
          {yTicks.map((tick) => (
            <Text key={tick} style={styles.axisLabel}>
              {tick}
            </Text>
          ))}
        </View>
        <View style={styles.plot}>
          <View
            onLayout={({ nativeEvent: { layout } }) =>
              setChartSize({ height: layout.height, width: layout.width })
            }
            style={styles.canvas}
          >
            {chartWidth > 0 && chartHeight > 0 && (
              <Svg height={chartHeight} width={chartWidth}>
                {yTicks.map((tick) => {
                  const y = pad + (1 - tick / maxY) * (chartHeight - pad * 2);
                  return (
                    <Line
                      key={tick}
                      stroke={colors.border}
                      strokeDasharray="4 4"
                      strokeWidth={1}
                      x1={0}
                      x2={chartWidth}
                      y1={y}
                      y2={y}
                    />
                  );
                })}
                <Defs>
                  <LinearGradient id="durations-area" x1="0" x2="0" y1="0" y2="1">
                    <Stop offset="0" stopColor={brand.blue} stopOpacity="0.22" />
                    <Stop offset="1" stopColor={brand.blue} stopOpacity="0" />
                  </LinearGradient>
                  <LinearGradient id="durations-line" x1="0" x2="1" y1="0" y2="0">
                    <Stop offset="0" stopColor={brand.blue} />
                    <Stop offset="1" stopColor={brand.blueDeep} />
                  </LinearGradient>
                </Defs>
                {/* Área bajo la curva y sombra desplazada: dan volumen a la línea. */}
                <Path
                  d={`${smoothPath(coordinates)} L ${last.x} ${chartHeight} L ${coordinates[0].x} ${chartHeight} Z`}
                  fill="url(#durations-area)"
                />
                <Path
                  d={smoothPath(coordinates)}
                  fill="none"
                  opacity={0.15}
                  stroke={brand.blueNight}
                  strokeLinecap="round"
                  strokeWidth={4}
                  transform="translate(0 4)"
                />
                <Path
                  d={smoothPath(coordinates)}
                  fill="none"
                  stroke="url(#durations-line)"
                  strokeLinecap="round"
                  strokeWidth={3.5}
                />
                <Circle cx={last.x} cy={last.y} fill={brand.blueSoft} r={POINT_RADIUS + 6} />
                <Circle cx={last.x} cy={last.y + 2} fill={brand.blueNight} r={POINT_RADIUS + 1} />
                <Circle
                  cx={last.x}
                  cy={last.y}
                  fill={brand.blue}
                  r={POINT_RADIUS + 1}
                  stroke={colors.surface}
                  strokeWidth={2}
                />
                <Circle
                  cx={last.x - 1.5}
                  cy={last.y - 1.5}
                  fill={colors.surface}
                  opacity={0.7}
                  r={1.8}
                />
              </Svg>
            )}
          </View>
          <View style={styles.xAxis}>
            {weeks.map((week, index) => (
              <Text
                key={week}
                style={[styles.axisLabel, index === weeks.length - 1 && styles.axisLabelActive]}
              >
                {week}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: 12, padding: 20 },
  goal: { alignItems: 'flex-end', gap: 4 },
  goalText: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 12 },
  goalTrack: {
    backgroundColor: categories.orange.soft,
    borderRadius: 3,
    height: 6,
    overflow: 'hidden',
    width: 64,
  },
  goalFill: { backgroundColor: brand.accent, borderRadius: 3, height: 6 },
  value: { color: colors.text, fontFamily: fontFamily.regular, fontSize: 40, letterSpacing: -1 },
  unit: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 16 },
  caption: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  /** La gráfica ocupa el alto que queda en la tarjeta (Inicio en un solo viewport). */
  chart: { flex: 1, flexDirection: 'row', gap: spacing.sm, minHeight: 0 },
  yAxis: { justifyContent: 'space-between', marginBottom: X_AXIS_SPACE, paddingVertical: 2 },
  plot: { flex: 1, gap: 6 },
  canvas: { flex: 1, minHeight: 0 },
  xAxis: { flexDirection: 'row', justifyContent: 'space-between' },
  axisLabel: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 11 },
  axisLabelActive: { color: colors.text, fontFamily: fontFamily.semibold },
});
