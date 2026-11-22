/** Datos ficticios de "Tareas" del alumno. Solo visual; se reemplazan por la API más adelante. */

import type { CourseColor, CourseIcon } from './studentCourses';

export type TaskStatus = 'pending' | 'submitted' | 'graded' | 'overdue';
export type TaskGroup = 'today' | 'week' | 'later';
export type AttachmentKind = 'pdf' | 'image' | 'doc';

export type StudentTask = {
  attachments: { kind: AttachmentKind; name: string }[];
  color: CourseColor;
  /** Texto corto del vencimiento o de la entrega. */
  dueLabel: string;
  feedback?: string;
  grade?: number;
  group?: TaskGroup;
  icon: CourseIcon;
  id: string;
  instructions: string;
  points: number;
  progress: { done: number; total: number };
  status: TaskStatus;
  subject: string;
  title: string;
  type: 'Tarea' | 'Práctica' | 'Lectura' | 'Proyecto';
};

export const studentTasksMock: StudentTask[] = [
  {
    attachments: [
      { kind: 'pdf', name: 'guia-funciones.pdf' },
      { kind: 'image', name: 'ejemplo-parabola.png' },
    ],
    color: 'brand',
    dueLabel: 'Hoy, 23:59',
    group: 'today',
    icon: 'sigma',
    id: 't1',
    instructions:
      'Resuelve los 5 ejercicios de la guía: identifica vértice, eje de simetría y raíces de cada función, y grafica dos de ellas.',
    points: 20,
    progress: { done: 2, total: 5 },
    status: 'pending',
    subject: 'Matemática',
    title: 'Funciones cuadráticas',
    type: 'Tarea',
  },
  {
    attachments: [{ kind: 'doc', name: 'plantilla-informe.docx' }],
    color: 'green',
    dueLabel: 'Jue, 18 sep.',
    group: 'week',
    icon: 'flask',
    id: 't2',
    instructions:
      'Elabora un informe de una página sobre las etapas del ciclo del agua con un esquema propio.',
    points: 20,
    progress: { done: 1, total: 3 },
    status: 'pending',
    subject: 'Ciencia',
    title: 'Informe: el ciclo del agua',
    type: 'Proyecto',
  },
  {
    attachments: [{ kind: 'pdf', name: 'capitulo-3.pdf' }],
    color: 'red',
    dueLabel: 'Vie, 19 sep.',
    group: 'week',
    icon: 'book',
    id: 't3',
    instructions: 'Lee el capítulo 3 y responde las preguntas de comprensión al final.',
    points: 10,
    progress: { done: 0, total: 1 },
    status: 'pending',
    subject: 'Comunicación',
    title: 'Lectura: capítulo 3',
    type: 'Lectura',
  },
  {
    attachments: [{ kind: 'pdf', name: 'fechas-clave.pdf' }],
    color: 'blue',
    dueLabel: 'Jue, 25 sep.',
    group: 'later',
    icon: 'landmark',
    id: 't4',
    instructions: 'Construye una línea de tiempo con 8 hechos del Perú en el siglo XX.',
    points: 20,
    progress: { done: 0, total: 8 },
    status: 'pending',
    subject: 'Historia',
    title: 'Línea de tiempo del siglo XX',
    type: 'Proyecto',
  },
  {
    attachments: [],
    color: 'orange',
    dueLabel: 'Entregada el 12 sep.',
    icon: 'puzzle',
    id: 't5',
    instructions: 'Completa las 10 sucesiones y explica el patrón de cada una.',
    points: 20,
    progress: { done: 10, total: 10 },
    status: 'submitted',
    subject: 'Razonamiento',
    title: 'Sucesiones y patrones',
    type: 'Práctica',
  },
  {
    attachments: [],
    color: 'red',
    dueLabel: 'Calificada el 10 sep.',
    feedback: 'Muy buena identificación de ideas principales. Cuida la ortografía.',
    grade: 18,
    icon: 'book',
    id: 't6',
    instructions: 'Responde las preguntas de comprensión del texto «El viejo y el mar».',
    points: 20,
    progress: { done: 1, total: 1 },
    status: 'graded',
    subject: 'Comunicación',
    title: 'Comprensión lectora',
    type: 'Práctica',
  },
  {
    attachments: [],
    color: 'green',
    dueLabel: 'Calificada el 8 sep.',
    feedback: 'Buen mapa; faltó ubicar dos cordilleras.',
    grade: 16,
    icon: 'globe',
    id: 't7',
    instructions: 'Ubica en el mapa las regiones naturales y principales cordilleras del Perú.',
    points: 20,
    progress: { done: 1, total: 1 },
    status: 'graded',
    subject: 'Geografía',
    title: 'Relieve del Perú',
    type: 'Tarea',
  },
  {
    attachments: [{ kind: 'pdf', name: 'consigna.pdf' }],
    color: 'blue',
    dueLabel: 'Venció el 10 sep.',
    icon: 'landmark',
    id: 't8',
    instructions: 'Resume en un mapa conceptual las causas de la independencia.',
    points: 10,
    progress: { done: 0, total: 1 },
    status: 'overdue',
    subject: 'Historia',
    title: 'Mapa conceptual: independencia',
    type: 'Tarea',
  },
];
