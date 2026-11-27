import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { courseDetailMock, type ChatMessage } from '../mocks/courseDetail';
import { findTask } from '../mocks/studentTasks';

export type ChatTab = 'ai' | 'teacher';

/**
 * Estado de la resolución de una tarea: historial por canal, borradores, solicitud al docente y
 * entrega. Uno por tarea, compartido por Cursos y Tareas (mismo historial venga de donde venga).
 *
 * DESARROLLO: vive solo en memoria durante la sesión. No hay API de chat, IA ni entregas; nada de
 * esto se envía ni se persiste.
 */
export type TaskThread = {
  ai: ChatMessage[];
  /** Intentos de entrega formal usados (parte del dato de la tarea). */
  attemptsUsed: number;
  drafts: Record<ChatTab, string>;
  helpRequested: boolean;
  /** Entrega registrada en esta sesión (demostración, no enviada). */
  submittedInSession: boolean;
  teacher: ChatMessage[];
};

type SessionValue = {
  /** Añade mensajes al historial (p. ej. la respuesta simulada tras subir una tarea). */
  appendMessages: (taskId: string, tab: ChatTab, messages: Omit<ChatMessage, 'time'>[]) => void;
  getThread: (taskId: string) => TaskThread;
  requestHelp: (taskId: string) => void;
  sendMessage: (taskId: string, tab: ChatTab, text: string) => void;
  setDraft: (taskId: string, tab: ChatTab, text: string) => void;
  submit: (taskId: string) => void;
};

const SessionContext = createContext<SessionValue | null>(null);

/** Historial inicial de ejemplo (solo la tarea de la lección activa tiene conversación previa). */
function initialThread(taskId: string): TaskThread {
  const task = findTask(taskId);
  const seeded = taskId === courseDetailMock.lessonTaskId;
  return {
    ai: seeded ? courseDetailMock.aiMessages : [],
    attemptsUsed: task?.attempts.used ?? 0,
    drafts: { ai: '', teacher: '' },
    helpRequested: false,
    submittedInSession: false,
    teacher: seeded ? courseDetailMock.teacherMessages : [],
  };
}

function timeNow() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export function StudentSessionProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<Record<string, TaskThread>>({});

  const getThread = useCallback(
    (taskId: string) => threads[taskId] ?? initialThread(taskId),
    [threads],
  );

  const update = useCallback((taskId: string, change: (thread: TaskThread) => TaskThread) => {
    setThreads((current) => ({
      ...current,
      [taskId]: change(current[taskId] ?? initialThread(taskId)),
    }));
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      appendMessages: (taskId, tab, messages) =>
        update(taskId, (thread) => ({
          ...thread,
          [tab]: [...thread[tab], ...messages.map((message) => ({ ...message, time: timeNow() }))],
        })),
      getThread,
      requestHelp: (taskId) => update(taskId, (thread) => ({ ...thread, helpRequested: true })),
      sendMessage: (taskId, tab, text) =>
        update(taskId, (thread) => ({
          ...thread,
          drafts: { ...thread.drafts, [tab]: '' },
          [tab]: [
            ...thread[tab],
            { from: 'student', id: `local-${Date.now()}`, text, time: timeNow() },
          ],
        })),
      setDraft: (taskId, tab, text) =>
        update(taskId, (thread) => ({ ...thread, drafts: { ...thread.drafts, [tab]: text } })),
      submit: (taskId) =>
        update(taskId, (thread) =>
          thread.submittedInSession
            ? thread
            : { ...thread, attemptsUsed: thread.attemptsUsed + 1, submittedInSession: true },
        ),
    }),
    [getThread, update],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useStudentSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useStudentSession debe usarse dentro de StudentSessionProvider');
  return value;
}
