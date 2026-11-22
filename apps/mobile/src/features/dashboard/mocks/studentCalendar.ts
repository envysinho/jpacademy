/** Datos ficticios del Calendario del alumno. Solo visual; se reemplazan por la API más adelante. */

export type EventType = 'class' | 'task' | 'help';
export type EventIcon = 'book' | 'flask' | 'task' | 'help';

export const studentCalendarMock = {
  stats: [
    { caption: 'Por entregar', id: 's2', label: 'Tareas próximas', type: 'task', value: 3 },
    { caption: 'Programadas', id: 's3', label: 'Clases', type: 'class', value: 8 },
    {
      caption: 'Pendiente de docente',
      id: 's4',
      label: 'Solicitudes de ayuda',
      type: 'help',
      value: 1,
    },
  ] satisfies { caption: string; id: string; label: string; type: EventType; value: number }[],

  month: {
    title: 'Septiembre, 2025',
    /** Septiembre de 2025 empieza en lunes y tiene 30 días. */
    firstWeekday: 0,
    days: 30,
    today: 16,
    /** Tipos de evento por día (puntos bajo el número). */
    events: {
      10: ['class'],
      12: ['task'],
      16: ['class', 'task', 'help'],
      18: ['help'],
      23: ['task'],
    } as Record<number, EventType[]>,
  },

  day: {
    title: 'Hoy, mar. 16 de septiembre',
    items: [
      {
        duration: '60 min',
        icon: 'book',
        id: 'd1',
        subtitle: 'Clase en línea · Unidad 3',
        time: '08:00',
        title: 'Matemática',
        type: 'class',
      },
      {
        duration: '60 min',
        icon: 'flask',
        id: 'd2',
        subtitle: 'Clase en línea · El ciclo del agua',
        time: '09:30',
        title: 'Ciencia',
        type: 'class',
      },
      {
        icon: 'task',
        id: 'd3',
        status: 'Por entregar',
        subtitle: 'Vence hoy, 23:59',
        time: '11:00',
        title: 'Entrega: Funciones',
        type: 'task',
      },
      {
        duration: '30 min',
        icon: 'help',
        id: 'd4',
        subtitle: 'Prof. Camila Torres',
        time: '14:00',
        title: 'Asesoría con el docente',
        type: 'help',
      },
      {
        duration: '60 min',
        icon: 'book',
        id: 'd5',
        subtitle: 'Análisis de textos',
        time: '16:00',
        title: 'Comunicación',
        type: 'class',
      },
    ] satisfies {
      duration?: string;
      icon: EventIcon;
      id: string;
      status?: string;
      subtitle: string;
      time: string;
      title: string;
      type: EventType;
    }[],
  },

  upcoming: [
    { id: 'u1', subtitle: 'Mié, 17 sep. · 08:00 – 09:00', title: 'Clase: Álgebra', type: 'class' },
    {
      id: 'u2',
      subtitle: 'Jue, 18 sep. · Vence 23:59',
      title: 'Entrega: Ecuaciones',
      type: 'task',
    },
    {
      id: 'u3',
      subtitle: 'Vie, 19 sep. · 16:00 – 16:45',
      title: 'Asesoría de dudas (grupal)',
      type: 'help',
    },
  ] satisfies { id: string; subtitle: string; title: string; type: EventType }[],
};
