import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Clay3DIcon } from '@/components/Clay3DIcon';
import { brand, categories, colors, fontFamily, radius, spacing } from '@/theme';
import { logos } from '@/theme/logos';

import { formatGrade } from '../../data/studentSelectors';

const GOLD = categories.orange;

/** Modal centrado sobre un velo de marca. */
function Sheet({
  children,
  label,
  onClose,
  visible,
}: {
  children: ReactNode;
  label: string;
  onClose: () => void;
  visible: boolean;
}) {
  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.backdrop}>
        <View pointerEvents="none" style={styles.scrim} />
        <Pressable
          accessibilityLabel={`Cerrar ${label}`}
          accessibilityRole="button"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        {children}
      </View>
    </Modal>
  );
}

function CloseButton({ color = colors.text, onPress }: { color?: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel="Cerrar"
      accessibilityRole="button"
      hitSlop={6}
      onPress={onPress}
      style={styles.close}
    >
      <X color={color} size={20} strokeWidth={2.4} />
    </Pressable>
  );
}

/**
 * Tarjeta académica personalizada: composición visual dinámica (no se exporta ni comparte en el
 * MVP). Los textos se adaptan a cualquier posición y al caso sin ranking.
 */
export function AcademicCardModal({
  average,
  name,
  onClose,
  percent,
  period,
  position,
  streakDays,
  total,
  visible,
}: {
  average?: number;
  name: string;
  onClose: () => void;
  percent: number;
  period: string;
  position?: number;
  streakDays: number;
  total: number;
  visible: boolean;
}) {
  const stats = [
    { label: 'Promedio', value: average === undefined ? '—' : `${formatGrade(average)}/20` },
    { label: 'Avance', value: `${percent}%` },
    { label: 'Racha', value: `${streakDays} ${streakDays === 1 ? 'día' : 'días'}` },
  ];

  return (
    <Sheet label="tarjeta académica" onClose={onClose} visible={visible}>
      <LinearGradient
        colors={[brand.blueDeep, brand.blueNight]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.academic}
      >
        <View pointerEvents="none" style={styles.glow} />
        <View style={styles.academicTop}>
          <Image
            accessibilityLabel="Academia José Pisconte"
            resizeMode="contain"
            source={logos.shield}
            style={styles.shield}
          />
          <View style={styles.flex}>
            <Text style={styles.brandTitle}>José Pisconte</Text>
            <Text style={styles.brandSubtitle}>Reforzamiento Académico</Text>
          </View>
          <CloseButton color={brand.onBlue} onPress={onClose} />
        </View>

        <View style={styles.trophy}>
          <Clay3DIcon kind="trophy" palette={GOLD} size={120} />
          <Text style={styles.rank}>
            {position ? `#${String(position).padStart(2, '0')}` : 'Sin posición'}
          </Text>
          <Text style={styles.rankLabel}>Mi posición académica</Text>
          <Text style={styles.rankTotal}>
            {position ? `De ${total} estudiantes` : 'Aparecerá cuando haya notas del periodo'}
          </Text>
        </View>

        <View style={styles.divider} />
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <View style={styles.stats}>
          {stats.map(({ label, value }) => (
            <View key={label} style={styles.stat}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.period}>Periodo: {period}</Text>
      </LinearGradient>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: spacing.lg },
  scrim: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: brand.blueNight,
    opacity: 0.45,
  },
  close: { alignItems: 'center', height: 48, justifyContent: 'center', width: 48 },

  academic: {
    borderColor: GOLD.base,
    borderRadius: radius.card + 8,
    borderWidth: 2,
    gap: spacing.md,
    maxHeight: '96%',
    overflow: 'hidden',
    padding: spacing.lg,
    width: 360,
  },
  glow: {
    backgroundColor: brand.onBlueSubtle,
    borderRadius: radius.pill,
    height: 300,
    left: 30,
    position: 'absolute',
    top: 40,
    width: 300,
  },
  academicTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  shield: { height: 40, width: 40 },
  brandTitle: { color: brand.onBlue, fontFamily: fontFamily.extrabold, fontSize: 16 },
  brandSubtitle: { color: brand.onBlueMuted, fontFamily: fontFamily.medium, fontSize: 11 },
  trophy: { alignItems: 'center', gap: 2 },
  rank: { color: GOLD.base, fontFamily: fontFamily.extrabold, fontSize: 44, letterSpacing: -1 },
  rankLabel: { color: brand.onBlue, fontFamily: fontFamily.bold, fontSize: 15 },
  rankTotal: { color: brand.onBlueMuted, fontFamily: fontFamily.medium, fontSize: 13 },
  divider: { backgroundColor: brand.onBlueBorder, height: 1 },
  name: { color: brand.onBlue, fontFamily: fontFamily.bold, fontSize: 18, textAlign: 'center' },
  stats: { flexDirection: 'row' },
  stat: { alignItems: 'center', flex: 1, gap: 2 },
  statValue: { color: GOLD.base, fontFamily: fontFamily.extrabold, fontSize: 17 },
  statLabel: { color: brand.onBlueMuted, fontFamily: fontFamily.medium, fontSize: 12 },
  period: {
    color: brand.onBlueMuted,
    fontFamily: fontFamily.medium,
    fontSize: 12,
    textAlign: 'center',
  },
});
