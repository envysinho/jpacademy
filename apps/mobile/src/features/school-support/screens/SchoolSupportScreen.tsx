import { X } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DashboardShell } from '@/features/dashboard/components/DashboardShell';
import { schoolSupportNavigation } from '@/features/dashboard/config/roleNavigation';
import {
  StudentSessionProvider,
  useStudentSession,
  type ChatTab,
} from '@/features/dashboard/data/StudentSession';
import type { ChatMessage } from '@/features/dashboard/mocks/courseDetail';
import type { StudentTask } from '@/features/dashboard/mocks/studentTasks';
import { StudentCalendar } from '@/features/dashboard/screens/StudentCalendar';
import { TaskWorkspace } from '@/features/dashboard/screens/TaskWorkspace';
import { brand, colors, fontFamily, radius, spacing } from '@/theme';

import { ScanTaskModal } from '../components/ScanTaskModal';
import {
  findTopic,
  practicedTopicsSeed,
  schoolCalendarEvents,
  schoolTasksSeed,
  topicsCatalog,
  weeklyPracticeSeed,
  type SchoolTask,
  type TaskBlock,
} from '../mocks/schoolSupport';

import { LearnScreen } from './LearnScreen';
import { SchoolHome } from './SchoolHome';
import { SchoolProgress } from './SchoolProgress';
import { SchoolTasks } from './SchoolTasks';
import { TopicSession } from './TopicSession';

/**
 * Adapta una tarea escolar al formato del espacio de resolución compartido (mismo componente
 * que reforzamiento). Sin puntaje oficial: la revisión es interna y simulada.
 */
function toWorkspaceTask(task: SchoolTask): StudentTask {
  const topic = findTopic(task.blocks[0]?.topicId);
  return {
    attachments: [{ kind: task.fileName.endsWith('.pdf') ? 'pdf' : 'image', name: task.fileName }],
    attempts: { max: 3, used: 0 },
    color: topic?.color ?? 'brand',
    courseId: '',
    dueLabel: task.dueLabel ?? 'Sin fecha',
    icon: topic?.icon ?? 'book',
    id: task.id,
    instructions: task.blocks.flatMap((block) => block.exercises).join(' '),
    lessonLabel: 'Acompañamiento escolar',
    points: 20,
    progress: { done: 0, total: task.blocks.length },
    status: 'pending',
    subject: task.subject,
    title: task.title,
    type: 'Tarea',
  };
}

/**
 * Primeros mensajes del chat de una tarea: la tarea subida y la respuesta **simulada** del
 * asistente con los temas encontrados (botones para ver el video de cada tema o corregirlo).
 */
function uploadMessages(task: SchoolTask): Omit<ChatMessage, 'time'>[] {
  const stamp = Date.now();
  return [
    {
      attachment: {
        name: task.fileName,
        size: task.fileName.endsWith('.pdf') ? 'PDF' : 'Foto',
      },
      from: 'student',
      id: `up-${stamp}`,
      text: 'Esta es mi tarea.',
    },
    {
      actions: [
        ...task.blocks.map((block) => ({
          id: `topic:${block.topicId}`,
          label: `Ver video: ${findTopic(block.topicId)?.title ?? 'tema'}`,
        })),
        { id: 'fix', label: 'No es ese tema' },
      ],
      from: 'ai',
      id: `ai-${stamp}`,
      steps: task.blocks.map(
        (block) =>
          `${findTopic(block.topicId)?.title ?? 'Tema'} (${block.exercises.length} ${
            block.exercises.length === 1 ? 'ejercicio' : 'ejercicios'
          })`,
      ),
      text: `Recibí tu tarea de ${task.subject} (análisis simulado). Encontré ${
        task.blocks.length === 1 ? 'este tema' : 'estos temas'
      }:`,
    },
    {
      from: 'ai',
      id: `ai2-${stamp}`,
      text: 'Mira el video del tema, resuelve tus ejercicios y súbeme tu solución por aquí: te diré si está validada. Si sigues con dudas, pídele ayuda a tu docente en la pestaña «Docente».',
    },
  ];
}

type OpenTopic = { blockIndex?: number; taskId?: string; topicId: string };

/** Corregir el tema detectado de cada bloque de una tarea. */
function TopicFixModal({
  blocks,
  onChange,
  onClose,
}: {
  blocks: TaskBlock[];
  onChange: (blockIndex: number, topicId: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible>
      <View style={styles.backdrop}>
        <View pointerEvents="none" style={styles.scrim} />
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>¿Qué tema es realmente?</Text>
            <Pressable
              accessibilityLabel="Cerrar"
              accessibilityRole="button"
              onPress={onClose}
              style={styles.close}
            >
              <X color={colors.text} size={20} strokeWidth={2.4} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.blocks}>
            {blocks.map((block, index) => (
              <View key={`${block.topicId}-${index}`} style={styles.block}>
                <Text style={styles.blockLabel}>
                  Bloque {index + 1}: {block.exercises[0]}
                </Text>
                <View style={styles.options}>
                  {topicsCatalog.map((topic) => {
                    const isActive = topic.id === block.topicId;
                    return (
                      <Pressable
                        key={topic.id}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isActive }}
                        onPress={() => onChange(index, topic.id)}
                        style={[styles.option, isActive && styles.optionActive]}
                      >
                        <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                          {topic.title}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/** Contenido del portal (dentro del proveedor de chats por tarea). */
function SchoolSupportPortal({ onSignOut }: { onSignOut: () => void }) {
  const { appendMessages, getThread } = useStudentSession();
  const [activeKey, setActiveKey] = useState('home');
  const [tasks, setTasks] = useState<SchoolTask[]>(schoolTasksSeed);
  const [practiced, setPracticed] = useState(practicedTopicsSeed);
  const [openTopic, setOpenTopic] = useState<OpenTopic>();
  const [scanOpen, setScanOpen] = useState(false);
  const [fixTaskId, setFixTaskId] = useState<string>();
  const [focusSearch, setFocusSearch] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  const [workspace, setWorkspace] = useState<{ tab: ChatTab; taskId: string }>();

  const select = (key: string) => {
    setWorkspace(undefined);
    setOpenTopic(undefined);
    setFocusSearch(false);
    setActiveKey(key);
  };

  /** Abre la sesión de un tema y lo registra como practicado hoy. */
  const openSession = (topic: OpenTopic) => {
    setWorkspace(undefined);
    setOpenTopic(topic);
    setPracticed((current) => [
      {
        lastLabel: 'Hoy',
        sessions: (current.find((item) => item.topicId === topic.topicId)?.sessions ?? 0) + 1,
        topicId: topic.topicId,
      },
      ...current.filter((item) => item.topicId !== topic.topicId),
    ]);
  };

  /** Entrar a una tarea = abrir su chat (con el análisis simulado si es la primera vez). */
  const enterTask = (task: SchoolTask) => {
    if (getThread(task.id).ai.length === 0) appendMessages(task.id, 'ai', uploadMessages(task));
    setWorkspace({ tab: 'ai', taskId: task.id });
  };

  const enterTaskById = (taskId: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (task) enterTask(task);
  };

  const handleUploaded = useCallback(
    (result: { blocks: TaskBlock[]; fileName: string; subject: string }) => {
      const task: SchoolTask = {
        blocks: result.blocks,
        createdLabel: 'Hoy',
        fileName: result.fileName,
        id: `scan-${Date.now()}`,
        status: 'studying',
        subject: result.subject,
        title: `Tarea de ${result.subject}`,
      };
      setTasks((current) => [task, ...current]);
      setScanOpen(false);
      setOpenTopic(undefined);
      appendMessages(task.id, 'ai', uploadMessages(task));
      setWorkspace({ tab: 'ai', taskId: task.id });
    },
    [appendMessages],
  );

  const workspaceTask = tasks.find((task) => task.id === workspace?.taskId);
  const fixTask = tasks.find((task) => task.id === fixTaskId);
  const topic = findTopic(openTopic?.topicId);
  const sessionTask = tasks.find((task) => task.id === openTopic?.taskId);

  const content = (() => {
    if (topic) {
      return (
        <TopicSession
          block={
            sessionTask && openTopic?.blockIndex !== undefined
              ? sessionTask.blocks[openTopic.blockIndex]
              : sessionTask?.blocks.find((block) => block.topicId === topic.id)
          }
          onBack={() => setOpenTopic(undefined)}
          onResolve={enterTaskById}
          task={sessionTask}
          topic={topic}
        />
      );
    }
    switch (activeKey) {
      case 'learn':
        return (
          <LearnScreen
            autoFocusSearch={focusSearch}
            currentTopicId={practiced[0]?.topicId}
            onOpenTopic={(topicId) => openSession({ topicId })}
            onScan={() => setScanOpen(true)}
          />
        );
      case 'tasks':
        return (
          <SchoolTasks
            initialTaskId={selectedTaskId}
            onOpenTopic={(topicId, taskId) => openSession({ taskId, topicId })}
            onResolve={enterTaskById}
            onScan={() => setScanOpen(true)}
            tasks={tasks}
          />
        );
      case 'calendar':
        return (
          <StudentCalendar
            emptyAction={{ label: 'Subir una tarea', onPress: () => setScanOpen(true) }}
            events={schoolCalendarEvents}
          />
        );
      case 'progress':
        return <SchoolProgress practiced={practiced} tasks={tasks} weekly={weeklyPracticeSeed} />;
      default:
        return (
          <SchoolHome
            onOpenTask={(taskId) => {
              setSelectedTaskId(taskId);
              enterTaskById(taskId);
            }}
            onOpenTopic={(topicId) => openSession({ topicId })}
            onScan={() => setScanOpen(true)}
            onSearch={() => {
              select('learn');
              setFocusSearch(true);
            }}
            practiced={practiced}
            tasks={tasks}
          />
        );
    }
  })();

  return (
    <>
      <DashboardShell
        activeKey={activeKey}
        items={schoolSupportNavigation}
        onSelect={select}
        onSignOut={onSignOut}
        role="STUDENT"
      >
        {/* La vista de origen queda montada (oculta) para conservar su estado al volver. */}
        <View style={[styles.fill, workspaceTask && styles.hidden]}>{content}</View>
        {workspaceTask && workspace && (
          <TaskWorkspace
            key={workspaceTask.id}
            initialTab={workspace.tab}
            onBack={() => setWorkspace(undefined)}
            onMessageAction={(actionId) => {
              if (actionId === 'fix') {
                setFixTaskId(workspaceTask.id);
              } else if (actionId.startsWith('topic:')) {
                const topicId = actionId.slice('topic:'.length);
                openSession({ taskId: workspaceTask.id, topicId });
              }
            }}
            task={toWorkspaceTask(workspaceTask)}
          />
        )}
      </DashboardShell>

      {scanOpen && <ScanTaskModal onClose={() => setScanOpen(false)} onUploaded={handleUploaded} />}

      {fixTask && (
        <TopicFixModal
          blocks={fixTask.blocks}
          onChange={(blockIndex, topicId) => {
            setTasks((current) =>
              current.map((task) =>
                task.id === fixTask.id
                  ? {
                      ...task,
                      blocks: task.blocks.map((block, index) =>
                        index === blockIndex ? { ...block, topicId } : block,
                      ),
                    }
                  : task,
              ),
            );
            appendMessages(fixTask.id, 'ai', [
              {
                actions: [
                  {
                    id: `topic:${topicId}`,
                    label: `Ver video: ${findTopic(topicId)?.title ?? 'tema'}`,
                  },
                ],
                from: 'ai',
                id: `fix-${Date.now()}`,
                text: `Gracias, corregí el bloque ${blockIndex + 1}: ahora es «${
                  findTopic(topicId)?.title ?? 'tema'
                }».`,
              },
            ]);
            setFixTaskId(undefined);
          }}
          onClose={() => setFixTaskId(undefined)}
        />
      )}
    </>
  );
}

/**
 * Portal del alumno de **Acompañamiento escolar** (modalidad `SCHOOL_SUPPORT`). Mismo shell y
 * estilo que reforzamiento, con su propia navegación: Inicio, Aprender, Mis tareas, Calendario
 * y Progreso. Entrar a una tarea abre su chat (Asistente IA / Docente). Datos demo en memoria.
 */
export function SchoolSupportScreen({ onSignOut }: { onSignOut: () => void }) {
  return (
    <StudentSessionProvider>
      <SchoolSupportPortal onSignOut={onSignOut} />
    </StudentSessionProvider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  hidden: { display: 'none' },
  backdrop: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: spacing.lg },
  scrim: {
    backgroundColor: brand.blueNight,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    gap: spacing.md,
    maxHeight: '92%',
    maxWidth: 640,
    padding: spacing.lg,
    width: '100%',
  },
  panelHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  panelTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 18 },
  close: { alignItems: 'center', height: 48, justifyContent: 'center', width: 48 },
  blocks: { gap: spacing.md },
  block: { gap: spacing.sm },
  blockLabel: { color: colors.textMuted, fontFamily: fontFamily.semibold, fontSize: 13 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  option: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 14,
  },
  optionActive: { backgroundColor: brand.blueSoft, borderColor: brand.blue },
  optionText: { color: colors.text, fontFamily: fontFamily.medium, fontSize: 13 },
  optionTextActive: { color: brand.blueDeep, fontFamily: fontFamily.bold },
});
