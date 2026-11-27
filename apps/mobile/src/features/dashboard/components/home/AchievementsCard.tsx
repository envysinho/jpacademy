import {
  BookOpen,
  Crown,
  Flame,
  Medal,
  Sigma,
  Star,
  Target,
  Trophy,
  type LucideIcon,
} from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Card } from '@/components/Card';
import { Clay3DIcon } from '@/components/Clay3DIcon';
import { ProgressBar } from '@/components/ProgressBar';
import { Raised3D } from '@/components/Raised3D';
import { brand, categories, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import type { MedalKey } from '../../mocks/student';

import { CardHeader } from './CardHeader';

const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };
const GOLD = categories.orange;

/** Destellos dorados alrededor del último logro (decorativos). */
const SPARKLES = [
  { left: '12%', size: 14, top: '8%' },
  { left: '82%', size: 12, top: '14%' },
  { left: '8%', size: 9, top: '72%' },
  { left: '86%', size: 10, top: '70%' },
  { left: '24%', size: 7, top: '40%' },
] as const;

function Sparkle({ size }: { size: number }) {
  return (
    <Svg height={size} viewBox="0 0 20 20" width={size}>
      <Path
        d="M10 0 L12.4 7.6 L20 10 L12.4 12.4 L10 20 L7.6 12.4 L0 10 L7.6 7.6 Z"
        fill={GOLD.base}
      />
    </Svg>
  );
}

const medalIcons: Record<MedalKey, LucideIcon> = {
  book: BookOpen,
  flame: Flame,
  medal: Medal,
  sigma: Sigma,
  star: Star,
  target: Target,
  trophy: Trophy,
};

/**
 * Logros: contador de desbloqueados, pila de tarjetas con el último logro (brillo y destellos
 * dorados), avance hacia el próximo logro y carrusel de medallas.
 */
export function AchievementsCard({
  isCompact,
  latest,
  medals,
  next,
  selected,
  total,
  unlocked,
}: {
  isCompact: boolean;
  latest: { subject: string; title: string; when: string };
  medals: { id: string; key: MedalKey }[];
  next: { current: number; target: number; title: string };
  selected: number;
  total: number;
  unlocked: number;
}) {
  return (
    <Card style={styles.card}>
      <CardHeader
        clay={{ kind: 'trophy', palette: categories.orange }}
        icon={Crown}
        right={
          <Raised3D
            depth={3}
            faceStyle={styles.counter}
            palette={GOLD}
            radius={radius.pill}
            variant="soft"
          >
            <Text accessibilityLabel={`${unlocked} de ${total} logros`} style={styles.counterText}>
              {unlocked}
              <Text style={styles.counterTotal}>/{total}</Text>
            </Text>
          </Raised3D>
        }
        title="Logros"
      />

      <View style={styles.stage}>
        <View pointerEvents="none" style={styles.glow} />
        {SPARKLES.map(({ left, size, top }) => (
          <View key={`${left}-${top}`} pointerEvents="none" style={[styles.sparkle, { left, top }]}>
            <Sparkle size={size} />
          </View>
        ))}
        <View
          style={[
            styles.ghost,
            isCompact && styles.ghostCompact,
            styles.ghostLeft,
            isCompact && styles.ghostLeftCompact,
          ]}
        />
        <View
          style={[
            styles.ghost,
            isCompact && styles.ghostCompact,
            styles.ghostRight,
            isCompact && styles.ghostRightCompact,
          ]}
        />
        <View style={styles.front}>
          <Clay3DIcon kind="badge" palette={BRAND_PALETTE} shadow={false} size={32} />
          <Text numberOfLines={1} style={styles.frontTitle}>
            {latest.title}
          </Text>
          <Raised3D depth={2} faceStyle={styles.whenPill} style={styles.whenWrap} variant="primary">
            <Text numberOfLines={1} style={styles.whenText}>
              {latest.subject} · {latest.when}
            </Text>
          </Raised3D>
        </View>
      </View>

      {/* Próximo logro */}
      <View style={styles.next}>
        <View style={styles.nextHeader}>
          <Text numberOfLines={1} style={styles.nextTitle}>
            Próximo: <Text style={styles.nextName}>{next.title}</Text>
          </Text>
          <Text style={styles.nextValue}>
            {next.current}/{next.target}
          </Text>
        </View>
        <ProgressBar
          color={brand.accent}
          trackColor={GOLD.soft}
          value={(next.current / next.target) * 100}
        />
      </View>

      <View style={styles.medals}>
        {medals.map(({ id, key }, index) => {
          const Icon = medalIcons[key];
          const isSelected = index === selected;
          const isEdge = index === 0 || index === medals.length - 1;

          // Medallas como botones 3D: la seleccionada en azul de marca, las demás blancas.
          return (
            <Raised3D
              key={id}
              depth={isSelected ? 3 : 2}
              faceStyle={[styles.medal, isSelected && styles.medalSelected]}
              style={isEdge && styles.medalEdge}
              variant={isSelected ? 'primary' : 'white'}
            >
              <Icon
                color={isSelected ? brand.onBlue : colors.text}
                size={isSelected ? 20 : 16}
                strokeWidth={2.2}
              />
            </Raised3D>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: 10, padding: 20 },
  counter: { justifyContent: 'center', minHeight: 32, paddingHorizontal: 12 },
  counterText: { color: GOLD.ink, fontFamily: fontFamily.extrabold, fontSize: 16 },
  counterTotal: { color: GOLD.ink, fontFamily: fontFamily.medium, fontSize: 12 },
  glow: {
    backgroundColor: GOLD.soft,
    borderRadius: radius.pill,
    height: 132,
    position: 'absolute',
    width: 132,
  },
  sparkle: { position: 'absolute' },
  stage: { alignItems: 'center', flex: 1, justifyContent: 'center', minHeight: 0 },
  ghost: {
    backgroundColor: colors.track,
    borderColor: colors.border,
    borderRadius: radius.chip,
    borderWidth: 1,
    height: 96,
    position: 'absolute',
    width: 110,
  },
  ghostLeft: { transform: [{ translateX: -54 }, { rotate: '-10deg' }] },
  ghostRight: { transform: [{ translateX: 54 }, { rotate: '10deg' }] },
  ghostCompact: { height: 92, width: 100 },
  ghostLeftCompact: { transform: [{ translateX: -50 }, { rotate: '-10deg' }] },
  ghostRightCompact: { transform: [{ translateX: 50 }, { rotate: '10deg' }] },
  front: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.chip,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    width: 176,
    ...shadows.card,
    shadowOpacity: 0.16,
  },
  frontTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 14, marginTop: 2 },
  whenWrap: { marginTop: 4, maxWidth: '100%' },
  whenPill: { paddingHorizontal: 10, paddingVertical: 3 },
  whenText: { color: brand.onBlue, fontFamily: fontFamily.semibold, fontSize: 11 },
  next: { gap: 4 },
  nextHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  nextTitle: { color: colors.textMuted, flex: 1, fontFamily: fontFamily.medium, fontSize: 12 },
  nextName: { color: colors.text, fontFamily: fontFamily.semibold },
  nextValue: { color: GOLD.ink, fontFamily: fontFamily.bold, fontSize: 12 },
  medals: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  medal: { alignItems: 'center', height: 32, justifyContent: 'center', width: 32 },
  medalSelected: { height: 42, width: 42 },
  medalEdge: { opacity: 0.35 },
});
