import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Play, Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card } from '@/components/Card';
import { FadeIn } from '@/components/FadeIn';
import { Raised3D } from '@/components/Raised3D';
import { CourseBanner } from '@/features/dashboard/components/courses/CourseBanner';
import { CourseObject } from '@/features/dashboard/components/courses/CourseIllustration';
import { courseColors } from '@/features/dashboard/components/courses/courseVisuals';
import { normalizeText } from '@/features/dashboard/data/studentSelectors';
import { brand, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import { findTopic, topicsCatalog } from '../mocks/schoolSupport';

const WHITE_CLAY = { base: colors.surface, ink: brand.blueSoft, soft: brand.blueSoft };

const STAGGER = 60;
const THREE_COLUMNS_MIN_WIDTH = 820;

/**
 * Aprender: buscar un tema en el catálogo (sin necesitar una tarea) o escanear una. Elegir un
 * tema abre una sesión personalizada; **no** matricula al alumno en un curso completo.
 */
export function LearnScreen({
  autoFocusSearch = false,
  currentTopicId,
  onOpenTopic,
  onScan,
}: {
  autoFocusSearch?: boolean;
  /** Tema que el alumno está aprendiendo ahora (última sesión). */
  currentTopicId?: string;
  onOpenTopic: (topicId: string) => void;
  onScan: () => void;
}) {
  const [search, setSearch] = useState('');
  const [contentWidth, setContentWidth] = useState(0);
  const columns = contentWidth > 0 && contentWidth < THREE_COLUMNS_MIN_WIDTH ? 2 : 3;

  const current = findTopic(currentTopicId);
  const query = normalizeText(search);
  const results = topicsCatalog.filter((topic) =>
    normalizeText(`${topic.title} ${topic.area} ${topic.summary.concepts.join(' ')}`).includes(
      query,
    ),
  );
  const rows = Array.from({ length: Math.ceil(results.length / columns) }, (_, index) =>
    results.slice(index * columns, (index + 1) * columns),
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
      showsVerticalScrollIndicator={false}
    >
      <FadeIn style={styles.toolbar}>
        <View style={styles.search}>
          <Search color={colors.textMuted} size={18} strokeWidth={2.2} />
          <TextInput
            accessibilityLabel="Buscar tema"
            autoCorrect={false}
            autoFocus={autoFocusSearch}
            onChangeText={setSearch}
            placeholder="Busca un tema: fracciones, fotosíntesis, independencia…"
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            style={styles.searchInput}
            value={search}
          />
          {search.length > 0 && (
            <Pressable
              accessibilityLabel="Limpiar búsqueda"
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => setSearch('')}
              style={styles.clear}
            >
              <X color={colors.text} size={16} strokeWidth={2.4} />
            </Pressable>
          )}
        </View>
        <Pressable accessibilityRole="button" onPress={onScan}>
          {({ pressed }) => (
            <Raised3D
              depth={3}
              faceStyle={styles.scan}
              pressed={pressed}
              radius={radius.chip}
              variant="primary"
            >
              <Camera color={brand.onBlue} size={18} strokeWidth={2.2} />
              <Text style={styles.scanText}>Escanear tarea</Text>
            </Raised3D>
          )}
        </Pressable>
      </FadeIn>

      {/* Tema que está aprendiendo ahora */}
      {current && !query && (
        <FadeIn delay={60}>
          <LinearGradient
            colors={[brand.blue, brand.blueDeep, brand.blueNight]}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.55, 1]}
            start={{ x: 0, y: 0 }}
            style={styles.current}
          >
            <View pointerEvents="none" style={styles.currentArt}>
              <CourseObject
                icon={current.icon}
                palette={WHITE_CLAY}
                uid={`learn-current-${current.id}`}
              />
            </View>
            <View style={styles.flex}>
              <Text style={styles.currentEyebrow}>Lo que estás aprendiendo · {current.area}</Text>
              <Text numberOfLines={1} style={styles.currentTitle}>
                {current.title}
              </Text>
              <Text numberOfLines={1} style={styles.currentStep}>
                Siguiente paso: {current.steps[0]}
              </Text>
            </View>
            <Pressable
              accessibilityLabel={`Continuar ${current.title}`}
              accessibilityRole="button"
              onPress={() => onOpenTopic(current.id)}
            >
              {({ pressed }) => (
                <Raised3D
                  depth={4}
                  faceStyle={styles.currentButton}
                  pressed={pressed}
                  variant="white"
                >
                  <Play color={brand.blueDeep} fill={brand.blueDeep} size={16} />
                  <Text style={styles.currentButtonText}>Continuar</Text>
                </Raised3D>
              )}
            </Pressable>
          </LinearGradient>
        </FadeIn>
      )}

      <Text style={styles.caption}>
        {query
          ? `${results.length} ${results.length === 1 ? 'tema encontrado' : 'temas encontrados'}`
          : 'Temas disponibles (catálogo de ejemplo)'}
      </Text>

      {results.length === 0 && (
        <Card style={styles.empty}>
          <Text style={styles.emptyTitle}>No encontramos «{search.trim()}»</Text>
          <Text style={styles.emptyText}>
            Prueba con otra palabra o escanea tu tarea para identificar el tema.
          </Text>
        </Card>
      )}

      {rows.map((row, rowIndex) => (
        <View key={`${columns}-${rowIndex}`} style={styles.gridRow}>
          {row.map((topic, index) => (
            <FadeIn
              key={topic.id}
              delay={STAGGER * (rowIndex * columns + index)}
              style={styles.flex}
            >
              <Card style={styles.card}>
                <View>
                  <CourseBanner
                    color={topic.color}
                    icon={topic.icon}
                    style={styles.banner}
                    uid={`learn-${topic.id}`}
                  />
                  <View style={styles.areaPill}>
                    <Text style={[styles.areaText, { color: courseColors[topic.color].ink }]}>
                      {topic.area}
                    </Text>
                  </View>
                </View>
                <View style={styles.body}>
                  <Text numberOfLines={1} style={styles.title}>
                    {topic.title}
                  </Text>
                  <Text style={styles.meta}>
                    {topic.steps.length} pasos · {topic.practice.length} ejercicios de práctica
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel={`Aprender ${topic.title}`}
                  accessibilityRole="button"
                  onPress={() => onOpenTopic(topic.id)}
                >
                  {({ pressed }) => (
                    <Raised3D faceStyle={styles.action} pressed={pressed}>
                      <Play color={brand.blueDeep} size={18} strokeWidth={2.2} />
                      <Text style={styles.actionText}>Aprender</Text>
                    </Raised3D>
                  )}
                </Pressable>
              </Card>
            </FadeIn>
          ))}
          {Array.from({ length: columns - row.length }, (_, index) => (
            <View key={`spacer-${index}`} style={styles.flex} />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: spacing.md, padding: spacing.lg },
  flex: { flex: 1 },
  toolbar: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  search: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.chip,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    height: 52,
    paddingLeft: 14,
    paddingRight: spacing.xs,
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    height: '100%',
    paddingVertical: 0,
  },
  clear: {
    alignItems: 'center',
    backgroundColor: colors.track,
    borderRadius: radius.pill,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  scan: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 52,
    paddingHorizontal: 18,
  },
  scanText: { color: brand.onBlue, fontFamily: fontFamily.bold, fontSize: 15 },
  caption: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 13 },
  current: {
    alignItems: 'center',
    borderRadius: radius.card,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 120,
    overflow: 'hidden',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadows.card,
  },
  currentArt: { bottom: 6, position: 'absolute', right: 180, top: 6, width: 140 },
  currentEyebrow: { color: brand.onBlueMuted, fontFamily: fontFamily.medium, fontSize: 13 },
  currentTitle: {
    color: brand.onBlue,
    fontFamily: fontFamily.regular,
    fontSize: 30,
    letterSpacing: -0.8,
  },
  currentStep: { color: brand.onBlueMuted, fontFamily: fontFamily.medium, fontSize: 14 },
  currentButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 52,
    paddingHorizontal: 22,
  },
  currentButtonText: { color: brand.blueDeep, fontFamily: fontFamily.bold, fontSize: 15 },
  empty: { alignItems: 'center', gap: spacing.xs, padding: spacing.xl },
  emptyTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 16 },
  emptyText: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 14 },
  gridRow: { flexDirection: 'row', gap: spacing.md },
  card: { flex: 1, gap: spacing.md, padding: 12 },
  banner: { height: 110 },
  areaPill: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    position: 'absolute',
    top: 12,
    ...shadows.card,
  },
  areaText: { fontFamily: fontFamily.semibold, fontSize: 12 },
  body: { gap: 4, paddingHorizontal: 6 },
  title: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 17, letterSpacing: -0.3 },
  meta: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  action: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 48,
    justifyContent: 'center',
  },
  actionText: { color: brand.blueDeep, fontFamily: fontFamily.bold, fontSize: 15 },
});
