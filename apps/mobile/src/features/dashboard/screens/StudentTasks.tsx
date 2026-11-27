import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import type { Clay3DKind, ClayPalette } from '@/components/Clay3DIcon';
import { FadeIn } from '@/components/FadeIn';
import { SceneStatTile } from '@/components/SceneStatTile';
import { brand, categories, spacing } from '@/theme';

import { TaskDetail } from '../components/tasks/TaskDetail';
import { TaskList, type TaskListMode } from '../components/tasks/TaskList';
import { averageGrade, formatGrade } from '../data/studentSelectors';
import { studentTasksMock, type StudentTask } from '../mocks/studentTasks';

type ViewKey = 'pending' | 'today' | 'submitted' | 'average';

const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };
/** Por debajo de este ancho de contenido, la lista y el detalle se apilan. */
const NARROW_WIDTH = 760;
const STAGGER = 70;

/** Mismo orden que la lista: de hoy primero, luego esta semana y más adelante. */
const GROUP_RANK = { later: 3, today: 1, week: 2 } as const;
const urgency = (task: StudentTask) => (task.group ? GROUP_RANK[task.group] : 4);

/** Fecha de referencia en el historial: entrega o, si venció sin entregar, la fecha límite. */
const historyDate = (task: StudentTask) => task.submittedAt ?? task.dueDate ?? '';
const byRecent = (date: (task: StudentTask) => string) => (a: StudentTask, b: StudentTask) =>
  date(b).localeCompare(date(a));
const isDelivered = (task: StudentTask) => task.status === 'submitted' || task.status === 'graded';

/** Tareas de cada vista, en el orden en que se muestran. */
function tasksFor(view: ViewKey): StudentTask[] {
  switch (view) {
    case 'today':
      return studentTasksMock.filter((task) => task.status === 'pending' && task.group === 'today');
    case 'submitted':
      // Historial: entregadas y vencidas sin entregar (no se pueden resolver; quedan registradas).
      return studentTasksMock
        .filter((task) => isDelivered(task) || task.status === 'overdue')
        .sort(byRecent(historyDate));
    case 'average':
      return studentTasksMock
        .filter((task) => task.status === 'graded')
        .sort(byRecent((task) => task.gradedAt ?? ''));
    default:
      // Solo las que aún se pueden resolver (las vencidas pasan al historial).
      return studentTasksMock
        .filter((task) => task.status === 'pending')
        .sort((a, b) => urgency(a) - urgency(b));
  }
}

const listMode: Record<ViewKey, TaskListMode> = {
  average: 'history',
  pending: 'grouped',
  submitted: 'history',
  today: 'plain',
};

const emptyMessage: Record<ViewKey, string> = {
  average: 'Aún no tienes tareas calificadas.',
  pending: '¡Todo al día! No tienes tareas por resolver.',
  submitted: 'Todavía no has entregado tareas.',
  today: 'No tienes entregas para hoy.',
};

/**
 * Tareas del alumno en **un solo viewport**: las cuatro tarjetas superiores son el selector de
 * vista (Pendientes por defecto); debajo, lista + detalle con scroll interno. «Resolver tarea» abre el espacio de resolución compartido.
 */
export function StudentTasks({
  onResolveTask,
}: {
  onResolveTask: (taskId: string, tab?: 'ai' | 'teacher') => void;
}) {
  const [view, setView] = useState<ViewKey>('pending');
  const [selectedId, setSelectedId] = useState<string>();
  const [contentWidth, setContentWidth] = useState(0);
  const isNarrow = contentWidth > 0 && contentWidth < NARROW_WIDTH;

  const tasks = tasksFor(view);
  // Siempre una tarea válida de la vista actual (la primera si la elegida no pertenece a ella).
  const selected = tasks.find((task) => task.id === selectedId) ?? tasks[0];
  const average = averageGrade(studentTasksMock);
  const overdueCount = studentTasksMock.filter((task) => task.status === 'overdue').length;

  const stats: {
    caption: string;
    key: ViewKey;
    kind: Clay3DKind;
    label: string;
    palette: ClayPalette;
    value: number | string;
  }[] = [
    {
      caption: 'Por resolver',
      key: 'pending',
      kind: 'clipboard',
      label: 'Pendientes',
      palette: BRAND_PALETTE,
      value: tasksFor('pending').length,
    },
    {
      caption: 'Vencen hoy',
      key: 'today',
      kind: 'flame',
      label: 'Para hoy',
      palette: categories.red,
      value: tasksFor('today').length,
    },
    {
      caption: overdueCount
        ? `${overdueCount} ${overdueCount === 1 ? 'vencida' : 'vencidas'}`
        : 'Historial',
      key: 'submitted',
      kind: 'badge',
      label: 'Entregadas',
      palette: categories.green,
      value: studentTasksMock.filter(isDelivered).length,
    },
    {
      caption: 'Sobre 20',
      key: 'average',
      kind: 'trophy',
      label: 'Promedio',
      palette: categories.orange,
      value: average === undefined ? '—' : formatGrade(average),
    },
  ];

  const statsRow = (
    <View accessibilityRole="tablist" style={[styles.row, isNarrow && styles.wrapRow]}>
      {stats.map(({ key, ...stat }, index) => (
        <FadeIn
          key={key}
          delay={STAGGER * index}
          style={[styles.flex, isNarrow && styles.halfWidth]}
        >
          <SceneStatTile
            {...stat}
            onPress={() => {
              setView(key);
              setSelectedId(undefined);
            }}
            selected={view === key}
          />
        </FadeIn>
      ))}
    </View>
  );

  const listAndDetail = (
    <View style={[styles.row, !isNarrow && styles.main, isNarrow && styles.stackedRow]}>
      <FadeIn delay={STAGGER * 4} style={[styles.listColumn, isNarrow && styles.fullWidth]}>
        <TaskList
          emptyMessage={emptyMessage[view]}
          fill={!isNarrow}
          mode={listMode[view]}
          onSelect={setSelectedId}
          selectedId={selected?.id}
          tasks={tasks}
        />
      </FadeIn>
      {selected && (
        <FadeIn delay={STAGGER * 5} style={[styles.detailColumn, isNarrow && styles.fullWidth]}>
          <TaskDetail
            key={selected.id}
            fill={!isNarrow}
            onAskHelp={() => onResolveTask(selected.id, 'teacher')}
            onResolve={() => onResolveTask(selected.id)}
            task={selected}
          />
        </FadeIn>
      )}
    </View>
  );

  // Un solo viewport: resúmenes arriba y lista + detalle con scroll interno. Apilado si es estrecho.
  return isNarrow ? (
    <ScrollView
      contentContainerStyle={styles.scroll}
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
      showsVerticalScrollIndicator={false}
    >
      {statsRow}
      {listAndDetail}
    </ScrollView>
  ) : (
    <View
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
      style={styles.screen}
    >
      {statsRow}
      {listAndDetail}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: spacing.md, padding: spacing.lg },
  scroll: { gap: spacing.md, padding: spacing.lg },
  main: { flex: 1, minHeight: 0 },
  row: { flexDirection: 'row', gap: spacing.md },
  wrapRow: { flexWrap: 'wrap' },
  stackedRow: { flexDirection: 'column' },
  flex: { flex: 1 },
  halfWidth: { flexBasis: '45%' },
  listColumn: { flex: 1.15, minWidth: 0 },
  detailColumn: { flex: 1, minWidth: 0 },
  fullWidth: { flexBasis: 'auto', width: '100%' },
});
