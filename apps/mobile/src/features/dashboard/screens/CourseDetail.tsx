import { ArrowLeft, PlayCircle, Sparkles, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { FadeIn } from '@/components/FadeIn';
import { ProgressBar } from '@/components/ProgressBar';
import { Raised3D } from '@/components/Raised3D';
import { brand, colors, fontFamily, radius, spacing } from '@/theme';

import { ChatPanel, type ChatTab } from '../components/course-detail/ChatPanel';
import { LessonPanel } from '../components/course-detail/LessonPanel';
import { RoadmapCard } from '../components/course-detail/RoadmapCard';
import { TaskSideCard, TeacherHelpCard } from '../components/course-detail/SidePanels';
import { CourseBanner } from '../components/courses/CourseBanner';
import { courseColors } from '../components/courses/courseVisuals';
import { courseDetailMock } from '../mocks/courseDetail';
import type { StudentCourse } from '../mocks/studentCourses';

type Mode = 'lesson' | 'ai';

const MODES: { icon: LucideIcon; key: Mode; label: string }[] = [
  { icon: PlayCircle, key: 'lesson', label: 'Lección' },
  { icon: Sparkles, key: 'ai', label: 'Asistente IA' },
];

/** Por debajo de este ancho de contenido, las dos columnas se apilan. */
const NARROW_WIDTH = 760;

/**
 * Detalle de un curso: cabecera con avance, modo «Lección» (video, material y roadmap) y modo
 * «Asistente IA» (chat con IA, tarea y paso al docente). Solo visual, con datos de muestra.
 */
export function CourseDetail({ course, onBack }: { course: StudentCourse; onBack: () => void }) {
  const {
    aiMessages,
    currentLesson,
    exercises,
    note,
    resources,
    task,
    teacher,
    teacherMessages,
    units,
  } = courseDetailMock;
  const [mode, setMode] = useState<Mode>('lesson');
  const [chatTab, setChatTab] = useState<ChatTab>('ai');
  const [helpRequested, setHelpRequested] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const isNarrow = contentWidth > 0 && contentWidth < NARROW_WIDTH;

  const requestHelp = () => {
    setHelpRequested(true);
    setChatTab('teacher');
    setMode('ai');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabecera */}
      <FadeIn style={[styles.header, isNarrow && styles.stacked]}>
        <View style={styles.titleBlock}>
          <Pressable
            accessibilityLabel="Volver a Mis cursos"
            accessibilityRole="button"
            onPress={onBack}
          >
            {({ pressed }) => (
              <Raised3D depth={3} faceStyle={styles.back} pressed={pressed} variant="white">
                <ArrowLeft color={colors.text} size={20} strokeWidth={2.2} />
              </Raised3D>
            )}
          </Pressable>
          <CourseBanner
            compact
            color={course.color}
            icon={course.icon}
            style={styles.thumb}
            uid={`detail-head-${course.id}`}
          />
          <View style={styles.flex}>
            <Text style={[styles.eyebrow, { color: courseColors[course.color].ink }]}>
              {course.subject}
            </Text>
            <Text numberOfLines={1} style={styles.title}>
              {course.title}
            </Text>
            <Text style={styles.subtitle}>
              {currentLesson.unit} · {currentLesson.lesson}: {currentLesson.title}
            </Text>
          </View>
        </View>

        <View style={[styles.headerSide, isNarrow && styles.fullWidth]}>
          <Card style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progreso del curso</Text>
              <Text style={styles.progressValue}>{course.progress}%</Text>
            </View>
            <ProgressBar trackColor={colors.track} value={course.progress} />
          </Card>
          <View style={styles.modes}>
            {MODES.map(({ icon: Icon, key, label }) => {
              const isActive = key === mode;
              const content = (
                <>
                  <Icon color={isActive ? brand.onBlue : colors.text} size={18} strokeWidth={2.2} />
                  <Text style={[styles.modeText, isActive && styles.modeTextActive]}>{label}</Text>
                </>
              );
              return (
                <Pressable
                  key={key}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  onPress={() => setMode(key)}
                  style={styles.flex}
                >
                  {({ pressed }) =>
                    isActive ? (
                      <Raised3D
                        depth={3}
                        faceStyle={styles.mode}
                        pressed={pressed}
                        radius={radius.chip}
                        variant="primary"
                      >
                        {content}
                      </Raised3D>
                    ) : (
                      <View style={[styles.mode, styles.modeFlat]}>{content}</View>
                    )
                  }
                </Pressable>
              );
            })}
          </View>
        </View>
      </FadeIn>

      {/* Cuerpo */}
      <View style={[styles.row, isNarrow && styles.stacked]}>
        {mode === 'lesson' ? (
          <>
            <FadeIn
              key="lesson-main"
              delay={80}
              style={[styles.main, isNarrow && styles.fullWidth]}
            >
              <LessonPanel
                color={course.color}
                duration={currentLesson.duration}
                exercises={exercises}
                icon={course.icon}
                note={note}
                resources={resources}
              />
            </FadeIn>
            <FadeIn
              key="lesson-side"
              delay={160}
              style={[styles.side, isNarrow && styles.fullWidth]}
            >
              <RoadmapCard units={units} />
            </FadeIn>
          </>
        ) : (
          <>
            <FadeIn key="ai-main" delay={80} style={[styles.main, isNarrow && styles.fullWidth]}>
              <ChatPanel
                aiMessages={aiMessages}
                helpRequested={helpRequested}
                onRequestHelp={() => (helpRequested ? setChatTab('teacher') : requestHelp())}
                onTabChange={setChatTab}
                tab={chatTab}
                teacher={teacher}
                teacherMessages={teacherMessages}
              />
            </FadeIn>
            <FadeIn
              key="ai-side"
              delay={160}
              style={[styles.side, styles.column, isNarrow && styles.fullWidth]}
            >
              <TaskSideCard {...task} />
              <TeacherHelpCard
                onOpenChat={() => setChatTab('teacher')}
                onRequest={requestHelp}
                requested={helpRequested}
                teacher={teacher}
              />
            </FadeIn>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: spacing.md, padding: spacing.lg },
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.md },
  stacked: { flexDirection: 'column' },
  column: { gap: spacing.md },
  main: { flex: 1.6, minWidth: 0 },
  side: { flex: 1, minWidth: 0 },
  fullWidth: { flexBasis: 'auto', width: '100%' },

  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  titleBlock: {
    alignItems: 'center',
    flex: 1.6,
    flexDirection: 'row',
    gap: spacing.md,
    minWidth: 0,
  },
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
  headerSide: { flex: 1, gap: spacing.sm, minWidth: 0 },
  progressCard: { gap: 8, paddingHorizontal: spacing.md, paddingVertical: 12 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 14 },
  progressValue: { color: brand.blueDeep, fontFamily: fontFamily.extrabold, fontSize: 14 },
  modes: {
    alignItems: 'flex-start',
    backgroundColor: colors.track,
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  mode: {
    alignItems: 'center',
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: 6,
    height: 44,
    justifyContent: 'center',
  },
  modeFlat: { marginBottom: 3 },
  modeText: { color: colors.text, fontFamily: fontFamily.medium, fontSize: 14 },
  modeTextActive: { color: brand.onBlue, fontFamily: fontFamily.bold },
});
