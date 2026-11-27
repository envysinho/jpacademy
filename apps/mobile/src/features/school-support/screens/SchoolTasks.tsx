import { CalendarClock, Camera, FileText, Info, MessageCircle, Play } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { FitList } from '@/components/FitList';
import { FadeIn } from '@/components/FadeIn';
import { Raised3D } from '@/components/Raised3D';
import { SoftScene } from '@/components/SoftScene';
import { TaskActionButton } from '@/features/dashboard/components/course-detail/SidePanels';
import { CourseBanner } from '@/features/dashboard/components/courses/CourseBanner';
import { courseColors } from '@/features/dashboard/components/courses/courseVisuals';
import { brand, categories, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import { findTopic, type SchoolTask, type SchoolTaskStatus } from '../mocks/schoolSupport';

const statusStyle: Record<SchoolTaskStatus, { background: string; color: string; label: string }> =
  {
    new: {
      background: categories.orange.soft,
      color: categories.orange.ink,
      label: 'Por estudiar',
    },
    solved: { background: categories.green.soft, color: categories.green.ink, label: 'Resuelta' },
    studying: { background: brand.blueSoft, color: brand.blueDeep, label: 'En sesión' },
  };

/**
 * Mis tareas (acompañamiento escolar): historial de tareas del colegio con su estado, fecha
 * opcional y acceso a la sesión de cada tema y al espacio de resolución. Un solo viewport.
 */
export function SchoolTasks({
  initialTaskId,
  onOpenTopic,
  onResolve,
  onScan,
  tasks,
}: {
  initialTaskId?: string;
  onOpenTopic: (topicId: string, taskId: string) => void;
  onResolve: (taskId: string) => void;
  onScan: () => void;
  tasks: SchoolTask[];
}) {
  const [selectedId, setSelectedId] = useState(initialTaskId);
  const selected = tasks.find((task) => task.id === selectedId) ?? tasks[0];
  const firstTopic = findTopic(selected?.blocks[0]?.topicId);

  return (
    <View style={styles.screen}>
      <FadeIn style={styles.toolbar}>
        <View style={styles.flex}>
          <Text style={styles.heading}>Mis tareas del colegio</Text>
          <Text style={styles.meta}>
            {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'} ·{' '}
            {tasks.filter((task) => task.status === 'solved').length} resueltas
          </Text>
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
              <Text style={styles.scanText}>Subir tarea</Text>
            </Raised3D>
          )}
        </Pressable>
      </FadeIn>

      <View style={styles.row}>
        <FadeIn delay={80} style={styles.listColumn}>
          <Card style={styles.card}>
            {tasks.length === 0 && (
              <Text style={styles.empty}>Aún no tienes tareas. Escanea la primera.</Text>
            )}
            {/* Sin scroll: las más recientes que quepan; el resto no se muestra. */}
            <FitList
              items={tasks}
              keyOf={(task) => task.id}
              renderItem={(task) => {
                const topic = findTopic(task.blocks[0]?.topicId);
                const status = statusStyle[task.status];
                const isSelected = task.id === selected?.id;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setSelectedId(task.id)}
                    style={({ pressed }) => [
                      styles.taskRow,
                      isSelected && styles.taskRowSelected,
                      pressed && !isSelected && styles.taskRowPressed,
                    ]}
                  >
                    {isSelected && <SoftScene base={brand.blue} />}
                    {topic && (
                      <CourseBanner
                        compact
                        color={topic.color}
                        icon={topic.icon}
                        style={styles.thumb}
                        uid={`stl-${task.id}`}
                      />
                    )}
                    <View style={styles.flex}>
                      <Text numberOfLines={1} style={styles.rowTitle}>
                        {task.title}
                      </Text>
                      <Text numberOfLines={1} style={styles.meta}>
                        {task.blocks.length} {task.blocks.length === 1 ? 'tema' : 'temas'} ·{' '}
                        {task.createdLabel}
                      </Text>
                    </View>
                    <View style={[styles.pill, { backgroundColor: status.background }]}>
                      <Text style={[styles.pillText, { color: status.color }]}>{status.label}</Text>
                    </View>
                  </Pressable>
                );
              }}
              rowHeight={72}
            />
          </Card>
        </FadeIn>

        {selected && (
          <FadeIn key={selected.id} delay={140} style={styles.detailColumn}>
            <Card style={styles.card}>
              <ScrollView contentContainerStyle={styles.detail} style={styles.flex}>
                {firstTopic && (
                  <CourseBanner
                    color={firstTopic.color}
                    icon={firstTopic.icon}
                    style={styles.banner}
                    uid={`std-${selected.id}`}
                  />
                )}
                <Text style={styles.title}>{selected.title}</Text>
                <View style={styles.chips}>
                  <View
                    style={[
                      styles.pill,
                      { backgroundColor: statusStyle[selected.status].background },
                    ]}
                  >
                    <Text style={[styles.pillText, { color: statusStyle[selected.status].color }]}>
                      {statusStyle[selected.status].label}
                    </Text>
                  </View>
                  <View style={[styles.pill, styles.pillNeutral]}>
                    <CalendarClock color={colors.text} size={13} strokeWidth={2.2} />
                    <Text style={styles.pillText}>{selected.dueLabel ?? 'Sin fecha'}</Text>
                  </View>
                  <View style={[styles.pill, styles.pillNeutral]}>
                    <FileText color={colors.text} size={13} strokeWidth={2.2} />
                    <Text style={styles.pillText}>{selected.fileName}</Text>
                  </View>
                </View>

                {selected.blocks.map((block, index) => {
                  const topic = findTopic(block.topicId);
                  if (!topic) return null;
                  return (
                    <View key={`${block.topicId}-${index}`} style={styles.block}>
                      <Text style={[styles.area, { color: courseColors[topic.color].ink }]}>
                        {topic.area}
                      </Text>
                      <Text style={styles.blockTitle}>{topic.title}</Text>
                      {block.exercises.map((exercise) => (
                        <Text key={exercise} style={styles.body}>
                          • {exercise}
                        </Text>
                      ))}
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => onOpenTopic(topic.id, selected.id)}
                        style={styles.link}
                      >
                        <Play color={brand.blueDeep} size={14} strokeWidth={2.4} />
                        <Text style={styles.linkText}>Ver sesión del tema</Text>
                      </Pressable>
                    </View>
                  );
                })}

                <View style={styles.notice}>
                  <Info color={colors.textMuted} size={14} strokeWidth={2.2} />
                  <Text style={[styles.meta, styles.flex]}>
                    La revisión de este espacio es interna y orientativa; no es la nota oficial de
                    tu colegio.
                  </Text>
                </View>
              </ScrollView>
              <TaskActionButton
                hint="Abre el chat de la tarea con el asistente y el docente."
                icon={MessageCircle}
                label="Entrar a la tarea"
                onPress={() => onResolve(selected.id)}
              />
            </Card>
          </FadeIn>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: spacing.md, padding: spacing.lg },
  flex: { flex: 1 },
  toolbar: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  heading: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 20 },
  meta: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  scan: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 48,
    paddingHorizontal: 18,
  },
  scanText: { color: brand.onBlue, fontFamily: fontFamily.bold, fontSize: 15 },
  row: { flex: 1, flexDirection: 'row', gap: spacing.md, minHeight: 0 },
  listColumn: { flex: 1.15, minWidth: 0 },
  detailColumn: { flex: 1, minWidth: 0 },
  card: { flex: 1, gap: spacing.md, padding: spacing.md },
  empty: {
    color: colors.textMuted,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    textAlign: 'center',
  },
  taskRow: {
    alignItems: 'center',
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: spacing.md,
    flex: 1,
    overflow: 'hidden',
    padding: 10,
  },
  taskRowSelected: { backgroundColor: brand.blueSoft, ...shadows.card },
  taskRowPressed: { backgroundColor: colors.track },
  thumb: { height: 52, width: 52 },
  rowTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 15 },
  pill: {
    alignItems: 'center',
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillNeutral: { backgroundColor: colors.track },
  pillText: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 12 },
  detail: { gap: spacing.sm },
  banner: { height: 100 },
  title: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 20, letterSpacing: -0.4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  block: { backgroundColor: colors.background, borderRadius: radius.chip, gap: 4, padding: 12 },
  area: {
    fontFamily: fontFamily.bold,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  blockTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 15 },
  body: { color: colors.text, fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  link: { alignItems: 'center', flexDirection: 'row', gap: 4, minHeight: 40 },
  linkText: { color: brand.blueDeep, fontFamily: fontFamily.bold, fontSize: 13 },
  notice: { alignItems: 'flex-start', flexDirection: 'row', gap: 6 },
});
