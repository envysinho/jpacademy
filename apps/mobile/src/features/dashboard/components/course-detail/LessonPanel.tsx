import { Captions, Maximize, NotebookText, Play } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Raised3D } from '@/components/Raised3D';
import { brand, colors, fontFamily, radius, spacing } from '@/theme';

import type { CourseColor, CourseIcon } from '../../mocks/studentCourses';
import { CourseBanner } from '../courses/CourseBanner';
import { CardHeader } from '../home/CardHeader';

const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };

export type LessonSummary = { concepts: string[]; objectives: string[]; text: string };

/**
 * Reproductor de la lección (portada 3D + controles sobre vidrio) y resumen escrito del tema
 * activo. Columna estable: no cambia al alternar Lección/Recursos.
 */
export function LessonPanel({
  color,
  duration,
  icon,
  summary,
}: {
  color: CourseColor;
  duration: string;
  icon: CourseIcon;
  summary: LessonSummary;
}) {
  return (
    <View style={styles.root}>
      {/* Reproductor */}
      <View style={styles.player}>
        <CourseBanner color={color} icon={icon} style={styles.playerBanner} uid="lesson-player" />
        <View style={styles.playCenter}>
          <Pressable
            accessibilityLabel="Reproducir lección"
            accessibilityRole="button"
            onPress={() => undefined}
          >
            {({ pressed }) => (
              <Raised3D depth={5} faceStyle={styles.playButton} pressed={pressed} variant="primary">
                <Play color={brand.onBlue} fill={brand.onBlue} size={30} />
              </Raised3D>
            )}
          </Pressable>
        </View>
        <View style={styles.controls}>
          <View style={styles.controlsGlass} />
          <Play color={brand.onBlue} fill={brand.onBlue} size={18} />
          <Text style={styles.controlText}>0:00 / {duration}</Text>
          <View style={styles.seek}>
            <View style={styles.seekDot} />
          </View>
          <Captions color={brand.onBlue} size={20} strokeWidth={2} />
          <Text style={styles.controlText}>1.0x</Text>
          <Maximize color={brand.onBlue} size={18} strokeWidth={2} />
        </View>
      </View>

      {/* Resumen escrito del tema activo */}
      <Card style={styles.card}>
        <CardHeader
          clay={{ kind: 'book', palette: BRAND_PALETTE }}
          icon={NotebookText}
          title="Resumen de la lección"
        />
        <Text style={styles.body}>{summary.text}</Text>
        {summary.objectives.length > 0 && (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Objetivos</Text>
            {summary.objectives.map((objective) => (
              <View key={objective} style={styles.bulletRow}>
                <View style={styles.bullet} />
                <Text style={[styles.body, styles.flex]}>{objective}</Text>
              </View>
            ))}
          </View>
        )}
        {summary.concepts.length > 0 && (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Conceptos clave</Text>
            <View style={styles.concepts}>
              {summary.concepts.map((concept) => (
                <View key={concept} style={styles.concept}>
                  <Text style={styles.conceptText}>{concept}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  player: { borderRadius: radius.card, overflow: 'hidden' },
  playerBanner: { borderRadius: radius.card, height: 300 },
  playCenter: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: '30%',
    top: 0,
  },
  playButton: {
    alignItems: 'center',
    height: 76,
    justifyContent: 'center',
    paddingLeft: 4,
    width: 76,
  },
  controls: {
    alignItems: 'center',
    borderRadius: radius.chip,
    bottom: 12,
    flexDirection: 'row',
    gap: spacing.md,
    left: 12,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    position: 'absolute',
    right: 12,
  },
  controlsGlass: {
    backgroundColor: brand.blueNight,
    bottom: 0,
    left: 0,
    opacity: 0.55,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  controlText: { color: brand.onBlue, fontFamily: fontFamily.semibold, fontSize: 13 },
  seek: {
    backgroundColor: brand.onBlueSubtle,
    borderRadius: 2,
    flex: 1,
    height: 4,
    justifyContent: 'center',
  },
  seekDot: { backgroundColor: brand.onBlue, borderRadius: 7, height: 14, width: 14 },
  card: { gap: spacing.md, padding: spacing.md },
  flex: { flex: 1 },
  body: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 21 },
  block: { gap: 6 },
  blockTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 14 },
  bulletRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm },
  bullet: {
    backgroundColor: brand.blueDeep,
    borderRadius: radius.pill,
    height: 6,
    marginTop: 8,
    width: 6,
  },
  concepts: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  concept: {
    backgroundColor: brand.blueSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  conceptText: { color: brand.blueDeep, fontFamily: fontFamily.semibold, fontSize: 13 },
});
