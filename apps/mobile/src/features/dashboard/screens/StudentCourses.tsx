import { LayoutGrid, List, Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { FadeIn } from '@/components/FadeIn';
import { Raised3D } from '@/components/Raised3D';
import { brand, colors, fontFamily, radius, spacing } from '@/theme';

import { CourseGridCard } from '../components/courses/CourseGridCard';
import { CourseListRow } from '../components/courses/CourseListRow';
import { normalizeText } from '../data/studentSelectors';
import { findCourse, studentCoursesMock, type StudentCourse } from '../mocks/studentCourses';

import { CourseDetail } from './CourseDetail';

type FilterKey = 'all' | 'inProgress' | 'completed' | 'favorites';
type ViewMode = 'grid' | 'list';

const FILTERS: {
  key: FilterKey;
  label: string;
  match: (c: StudentCourse) => boolean;
}[] = [
  { key: 'all', label: 'Todos', match: () => true },
  {
    key: 'inProgress',
    label: 'En progreso',
    match: (course) => course.progress > 0 && course.progress < 100,
  },
  {
    key: 'completed',
    label: 'Completados',
    match: (course) => course.progress >= 100,
  },
  { key: 'favorites', label: 'Favoritos', match: (course) => course.bookmarked },
];

/** Por debajo de este ancho de contenido la cuadrícula pasa a 2 columnas. */
const THREE_COLUMNS_MIN_WIDTH = 820;
const STAGGER = 70;
/** Canto de los botones 3D de la barra (pestaña y vista activas). */
const RAISE = 3;

/** Coincide por nombre del curso o por área, sin distinguir mayúsculas ni tildes. */
function matchesSearch(course: StudentCourse, query: string) {
  if (!query) return true;
  return normalizeText(`${course.title} ${course.area}`).includes(query);
}

/**
 * Catálogo de cursos del alumno. El curso abierto lo controla el Dashboard para poder abrirlo
 * también desde «Continúa aprendiendo». Los contadores de cada estado cuentan los cursos que
 * coinciden con la búsqueda actual (sin búsqueda, el catálogo completo).
 */
export function StudentCourses({
  onCloseCourse,
  onOpenCourse,
  onResolveTask,
  openCourseId,
}: {
  onCloseCourse: () => void;
  onOpenCourse: (courseId: string) => void;
  onResolveTask: (taskId: string) => void;
  openCourseId?: string;
}) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [contentWidth, setContentWidth] = useState(0);
  const openCourse = findCourse(openCourseId);

  const query = normalizeText(search);
  const searched = studentCoursesMock.filter((course) => matchesSearch(course, query));
  const columns = contentWidth > 0 && contentWidth < THREE_COLUMNS_MIN_WIDTH ? 2 : 3;
  const activeFilter = FILTERS.find((item) => item.key === filter) ?? FILTERS[0];
  const courses = searched.filter(activeFilter.match);
  const rows = Array.from({ length: Math.ceil(courses.length / columns) }, (_, index) =>
    courses.slice(index * columns, (index + 1) * columns),
  );

  if (openCourse) {
    return (
      <CourseDetail course={openCourse} onBack={onCloseCourse} onResolveTask={onResolveTask} />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
      showsVerticalScrollIndicator={false}
    >
      {/* Buscador (izquierda) + estados y vista (derecha) */}
      <FadeIn style={styles.toolbar}>
        <View style={styles.search}>
          <Search color={colors.textMuted} size={18} strokeWidth={2.2} />
          <TextInput
            accessibilityLabel="Buscar cursos"
            autoCorrect={false}
            onChangeText={setSearch}
            placeholder="Buscar cursos…"
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          <View accessibilityRole="tablist" style={styles.tabs}>
            {FILTERS.map(({ key, label, match }) => {
              const isActive = key === filter;
              const count = searched.filter(match).length;

              return (
                <Pressable
                  key={key}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  onPress={() => setFilter(key)}
                >
                  {({ pressed }) => {
                    const content = (
                      <>
                        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                          {label}
                        </Text>
                        <View style={[styles.count, isActive && styles.countActive]}>
                          <Text style={[styles.countText, isActive && styles.countTextActive]}>
                            {count}
                          </Text>
                        </View>
                      </>
                    );

                    // Pestaña activa = botón 3D de marca; las demás, planas sobre la pista.
                    return isActive ? (
                      <Raised3D
                        depth={RAISE}
                        faceStyle={styles.tab}
                        pressed={pressed}
                        radius={radius.chip}
                        variant="primary"
                      >
                        {content}
                      </Raised3D>
                    ) : (
                      <View style={[styles.tab, styles.flatRaise, pressed && styles.tabPressed]}>
                        {content}
                      </View>
                    );
                  }}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.viewToggle}>
          {(
            [
              { icon: LayoutGrid, label: 'Ver en cuadrícula', mode: 'grid' },
              { icon: List, label: 'Ver en lista', mode: 'list' },
            ] as const
          ).map(({ icon: Icon, label, mode }) => {
            const isActive = viewMode === mode;

            return (
              <Pressable
                key={mode}
                accessibilityLabel={label}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                hitSlop={4}
                onPress={() => setViewMode(mode)}
              >
                {({ pressed }) =>
                  isActive ? (
                    <Raised3D
                      depth={RAISE}
                      faceStyle={styles.toggleButton}
                      pressed={pressed}
                      radius={10}
                      variant="primary"
                    >
                      <Icon color={brand.onBlue} size={18} strokeWidth={2.2} />
                    </Raised3D>
                  ) : (
                    <View style={[styles.toggleButton, styles.flatRaise]}>
                      <Icon color={colors.text} size={18} strokeWidth={2} />
                    </View>
                  )
                }
              </Pressable>
            );
          })}
        </View>
      </FadeIn>

      {/* Cursos */}
      {courses.length === 0 && (
        <Text style={styles.empty}>
          {query
            ? `No hay cursos que coincidan con «${search.trim()}».`
            : 'No hay cursos en esta sección todavía.'}
        </Text>
      )}

      {viewMode === 'grid'
        ? rows.map((row, rowIndex) => (
            <View key={`${filter}-${columns}-${rowIndex}`} style={styles.gridRow}>
              {row.map((course, index) => (
                <FadeIn
                  key={course.id}
                  delay={STAGGER * (2 + rowIndex * columns + index)}
                  style={styles.gridCell}
                >
                  <CourseGridCard course={course} onOpen={() => onOpenCourse(course.id)} />
                </FadeIn>
              ))}
              {/* Huecos para que la última fila mantenga el ancho de columna. */}
              {Array.from({ length: columns - row.length }, (_, index) => (
                <View key={`spacer-${index}`} style={styles.gridCell} />
              ))}
            </View>
          ))
        : courses.map((course, index) => (
            <FadeIn key={`${filter}-${course.id}`} delay={STAGGER * (2 + index)}>
              <CourseListRow course={course} onOpen={() => onOpenCourse(course.id)} />
            </FadeIn>
          ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: spacing.md, padding: spacing.lg },

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
    minWidth: 180,
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
  tabsScroll: { flexGrow: 0, flexShrink: 1 },
  /** Elementos planos junto a botones 3D: mismo alto total (cara + canto). */
  flatRaise: { marginBottom: RAISE },

  tabs: {
    backgroundColor: colors.track,
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  tab: {
    alignItems: 'center',
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: spacing.sm,
    height: 48,
    paddingHorizontal: spacing.md,
  },
  tabPressed: { backgroundColor: colors.border },
  tabText: { color: colors.text, fontFamily: fontFamily.medium, fontSize: 14 },
  tabTextActive: { color: brand.onBlue, fontFamily: fontFamily.bold },
  count: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    justifyContent: 'center',
    minWidth: 24,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  countActive: { backgroundColor: brand.onBlue },
  countText: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 11 },
  countTextActive: { color: brand.blueDeep },
  viewToggle: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.chip,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.xs,
  },
  toggleButton: {
    alignItems: 'center',
    borderRadius: 10,
    height: 44,
    justifyContent: 'center',
    width: 48,
  },

  gridRow: { flexDirection: 'row', gap: spacing.md },
  gridCell: { flex: 1 },
  empty: {
    color: colors.textMuted,
    fontFamily: fontFamily.medium,
    fontSize: 15,
    paddingVertical: spacing.xxl,
    textAlign: 'center',
  },
});
