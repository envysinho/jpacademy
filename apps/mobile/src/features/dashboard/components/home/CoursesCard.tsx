import { MonitorPlay } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { brand, colors, fontFamily, radius, spacing } from '@/theme';

import { CardHeader } from './CardHeader';

const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };

/** Cursos: total matriculado, posición en el grupo y avance por curso. */
export function CoursesCard({
  caption,
  enrolled,
  isCompact,
  items,
  teachers,
}: {
  caption: string;
  enrolled: number;
  isCompact: boolean;
  items: { active: boolean; id: string; lessons: number; name: string; progress: number }[];
  teachers: string[];
}) {
  return (
    <Card style={styles.card}>
      <CardHeader
        clay={{ kind: 'monitor', palette: BRAND_PALETTE }}
        icon={MonitorPlay}
        right={
          <View style={styles.avatars}>
            {teachers.map((initials, index) => (
              <View
                key={initials}
                style={[
                  styles.avatar,
                  isCompact && styles.avatarCompact,
                  index > 0 && styles.avatarOverlap,
                ]}
              >
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            ))}
          </View>
        }
        title="Cursos"
      />

      <View>
        <Text style={styles.value}>
          {enrolled} <Text style={styles.unit}>matriculados</Text>
        </Text>
        <Text
          numberOfLines={isCompact ? 1 : undefined}
          style={[styles.caption, isCompact && styles.captionCompact]}
        >
          {isCompact ? 'Top 10 % de tu grupo este mes.' : caption}
        </Text>
      </View>

      <View style={styles.list}>
        {items.map(({ active, id, lessons, name, progress }) => (
          <View key={id} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text numberOfLines={1} style={styles.itemName}>
                {name}
              </Text>
              <Text style={styles.itemValue}>{lessons}</Text>
            </View>
            <ProgressBar
              color={active ? brand.blueDeep : colors.trackFill}
              trackColor={colors.track}
              value={progress}
            />
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: spacing.md },
  avatars: { flexDirection: 'row' },
  avatar: {
    alignItems: 'center',
    backgroundColor: brand.blueSoft,
    borderColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  avatarOverlap: { marginLeft: -10 },
  avatarCompact: { height: 30, width: 30 },
  avatarText: { color: brand.blueDeep, fontFamily: fontFamily.bold, fontSize: 11 },
  value: { color: colors.text, fontFamily: fontFamily.regular, fontSize: 40, letterSpacing: -1 },
  unit: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 16 },
  caption: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  captionCompact: { fontSize: 11 },
  list: { gap: spacing.md },
  item: { gap: 6 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  itemName: { color: colors.text, flex: 1, fontFamily: fontFamily.medium, fontSize: 13 },
  itemValue: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 13 },
});
