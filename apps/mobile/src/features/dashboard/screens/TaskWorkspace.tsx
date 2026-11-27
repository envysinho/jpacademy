import { ArrowLeft, CircleCheck, Info, Upload, X } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FadeIn } from '@/components/FadeIn';
import { Raised3D } from '@/components/Raised3D';
import { brand, categories, colors, fontFamily, radius, spacing } from '@/theme';

import { ChatPanel, type ChatTab } from '../components/course-detail/ChatPanel';
import {
  TaskActionButton,
  TaskSideCard,
  TeacherHelpCard,
} from '../components/course-detail/SidePanels';
import { CourseBanner } from '../components/courses/CourseBanner';
import { courseColors } from '../components/courses/courseVisuals';
import { taskStatusPill } from '../components/tasks/taskVisuals';
import { useStudentSession } from '../data/StudentSession';
import { findCourse } from '../mocks/studentCourses';
import type { StudentTask } from '../mocks/studentTasks';

/** Por debajo de este ancho de contenido, chat y tarea se apilan. */
const NARROW_WIDTH = 760;

/**
 * Espacio compartido de resolución de una tarea (antigua vista «Asistente IA»). Se abre con
 * «Resolver tarea» desde Cursos → Recursos y desde Tareas; ambos usan este componente y el mismo
 * historial por tarea. Abrirlo o consultar en el chat no consume intentos; «Entregar tarea» es
 * la entrega formal.
 *
 * DESARROLLO: no hay API de entregas ni evaluación. La entrega se registra solo en memoria y se
 * indica como tal; no se simula ninguna nota.
 */
export function TaskWorkspace({
  initialTab = 'ai',
  onBack,
  onMessageAction,
  task,
}: {
  initialTab?: ChatTab;
  onBack: () => void;
  /** Botones dentro de los mensajes del chat (los interpreta cada modalidad). */
  onMessageAction?: (actionId: string) => void;
  task: StudentTask;
}) {
  const { getThread, requestHelp, sendMessage, setDraft, submit } = useStudentSession();
  const [tab, setTab] = useState<ChatTab>(initialTab);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const isNarrow = contentWidth > 0 && contentWidth < NARROW_WIDTH;

  const thread = getThread(task.id);
  const course = findCourse(task.courseId);
  const pill = taskStatusPill(task, thread.submittedInSession);

  // Entregada, calificada o vencida: ya no admite entregas.
  const isClosed = task.status !== 'pending';
  const attemptsLeft = task.attempts.max - thread.attemptsUsed;
  const canSubmit = !isClosed && !thread.submittedInSession && attemptsLeft > 0;

  const askForHelp = () => {
    requestHelp(task.id);
    setTab('teacher');
  };

  const confirmSubmit = () => {
    setConfirmOpen(false);
    submit(task.id);
  };

  const header = (
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
        color={task.color}
        icon={task.icon}
        style={styles.thumb}
        uid={`workspace-${task.id}`}
      />
      <View style={styles.flex}>
        <Text numberOfLines={1} style={[styles.eyebrow, { color: courseColors[task.color].ink }]}>
          {course?.title ?? task.subject} · {task.lessonLabel}
        </Text>
        <Text numberOfLines={1} style={styles.title}>
          {task.title}
        </Text>
      </View>
      <View style={[styles.pill, { backgroundColor: pill.background }]}>
        <Text style={[styles.pillText, { color: pill.color }]}>{pill.label}</Text>
      </View>
    </FadeIn>
  );

  const chat = (
    <ChatPanel
      draft={thread.drafts[tab]}
      helpRequested={thread.helpRequested}
      messages={thread[tab]}
      onChangeDraft={(text) => setDraft(task.id, tab, text)}
      onRequestHelp={() => (thread.helpRequested ? setTab('teacher') : askForHelp())}
      onSend={() => {
        const text = thread.drafts[tab].trim();
        if (text) sendMessage(task.id, tab, text);
      }}
      onAction={onMessageAction}
      onTabChange={setTab}
      tab={tab}
    />
  );

  const side = (
    <>
      <TaskSideCard
        action={
          <View style={styles.actionBlock}>
            {thread.submittedInSession && (
              <View style={styles.notice}>
                <CircleCheck color={categories.green.ink} size={16} strokeWidth={2.4} />
                <Text style={[styles.noticeText, styles.flex]}>
                  Entrega registrada solo en esta sesión de demostración: aún no se envía ni se
                  evalúa.
                </Text>
              </View>
            )}
            {!isClosed && !thread.submittedInSession && attemptsLeft <= 0 && (
              <View style={styles.notice}>
                <Info color={colors.textMuted} size={16} strokeWidth={2.2} />
                <Text style={[styles.noticeText, styles.flex]}>
                  Agotaste tus intentos. Pide ayuda a tu docente para continuar.
                </Text>
              </View>
            )}
            {!isClosed && (
              <TaskActionButton
                disabled={!canSubmit}
                hint="Entrega formal para evaluación. Cuenta como un intento."
                icon={Upload}
                label="Entregar tarea"
                onPress={() => setConfirmOpen(true)}
              />
            )}
          </View>
        }
        attemptsUsed={thread.attemptsUsed}
        showInstructions
        submittedInSession={thread.submittedInSession}
        task={task}
      />
      <TeacherHelpCard
        onOpenChat={() => setTab('teacher')}
        onRequest={askForHelp}
        requested={thread.helpRequested}
      />
    </>
  );

  return (
    <View onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)} style={styles.root}>
      {isNarrow ? (
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {header}
          <View style={styles.narrowChat}>{chat}</View>
          {side}
        </ScrollView>
      ) : (
        <View style={styles.wide}>
          {header}
          <View style={styles.row}>
            <FadeIn delay={80} style={styles.main}>
              {chat}
            </FadeIn>
            <FadeIn delay={140} style={styles.side}>
              <ScrollView
                contentContainerStyle={styles.sideContent}
                showsVerticalScrollIndicator={false}
              >
                {side}
              </ScrollView>
            </FadeIn>
          </View>
        </View>
      )}

      <Modal
        animationType="fade"
        onRequestClose={() => setConfirmOpen(false)}
        transparent
        visible={confirmOpen}
      >
        <View style={styles.modalBackdrop}>
          <View pointerEvents="none" style={styles.modalScrim} />
          <View style={styles.modalPanel}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>¿Entregar la tarea?</Text>
              <Pressable
                accessibilityLabel="Cancelar"
                accessibilityRole="button"
                onPress={() => setConfirmOpen(false)}
                style={styles.close}
              >
                <X color={colors.text} size={20} />
              </Pressable>
            </View>
            <Text style={styles.modalBody}>
              Es la entrega formal para evaluación y contará como intento {thread.attemptsUsed + 1}{' '}
              de {task.attempts.max}. Las consultas en el chat no cuentan como intento.
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setConfirmOpen(false)}
                style={styles.flex}
              >
                {({ pressed }) => (
                  <Raised3D faceStyle={styles.modalButton} pressed={pressed} variant="white">
                    <Text style={styles.modalButtonText}>Seguir resolviendo</Text>
                  </Raised3D>
                )}
              </Pressable>
              <Pressable accessibilityRole="button" onPress={confirmSubmit} style={styles.flex}>
                {({ pressed }) => (
                  <Raised3D faceStyle={styles.modalButton} pressed={pressed} variant="primary">
                    <Text style={[styles.modalButtonText, styles.onBlue]}>Entregar</Text>
                  </Raised3D>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: { gap: spacing.md, padding: spacing.lg },
  wide: { flex: 1, gap: spacing.md, padding: spacing.lg },
  row: { flex: 1, flexDirection: 'row', gap: spacing.md },
  main: { flex: 1.6, minWidth: 0 },
  side: { flex: 1, minWidth: 0 },
  sideContent: { gap: spacing.md, paddingBottom: spacing.xs },
  narrowChat: { height: 560 },

  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  back: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  thumb: { height: 56, width: 56 },
  eyebrow: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontFamily: fontFamily.extrabold,
    fontSize: 24,
    letterSpacing: -0.6,
  },
  pill: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  pillText: { fontFamily: fontFamily.semibold, fontSize: 13 },

  actionBlock: { gap: spacing.sm },
  notice: {
    alignItems: 'flex-start',
    backgroundColor: colors.track,
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: 10,
  },
  noticeText: {
    color: colors.textMuted,
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 17,
  },

  modalBackdrop: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: spacing.lg },
  modalScrim: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: brand.blueNight,
    opacity: 0.3,
  },
  modalPanel: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    gap: spacing.md,
    maxWidth: 520,
    padding: spacing.lg,
    width: '100%',
  },
  modalHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  modalTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 18 },
  close: { alignItems: 'center', height: 48, justifyContent: 'center', width: 48 },
  modalBody: {
    color: colors.textMuted,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  modalActions: { flexDirection: 'row', gap: spacing.sm },
  modalButton: { alignItems: 'center', height: 48, justifyContent: 'center' },
  modalButtonText: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 15 },
  onBlue: { color: brand.onBlue },
});
