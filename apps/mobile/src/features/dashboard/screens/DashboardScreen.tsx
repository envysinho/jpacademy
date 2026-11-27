import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DashboardShell } from '../components/DashboardShell';
import { StudentSessionProvider, type ChatTab } from '../data/StudentSession';
import { reinforcementCalendarEvents } from '../mocks/studentCalendar';
import { findTask } from '../mocks/studentTasks';

import { StudentCalendar } from './StudentCalendar';
import { StudentCourses } from './StudentCourses';
import { StudentHome } from './StudentHome';
import { StudentProgress } from './StudentProgress';
import { StudentTasks } from './StudentTasks';
import { TaskWorkspace } from './TaskWorkspace';

type Workspace = { from: string; tab: ChatTab; taskId: string };

/**
 * Dashboard del alumno. Temporal: la navegación es estado local hasta que use rutas reales
 * (DASHBOARD.md §6). Aquí se coordina lo que cruza secciones: abrir el curso activo desde el
 * Inicio y el espacio de resolución compartido por Cursos y Tareas.
 */
export function DashboardScreen({ onSignOut }: { onSignOut: () => void }) {
  const [activeKey, setActiveKey] = useState('home');
  const [openCourseId, setOpenCourseId] = useState<string>();
  const [workspace, setWorkspace] = useState<Workspace>();
  const workspaceTask = findTask(workspace?.taskId);

  const select = (key: string) => {
    setWorkspace(undefined);
    setActiveKey(key);
  };

  const resolveTask = (taskId: string, tab: ChatTab = 'ai') =>
    setWorkspace({ from: activeKey, tab, taskId });

  return (
    <StudentSessionProvider>
      <DashboardShell activeKey={activeKey} onSelect={select} onSignOut={onSignOut} role="STUDENT">
        {/* La sección de origen sigue montada (oculta) para conservar su estado al volver. */}
        <View style={[styles.fill, workspaceTask && styles.hidden]}>
          {activeKey === 'home' && (
            <StudentHome
              onOpenCourses={() => select('courses')}
              onResume={(courseId) => {
                setOpenCourseId(courseId);
                select('courses');
              }}
            />
          )}
          {activeKey === 'courses' && (
            <StudentCourses
              onCloseCourse={() => setOpenCourseId(undefined)}
              onOpenCourse={setOpenCourseId}
              onResolveTask={resolveTask}
              openCourseId={openCourseId}
            />
          )}
          {activeKey === 'calendar' && (
            <StudentCalendar
              emptyAction={{ label: 'Continuar aprendiendo', onPress: () => select('home') }}
              events={reinforcementCalendarEvents}
            />
          )}
          {activeKey === 'tasks' && <StudentTasks onResolveTask={resolveTask} />}
          {activeKey === 'progress' && <StudentProgress />}
        </View>
        {workspaceTask && workspace && (
          <TaskWorkspace
            key={workspaceTask.id}
            initialTab={workspace.tab}
            onBack={() => setWorkspace(undefined)}
            task={workspaceTask}
          />
        )}
      </DashboardShell>
    </StudentSessionProvider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  hidden: { display: 'none' },
});
