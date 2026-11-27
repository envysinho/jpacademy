import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { SoftScene } from '@/components/SoftScene';
import { brand, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import type { StudentTask } from '../../mocks/studentTasks';
import { CourseBanner } from '../courses/CourseBanner';

import { formatShortDate, taskChip } from './taskVisuals';

export type TaskListMode = 'grouped' | 'plain' | 'history';

/** Medidas fijas para calcular cuántas filas caben sin scroll. */
const ROW_HEIGHT = 76;
const ROW_GAP = 6;
const TITLE_HEIGHT = 16;
const SECTION_GAP = 16;

type Section = { items: StudentTask[]; title?: string };

/**
 * Recorta las secciones a lo que cabe en `height`, sin filas a medias: lo que no entra no se
 * muestra (la lista no se desplaza).
 */
function fitSections(sections: Section[], height: number): Section[] {
  const fitted: Section[] = [];
  let used = 0;
  for (const section of sections) {
    const header =
      (fitted.length > 0 ? SECTION_GAP : 0) + (section.title ? TITLE_HEIGHT + ROW_GAP : 0);
    if (used + header + ROW_HEIGHT > height) break;
    used += header;
    const items: StudentTask[] = [];
    for (const item of section.items) {
      const cost = (items.length > 0 ? ROW_GAP : 0) + ROW_HEIGHT;
      if (used + cost > height) break;
      used += cost;
      items.push(item);
    }
    fitted.push({ ...section, items });
    if (items.length < section.items.length) break;
  }
  return fitted;
}

function TaskRow({
  isHistory,
  isSelected,
  onPress,
  task,
}: {
  isHistory: boolean;
  isSelected: boolean;
  onPress: () => void;
  task: StudentTask;
}) {
  const historyDate = task.gradedAt ?? task.submittedAt ?? task.dueDate;
  const chip = taskChip(task);
  const ChipIcon = chip.icon;

  return (
    <Pressable
      accessibilityLabel={`${task.title}, ${task.subject}. ${chip.label}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        isSelected && styles.rowSelected,
        pressed && !isSelected && styles.rowPressed,
      ]}
    >
      {isSelected && <SoftScene base={brand.blue} />}
      <CourseBanner
        compact
        color={task.color}
        icon={task.icon}
        style={styles.thumb}
        uid={`task-row-${task.id}`}
      />
      <View style={styles.rowText}>
        <Text numberOfLines={1} style={styles.rowTitle}>
          {task.title}
        </Text>
        <Text numberOfLines={1} style={styles.rowSubtitle}>
          {task.subject} · {task.type}
          {isHistory && historyDate ? ` · ${formatShortDate(historyDate)}` : ''}
        </Text>
      </View>
      <View style={[styles.chip, { backgroundColor: chip.background }]}>
        <ChipIcon color={chip.color} size={14} strokeWidth={2.2} />
        <Text numberOfLines={1} style={[styles.chipText, { color: chip.color }]}>
          {chip.label}
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * Lista de tareas. `grouped`: atrasadas primero y luego Hoy · Esta semana · Más adelante.
 * `history`: entregas recientes con su nota o «Por calificar». `plain`: sin agrupar.
 */
export function TaskList({
  emptyMessage,
  fill = false,
  mode,
  onSelect,
  selectedId,
  tasks,
}: {
  emptyMessage: string;
  /**
   * Ocupa el alto disponible y muestra solo las filas que caben, sin scroll (Tareas en un
   * viewport).
   */
  fill?: boolean;
  mode: TaskListMode;
  onSelect: (id: string) => void;
  selectedId?: string;
  tasks: StudentTask[];
}) {
  const [height, setHeight] = useState(0);
  // Pendientes: «Hoy» y debajo «Próximas».
  const sections: Section[] =
    mode === 'grouped'
      ? [
          {
            items: tasks.filter((task) => task.group === 'today'),
            title: 'Hoy',
          },
          {
            items: tasks.filter((task) => task.group !== 'today'),
            title: 'Próximas',
          },
        ].filter((section) => section.items.length > 0)
      : [{ items: tasks }];

  const rows = (list: Section[]) =>
    list.map(({ items, title }) => (
      <View key={title ?? 'all'} style={styles.section}>
        {title && <Text style={styles.sectionTitle}>{title}</Text>}
        {items.map((task) => (
          <TaskRow
            key={task.id}
            isHistory={mode === 'history'}
            isSelected={task.id === selectedId}
            onPress={() => onSelect(task.id)}
            task={task}
          />
        ))}
      </View>
    ));

  return (
    <Card style={[styles.card, fill && styles.cardFill]}>
      {tasks.length === 0 && <Text style={styles.empty}>{emptyMessage}</Text>}
      {fill ? (
        <View
          onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
          style={styles.fitted}
        >
          {height > 0 && rows(fitSections(sections, height))}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>{rows(sections)}</ScrollView>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.md },
  cardFill: { flex: 1 },
  fitted: { flex: 1, gap: SECTION_GAP, overflow: 'hidden' },
  content: { gap: SECTION_GAP },
  section: { gap: ROW_GAP },
  sectionTitle: {
    color: colors.textMuted,
    fontFamily: fontFamily.bold,
    fontSize: 12,
    letterSpacing: 0.6,
    lineHeight: TITLE_HEIGHT,
    paddingHorizontal: spacing.xs,
    textTransform: 'uppercase',
  },
  row: {
    alignItems: 'center',
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: spacing.md,
    height: ROW_HEIGHT,
    overflow: 'hidden',
    padding: 10,
  },
  rowSelected: { backgroundColor: brand.blueSoft, ...shadows.card },
  rowPressed: { backgroundColor: colors.track },
  thumb: { height: 56, width: 56 },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 15 },
  rowSubtitle: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  chip: {
    alignItems: 'center',
    borderRadius: radius.pill,
    flexDirection: 'row',
    flexShrink: 0,
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: { fontFamily: fontFamily.semibold, fontSize: 12 },
  empty: {
    color: colors.textMuted,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    paddingVertical: spacing.xl,
    textAlign: 'center',
  },
});
