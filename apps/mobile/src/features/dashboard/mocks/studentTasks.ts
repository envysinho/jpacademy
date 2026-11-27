/**
 * DATOS DE DESARROLLO (mock). Tareas del alumno; se reemplazan por la API más adelante.
 * Una tarea vencida (`overdue`) ya no se puede resolver ni entregar: queda para el registro.
 * Es la **única fuente** de tareas y notas: la usan Tareas, el detalle de curso, el espacio de
 * resolución y Progreso (promedios y evolución), para que las cifras no se contradigan.
 */

import type { CourseColor, CourseIcon } from './studentCourses';

export type TaskStatus = 'pending' | 'submitted' | 'graded' | 'overdue';
export type TaskGroup = 'today' | 'week' | 'later';
export type AttachmentKind = 'pdf' | 'image' | 'doc';

export type StudentTask = {
  attachments: { kind: AttachmentKind; name: string }[];
  /** Intentos de entrega formal usados y permitidos. */
  attempts: { max: number; used: number };
  color: CourseColor;
  courseId: string;
  /** Texto corto del vencimiento o de la entrega. */
  dueLabel: string;
  feedback?: string;
  grade?: number;
  /**
   * Fecha límite (AAAA-MM-DD). Las tareas con fecha aparecen en el Calendario como entregas;
   * las vencidas se ordenan por ella en el historial.
   */
  dueDate?: string;
  /** Fecha de calificación (AAAA-MM-DD), para el historial. */
  gradedAt?: string;
  /**
   * Agrupación por vencimiento. En producción se calcula con la fecha límite en la zona horaria
   * de la academia; aquí es fija.
   */
  group?: TaskGroup;
  icon: CourseIcon;
  id: string;
  instructions: string;
  /** Unidad y lección a la que pertenece. */
  lessonLabel: string;
  points: number;
  progress: { done: number; total: number };
  status: TaskStatus;
  subject: string;
  /** Fecha de entrega (AAAA-MM-DD), para ordenar el historial. */
  submittedAt?: string;
  title: string;
  type: 'Tarea' | 'Práctica' | 'Lectura' | 'Proyecto';
};

export const studentTasksMock: StudentTask[] = [
  {
    attachments: [
      { kind: 'pdf', name: 'guia-funciones.pdf' },
      { kind: 'image', name: 'ejemplo-parabola.png' },
    ],
    attempts: { max: 3, used: 1 },
    color: 'brand',
    courseId: 'c1',
    dueDate: '2025-09-16',
    dueLabel: 'Hoy, 23:59',
    group: 'today',
    icon: 'sigma',
    id: 't1',
    instructions:
      'Resuelve los 5 ejercicios de la guía: identifica vértice, eje de simetría y raíces de cada función, y grafica dos de ellas.',
    lessonLabel: 'Unidad 3 · Lección 2',
    points: 20,
    progress: { done: 2, total: 5 },
    status: 'pending',
    subject: 'Álgebra',
    title: 'Funciones cuadráticas',
    type: 'Tarea',
  },
  {
    attachments: [{ kind: 'doc', name: 'plantilla-informe.docx' }],
    attempts: { max: 3, used: 0 },
    color: 'green',
    courseId: 'c2',
    dueDate: '2025-09-18',
    dueLabel: 'Jue, 18 sep.',
    group: 'week',
    icon: 'flask',
    id: 't2',
    instructions:
      'Elabora un informe de una página sobre las etapas del ciclo del agua con un esquema propio.',
    lessonLabel: 'Unidad 2 · Lección 1',
    points: 20,
    progress: { done: 1, total: 3 },
    status: 'pending',
    subject: 'Ciencia',
    title: 'Informe: el ciclo del agua',
    type: 'Proyecto',
  },
  {
    attachments: [{ kind: 'pdf', name: 'capitulo-3.pdf' }],
    attempts: { max: 3, used: 0 },
    color: 'red',
    courseId: 'c4',
    dueDate: '2025-09-19',
    dueLabel: 'Vie, 19 sep.',
    group: 'week',
    icon: 'book',
    id: 't3',
    instructions: 'Lee el capítulo 3 y responde las preguntas de comprensión al final.',
    lessonLabel: 'Unidad 4 · Lección 3',
    points: 10,
    progress: { done: 0, total: 1 },
    status: 'pending',
    subject: 'Comunicación',
    title: 'Lectura: capítulo 3',
    type: 'Lectura',
  },
  {
    attachments: [{ kind: 'pdf', name: 'fechas-clave.pdf' }],
    attempts: { max: 3, used: 0 },
    color: 'blue',
    courseId: 'c5',
    dueDate: '2025-09-25',
    dueLabel: 'Jue, 25 sep.',
    group: 'later',
    icon: 'landmark',
    id: 't4',
    instructions: 'Construye una línea de tiempo con 8 hechos del Perú en el siglo XX.',
    lessonLabel: 'Unidad 2 · Lección 4',
    points: 20,
    progress: { done: 0, total: 8 },
    status: 'pending',
    subject: 'Historia',
    title: 'Línea de tiempo del siglo XX',
    type: 'Proyecto',
  },
  {
    attachments: [{ kind: 'pdf', name: 'consigna.pdf' }],
    attempts: { max: 3, used: 0 },
    color: 'blue',
    courseId: 'c5',
    dueDate: '2025-09-10',
    dueLabel: 'Venció el 10 sep.',
    icon: 'landmark',
    id: 't8',
    instructions: 'Resume en un mapa conceptual las causas de la independencia.',
    lessonLabel: 'Unidad 2 · Lección 2',
    points: 10,
    progress: { done: 0, total: 1 },
    status: 'overdue',
    subject: 'Historia',
    title: 'Mapa conceptual: independencia',
    type: 'Tarea',
  },
  {
    attachments: [],
    attempts: { max: 3, used: 1 },
    color: 'orange',
    courseId: 'c3',
    dueLabel: 'Entregada el 12 sep.',
    icon: 'puzzle',
    id: 't5',
    instructions: 'Completa las 10 sucesiones y explica el patrón de cada una.',
    lessonLabel: 'Unidad 1 · Lección 1',
    points: 20,
    progress: { done: 10, total: 10 },
    status: 'submitted',
    subject: 'Razonamiento Matemático',
    submittedAt: '2025-09-12',
    title: 'Sucesiones y patrones',
    type: 'Práctica',
  },
  {
    attachments: [],
    attempts: { max: 3, used: 1 },
    color: 'red',
    courseId: 'c4',
    dueLabel: 'Calificada el 10 sep.',
    feedback: 'Muy buena identificación de ideas principales. Cuida la ortografía.',
    grade: 18,
    gradedAt: '2025-09-10',
    icon: 'book',
    id: 't6',
    instructions: 'Responde las preguntas de comprensión del texto «El viejo y el mar».',
    lessonLabel: 'Unidad 4 · Lección 1',
    points: 20,
    progress: { done: 1, total: 1 },
    status: 'graded',
    subject: 'Comunicación',
    submittedAt: '2025-09-09',
    title: 'Comprensión lectora',
    type: 'Práctica',
  },
  {
    attachments: [],
    attempts: { max: 3, used: 1 },
    color: 'green',
    courseId: 'c6',
    dueLabel: 'Calificada el 8 sep.',
    feedback: 'Buen mapa; faltó ubicar dos cordilleras.',
    grade: 16,
    gradedAt: '2025-09-08',
    icon: 'globe',
    id: 't7',
    instructions: 'Ubica en el mapa las regiones naturales y principales cordilleras del Perú.',
    lessonLabel: 'Unidad 3 · Lección 2',
    points: 20,
    progress: { done: 1, total: 1 },
    status: 'graded',
    subject: 'Geografía',
    submittedAt: '2025-09-06',
    title: 'Relieve del Perú',
    type: 'Tarea',
  },
  {
    attachments: [],
    attempts: { max: 3, used: 2 },
    color: 'brand',
    courseId: 'c1',
    dueLabel: 'Calificada el 5 sep.',
    feedback: 'Procedimientos claros. Revisa los signos al despejar.',
    grade: 18,
    gradedAt: '2025-09-05',
    icon: 'sigma',
    id: 't9',
    instructions: 'Resuelve 10 ecuaciones lineales y verifica cada solución.',
    lessonLabel: 'Unidad 3 · Lección 1',
    points: 20,
    progress: { done: 10, total: 10 },
    status: 'graded',
    subject: 'Álgebra',
    submittedAt: '2025-09-04',
    title: 'Ecuaciones lineales',
    type: 'Práctica',
  },
  {
    attachments: [],
    attempts: { max: 3, used: 1 },
    color: 'green',
    courseId: 'c2',
    dueLabel: 'Calificada el 29 ago.',
    feedback: 'Buen uso de ejemplos cotidianos.',
    grade: 17,
    gradedAt: '2025-08-29',
    icon: 'flask',
    id: 't10',
    instructions: 'Explica con ejemplos los tres estados de la materia.',
    lessonLabel: 'Unidad 1 · Lección 3',
    points: 20,
    progress: { done: 1, total: 1 },
    status: 'graded',
    subject: 'Ciencia',
    submittedAt: '2025-08-28',
    title: 'Estados de la materia',
    type: 'Tarea',
  },
  {
    attachments: [],
    attempts: { max: 3, used: 1 },
    color: 'red',
    courseId: 'c4',
    dueLabel: 'Calificada el 26 ago.',
    feedback: 'Excelente estructura narrativa.',
    grade: 19,
    gradedAt: '2025-08-26',
    icon: 'book',
    id: 't11',
    instructions: 'Escribe un cuento breve con inicio, nudo y desenlace.',
    lessonLabel: 'Unidad 3 · Lección 2',
    points: 20,
    progress: { done: 1, total: 1 },
    status: 'graded',
    subject: 'Comunicación',
    submittedAt: '2025-08-25',
    title: 'Textos narrativos',
    type: 'Tarea',
  },
  {
    attachments: [],
    attempts: { max: 3, used: 1 },
    color: 'blue',
    courseId: 'c5',
    dueLabel: 'Calificada el 22 ago.',
    feedback: 'Faltó relacionar causas y consecuencias.',
    grade: 15,
    gradedAt: '2025-08-22',
    icon: 'landmark',
    id: 't12',
    instructions: 'Resume los hechos principales de la etapa republicana.',
    lessonLabel: 'Unidad 1 · Lección 4',
    points: 20,
    progress: { done: 1, total: 1 },
    status: 'graded',
    subject: 'Historia',
    submittedAt: '2025-08-21',
    title: 'Perú republicano',
    type: 'Tarea',
  },
  {
    attachments: [],
    attempts: { max: 3, used: 1 },
    color: 'brand',
    courseId: 'c1',
    dueLabel: 'Calificada el 15 ago.',
    feedback: 'Bien. Practica el cuadrado de un binomio.',
    grade: 17,
    gradedAt: '2025-08-15',
    icon: 'sigma',
    id: 't13',
    instructions: 'Desarrolla 8 productos notables.',
    lessonLabel: 'Unidad 2 · Lección 2',
    points: 20,
    progress: { done: 8, total: 8 },
    status: 'graded',
    subject: 'Álgebra',
    submittedAt: '2025-08-14',
    title: 'Productos notables',
    type: 'Práctica',
  },
];

export function findTask(id: string | undefined) {
  return studentTasksMock.find((task) => task.id === id);
}
