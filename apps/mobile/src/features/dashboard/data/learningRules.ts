/**
 * Reglas de avance del alumno, centralizadas. Regla aprobada: avance secuencial estricto; solo
 * la lección activa se puede estudiar. Las completadas muestran su estado y las futuras están
 * bloqueadas. La condición exacta de desbloqueo (video, tarea aprobada, nota mínima…) está
 * pendiente de confirmar (README UX §6.2 y §12): hasta entonces no se desbloquea nada en el
 * cliente. Cuando exista la API, debe validar esta misma regla en el servidor.
 */

import type { LessonStatus } from '../mocks/courseDetail';

export function canStudyLesson(status: LessonStatus) {
  return status === 'current';
}

export const lessonStatusLabel: Record<LessonStatus, string> = {
  current: 'En curso',
  done: 'Completada',
  pending: 'Bloqueada',
};
