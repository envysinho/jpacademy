/**
 * DATOS DE DESARROLLO (mock) del detalle de un curso: temario, lección activa, material y chat
 * inicial de su tarea. Se usa el mismo contenido de muestra para cualquier curso; vendrá de la
 * API más adelante.
 *
 * Estados del temario (avance secuencial estricto): `done` = completada (no navegable),
 * `current` = única lección accesible, `pending` = bloqueada.
 */

export type LessonStatus = 'done' | 'current' | 'pending';
export type ResourceKind = 'pdf' | 'slides' | 'sheet';
/** Origen del material de estudio. `ai` = práctica generada con IA (cuando exista el servicio). */
export type MaterialSource = 'teacher' | 'ai';

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
  analysis?: { points: string[]; question: string; summary: string };
  /** Botones bajo el mensaje (p. ej. «Ver video del tema»); el id lo interpreta la pantalla. */
  actions?: { id: string; label: string }[];
};

export const courseDetailMock = {
  currentLesson: {
    duration: '12:34',
    lesson: 'Lección 2',
    title: 'Ecuaciones y funciones',
    unit: 'Unidad 3',
  },
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
  /** Resumen escrito de la lección activa (sustituye al antiguo selector Recursos/Ejercicios/Notas). */
  summary: {
    concepts: [
      'Función cuadrática: f(x) = ax² + bx + c',
      'Vértice: x = −b/(2a)',
      'Apertura según el signo de a',
    ],
    objectives: [
      'Reconocer una función cuadrática y sus coeficientes.',
      'Calcular el vértice y el eje de simetría.',
      'Esbozar la parábola a partir de pocos puntos.',
    ],
    text: 'Una ecuación relaciona expresiones mediante una igualdad; una función asigna a cada valor de x un único valor f(x). En esta lección pasamos de resolver ecuaciones a estudiar funciones cuadráticas y su gráfica, la parábola.',
  },
  /** Material de estudio de la lección activa. */
  materials: [
    {
      id: 'r1',
      kind: 'pdf',
      meta: 'PDF · 1,2 MB',
      name: 'Ejemplos resueltos: funciones cuadráticas',
      source: 'teacher',
    },
    {
      id: 'r2',
      kind: 'pdf',
      meta: 'PDF · 8 ejercicios',
      name: 'Práctica: vértice y raíces',
      source: 'ai',
    },
    {
      id: 'r3',
      kind: 'slides',
      meta: 'PPTX · 4,8 MB',
      name: 'Presentación de la clase',
      source: 'teacher',
    },
  ] satisfies {
    id: string;
    kind: ResourceKind;
    meta: string;
    name: string;
    source: MaterialSource;
  }[],
  /** Tarea asociada a la lección activa (id de `studentTasksMock`). */
  lessonTaskId: 't1',
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
