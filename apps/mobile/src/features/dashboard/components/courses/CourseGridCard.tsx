import { Bookmark, BookOpen, Clock, Play, RotateCcw } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { Raised3D } from '@/components/Raised3D';
import { brand, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import type { StudentCourse } from '../../mocks/studentCourses';

import { CourseBanner } from './CourseBanner';
import { courseAction, courseColors } from './courseVisuals';

/** Tarjeta de curso en cuadrícula: ilustración de la materia, avance y acción principal. */
export function CourseGridCard({ course, onOpen }: { course: StudentCourse; onOpen?: () => void }) {
  const { area, bookmarked, color, hours, icon, id, lessons, progress, title } = course;
  const action = courseAction(progress);
  const ActionIcon = progress >= 100 ? RotateCcw : Play;

  return (
    <Card style={styles.card}>
      <View>
        <CourseBanner color={color} icon={icon} style={styles.banner} uid={`grid-${id}`} />
        <View style={styles.subjectPill}>
          <Text style={[styles.subjectText, { color: courseColors[color].ink }]}>{area}</Text>
        </View>
        <Pressable
          accessibilityLabel={bookmarked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          accessibilityRole="button"
          accessibilityState={{ selected: bookmarked }}
          hitSlop={6}
          onPress={() => undefined}
          style={styles.bookmark}
        >
          <Bookmark
            color={colors.text}
            fill={bookmarked ? colors.text : 'transparent'}
            size={18}
            strokeWidth={2}
          />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <View style={styles.meta}>
          <BookOpen color={colors.textMuted} size={14} strokeWidth={2} />
          <Text style={styles.metaText}>{lessons} lecciones</Text>
          <View style={styles.dot} />
          <Clock color={colors.textMuted} size={14} strokeWidth={2} />
          <Text style={styles.metaText}>{hours} h</Text>
        </View>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{progress >= 100 ? 'Completado' : 'Progreso'}</Text>
          <Text style={styles.progressValue}>{progress}%</Text>
        </View>
        <ProgressBar trackColor={colors.track} value={progress} />
      </View>

      <Pressable
        accessibilityLabel={`${action} ${title}`}
        accessibilityRole="button"
        onPress={onOpen}
      >
        {({ pressed }) => (
          <Raised3D faceStyle={styles.action} pressed={pressed}>
            <ActionIcon color={brand.blueDeep} size={18} strokeWidth={2.2} />
            <Text style={styles.actionText}>{action}</Text>
          </Raised3D>
        )}
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: spacing.md, padding: 12 },
  banner: { height: 120 },
  subjectPill: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    position: 'absolute',
    top: 12,
    ...shadows.card,
  },
  subjectText: { fontFamily: fontFamily.semibold, fontSize: 12 },
  bookmark: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
    top: 10,
    width: 36,
    ...shadows.card,
  },
  body: { gap: spacing.sm, paddingHorizontal: 6 },
  title: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 17, letterSpacing: -0.3 },
  meta: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  metaText: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  dot: {
    backgroundColor: colors.trackFill,
    borderRadius: radius.pill,
    height: 3,
    marginHorizontal: 4,
    width: 3,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  progressLabel: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 12 },
  progressValue: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 13 },
  action: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 48,
    justifyContent: 'center',
  },
  actionText: { color: brand.blueDeep, fontFamily: fontFamily.bold, fontSize: 15 },
});
