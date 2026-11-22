import { SlidersHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FadeIn } from '@/components/FadeIn';
import { Raised3D } from '@/components/Raised3D';
import { SceneStatTile } from '@/components/SceneStatTile';
import { brand, categories, colors, fontFamily, radius, spacing } from '@/theme';

import { TaskDetail } from '../components/tasks/TaskDetail';
import { TaskList } from '../components/tasks/TaskList';
import { studentTasksMock, type StudentTask, type TaskStatus } from '../mocks/studentTasks';

type TabKey = 'pending' | 'submitted' | 'graded' | 'overdue';

const TABS: { key: TabKey; label: string; statuses: TaskStatus[] }[] = [
  { key: 'pending', label: 'Pendientes', statuses: ['pending'] },
  { key: 'submitted', label: 'Entregadas', statuses: ['submitted', 'graded'] },
  { key: 'graded', label: 'Calificadas', statuses: ['graded'] },
  { key: 'overdue', label: 'Vencidas', statuses: ['overdue'] },
];

const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };
/** Por debajo de este ancho de contenido, la lista y el detalle se apilan. */
const NARROW_WIDTH = 760;
const STAGGER = 70;
/** Canto de los botones 3D de la barra. */
const RAISE = 3;

function countBy(statuses: TaskStatus[]) {
  return studentTasksMock.filter((task) => statuses.includes(task.status)).length;
}

/** Tareas del alumno: resúmenes 3D, pestañas por estado, lista agrupada y detalle. Solo visual. */
export function StudentTasks() {
  const [tab, setTab] = useState<TabKey>('pending');
  const [selectedId, setSelectedId] = useState<string>();
  const [contentWidth, setContentWidth] = useState(0);
  const isNarrow = contentWidth > 0 && contentWidth < NARROW_WIDTH;

  const activeTab = TABS.find((item) => item.key === tab) ?? TABS[0];
  const tasks = studentTasksMock.filter((task) => activeTab.statuses.includes(task.status));
  const selected: StudentTask | undefined =
    tasks.find((task) => task.id === selectedId) ?? tasks[0];

  const pending = studentTasksMock.filter((task) => task.status === 'pending');
  const graded = studentTasksMock.filter((task) => task.status === 'graded');
  const average = graded.length
    ? Math.round(graded.reduce((sum, task) => sum + (task.grade ?? 0), 0) / graded.length)
    : 0;

  const stats = [
    {
      caption: 'Por entregar',
      kind: 'clipboard',
      label: 'Pendientes',
      palette: BRAND_PALETTE,
      value: pending.length,
    },
    {
      caption: 'Vencen hoy',
      kind: 'flame',
      label: 'Para hoy',
      palette: categories.red,
      value: pending.filter((task) => task.group === 'today').length,
    },
    {
      caption: 'Este bimestre',
      kind: 'badge',
      label: 'Entregadas',
      palette: categories.green,
      value: countBy(['submitted', 'graded']),
    },
    {
      caption: 'Sobre 20',
      kind: 'trophy',
      label: 'Promedio',
      palette: categories.orange,
      value: average,
    },
  ] as const;

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
      showsVerticalScrollIndicator={false}
    >
      {/* Resúmenes */}
      <View style={[styles.row, isNarrow && styles.wrapRow]}>
        {stats.map((stat, index) => (
          <FadeIn
            key={stat.label}
            delay={STAGGER * index}
            style={[styles.flex, isNarrow && styles.halfWidth]}
          >
            <SceneStatTile {...stat} />
          </FadeIn>
        ))}
      </View>

      {/* Pestañas por estado + filtros */}
      <FadeIn delay={STAGGER * 4} style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          <View accessibilityRole="tablist" style={styles.tabs}>
            {TABS.map(({ key, label, statuses }) => {
              const isActive = key === tab;
              const content = (
                <>
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{label}</Text>
                  <View style={[styles.count, isActive && styles.countActive]}>
                    <Text style={[styles.countText, isActive && styles.countTextActive]}>
                      {countBy(statuses)}
                    </Text>
                  </View>
                </>
              );

              return (
                <Pressable
                  key={key}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  onPress={() => {
                    setTab(key);
                    setSelectedId(undefined);
                  }}
                >
                  {({ pressed }) =>
                    isActive ? (
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
                    )
                  }
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <Pressable
          accessibilityLabel="Filtros de tareas"
          accessibilityRole="button"
          onPress={() => undefined}
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
              <Text style={styles.optionsText}>Filtros</Text>
            </Raised3D>
          )}
        </Pressable>
      </FadeIn>

      {/* Lista + detalle */}
      <View style={[styles.row, isNarrow && styles.stackedRow]}>
        <FadeIn delay={STAGGER * 5} style={[styles.listColumn, isNarrow && styles.fullWidth]}>
          <TaskList
            grouped={tab === 'pending'}
            onSelect={setSelectedId}
            selectedId={selected?.id}
            tasks={tasks}
          />
        </FadeIn>
        {selected && (
          <FadeIn delay={STAGGER * 6} style={[styles.detailColumn, isNarrow && styles.fullWidth]}>
            <TaskDetail key={selected.id} task={selected} />
          </FadeIn>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: spacing.md, padding: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md },
  wrapRow: { flexWrap: 'wrap' },
  stackedRow: { flexDirection: 'column' },
  flex: { flex: 1 },
  halfWidth: { flexBasis: '45%' },
  listColumn: { flex: 1.15, minWidth: 0 },
  detailColumn: { flex: 1, minWidth: 0 },
  fullWidth: { flexBasis: 'auto', width: '100%' },

  toolbar: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  tabsScroll: { flexGrow: 0, flexShrink: 1 },
  tabs: {
    alignItems: 'flex-start',
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
  /** Pestañas planas junto a la 3D: mismo alto total (cara + canto). */
  flatRaise: { marginBottom: RAISE },
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
  optionsPressable: { marginLeft: 'auto' },
  optionsButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 52,
    paddingHorizontal: spacing.md,
  },
  optionsText: { color: colors.text, fontFamily: fontFamily.medium, fontSize: 14 },
});
