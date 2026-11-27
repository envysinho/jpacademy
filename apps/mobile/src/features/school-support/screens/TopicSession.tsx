import { ArrowLeft, Lightbulb, ListChecks, MessageCircle, Route } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { FadeIn } from '@/components/FadeIn';
import { Raised3D } from '@/components/Raised3D';
import { SoftScene } from '@/components/SoftScene';
import { LessonPanel } from '@/features/dashboard/components/course-detail/LessonPanel';
import { TaskActionButton } from '@/features/dashboard/components/course-detail/SidePanels';
import { CourseBanner } from '@/features/dashboard/components/courses/CourseBanner';
import { courseColors } from '@/features/dashboard/components/courses/courseVisuals';
import { CardHeader } from '@/features/dashboard/components/home/CardHeader';
import { brand, categories, colors, fontFamily, radius, spacing } from '@/theme';

import type { SchoolTask, TaskBlock, Topic } from '../mocks/schoolSupport';

const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };
const NARROW_WIDTH = 760;

/**
 * Sesión personalizada de un tema (desde una búsqueda o una tarea escaneada). Reutiliza el
 * reproductor y el resumen de la lección; a la derecha, ruta corta, ejemplos, práctica similar
 * y, si viene de una tarea, los ejercicios originales con «Resolver tarea». No matricula al
 * alumno en ningún curso.
 */
export function TopicSession({
  block,
  onBack,
  onResolve,
  task,
  topic,
}: {
  block?: TaskBlock;
  onBack: () => void;
  onResolve: (taskId: string) => void;
  task?: SchoolTask;
  topic: Topic;
}) {
  const [contentWidth, setContentWidth] = useState(0);
  const isNarrow = contentWidth > 0 && contentWidth < NARROW_WIDTH;

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
      showsVerticalScrollIndicator={false}
    >
      <FadeIn style={styles.header}>
        <Pressable accessibilityLabel="Volver" accessibilityRole="button" onPress={onBack}>
          {({ pressed }) => (
            <Raised3D depth={3} faceStyle={styles.back} pressed={pressed} variant="white">
              <ArrowLeft color={colors.text} size={20} strokeWidth={2.2} />
            </Raised3D>
          )}
        </Pressable>
        <CourseBanner
          compact
          color={topic.color}
          icon={topic.icon}
          style={styles.thumb}
          uid={`session-${topic.id}`}
        />
        <View style={styles.flex}>
          <Text style={[styles.eyebrow, { color: courseColors[topic.color].ink }]}>
            {topic.area}
          </Text>
          <Text numberOfLines={1} style={styles.title}>
            {topic.title}
          </Text>
          <Text numberOfLines={1} style={styles.subtitle}>
            Sesión personalizada · {task ? `de tu tarea «${task.title}»` : 'tema elegido por ti'}
          </Text>
        </View>
      </FadeIn>

      <View style={[styles.row, isNarrow && styles.stacked]}>
        <FadeIn delay={80} style={[styles.main, isNarrow && styles.fullWidth]}>
          <LessonPanel
            color={topic.color}
            duration="08:30"
            icon={topic.icon}
            summary={topic.summary}
          />
        </FadeIn>

        <FadeIn delay={140} style={[styles.side, isNarrow && styles.fullWidth]}>
          {/* Tarea original (si la sesión viene de un escaneo) */}
          {task && block && (
            <View style={styles.original}>
              <SoftScene base={categories.orange.base} />
              <Text style={styles.cardTitle}>Tu tarea original</Text>
              <Text style={styles.meta}>{task.fileName}</Text>
              {block.exercises.map((exercise) => (
                <Text key={exercise} style={styles.body}>
                  • {exercise}
                </Text>
              ))}
              <TaskActionButton
                hint="Abre el chat de la tarea con el asistente y el docente."
                icon={MessageCircle}
                label="Ir al chat de la tarea"
                onPress={() => onResolve(task.id)}
              />
            </View>
          )}

          <Card style={styles.card}>
            <CardHeader
              clay={{ kind: 'book', palette: BRAND_PALETTE }}
              icon={Route}
              title="Ruta corta"
            />
            {topic.steps.map((step, index) => (
              <View key={step} style={styles.step}>
                <View style={[styles.stepNode, index === 0 && styles.stepNodeActive]}>
                  <Text style={[styles.stepNumber, index === 0 && styles.stepNumberActive]}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={[styles.stepText, index === 0 && styles.stepTextActive]}>{step}</Text>
              </View>
            ))}
          </Card>

          <Card style={styles.card}>
            <CardHeader
              clay={{ kind: 'badge', palette: categories.green }}
              icon={Lightbulb}
              title="Ejemplos resueltos"
            />
            {topic.examples.map(({ problem, solution }) => (
              <View key={problem} style={styles.example}>
                <Text style={styles.exampleProblem}>{problem}</Text>
                <Text style={styles.body}>{solution}</Text>
              </View>
            ))}
          </Card>

          <Card style={styles.card}>
            <CardHeader
              clay={{ kind: 'clipboard', palette: categories.orange }}
              icon={ListChecks}
              title="Práctica similar"
            />
            {topic.practice.map((exercise, index) => (
              <View key={exercise} style={styles.practice}>
                <Text style={styles.practiceNumber}>{index + 1}</Text>
                <Text style={[styles.body, styles.flex]}>{exercise}</Text>
              </View>
            ))}
            <Text style={styles.note}>
              Ejercicios de ejemplo del prototipo (no generados por IA).
            </Text>
          </Card>
        </FadeIn>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: spacing.md, padding: spacing.lg },
  flex: { flex: 1 },
  row: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md },
  stacked: { alignItems: 'stretch', flexDirection: 'column' },
  main: { flex: 1.6, minWidth: 0 },
  side: { flex: 1, gap: spacing.md, minWidth: 0 },
  fullWidth: { width: '100%' },

  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  back: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  thumb: { height: 64, width: 64 },
  eyebrow: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontFamily: fontFamily.extrabold,
    fontSize: 26,
    letterSpacing: -0.6,
  },
  subtitle: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 13 },

  card: { gap: 10, padding: spacing.md },
  cardTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 17 },
  meta: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 12 },
  body: { color: colors.text, fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  note: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 11 },

  original: {
    backgroundColor: categories.orange.soft,
    borderRadius: radius.card,
    gap: 8,
    overflow: 'hidden',
    padding: spacing.md,
  },

  step: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, minHeight: 40 },
  stepNode: {
    alignItems: 'center',
    backgroundColor: colors.track,
    borderColor: colors.trackFill,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  stepNodeActive: { backgroundColor: brand.blue, borderColor: brand.blueNight },
  stepNumber: { color: colors.textMuted, fontFamily: fontFamily.bold, fontSize: 12 },
  stepNumberActive: { color: brand.onBlue },
  stepText: { color: colors.text, flex: 1, fontFamily: fontFamily.medium, fontSize: 14 },
  stepTextActive: { color: brand.blueDeep, fontFamily: fontFamily.bold },

  example: { backgroundColor: colors.background, borderRadius: radius.chip, gap: 4, padding: 12 },
  exampleProblem: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 14 },
  practice: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm },
  practiceNumber: {
    backgroundColor: categories.orange.soft,
    borderRadius: radius.pill,
    color: categories.orange.ink,
    fontFamily: fontFamily.bold,
    fontSize: 12,
    height: 24,
    overflow: 'hidden',
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 24,
  },
});
