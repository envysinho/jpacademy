/**
 * Datos ficticios del detalle de un curso (roadmap, lección, chat y tarea). Solo visual: se usa
 * el mismo contenido de muestra para cualquier curso; vendrá de la base de datos más adelante.
 */

export type LessonStatus = 'done' | 'current' | 'pending';
export type ResourceKind = 'pdf' | 'slides' | 'sheet';

export type RoadmapItem = {
  duration?: string;
  id: string;
  kind: 'lesson' | 'task';
  status: LessonStatus;
  title: string;
};

export type RoadmapUnit = { id: string; items: RoadmapItem[]; title: string };

export type ChatMessage = {
  from: 'student' | 'ai' | 'teacher';
  id: string;
  time: string;
  text?: string;
  /** Mensaje estructurado de la IA. */
  title?: string;
  steps?: string[];
  attachment?: { name: string; size: string };
  analysis?: { estimate: string; points: string[]; question: string; summary: string };
};

export const courseDetailMock = {
  currentLesson: {
    duration: '12:34',
    lesson: 'Lección 2',
    title: 'Ecuaciones y funciones',
    unit: 'Unidad 3',
  },
  teacher: 'Prof. Valeria Ríos',
  units: [
    {
      id: 'u1',
      items: [
        { duration: '06:10', id: 'u1l1', kind: 'lesson', status: 'done', title: 'Números reales' },
        { duration: '09:40', id: 'u1l2', kind: 'lesson', status: 'done', title: 'Operaciones' },
        { duration: '07:55', id: 'u1l3', kind: 'lesson', status: 'done', title: 'Potencias' },
      ],
      title: 'Unidad 1: Fundamentos',
    },
    {
      id: 'u2',
      items: [
        {
          duration: '08:30',
          id: 'u2l1',
          kind: 'lesson',
          status: 'done',
          title: 'Expresiones algebraicas',
        },
        {
          duration: '10:05',
          id: 'u2l2',
          kind: 'lesson',
          status: 'done',
          title: 'Productos notables',
        },
        { duration: '11:20', id: 'u2l3', kind: 'lesson', status: 'done', title: 'Factorización' },
        {
          duration: '09:00',
          id: 'u2l4',
          kind: 'lesson',
          status: 'done',
          title: 'Fracciones algebraicas',
        },
      ],
      title: 'Unidad 2: Álgebra',
    },
    {
      id: 'u3',
      items: [
        { duration: '08:20', id: 'u3l1', kind: 'lesson', status: 'done', title: 'Introducción' },
        {
          duration: '12:34',
          id: 'u3l2',
          kind: 'lesson',
          status: 'current',
          title: 'Ecuaciones y funciones',
        },
        {
          duration: '10:15',
          id: 'u3l3',
          kind: 'lesson',
          status: 'pending',
          title: 'Tipos de funciones',
        },
        {
          duration: '14:08',
          id: 'u3l4',
          kind: 'lesson',
          status: 'pending',
          title: 'Problemas aplicados',
        },
        { id: 'u3t1', kind: 'task', status: 'pending', title: 'Tarea: Funciones cuadráticas' },
      ],
      title: 'Unidad 3: Ecuaciones y funciones',
    },
    {
      id: 'u4',
      items: [
        {
          duration: '09:30',
          id: 'u4l1',
          kind: 'lesson',
          status: 'pending',
          title: 'Modelos lineales',
        },
        {
          duration: '11:45',
          id: 'u4l2',
          kind: 'lesson',
          status: 'pending',
          title: 'Modelos cuadráticos',
        },
        {
          duration: '13:00',
          id: 'u4l3',
          kind: 'lesson',
          status: 'pending',
          title: 'Proyecto final',
        },
      ],
      title: 'Unidad 4: Aplicaciones',
    },
  ] satisfies RoadmapUnit[],
  resources: [
    { id: 'r1', kind: 'pdf', meta: 'PDF · 1,2 MB', name: 'Resumen: Ecuaciones y funciones' },
    { id: 'r2', kind: 'slides', meta: 'PPTX · 4,8 MB', name: 'Presentación de la clase' },
    { id: 'r3', kind: 'sheet', meta: 'XLSX · 320 KB', name: 'Ejercicios propuestos' },
  ] satisfies { id: string; kind: ResourceKind; meta: string; name: string }[],
  exercises: [
    { done: true, id: 'e1', title: 'Identifica a, b y c en 5 funciones' },
    { done: true, id: 'e2', title: 'Calcula el vértice de cada parábola' },
    { done: false, id: 'e3', title: 'Grafica f(x) = x² − 4x + 3' },
  ],
  note: 'El vértice está en x = −b/(2a). Si a > 0 la parábola abre hacia arriba.',
  task: { attempts: '1 de 3', due: '20 sep, 23:59', title: 'Funciones cuadráticas' },
  aiMessages: [
    {
      from: 'student',
      id: 'm1',
      text: 'No entiendo cómo graficar una función cuadrática, ¿me puedes explicar?',
      time: '15:24',
    },
    {
      from: 'ai',
      id: 'm2',
      steps: [
        'Identifica a, b y c.',
        'Calcula el vértice: x = −b/(2a).',
        'Determina la apertura (a > 0 hacia arriba, a < 0 hacia abajo).',
        'Usa algunos puntos y dibuja la parábola.',
      ],
      text: 'Una función cuadrática tiene la forma f(x) = ax² + bx + c. Su gráfica es una parábola.',
      time: '15:24',
      title: 'Pasos para graficarla',
    },
    {
      attachment: { name: 'Tarea_Funciones.pdf', size: '1,2 MB' },
      from: 'student',
      id: 'm3',
      text: '¿Puedes revisar mi tarea y decirme si está bien?',
      time: '15:30',
    },
    {
      analysis: {
        estimate: '18/20',
        points: [
          'Explicar con más detalle el cálculo del vértice.',
          'Revisar la notación en el paso 3 (f(x) en lugar de y).',
        ],
        question: '¿Quieres que te muestre la versión corregida?',
        summary:
          'Tus procedimientos son correctos y la gráfica está bien construida. Te recomendaría:',
      },
      from: 'ai',
      id: 'm4',
      time: '15:31',
    },
  ] satisfies ChatMessage[],
  teacherMessages: [
    {
      from: 'teacher',
      id: 't1',
      text: 'Hola, Juan. Vi tu consulta sobre el vértice. ¿En qué paso te trabaste?',
      time: '15:40',
    },
    {
      from: 'student',
      id: 't2',
      text: 'En el paso 3, no sé cuándo usar f(x) y cuándo y.',
      time: '15:42',
    },
  ] satisfies ChatMessage[],
};
