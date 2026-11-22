import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { FadeIn } from '@/components/FadeIn';
import { spacing } from '@/theme';

import { AchievementsCard } from '../components/home/AchievementsCard';
import { CoursesCard } from '../components/home/CoursesCard';
import { DurationsCard } from '../components/home/DurationsCard';
import { ResumeCard } from '../components/home/ResumeCard';
import { StreakCard } from '../components/home/StreakCard';
import { studentHomeMock } from '../mocks/student';

/** Retraso entre bloques en la animación de entrada (ms). */
const STAGGER = 90;
const COMPACT_CONTENT_WIDTH = 1000;

/** Inicio del alumno. Solo visual, con datos ficticios. */
export function StudentHome() {
  const { achievements, courses, durations, resume, streak } = studentHomeMock;
  const [contentWidth, setContentWidth] = useState(0);
  const isCompact = contentWidth > 0 && contentWidth < COMPACT_CONTENT_WIDTH;

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
      showsVerticalScrollIndicator={false}
    >
      {/* Continuar aprendiendo + racha */}
      <View style={styles.row}>
        <FadeIn style={styles.resume}>
          <ResumeCard {...resume} isCompact={isCompact} />
        </FadeIn>
        <FadeIn delay={STAGGER} style={styles.flex}>
          <StreakCard {...streak} isCompact={isCompact} />
        </FadeIn>
      </View>

      {/* Cursos + horas + logros */}
      <View style={styles.row}>
        <FadeIn delay={STAGGER * 2} style={styles.flex}>
          <CoursesCard {...courses} isCompact={isCompact} />
        </FadeIn>
        <FadeIn delay={STAGGER * 3} style={styles.flex}>
          <DurationsCard {...durations} isCompact={isCompact} />
        </FadeIn>
        <FadeIn delay={STAGGER * 4} style={styles.flex}>
          <AchievementsCard {...achievements} isCompact={isCompact} />
        </FadeIn>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: spacing.md, padding: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
  resume: { flex: 1.75 },
});
