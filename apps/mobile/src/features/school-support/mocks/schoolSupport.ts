/**
 * DATOS DE DESARROLLO (mock) de la modalidad **Acompañamiento escolar**. El alumno aprende a
 * partir de tareas de su colegio (escaneadas) o buscando un tema; no recorre un curso completo.
 *
 * Nada de esto viene de OCR ni de IA reales: el «análisis» de una tarea escaneada devuelve
 * resultados fijos de ejemplo. Los ejercicios son ilustrativos y no están validados por IA.
 */

import type { CourseColor, CourseIcon } from '@/features/dashboard/mocks/studentCourses';

export type Topic = {
  area: string;
  color: CourseColor;
  examples: { problem: string; solution: string }[];
  icon: CourseIcon;
  id: string;
  practice: string[];
  steps: string[];
  summary: { concepts: string[]; objectives: string[]; text: string };
  title: string;
};

export const topicsCatalog: Topic[] = [
  {
    area: 'Matemática',
    color: 'brand',
    examples: [
      {
        problem: 'Halla el vértice de f(x) = x² − 4x + 3.',
        solution: 'x = −b/(2a) = 4/2 = 2; f(2) = 4 − 8 + 3 = −1. Vértice: (2, −1).',
      },
      {
        problem: '¿Hacia dónde abre f(x) = −2x² + 1?',
        solution: 'a = −2 < 0, así que la parábola abre hacia abajo.',
      },
    ],
    icon: 'sigma',
    id: 'cuadraticas',
    practice: [
      'Halla el vértice de f(x) = x² + 6x + 5.',
      'Indica si f(x) = 3x² − x abre hacia arriba o hacia abajo.',
      'Calcula las raíces de f(x) = x² − 9.',
    ],
    steps: ['Qué es una función cuadrática', 'Calcular el vértice', 'Raíces y gráfica'],
    summary: {
      concepts: ['f(x) = ax² + bx + c', 'Vértice: x = −b/(2a)', 'Signo de a'],
      objectives: [
        'Reconocer los coeficientes a, b y c.',
        'Calcular el vértice de la parábola.',
        'Esbozar la gráfica con pocos puntos.',
      ],
      text: 'Una función cuadrática tiene la forma f(x) = ax² + bx + c y su gráfica es una parábola. El signo de a indica si abre hacia arriba o hacia abajo, y el vértice es su punto más alto o más bajo.',
    },
    title: 'Funciones cuadráticas',
  },
  {
    area: 'Matemática',
    color: 'brand',
    examples: [
      { problem: '2/3 + 1/4', solution: 'Común denominador 12: 8/12 + 3/12 = 11/12.' },
      { problem: '3/5 × 10/9', solution: '(3 × 10)/(5 × 9) = 30/45 = 2/3.' },
    ],
    icon: 'sigma',
    id: 'fracciones',
    practice: ['Calcula 1/2 + 2/5.', 'Calcula 7/8 − 1/4.', 'Calcula 4/9 ÷ 2/3.'],
    steps: ['Fracciones equivalentes', 'Sumar y restar', 'Multiplicar y dividir'],
    summary: {
      concepts: ['Común denominador', 'Simplificar', 'Inverso al dividir'],
      objectives: [
        'Sumar y restar con distinto denominador.',
        'Multiplicar y dividir fracciones.',
        'Simplificar el resultado.',
      ],
      text: 'Para sumar o restar fracciones se busca un denominador común. Para multiplicar se multiplican numeradores y denominadores; para dividir se multiplica por la fracción invertida.',
    },
    title: 'Operaciones con fracciones',
  },
  {
    area: 'Ciencia y Tecnología',
    color: 'green',
    examples: [
      {
        problem: '¿Qué necesita una planta para hacer fotosíntesis?',
        solution: 'Luz solar, agua, dióxido de carbono y clorofila.',
      },
      {
        problem: '¿Qué produce la fotosíntesis?',
        solution: 'Glucosa (alimento para la planta) y oxígeno, que se libera al aire.',
      },
    ],
    icon: 'flask',
    id: 'fotosintesis',
    practice: [
      'Nombra los reactivos de la fotosíntesis.',
      'Explica por qué las hojas son verdes.',
      '¿Qué pasaría con una planta sin luz durante una semana?',
    ],
    steps: ['Qué es la fotosíntesis', 'Reactivos y productos', 'Importancia para la vida'],
    summary: {
      concepts: ['Clorofila', 'CO₂ + H₂O → glucosa + O₂', 'Energía solar'],
      objectives: [
        'Explicar qué es la fotosíntesis.',
        'Identificar reactivos y productos.',
        'Relacionarla con el oxígeno que respiramos.',
      ],
      text: 'La fotosíntesis es el proceso por el que las plantas usan la luz del sol para transformar agua y dióxido de carbono en glucosa, liberando oxígeno. Ocurre en los cloroplastos gracias a la clorofila.',
    },
    title: 'Fotosíntesis',
  },
  {
    area: 'Comunicación',
    color: 'red',
    examples: [
      {
        problem: 'Lee un párrafo sobre el reciclaje y encuentra su idea principal.',
        solution: 'Pregúntate de qué trata todo el párrafo: «reciclar reduce la basura».',
      },
      {
        problem: '¿Qué diferencia hay entre idea principal e idea secundaria?',
        solution: 'La principal resume el texto; las secundarias la explican o dan ejemplos.',
      },
    ],
    icon: 'book',
    id: 'idea-principal',
    practice: [
      'Subraya la idea principal de un párrafo de tu libro.',
      'Escribe dos ideas secundarias que la apoyen.',
      'Resume el texto en una sola oración.',
    ],
    steps: ['Leer con propósito', 'Encontrar la idea principal', 'Resumir'],
    summary: {
      concepts: ['Idea principal', 'Ideas secundarias', 'Resumen'],
      objectives: [
        'Distinguir idea principal y secundarias.',
        'Subrayar lo esencial de un párrafo.',
        'Resumir un texto con tus palabras.',
      ],
      text: 'La idea principal es lo más importante que el autor quiere decir; las ideas secundarias la explican. Encontrarla ayuda a resumir y a responder preguntas de comprensión.',
    },
    title: 'Idea principal de un texto',
  },
  {
    area: 'Ciencias Sociales',
    color: 'blue',
    examples: [
      {
        problem: '¿Quién proclamó la independencia del Perú y cuándo?',
        solution: 'José de San Martín, el 28 de julio de 1821, en Lima.',
      },
      {
        problem: 'Menciona una causa de la independencia.',
        solution: 'El descontento de los criollos por no acceder a cargos de gobierno.',
      },
    ],
    icon: 'landmark',
    id: 'independencia',
    practice: [
      'Ordena en una línea de tiempo tres hechos de la independencia.',
      'Explica qué fueron las corrientes libertadoras.',
      '¿Qué batalla selló la independencia en 1824?',
    ],
    steps: ['Causas', 'Corrientes libertadoras', 'Consolidación (1824)'],
    summary: {
      concepts: ['Criollos', 'San Martín y Bolívar', 'Batalla de Ayacucho'],
      objectives: [
        'Reconocer las causas de la independencia.',
        'Ubicar los hechos principales en el tiempo.',
        'Explicar cómo se consolidó en 1824.',
      ],
      text: 'La independencia del Perú se proclamó en 1821 con San Martín y se consolidó en 1824 con las batallas de Junín y Ayacucho, en un proceso impulsado por causas internas y externas.',
    },
    title: 'Independencia del Perú',
  },
  {
    area: 'Matemática',
    color: 'orange',
    examples: [
      { problem: '3, 7, 11, 15, …', solution: 'Se suma 4 cada vez: el siguiente es 19.' },
      { problem: '2, 6, 18, 54, …', solution: 'Se multiplica por 3: el siguiente es 162.' },
    ],
    icon: 'puzzle',
    id: 'sucesiones',
    practice: ['Continúa: 5, 10, 20, 40, …', 'Continúa: 1, 4, 9, 16, …', 'Continúa: 50, 45, 40, …'],
    steps: ['Encontrar el patrón', 'Sucesiones aritméticas', 'Sucesiones geométricas'],
    summary: {
      concepts: ['Patrón', 'Razón aritmética', 'Razón geométrica'],
      objectives: [
        'Encontrar el patrón de una sucesión.',
        'Distinguir sucesiones aritméticas y geométricas.',
        'Calcular el término siguiente.',
      ],
      text: 'Una sucesión es una lista ordenada de números que sigue un patrón. Si se suma siempre lo mismo es aritmética; si se multiplica siempre por lo mismo es geométrica.',
    },
    title: 'Sucesiones numéricas',
  },
];

export function findTopic(id: string | undefined) {
  return topicsCatalog.find((topic) => topic.id === id);
}

/** Bloque detectado en una tarea: un tema con sus ejercicios. */
export type TaskBlock = { exercises: string[]; topicId: string };

export type ScanSource = 'camera' | 'gallery' | 'pdf';

/**
 * Resultado simulado del análisis según el origen elegido. `null` = la imagen no se pudo leer
 * (para demostrar el estado de error).
 */
export const scanSamples: Record<
  ScanSource,
  { blocks: TaskBlock[]; fileName: string; preview: string[]; subject: string } | null
> = {
  camera: {
    blocks: [
      {
        exercises: [
          'Halla el vértice de f(x) = x² − 2x − 3.',
          'Calcula las raíces de f(x) = x² − 4.',
        ],
        topicId: 'cuadraticas',
      },
      {
        exercises: ['Calcula 3/4 + 2/3.', 'Calcula 5/6 ÷ 1/2.'],
        topicId: 'fracciones',
      },
    ],
    fileName: 'foto-tarea.jpg',
    preview: [
      '1) f(x) = x² − 2x − 3: vértice',
      '2) Raíces de f(x) = x² − 4',
      '3) 3/4 + 2/3',
      '4) 5/6 ÷ 1/2',
    ],
    subject: 'Matemática',
  },
  gallery: null,
  pdf: {
    blocks: [
      {
        exercises: [
          'Lee el texto «El agua es vida» y escribe su idea principal.',
          'Anota dos ideas secundarias.',
        ],
        topicId: 'idea-principal',
      },
    ],
    fileName: 'ficha-comunicacion.pdf',
    preview: [
      'Lectura: «El agua es vida»',
      'a) ¿Cuál es la idea principal?',
      'b) Dos ideas secundarias',
    ],
    subject: 'Comunicación',
  },
};

export type SchoolTaskStatus = 'new' | 'studying' | 'solved';

/** Tarea escolar del alumno (escaneada o registrada). La fecha es opcional. */
export type SchoolTask = {
  blocks: TaskBlock[];
  createdLabel: string;
  dueLabel?: string;
  fileName: string;
  id: string;
  status: SchoolTaskStatus;
  subject: string;
  title: string;
};

export const schoolTasksSeed: SchoolTask[] = [
  {
    blocks: [
      {
        exercises: ['Explica qué produce la fotosíntesis.', 'Dibuja el proceso.'],
        topicId: 'fotosintesis',
      },
    ],
    createdLabel: 'Hoy',
    dueLabel: 'Jue, 18 sep.',
    fileName: 'tarea-ciencia.jpg',
    id: 'st1',
    status: 'studying',
    subject: 'Ciencia y Tecnología',
    title: 'Tarea de Ciencia',
  },
  {
    blocks: [{ exercises: ['Ordena los hechos de 1821 a 1824.'], topicId: 'independencia' }],
    createdLabel: 'Lun, 15 sep.',
    fileName: 'ficha-historia.pdf',
    id: 'st2',
    status: 'solved',
    subject: 'Ciencias Sociales',
    title: 'Ficha de Historia',
  },
  {
    blocks: [
      { exercises: ['Continúa: 3, 6, 12, …', 'Continúa: 2, 5, 8, …'], topicId: 'sucesiones' },
    ],
    createdLabel: 'Vie, 12 sep.',
    fileName: 'practica-sucesiones.jpg',
    id: 'st3',
    status: 'solved',
    subject: 'Matemática',
    title: 'Práctica de sucesiones',
  },
];

/** Temas practicados (para Inicio y Progreso): veces y última práctica. */
export const practicedTopicsSeed: { lastLabel: string; sessions: number; topicId: string }[] = [
  { lastLabel: 'Hoy', sessions: 2, topicId: 'fotosintesis' },
  { lastLabel: 'Lun, 15 sep.', sessions: 3, topicId: 'independencia' },
  { lastLabel: 'Vie, 12 sep.', sessions: 2, topicId: 'sucesiones' },
  { lastLabel: 'Mié, 10 sep.', sessions: 1, topicId: 'idea-principal' },
];

/** Sesiones de práctica por semana (últimas 6), para la gráfica de Progreso. */
export const weeklyPracticeSeed = [
  { label: '11 ago.', value: 1 },
  { label: '18 ago.', value: 2 },
  { label: '25 ago.', value: 2 },
  { label: '1 sep.', value: 3 },
  { label: '8 sep.', value: 4 },
  { label: '15 sep.', value: 3 },
];

/** Eventos con fecha de esta modalidad (Calendario asincrónico). */
export const schoolCalendarEvents = [
  {
    date: '2025-09-18',
    id: 'sc1',
    status: 'Del colegio',
    subtitle: 'Ciencia y Tecnología · fecha del colegio',
    time: '08:00',
    title: 'Entrega: Tarea de Ciencia',
    type: 'task' as const,
  },
  {
    date: '2025-09-16',
    duration: '30 min',
    id: 'sc2',
    subtitle: 'Con tu docente · Matemática',
    time: '17:00',
    title: 'Asesoría agendada',
    type: 'help' as const,
  },
  {
    date: '2025-09-24',
    duration: '60 min',
    id: 'sc3',
    subtitle: 'Repaso antes de exámenes del colegio',
    time: '16:00',
    title: 'Taller de repaso',
    type: 'activity' as const,
  },
];
