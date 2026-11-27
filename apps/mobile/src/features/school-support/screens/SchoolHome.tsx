import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Camera, CircleCheck, GraduationCap, Search } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { FitList } from '@/components/FitList';
import { Clay3DIcon } from '@/components/Clay3DIcon';
import { FadeIn } from '@/components/FadeIn';
import { Raised3D } from '@/components/Raised3D';
import { CourseBanner } from '@/features/dashboard/components/courses/CourseBanner';
import { CardHeader } from '@/features/dashboard/components/home/CardHeader';
import { StreakCard } from '@/features/dashboard/components/home/StreakCard';
import { studentHomeMock } from '@/features/dashboard/mocks/student';
import { brand, categories, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import { findTopic, type SchoolTask } from '../mocks/schoolSupport';

const STAGGER = 90;
const COMPACT_CONTENT_WIDTH = 1000;
const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };
const statusLabel = { new: 'Por estudiar', solved: 'Resuelta', studying: 'En sesión' } as const;
const WHITE_CLAY = { base: colors.surface, ink: brand.blueSoft, soft: brand.blueSoft };

/**
 * Inicio de **Acompañamiento escolar** (solo esta modalidad), en un viewport: «¿Qué vamos a
 * aprender hoy?» con Escanear tarea y Buscar tema, la racha y la actividad reciente.
 */
export function SchoolHome({
  onOpenTask,
  onOpenTopic,
  onScan,
  onSearch,
  practiced,
  tasks,
}: {
  onOpenTask: (taskId: string) => void;
  onOpenTopic: (topicId: string) => void;
  onScan: () => void;
  onSearch: () => void;
  practiced: { lastLabel: string; sessions: number; topicId: string }[];
  tasks: SchoolTask[];
}) {
  const [contentWidth, setContentWidth] = useState(0);
  const isCompact = contentWidth > 0 && contentWidth < COMPACT_CONTENT_WIDTH;
  const solved = tasks.filter((task) => task.status === 'solved');
  const pending = tasks.filter((task) => task.status !== 'solved');

  return (
    <View
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
      style={styles.screen}
    >
      <View style={styles.row}>
        {/* Tarjeta destacada: qué aprender hoy */}
        <FadeIn style={styles.wide}>
          <LinearGradient
            colors={[brand.blue, brand.blueDeep, brand.blueNight]}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.55, 1]}
            start={{ x: 0, y: 0 }}
            style={styles.hero}
          >
            <View pointerEvents="none" style={styles.heroGlow} />
            <View pointerEvents="none" style={styles.heroArt}>
              <Clay3DIcon kind="camera" palette={WHITE_CLAY} size={isCompact ? 130 : 170} />
            </View>
            <View style={styles.heroText}>
              <View style={styles.eyebrow}>
                <GraduationCap color={brand.onBlueMuted} size={14} strokeWidth={2} />
                <Text style={styles.eyebrowText}>Acompañamiento escolar</Text>
              </View>
              <Text style={[styles.heroTitle, isCompact && styles.heroTitleCompact]}>
                ¿Qué vamos a aprender hoy?
              </Text>
              <Text style={styles.heroSubtitle}>
                Escanea la tarea de tu colegio o busca el tema que necesitas.
              </Text>
            </View>
            <View style={styles.heroActions}>
              <Pressable accessibilityRole="button" onPress={onScan}>
                {({ pressed }) => (
                  <Raised3D
                    depth={4}
                    faceStyle={styles.heroButton}
                    pressed={pressed}
                    variant="white"
                  >
                    <Camera color={brand.blueDeep} size={20} strokeWidth={2.2} />
                    <Text style={styles.heroButtonText}>Escanear tarea</Text>
                  </Raised3D>
                )}
              </Pressable>
              <Pressable accessibilityRole="button" onPress={onSearch}>
                {({ pressed }) => (
                  <Raised3D
                    depth={4}
                    faceStyle={styles.heroButton}
                    pressed={pressed}
                    variant="white"
                  >
                    <Search color={brand.blueDeep} size={20} strokeWidth={2.2} />
                    <Text style={styles.heroButtonText}>Buscar tema</Text>
                  </Raised3D>
                )}
              </Pressable>
            </View>
          </LinearGradient>
        </FadeIn>
        <FadeIn delay={STAGGER} style={styles.flex}>
          <StreakCard {...studentHomeMock.streak} isCompact={isCompact} />
        </FadeIn>
      </View>

      <View style={styles.row}>
        {/* Sesiones recientes */}
        <FadeIn delay={STAGGER * 2} style={styles.flex}>
          <Card style={styles.card}>
            <CardHeader
              clay={{ kind: 'book', palette: BRAND_PALETTE }}
              icon={BookOpen}
              title="Sesiones recientes"
            />
            {practiced.length === 0 && (
              <Text style={styles.empty}>
                Aún no tienes sesiones. ¡Empieza escaneando una tarea!
              </Text>
            )}
            <FitList
              gap={2}
              items={practiced}
              keyOf={(item) => item.topicId}
              renderItem={({ lastLabel, sessions, topicId }) => {
                const topic = findTopic(topicId);
                if (!topic) return null;
                return (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => onOpenTopic(topicId)}
                    style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
                  >
                    <CourseBanner
                      compact
                      color={topic.color}
                      icon={topic.icon}
                      style={styles.thumb}
                      uid={`sh-${topicId}`}
                    />
                    <View style={styles.flex}>
                      <Text numberOfLines={1} style={styles.itemTitle}>
                        {topic.title}
                      </Text>
                      <Text numberOfLines={1} style={styles.meta}>
                        {lastLabel} · {sessions} {sessions === 1 ? 'sesión' : 'sesiones'}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
              rowHeight={46}
            />
          </Card>
        </FadeIn>

        {/* Tareas */}
        <FadeIn delay={STAGGER * 3} style={styles.flex}>
          <Card style={styles.card}>
            <CardHeader
              clay={{ kind: 'clipboard', palette: categories.orange }}
              icon={CircleCheck}
              title="Mis tareas"
            />
            <Text style={styles.value}>
              {solved.length} <Text style={styles.unit}>resueltas</Text>
            </Text>
            <View style={styles.list}>
              {[...pending, ...solved].slice(0, 2).map((task) => (
                <Pressable
                  key={task.id}
                  accessibilityRole="button"
                  onPress={() => onOpenTask(task.id)}
                  style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
                >
                  <View
                    style={[
                      styles.dot,
                      task.status === 'solved' ? styles.dotSolved : styles.dotPending,
                    ]}
                  />
                  <View style={styles.flex}>
                    <Text numberOfLines={1} style={styles.itemTitle}>
                      {task.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.meta}>
                      {statusLabel[task.status]} · {task.createdLabel}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </Card>
        </FadeIn>

        {/* Temas aprendidos */}
        <FadeIn delay={STAGGER * 4} style={styles.flex}>
          <Card style={styles.card}>
            <CardHeader
              clay={{ kind: 'trophy', palette: categories.orange }}
              icon={GraduationCap}
              title="Temas aprendidos"
            />
            <Text style={styles.value}>
              {practiced.length} <Text style={styles.unit}>temas</Text>
            </Text>
            <View style={styles.chips}>
              {practiced.map(({ topicId }) => {
                const topic = findTopic(topicId);
                return topic ? (
                  <View key={topicId} style={styles.chip}>
                    <Text numberOfLines={1} style={styles.chipText}>
                      {topic.title}
                    </Text>
                  </View>
                ) : null;
              })}
            </View>
          </Card>
        </FadeIn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: spacing.md, padding: spacing.lg },
  row: { flex: 1, flexDirection: 'row', gap: spacing.md, minHeight: 0 },
  flex: { flex: 1 },
  wide: { flex: 1.75 },

  hero: {
    borderRadius: radius.card,
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: spacing.lg,
    ...shadows.card,
  },
  heroGlow: {
    backgroundColor: brand.onBlueSubtle,
    borderRadius: radius.pill,
    height: 300,
    position: 'absolute',
    right: -40,
    top: -90,
    width: 300,
  },
  heroArt: { position: 'absolute', right: 40, top: 40 },
  heroText: { gap: spacing.xs, maxWidth: '64%' },
  eyebrow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  eyebrowText: { color: brand.onBlueMuted, fontFamily: fontFamily.medium, fontSize: 13 },
  heroTitle: {
    color: brand.onBlue,
    fontFamily: fontFamily.regular,
    fontSize: 36,
    letterSpacing: -1,
    lineHeight: 42,
  },
  heroTitleCompact: { fontSize: 30, lineHeight: 36 },
  heroSubtitle: { color: brand.onBlueMuted, fontFamily: fontFamily.medium, fontSize: 15 },
  heroActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  heroButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 52,
    paddingHorizontal: 20,
  },
  heroButtonText: { color: brand.blueDeep, fontFamily: fontFamily.bold, fontSize: 15 },

  card: { flex: 1, gap: 10, padding: 20 },
  empty: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 13 },
  value: { color: colors.text, fontFamily: fontFamily.regular, fontSize: 36, letterSpacing: -1 },
  unit: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 15 },
  list: { gap: 6 },
  item: {
    alignItems: 'center',
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: spacing.sm,
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 6,
  },
  itemPressed: { backgroundColor: colors.track },
  thumb: { borderRadius: 10, height: 40, width: 40 },
  itemTitle: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 14 },
  meta: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  dot: { borderRadius: radius.pill, height: 10, marginHorizontal: 4, width: 10 },
  dotSolved: { backgroundColor: categories.green.base },
  dotPending: { backgroundColor: brand.accent },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: brand.blueSoft,
    borderRadius: radius.pill,
    maxWidth: '100%',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: { color: brand.blueDeep, fontFamily: fontFamily.semibold, fontSize: 12 },
});
