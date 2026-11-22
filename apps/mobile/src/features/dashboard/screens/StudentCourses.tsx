import {
  ArrowUpDown,
  ChevronDown,
  LayoutGrid,
  Layers,
  List,
  Signal,
  SlidersHorizontal,
  X,
  type LucideIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FadeIn } from '@/components/FadeIn';
import { Raised3D } from '@/components/Raised3D';
import { brand, colors, fontFamily, radius, spacing } from '@/theme';

import { CourseGridCard } from '../components/courses/CourseGridCard';
import { CourseListRow } from '../components/courses/CourseListRow';
import { studentCoursesMock, type StudentCourse } from '../mocks/studentCourses';

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

/** Botón de filtro desplegable (solo visual por ahora). */
function DropdownButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: true }}
      disabled
      style={styles.dropdown}
    >
      <Icon color={colors.text} size={18} strokeWidth={2} />
      <Text style={styles.dropdownText}>{label}</Text>
      <ChevronDown color={colors.textMuted} size={18} strokeWidth={2} />
    </Pressable>
  );
}

/** "Mis cursos" del alumno. Solo visual, con datos ficticios. */
export function StudentCourses() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  // Curso abierto (detalle con roadmap, lección y asistente). Estado local, sin rutas aún.
  const [openCourseId, setOpenCourseId] = useState<string>();
  const openCourse = studentCoursesMock.find((course) => course.id === openCourseId);

  const columns = contentWidth > 0 && contentWidth < THREE_COLUMNS_MIN_WIDTH ? 2 : 3;
  const activeFilter = FILTERS.find((item) => item.key === filter) ?? FILTERS[0];
  const courses = studentCoursesMock.filter(activeFilter.match);
  const rows = Array.from({ length: Math.ceil(courses.length / columns) }, (_, index) =>
    courses.slice(index * columns, (index + 1) * columns),
  );

  if (openCourse) {
    return <CourseDetail course={openCourse} onBack={() => setOpenCourseId(undefined)} />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
      showsVerticalScrollIndicator={false}
    >
      {/* Estados de los cursos */}
      <FadeIn style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          <View accessibilityRole="tablist" style={styles.tabs}>
            {FILTERS.map(({ key, label, match }) => {
              const isActive = key === filter;
              const count = studentCoursesMock.filter(match).length;

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
        <Pressable
          accessibilityLabel="Opciones de filtros y orden"
          accessibilityRole="button"
          onPress={() => setOptionsOpen(true)}
          style={styles.optionsPressable}
        >
          {({ pressed }) => (
            <Raised3D
              faceStyle={styles.optionsButton}
              pressed={pressed}
              radius={radius.chip}
              variant="white"
            >
              <SlidersHorizontal color={colors.text} size={20} />
              <Text style={styles.dropdownText}>Filtros</Text>
            </Raised3D>
          )}
        </Pressable>
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

      <Modal
        animationType="fade"
        onRequestClose={() => setOptionsOpen(false)}
        transparent
        visible={optionsOpen}
      >
        <View style={styles.modalBackdrop}>
          <View pointerEvents="none" style={styles.modalScrim} />
          <Pressable
            accessibilityLabel="Cerrar opciones"
            accessibilityRole="button"
            onPress={() => setOptionsOpen(false)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.optionsPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Filtros y orden</Text>
              <Pressable
                accessibilityLabel="Cerrar opciones"
                accessibilityRole="button"
                onPress={() => setOptionsOpen(false)}
                style={styles.closeButton}
              >
                <X color={colors.text} size={20} />
              </Pressable>
            </View>
            <Text style={styles.panelHint}>Estas opciones estarán disponibles próximamente.</Text>
            <View style={styles.filterGroup}>
              <DropdownButton icon={Layers} label="Categoría" />
              <DropdownButton icon={Signal} label="Nivel" />
              <DropdownButton icon={ArrowUpDown} label="Más recientes" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Cursos */}
      {courses.length === 0 && (
        <Text style={styles.empty}>No hay cursos en esta sección todavía.</Text>
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
                  <CourseGridCard course={course} onOpen={() => setOpenCourseId(course.id)} />
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
              <CourseListRow course={course} onOpen={() => setOpenCourseId(course.id)} />
            </FadeIn>
          ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: spacing.md, padding: spacing.lg },

  toolbar: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  tabsScroll: { flexGrow: 0, flexShrink: 1 },
  optionsPressable: { marginLeft: 'auto' },
  optionsButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 52,
    paddingHorizontal: spacing.md,
  },
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

  modalBackdrop: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalScrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: brand.blueNight,
    opacity: 0.3,
  },
  optionsPanel: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    gap: spacing.md,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 600,
  },
  panelHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  panelTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 18 },
  panelHint: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 14 },
  closeButton: { alignItems: 'center', height: 48, justifyContent: 'center', width: 48 },
  filterGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  dropdown: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.chip,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    height: 48,
    minWidth: 168,
    paddingHorizontal: 14,
  },
  dropdownPressed: { backgroundColor: colors.track },
  // Sin truncar: el botón crece con la etiqueta (mín. 168 dp para alinear los filtros).
  dropdownText: { color: colors.text, flexGrow: 1, fontFamily: fontFamily.medium, fontSize: 14 },

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
