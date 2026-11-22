import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { radius } from '@/theme';

import type { CourseColor, CourseIcon } from '../../mocks/studentCourses';

import { CourseIllustration } from './CourseIllustration';
import { courseColors } from './courseVisuals';

/** Portada de la materia: fondo suave de su color con la ilustración 3D (SVG). */
export function CourseBanner({
  color,
  compact = false,
  icon,
  style,
  uid,
}: {
  color: CourseColor;
  compact?: boolean;
  icon: CourseIcon;
  style?: StyleProp<ViewStyle>;
  /** Prefijo único para los degradados SVG de esta portada. */
  uid: string;
}) {
  const palette = courseColors[color];

  return (
    <View style={[styles.banner, { backgroundColor: palette.soft }, style]}>
      <CourseIllustration compact={compact} icon={icon} palette={palette} uid={uid} />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: radius.chip, overflow: 'hidden' },
});
