import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { FadeIn } from '@/components/FadeIn';
import { SceneStatTile } from '@/components/SceneStatTile';
import { brand, categories, spacing } from '@/theme';

import {
  CoursePerformanceCard,
  PositionCard,
  ProgressHero,
  RankingDetailCard,
} from '../components/progress/ProgressCards';
import { AcademicCardModal } from '../components/progress/ProgressModals';
import {
  averageGrade,
  courseAverage,
  formatGrade,
  overallProgress,
  taskTotals,
} from '../data/studentSelectors';
import { studentHomeMock } from '../mocks/student';
import { studentCoursesMock } from '../mocks/studentCourses';
import { rankingMock, studentProfile } from '../mocks/studentProgress';
import { studentTasksMock } from '../mocks/studentTasks';

const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };
const STAGGER = 80;
/** Por debajo de este ancho de contenido, las filas se apilan (y entonces sí hay scroll). */
const NARROW_WIDTH = 820;

/**
 * Progreso del alumno en **un solo viewport**: mi avance y mi posición arriba, métricas en el
 * centro (alto natural) y rendimiento por curso + ranking abajo, repartiéndose el alto. Mismos
 * datos que Inicio y Tareas.
 */
export function StudentProgress() {
  const [cardOpen, setCardOpen] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const isNarrow = contentWidth > 0 && contentWidth < NARROW_WIDTH;

  const progress = overallProgress(studentCoursesMock);
  const average = averageGrade(studentTasksMock);
  const tasks = taskTotals(studentTasksMock);
  const performance = studentCoursesMock.map((course) => ({
    average: courseAverage(course.id, studentTasksMock),
    course,
  }));

  const metrics = [
    {
      caption: average === undefined ? 'Sin notas todavía' : 'Promedio general sobre 20',
      kind: 'badge',
      label: 'Promedio',
      palette: categories.green,
      value: average === undefined ? '—' : formatGrade(average),
    },
    {
      caption: `de ${progress.total} lecciones`,
      kind: 'book',
      label: 'Lecciones completadas',
      palette: BRAND_PALETTE,
      value: progress.done,
    },
    {
      caption: tasks.evaluated ? `de ${tasks.evaluated} calificadas` : 'Sin tareas calificadas',
      kind: 'clipboard',
      label: 'Tareas aprobadas',
      palette: categories.orange,
      value: tasks.evaluated ? tasks.approved : '—',
    },
  ] as const;

  const content: ReactNode = (
    <>
      {/* Mi avance + mi posición */}
      <View style={[styles.row, !isNarrow && styles.top, isNarrow && styles.stacked]}>
        <FadeIn style={styles.wide}>
          <ProgressHero done={progress.done} percent={progress.percent} total={progress.total} />
        </FadeIn>
        <FadeIn delay={STAGGER} style={styles.flex}>
          <PositionCard
            change={rankingMock.change}
            onOpenCard={() => setCardOpen(true)}
            period={rankingMock.periodShort}
            position={rankingMock.position}
            scope={rankingMock.scope}
            total={rankingMock.total}
          />
        </FadeIn>
      </View>

      {/* Métricas */}
      <View style={[styles.row, isNarrow && styles.stacked]}>
        {metrics.map((metric, index) => (
          <FadeIn key={metric.label} delay={STAGGER * (2 + index)} style={styles.flex}>
            <SceneStatTile {...metric} chevron={false} compact />
          </FadeIn>
        ))}
      </View>

      {/* Mi rendimiento + ranking */}
      <View style={[styles.row, !isNarrow && styles.bottom, isNarrow && styles.stacked]}>
        <FadeIn delay={STAGGER * 5} style={styles.wide}>
          <CoursePerformanceCard rows={performance} />
        </FadeIn>
        <FadeIn delay={STAGGER * 6} style={styles.flex}>
          <RankingDetailCard
            entries={rankingMock.entries}
            period={rankingMock.period}
            position={rankingMock.position}
            scope={rankingMock.scope}
            total={rankingMock.total}
          />
        </FadeIn>
      </View>
    </>
  );

  return (
    <>
      {isNarrow ? (
        <ScrollView
          contentContainerStyle={styles.scroll}
          onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
        >
          {content}
        </ScrollView>
      ) : (
        <View
          onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
          style={styles.screen}
        >
          {content}
        </View>
      )}

      <AcademicCardModal
        average={average}
        name={studentProfile.name}
        onClose={() => setCardOpen(false)}
        percent={progress.percent}
        period={rankingMock.period}
        position={rankingMock.position}
        streakDays={studentHomeMock.streak.days}
        total={rankingMock.total}
        visible={cardOpen}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: spacing.md, padding: spacing.lg },
  scroll: { gap: spacing.md, padding: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md },
  /** Alto repartido: la fila inferior necesita más (6 cursos y 5 filas de ranking). */
  top: { flex: 1, minHeight: 0 },
  bottom: { flex: 1.6, minHeight: 0 },
  stacked: { flexDirection: 'column' },
  flex: { flex: 1 },
  wide: { flex: 1.75 },
});
