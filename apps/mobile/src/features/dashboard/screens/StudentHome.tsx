import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FadeIn } from '@/components/FadeIn';
import { spacing } from '@/theme';

import { AchievementsCard } from '../components/home/AchievementsCard';
import { DurationsCard } from '../components/home/DurationsCard';
import { RankingCard } from '../components/home/RankingCard';
import { ResumeCard } from '../components/home/ResumeCard';
import { StreakCard } from '../components/home/StreakCard';
import { studentHomeMock } from '../mocks/student';
import { findCourse } from '../mocks/studentCourses';
import { lastActivityMock, rankingMock } from '../mocks/studentProgress';

/** Retraso entre bloques en la animación de entrada (ms). */
const STAGGER = 90;
const COMPACT_CONTENT_WIDTH = 1000;

/**
 * Inicio del alumno en **un solo viewport** (sin scroll vertical): las dos filas se reparten el
 * alto disponible y cada tarjeta ajusta su zona flexible (racha, gráfica, logros, ranking).
 */
export function StudentHome({
  onOpenCourses,
  onResume,
}: {
  onOpenCourses: () => void;
  onResume: (courseId: string) => void;
}) {
  const { achievements, durations, streak } = studentHomeMock;
  const [contentWidth, setContentWidth] = useState(0);
  const isCompact = contentWidth > 0 && contentWidth < COMPACT_CONTENT_WIDTH;

  const activeCourse = findCourse(lastActivityMock?.courseId);
  const activity =
    lastActivityMock && activeCourse
      ? { ...lastActivityMock, icon: activeCourse.icon, title: activeCourse.title }
      : null;

  return (
    <View
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
      style={styles.screen}
    >
      {/* Continuar aprendiendo + racha */}
      <View style={styles.row}>
        <FadeIn style={styles.resume}>
          <ResumeCard
            activity={activity}
            isCompact={isCompact}
            onPress={() => (activeCourse ? onResume(activeCourse.id) : onOpenCourses())}
          />
        </FadeIn>
        <FadeIn delay={STAGGER} style={styles.flex}>
          <StreakCard {...streak} isCompact={isCompact} />
        </FadeIn>
      </View>

      {/* Ranking + horas + logros */}
      <View style={styles.row}>
        <FadeIn delay={STAGGER * 2} style={styles.flex}>
          <RankingCard
            entries={rankingMock.entries}
            periodShort={rankingMock.periodShort}
            position={rankingMock.position}
            scope={rankingMock.scope}
            total={rankingMock.total}
          />
        </FadeIn>
        <FadeIn delay={STAGGER * 3} style={styles.flex}>
          <DurationsCard {...durations} isCompact={isCompact} />
        </FadeIn>
        <FadeIn delay={STAGGER * 4} style={styles.flex}>
          <AchievementsCard {...achievements} isCompact={isCompact} />
        </FadeIn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: spacing.md, padding: spacing.lg },
  row: { flex: 1, flexDirection: 'row', gap: spacing.md, minHeight: 0 },
  flex: { flex: 1 },
  resume: { flex: 1.75 },
});
