import {
  BookOpen,
  Crown,
  Flame,
  Medal,
  MoreHorizontal,
  Sigma,
  Star,
  Target,
  Trophy,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Clay3DIcon } from '@/components/Clay3DIcon';
import { Raised3D } from '@/components/Raised3D';
import { brand, categories, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import type { MedalKey } from '../../mocks/student';

import { CardHeader } from './CardHeader';

const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };

const medalIcons: Record<MedalKey, LucideIcon> = {
  book: BookOpen,
  flame: Flame,
  medal: Medal,
  sigma: Sigma,
  star: Star,
  target: Target,
  trophy: Trophy,
};

/** Logros: pila de tarjetas con el último logro y carrusel de medallas. */
export function AchievementsCard({
  latest,
  medals,
  isCompact,
  selected,
}: {
  latest: { subject: string; title: string; when: string };
  medals: { id: string; key: MedalKey }[];
  isCompact: boolean;
  selected: number;
}) {
  return (
    <Card style={styles.card}>
      <CardHeader
        clay={{ kind: 'trophy', palette: categories.orange }}
        icon={Crown}
        right={
          <Pressable
            accessibilityLabel="Más opciones de logros"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => undefined}
          >
            {({ pressed }) => (
              <Raised3D depth={3} faceStyle={styles.more} pressed={pressed} variant="white">
                <MoreHorizontal color={colors.text} size={18} strokeWidth={2} />
              </Raised3D>
            )}
          </Pressable>
        }
        title="Logros"
      />

      <View style={styles.stage}>
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
          <Clay3DIcon kind="badge" palette={BRAND_PALETTE} shadow={false} size={40} />
          <Text style={styles.frontTitle}>{latest.title}</Text>
          <Text style={styles.frontSubject}>{latest.subject}</Text>
          <Raised3D depth={2} faceStyle={styles.whenPill} style={styles.whenWrap} variant="primary">
            <Text style={styles.whenText}>{latest.when}</Text>
          </Raised3D>
        </View>
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
              depth={isSelected ? 4 : 3}
              faceStyle={[styles.medal, isSelected && styles.medalSelected]}
              style={isEdge && styles.medalEdge}
              variant={isSelected ? 'primary' : 'white'}
            >
              <Icon
                color={isSelected ? brand.onBlue : colors.text}
                size={isSelected ? 22 : 18}
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
  card: { flex: 1, gap: spacing.md },
  more: { alignItems: 'center', height: 36, justifyContent: 'center', width: 36 },
  stage: { alignItems: 'center', flex: 1, justifyContent: 'center', minHeight: 150 },
  ghost: {
    backgroundColor: colors.track,
    borderColor: colors.border,
    borderRadius: radius.chip,
    borderWidth: 1,
    height: 118,
    position: 'absolute',
    width: 120,
  },
  ghostLeft: { transform: [{ translateX: -44 }, { rotate: '-10deg' }] },
  ghostRight: { transform: [{ translateX: 44 }, { rotate: '10deg' }] },
  ghostCompact: { height: 110, width: 108 },
  ghostLeftCompact: { transform: [{ translateX: -36 }, { rotate: '-10deg' }] },
  ghostRightCompact: { transform: [{ translateX: 36 }, { rotate: '10deg' }] },
  front: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.chip,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 3,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    width: 150,
    ...shadows.card,
    shadowOpacity: 0.16,
  },
  frontTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 14, marginTop: 4 },
  frontSubject: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  whenWrap: { marginTop: 6 },
  whenPill: { paddingHorizontal: 12, paddingVertical: 4 },
  whenText: { color: brand.onBlue, fontFamily: fontFamily.semibold, fontSize: 11 },
  medals: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  medal: { alignItems: 'center', height: 36, justifyContent: 'center', width: 36 },
  medalSelected: { height: 48, width: 48 },
  medalEdge: { opacity: 0.35 },
});
