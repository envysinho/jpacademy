import { Bookmark, Play, RotateCcw } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { Raised3D } from '@/components/Raised3D';
import { brand, colors, fontFamily, spacing } from '@/theme';

import type { StudentCourse } from '../../mocks/studentCourses';

import { CourseBanner } from './CourseBanner';
import { courseAction, courseColors } from './courseVisuals';

/** Fila de curso para la vista de lista. */
export function CourseListRow({ course, onOpen }: { course: StudentCourse; onOpen?: () => void }) {
  const { bookmarked, color, hours, icon, id, lessons, progress, subject, title } = course;
  const action = courseAction(progress);
  const ActionIcon = progress >= 100 ? RotateCcw : Play;

  return (
    <Card style={styles.card}>
      <CourseBanner compact color={color} icon={icon} style={styles.banner} uid={`list-${id}`} />

      <View style={styles.info}>
        <Text style={[styles.subject, { color: courseColors[color].ink }]}>{subject}</Text>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.meta}>
          {lessons} lecciones · {hours} h
        </Text>
      </View>

      <View style={styles.progress}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{progress >= 100 ? 'Completado' : 'Progreso'}</Text>
          <Text style={styles.progressValue}>{progress}%</Text>
        </View>
        <ProgressBar trackColor={colors.track} value={progress} />
      </View>

      <Pressable
        accessibilityLabel={bookmarked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        accessibilityRole="button"
        accessibilityState={{ selected: bookmarked }}
        onPress={() => undefined}
      >
        {({ pressed }) => (
          <Raised3D faceStyle={styles.bookmark} pressed={pressed} variant="white">
            <Bookmark
              color={colors.text}
              fill={bookmarked ? colors.text : 'transparent'}
              size={18}
              strokeWidth={2}
            />
          </Raised3D>
        )}
      </Pressable>

      <Pressable
        accessibilityLabel={`${action} ${title}`}
        accessibilityRole="button"
        onPress={onOpen}
      >
        {({ pressed }) => (
          <Raised3D faceStyle={styles.action} pressed={pressed}>
            <ActionIcon color={brand.blueDeep} size={16} strokeWidth={2.2} />
            <Text style={styles.actionText}>{action}</Text>
          </Raised3D>
        )}
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, padding: 12 },
  banner: { height: 72, width: 96 },
  info: { flex: 1.4, gap: 2 },
  subject: { fontFamily: fontFamily.semibold, fontSize: 12 },
  title: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 16 },
  meta: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  progress: { flex: 1, gap: 6 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 12 },
  progressValue: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 13 },
  bookmark: { alignItems: 'center', height: 48, justifyContent: 'center', width: 48 },
  action: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    height: 48,
    justifyContent: 'center',
    width: 132,
  },
  actionText: { color: brand.blueDeep, fontFamily: fontFamily.bold, fontSize: 14 },
});
