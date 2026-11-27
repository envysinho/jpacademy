/**
 * DATOS DE DESARROLLO (mock) del Calendario. La academia es **asincrónica**: cada alumno avanza a
 * su ritmo, así que no hay clases diarias ni fechas de lecciones. Solo se muestran eventos con
 * fecha: entregas (salen de las tareas con `dueDate`), asesorías agendadas y simulacros o
 * actividades especiales. Las solicitudes de ayuda inmediatas no van aquí (irán en Atenciones).
 */

import { studentTasksMock } from './studentTasks';

export type EventType = 'task' | 'help' | 'activity';

export type CalendarEvent = {
  /** AAAA-MM-DD. */
  date: string;
  duration?: string;
  id: string;
  status?: string;
  subtitle: string;
  time: string;
  title: string;
  type: EventType;
};

/** Mes mostrado en el prototipo: septiembre de 2025 empieza en lunes y tiene 30 días. */
export const calendarMonth = {
  days: 30,
  firstWeekday: 0,
  monthIndex: 8,
  title: 'Septiembre, 2025',
  today: 16,
  year: 2025,
};

/** Entregas: tareas pendientes con fecha límite (misma fuente que Tareas). */
const deliveries: CalendarEvent[] = studentTasksMock
  .filter((task) => task.status === 'pending' && task.dueDate)
  .map((task) => ({
    date: task.dueDate ?? '',
    id: `due-${task.id}`,
    status: 'Por entregar',
    subtitle: `${task.subject} · vence 23:59`,
    time: '23:59',
    title: `Entrega: ${task.title}`,
    type: 'task',
  }));

/** Asesorías y actividades con fecha (simuladas). */
const scheduled: CalendarEvent[] = [
  {
    date: '2025-09-16',
    duration: '30 min',
    id: 'h1',
    subtitle: 'Con tu docente · Álgebra',
    time: '16:00',
    title: 'Asesoría agendada',
    type: 'help',
  },
  {
    date: '2025-09-20',
    duration: '90 min',
    id: 'a1',
    subtitle: 'Matemática y Comunicación',
    time: '09:00',
    title: 'Simulacro de examen',
    type: 'activity',
  },
  {
    date: '2025-09-23',
    duration: '30 min',
    id: 'h2',
    subtitle: 'Con tu docente · Ciencia',
    time: '15:30',
    title: 'Asesoría agendada',
    type: 'help',
  },
  {
    date: '2025-09-27',
    duration: '60 min',
    id: 'a2',
    subtitle: 'Feria de ciencias virtual',
    time: '10:00',
    title: 'Actividad especial',
    type: 'activity',
  },
];

export const reinforcementCalendarEvents: CalendarEvent[] = [...deliveries, ...scheduled];
