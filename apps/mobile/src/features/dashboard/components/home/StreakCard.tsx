import { Flame } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { Card } from '@/components/Card';
import { Clay3DIcon } from '@/components/Clay3DIcon';
import { ProgressRing } from '@/components/ProgressRing';
import { brand, categories, colors, fontFamily, spacing } from '@/theme';

import type { StreakDay } from '../../mocks/student';

import { CardHeader } from './CardHeader';

const BOOK_WIDTH = 22;
const BOOK_HEIGHT = 26;
/** Canto inferior del libro 3D. */
const BOOK_DEPTH = 3;

const FLAME_PALETTE = categories.orange;

/**
 * Libro con marcapáginas (icono de la racha de la referencia) con volumen: canto inferior
 * más oscuro, cara y brillo blanco en la parte superior.
 */
function StreakBook({ done }: { done: boolean }) {
  const face = done ? brand.blue : colors.trackFill;
  const edge = done ? brand.blueNight : colors.textMuted;

  return (
    <Svg
      height={BOOK_HEIGHT + BOOK_DEPTH}
      viewBox={`0 0 ${BOOK_WIDTH} ${BOOK_HEIGHT + BOOK_DEPTH}`}
      width={BOOK_WIDTH}
    >
      <Rect
        fill={edge}
        height={BOOK_HEIGHT}
        opacity={done ? 1 : 0.35}
        rx={4}
        width={BOOK_WIDTH}
        y={BOOK_DEPTH}
      />
      <Rect fill={face} height={BOOK_HEIGHT} rx={4} width={BOOK_WIDTH} />
      <Rect
        fill={colors.surface}
        height={BOOK_HEIGHT / 2}
        opacity={0.18}
        rx={4}
        width={BOOK_WIDTH}
      />
      <Rect fill={edge} height={BOOK_HEIGHT} opacity={done ? 0.35 : 0.15} rx={2} width={4} x={2} />
      <Path d="M13 0 H18 V10 L15.5 7.8 L13 10 Z" fill={colors.surface} opacity={0.9} />
    </Svg>
  );
}

/** Racha de estudio: días seguidos, avance al próximo logro y cuadrícula de libros. */
export function StreakCard({
  days,
  goalPercent,
  isCompact,
  rows,
  toNextAchievement,
}: {
  days: number;
  goalPercent: number;
  isCompact: boolean;
  rows: StreakDay[][];
  toNextAchievement: number;
}) {
  return (
    <Card style={styles.card}>
      <CardHeader
        clay={{ kind: 'flame', palette: FLAME_PALETTE }}
        icon={Flame}
        right={
          <ProgressRing
            color={brand.accent}
            size={46}
            strokeWidth={5}
            trackColor={colors.track}
            value={goalPercent}
          >
            <Text style={styles.ringLabel}>{goalPercent}%</Text>
          </ProgressRing>
        }
        title="Racha de estudio"
      />

      <View>
        <Text style={styles.days}>
          {days} <Text style={styles.daysUnit}>días</Text>
        </Text>
        <Text
          numberOfLines={isCompact ? 1 : undefined}
          style={[styles.hint, isCompact && styles.hintCompact]}
        >
          {isCompact
            ? `Solo ${toNextAchievement} más para tu próximo logro.`
            : `Solo ${toNextAchievement} más para desbloquear tu próximo logro.`}
        </Text>
      </View>

      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((day, dayIndex) => (
              <View key={dayIndex} style={styles.cell}>
                {day === 'today' ? (
                  <Clay3DIcon kind="flame" palette={FLAME_PALETTE} shadow={false} size={30} />
                ) : (
                  <StreakBook done={day === 'done'} />
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: spacing.md },
  ringLabel: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 11 },
  days: {
    color: colors.text,
    fontFamily: fontFamily.regular,
    fontSize: 40,
    letterSpacing: -1,
  },
  daysUnit: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 16 },
  hint: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  hintCompact: { fontSize: 11 },
  grid: { gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  cell: {
    alignItems: 'center',
    height: BOOK_HEIGHT + BOOK_DEPTH,
    justifyContent: 'center',
    width: BOOK_WIDTH,
  },
});
