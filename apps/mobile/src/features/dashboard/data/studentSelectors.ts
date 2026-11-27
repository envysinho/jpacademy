/**
 * Cálculos derivados del alumno. Son la única forma de obtener promedios, avance y ventanas de
 * ranking, para que Inicio, Tareas y Progreso muestren siempre las mismas cifras.
 */

import type { StudentCourse } from '../mocks/studentCourses';
import type { RankingEntry } from '../mocks/studentProgress';
import type { StudentTask } from '../mocks/studentTasks';

/**
 * Nota mínima aprobatoria **provisional** (escala vigesimal). Regla pendiente de confirmar por
 * la academia (README UX §12); solo se usa para contar «tareas aprobadas».
 */
export const PROVISIONAL_PASSING_GRADE = 11;

/** Minúsculas y sin tildes, para buscar sin distinguir «Álgebra» de «algebra». */
export function normalizeText(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Nota con un decimal y coma decimal (17,1). */
export function formatGrade(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace('.', ',');
}

export function gradedTasks(tasks: StudentTask[]) {
  return tasks.filter((task) => task.status === 'graded' && task.grade !== undefined);
}

/** Promedio sobre 20 de las tareas calificadas; las pendientes no cuentan como cero. */
export function averageGrade(tasks: StudentTask[]): number | undefined {
  const graded = gradedTasks(tasks);
  if (graded.length === 0) return undefined;
  const total = graded.reduce((sum, task) => sum + ((task.grade ?? 0) / task.points) * 20, 0);
  return Math.round((total / graded.length) * 10) / 10;
}

export function courseAverage(courseId: string, tasks: StudentTask[]) {
  return averageGrade(tasks.filter((task) => task.courseId === courseId));
}

/** Avance general = lecciones completadas / lecciones totales (no es un promedio de notas). */
export function overallProgress(courses: StudentCourse[]) {
  const done = courses.reduce((sum, course) => sum + course.lessonsDone, 0);
  const total = courses.reduce((sum, course) => sum + course.lessons, 0);
  return { done, percent: total ? Math.round((done / total) * 100) : 0, total };
}

export function taskTotals(tasks: StudentTask[]) {
  const graded = gradedTasks(tasks);
  const approved = graded.filter(
    (task) => ((task.grade ?? 0) / task.points) * 20 >= PROVISIONAL_PASSING_GRADE,
  ).length;
  return { approved, evaluated: graded.length };
}

/**
 * Hasta `radius` posiciones antes y después del alumno, sin inventar filas si está primero o
 * último. Si no tiene posición, devuelve las primeras.
 */
export function rankingWindow(entries: RankingEntry[], position: number | undefined, radius = 2) {
  if (position === undefined) return entries.slice(0, radius * 2 + 1);
  const index = entries.findIndex((entry) => entry.position === position);
  return entries.slice(Math.max(0, index - radius), index + radius + 1);
}

/** Frase motivacional basada en datos; solo afirma lo que es cierto. */
export function rankingMessage(position: number | undefined, total: number) {
  if (position === undefined) return 'Tu posición aparecerá cuando haya notas del periodo.';
  if (position === 1) return '¡Primer lugar!';
  if (position <= 3) return 'En el podio';
  if (position <= 10) return 'Entre los 10 mejores';
  if (position <= Math.ceil(total / 2)) return 'En la mitad superior';
  return 'Cada lección suma';
}
