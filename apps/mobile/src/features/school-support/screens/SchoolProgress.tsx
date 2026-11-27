import { BarChart3, GraduationCap } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { FitList } from '@/components/FitList';
import { FadeIn } from '@/components/FadeIn';
import { SceneStatTile } from '@/components/SceneStatTile';
import { CourseBanner } from '@/features/dashboard/components/courses/CourseBanner';
import { CardHeader } from '@/features/dashboard/components/home/CardHeader';
import { brand, categories, colors, fontFamily, radius, spacing } from '@/theme';

import { findTopic, type SchoolTask } from '../mocks/schoolSupport';

const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };
const STAGGER = 80;

/**
 * Progreso de **Acompañamiento escolar**: temas practicados, tareas resueltas y práctica por
 * semana. Sin porcentaje de currículo (no hay un denominador definido) y sin ranking (pendiente
 * de reglas). Un solo viewport.
 */
export function SchoolProgress({
  practiced,
  tasks,
  weekly,
}: {
  practiced: { lastLabel: string; sessions: number; topicId: string }[];
  tasks: SchoolTask[];
  weekly: { label: string; value: number }[];
}) {
  const sessions = practiced.reduce((sum, item) => sum + item.sessions, 0);
  const maxWeek = Math.max(1, ...weekly.map((week) => week.value));
  const thisWeek = weekly.at(-1)?.value ?? 0;

  return (
    <View style={styles.screen}>
      <View style={styles.row}>
        {(
          [
            {
              caption: `${sessions} sesiones en total`,
              kind: 'book',
              label: 'Temas practicados',
              palette: BRAND_PALETTE,
              value: practiced.length,
            },
            {
              caption: `de ${tasks.length} tareas registradas`,
              kind: 'badge',
              label: 'Tareas resueltas',
              palette: categories.green,
              value: tasks.filter((task) => task.status === 'solved').length,
            },
            {
              caption: 'Sesiones de práctica',
              kind: 'flame',
              label: 'Esta semana',
              palette: categories.orange,
              value: thisWeek,
            },
          ] as const
        ).map((metric, index) => (
          <FadeIn key={metric.label} delay={STAGGER * index} style={styles.flex}>
            <SceneStatTile {...metric} chevron={false} compact />
          </FadeIn>
        ))}
      </View>

      <View style={[styles.row, styles.main]}>
        <FadeIn delay={STAGGER * 3} style={styles.wide}>
          <Card style={styles.card}>
            <CardHeader
              clay={{ kind: 'monitor', palette: BRAND_PALETTE }}
              icon={GraduationCap}
              title="Temas y competencias practicados"
            />
            {practiced.length === 0 && (
              <Text style={styles.empty}>Cuando practiques un tema aparecerá aquí.</Text>
            )}
            {/* Desde arriba y sin scroll: se muestran los temas que caben (los más recientes). */}
            <FitList
              items={practiced}
              keyOf={(item) => item.topicId}
              renderItem={({ lastLabel, sessions: count, topicId }) => {
                const topic = findTopic(topicId);
                if (!topic) return null;
                return (
                  <View style={styles.item}>
                    <CourseBanner
                      compact
                      color={topic.color}
                      icon={topic.icon}
                      style={styles.thumb}
                      uid={`sp-${topicId}`}
                    />
                    <View style={styles.flex}>
                      <Text numberOfLines={1} style={styles.itemTitle}>
                        {topic.title}
                      </Text>
                      <Text numberOfLines={1} style={styles.meta}>
                        {topic.area} · última vez: {lastLabel}
                      </Text>
                    </View>
                    <View style={styles.count}>
                      <Text style={styles.countText}>
                        {count} {count === 1 ? 'sesión' : 'sesiones'}
                      </Text>
                    </View>
                  </View>
                );
              }}
              rowHeight={52}
            />
          </Card>
        </FadeIn>

        <FadeIn delay={STAGGER * 4} style={styles.flex}>
          <Card style={styles.card}>
            <CardHeader
              clay={{ kind: 'clock', palette: BRAND_PALETTE }}
              icon={BarChart3}
              title="Práctica por semana"
            />
            <View style={styles.chart}>
              {weekly.map(({ label, value }, index) => {
                const isLast = index === weekly.length - 1;
                return (
                  <View key={label} style={styles.barColumn}>
                    <Text style={styles.barValue}>{value}</Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barEdge,
                          isLast && styles.barEdgeActive,
                          { height: `${(value / maxWeek) * 100}%` },
                        ]}
                      >
                        <View style={[styles.barFace, isLast && styles.barFaceActive]} />
                      </View>
                    </View>
                    <Text style={[styles.meta, isLast && styles.barLabelActive]}>{label}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.note}>Ranking de esta modalidad: pendiente de definir.</Text>
          </Card>
        </FadeIn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: spacing.md, padding: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md },
  main: { flex: 1, minHeight: 0 },
  flex: { flex: 1 },
  wide: { flex: 1.5 },
  card: { flex: 1, gap: 12, padding: 20 },
  empty: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 14 },
  meta: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  note: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 11 },
  item: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: spacing.sm },
  thumb: { borderRadius: 10, height: 44, width: 44 },
  itemTitle: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 15 },
  count: {
    backgroundColor: brand.blueSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: { color: brand.blueDeep, fontFamily: fontFamily.bold, fontSize: 12 },
  chart: { alignItems: 'flex-end', flex: 1, flexDirection: 'row', gap: spacing.sm, minHeight: 0 },
  barColumn: { alignItems: 'center', flex: 1, gap: 4, height: '100%' },
  barValue: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 12 },
  barTrack: { flex: 1, justifyContent: 'flex-end', width: '70%' },
  /** Barra 3D: canto debajo y cara encima (la semana actual en azul de marca). */
  barEdge: {
    backgroundColor: colors.trackFill,
    borderRadius: 8,
    minHeight: 8,
    paddingBottom: 4,
  },
  barEdgeActive: { backgroundColor: brand.blueNight },
  barFace: { backgroundColor: brand.blueSoft, borderRadius: 8, flex: 1 },
  barFaceActive: { backgroundColor: brand.blue },
  barLabelActive: { color: colors.text, fontFamily: fontFamily.semibold },
});
