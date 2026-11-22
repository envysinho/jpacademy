import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { SoftScene } from '@/components/SoftScene';
import { brand, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import type { StudentTask, TaskGroup } from '../../mocks/studentTasks';
import { CourseBanner } from '../courses/CourseBanner';

import { groupLabels, taskChip } from './taskVisuals';

const GROUP_ORDER: TaskGroup[] = ['today', 'week', 'later'];

function TaskRow({
  isSelected,
  onPress,
  task,
}: {
  isSelected: boolean;
  onPress: () => void;
  task: StudentTask;
}) {
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

/** Lista de tareas; las pendientes se agrupan por vencimiento (Hoy · Esta semana · Más adelante). */
export function TaskList({
  grouped,
  onSelect,
  selectedId,
  tasks,
}: {
  grouped: boolean;
  onSelect: (id: string) => void;
  selectedId?: string;
  tasks: StudentTask[];
}) {
  const sections = grouped
    ? GROUP_ORDER.map((group) => ({
        items: tasks.filter((task) => task.group === group),
        title: groupLabels[group],
      })).filter((section) => section.items.length > 0)
    : [{ items: tasks, title: undefined }];

  return (
    <Card style={styles.card}>
      {tasks.length === 0 && <Text style={styles.empty}>No hay tareas en esta sección.</Text>}
      {sections.map(({ items, title }) => (
        <View key={title ?? 'all'} style={styles.section}>
          {title && <Text style={styles.sectionTitle}>{title}</Text>}
          {items.map((task) => (
            <TaskRow
              key={task.id}
              isSelected={task.id === selectedId}
              onPress={() => onSelect(task.id)}
              task={task}
            />
          ))}
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, padding: spacing.md },
  section: { gap: 6 },
  sectionTitle: {
    color: colors.textMuted,
    fontFamily: fontFamily.bold,
    fontSize: 12,
    letterSpacing: 0.6,
    paddingHorizontal: spacing.xs,
    textTransform: 'uppercase',
  },
  row: {
    alignItems: 'center',
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 76,
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
