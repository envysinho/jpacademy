import {
  Captions,
  Check,
  Download,
  FileSpreadsheet,
  FileText,
  Maximize,
  NotebookPen,
  PenLine,
  Play,
  Presentation,
  type LucideIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Raised3D } from '@/components/Raised3D';
import { brand, categories, colors, fontFamily, radius, spacing } from '@/theme';

import type { CourseColor, CourseIcon } from '../../mocks/studentCourses';
import type { ResourceKind } from '../../mocks/courseDetail';
import { CourseBanner } from '../courses/CourseBanner';

type TabKey = 'resources' | 'exercises' | 'notes';

const TABS: { icon: LucideIcon; key: TabKey; label: string }[] = [
  { icon: FileText, key: 'resources', label: 'Recursos' },
  { icon: PenLine, key: 'exercises', label: 'Ejercicios' },
  { icon: NotebookPen, key: 'notes', label: 'Notas' },
];

const resourceStyle: Record<
  ResourceKind,
  { icon: LucideIcon; palette: { ink: string; soft: string } }
> = {
  pdf: { icon: FileText, palette: categories.red },
  sheet: { icon: FileSpreadsheet, palette: categories.green },
  slides: { icon: Presentation, palette: categories.orange },
};

/** Reproductor de la lección (portada 3D de la materia + controles sobre vidrio) y material. */
export function LessonPanel({
  color,
  duration,
  exercises,
  icon,
  note,
  resources,
}: {
  color: CourseColor;
  duration: string;
  exercises: { done: boolean; id: string; title: string }[];
  icon: CourseIcon;
  note: string;
  resources: { id: string; kind: ResourceKind; meta: string; name: string }[];
}) {
  const [tab, setTab] = useState<TabKey>('resources');

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

      {/* Material de la lección */}
      <Card style={styles.card}>
        <View style={styles.tabs}>
          {TABS.map(({ icon: Icon, key, label }) => {
            const isActive = key === tab;
            const content = (
              <>
                <Icon color={isActive ? brand.onBlue : colors.text} size={16} strokeWidth={2.2} />
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{label}</Text>
              </>
            );
            return (
              <Pressable
                key={key}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                onPress={() => setTab(key)}
                style={styles.tabPressable}
              >
                {({ pressed }) =>
                  isActive ? (
                    <Raised3D
                      depth={3}
                      faceStyle={styles.tab}
                      pressed={pressed}
                      radius={radius.chip}
                      variant="primary"
                    >
                      {content}
                    </Raised3D>
                  ) : (
                    <View style={[styles.tab, styles.tabFlat]}>{content}</View>
                  )
                }
              </Pressable>
            );
          })}
        </View>

        {tab === 'resources' &&
          resources.map(({ id, kind, meta, name }) => {
            const { icon: Icon, palette } = resourceStyle[kind];
            return (
              <View key={id} style={styles.resource}>
                <View style={[styles.resourceIcon, { backgroundColor: palette.soft }]}>
                  <Icon color={palette.ink} size={20} strokeWidth={2} />
                </View>
                <View style={styles.resourceText}>
                  <Text numberOfLines={1} style={styles.resourceName}>
                    {name}
                  </Text>
                  <Text style={styles.resourceMeta}>{meta}</Text>
                </View>
                <Pressable
                  accessibilityLabel={`Descargar ${name}`}
                  accessibilityRole="button"
                  onPress={() => undefined}
                >
                  {({ pressed }) => (
                    <Raised3D
                      depth={3}
                      faceStyle={styles.download}
                      pressed={pressed}
                      variant="white"
                    >
                      <Download color={colors.text} size={18} strokeWidth={2.2} />
                    </Raised3D>
                  )}
                </Pressable>
              </View>
            );
          })}

        {tab === 'exercises' &&
          exercises.map(({ done, id, title }) => (
            <View key={id} style={styles.resource}>
              <View style={[styles.check, done && styles.checkDone]}>
                {done && <Check color={brand.onBlue} size={16} strokeWidth={3} />}
              </View>
              <Text style={[styles.resourceName, styles.resourceText]}>{title}</Text>
            </View>
          ))}

        {tab === 'notes' && (
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>{note}</Text>
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
  card: { gap: spacing.sm, padding: spacing.md },
  tabs: {
    alignItems: 'flex-start',
    backgroundColor: colors.track,
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  tabPressable: { flex: 1 },
  tab: {
    alignItems: 'center',
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: 6,
    height: 44,
    justifyContent: 'center',
  },
  tabFlat: { marginBottom: 3 },
  tabText: { color: colors.text, fontFamily: fontFamily.medium, fontSize: 14 },
  tabTextActive: { color: brand.onBlue, fontFamily: fontFamily.bold },
  resource: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 60,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resourceIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  resourceText: { flex: 1, gap: 2 },
  resourceName: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 14 },
  resourceMeta: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  download: { alignItems: 'center', height: 40, justifyContent: 'center', width: 40 },
  check: {
    alignItems: 'center',
    borderColor: colors.trackFill,
    borderRadius: 8,
    borderWidth: 2,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  checkDone: { backgroundColor: categories.green.base, borderColor: categories.green.base },
  noteBox: {
    backgroundColor: categories.orange.soft,
    borderRadius: radius.chip,
    padding: spacing.md,
  },
  noteText: { color: colors.text, fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
});
