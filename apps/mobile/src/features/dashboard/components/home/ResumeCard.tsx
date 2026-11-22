import { LinearGradient } from 'expo-linear-gradient';
import { GraduationCap, Hourglass, Play } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProgressRing } from '@/components/ProgressRing';
import { Raised3D } from '@/components/Raised3D';
import { brand, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import { CourseObject } from '../courses/CourseIllustration';

/** π 3D en "arcilla" blanca con canto lavanda, para que destaque sobre el azul. */
const WHITE_CLAY = { base: colors.surface, ink: brand.blueSoft, soft: brand.blueSoft };

/** Tarjeta destacada "Continúa aprendiendo" (bloque azul único de la vista). */
export function ResumeCard({
  eyebrow,
  modules,
  remaining,
  remainingProgress,
  subject,
  topic,
  isCompact,
}: {
  eyebrow: string;
  modules: { done: number; total: number };
  remaining: string;
  remainingProgress: number;
  subject: string;
  topic: string;
  isCompact: boolean;
}) {
  return (
    <LinearGradient
      colors={[brand.blue, brand.blueDeep, brand.blueNight]}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.55, 1]}
      start={{ x: 0, y: 0 }}
      style={styles.card}
    >
      {/* Luz suave y objeto 3D de la materia a la derecha (sustituye a la foto de la referencia). */}
      <View pointerEvents="none" style={styles.glow} />
      <View pointerEvents="none" style={[styles.object, isCompact && styles.objectCompact]}>
        <CourseObject icon="sigma" palette={WHITE_CLAY} uid="resume-hero" />
      </View>
      <Text pointerEvents="none" style={styles.symbol}>
        ∑
      </Text>

      <View style={styles.top}>
        <View style={styles.eyebrow}>
          <Hourglass color={brand.onBlueMuted} size={14} strokeWidth={2} />
          <Text style={styles.eyebrowText}>{eyebrow}</Text>
        </View>
        <Text numberOfLines={1} style={styles.title}>
          {subject}
        </Text>
        <Text numberOfLines={1} style={styles.topic}>
          {topic}
        </Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.chips}>
          <View style={styles.chip}>
            <View style={styles.chipIcon}>
              <ProgressRing
                color={brand.accent}
                size={22}
                strokeWidth={4}
                trackColor={colors.track}
                value={remainingProgress}
              />
            </View>
            <View>
              <Text style={styles.chipLabel}>Restante</Text>
              <Text style={styles.chipValue}>{remaining}</Text>
            </View>
          </View>
          <View style={styles.chip}>
            <View style={styles.chipIcon}>
              <GraduationCap color={brand.accentPressed} size={18} strokeWidth={2.2} />
            </View>
            <View>
              <Text style={styles.chipLabel}>Módulos</Text>
              <Text style={styles.chipValue}>
                {modules.done} de {modules.total}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          accessibilityLabel={`Continuar ${subject}`}
          accessibilityRole="button"
          onPress={() => undefined}
        >
          {({ pressed }) => (
            <Raised3D depth={5} faceStyle={styles.play} pressed={pressed} variant="white">
              <Play color={brand.blueDeep} fill={brand.blueDeep} size={26} />
            </Raised3D>
          )}
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 290,
    overflow: 'hidden',
    padding: spacing.lg,
    ...shadows.card,
  },
  glow: {
    backgroundColor: brand.onBlueSubtle,
    borderRadius: radius.pill,
    height: 300,
    position: 'absolute',
    right: -40,
    top: -90,
    width: 300,
  },
  object: { bottom: 18, position: 'absolute', right: 96, top: 18, width: 230 },
  objectCompact: { right: 84, width: 170 },
  symbol: {
    bottom: -40,
    color: brand.onBlue,
    fontFamily: fontFamily.bold,
    fontSize: 180,
    left: '36%',
    opacity: 0.06,
    position: 'absolute',
  },
  top: { gap: spacing.xs },
  eyebrow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  eyebrowText: { color: brand.onBlueMuted, fontFamily: fontFamily.medium, fontSize: 13 },
  title: {
    color: brand.onBlue,
    fontFamily: fontFamily.regular,
    fontSize: 44,
    letterSpacing: -1,
    lineHeight: 52,
  },
  topic: { color: brand.onBlueMuted, fontFamily: fontFamily.medium, fontSize: 15 },
  bottom: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between' },
  chips: {
    backgroundColor: brand.onBlueSubtle,
    borderColor: brand.onBlueBorder,
    borderRadius: radius.chip,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  chip: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  chipIcon: {
    alignItems: 'center',
    backgroundColor: brand.onBlue,
    borderRadius: radius.pill,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  chipLabel: { color: brand.onBlueMuted, fontFamily: fontFamily.regular, fontSize: 11 },
  chipValue: { color: brand.onBlue, fontFamily: fontFamily.semibold, fontSize: 13 },
  play: {
    alignItems: 'center',
    height: 64,
    justifyContent: 'center',
    paddingLeft: 4,
    width: 64,
  },
});
