/**
 * DATOS DE DESARROLLO (mock). Perfil, última actividad y ranking del alumno.
 * El ranking es **una sola fuente** para Inicio y Progreso. Su fórmula, ámbito, periodo y
 * desempates están pendientes de definir por la academia (README UX §12): aquí solo hay una
 * posición ficticia, sin puntuaciones de terceros.
 */

export const studentProfile = { initials: 'JP', name: 'Juan Pérez' };

/**
 * Última actividad de aprendizaje persistida. `null` = el alumno aún no ha empezado ningún
 * curso (el Inicio muestra entonces una invitación, sin inventar un último curso).
 */
export const lastActivityMock: {
  courseId: string;
  lessonLabel: string;
  lessonTitle: string;
  modules: { done: number; total: number };
  /** Tiempo restante de la lección y su avance (0–100); `undefined` si no se conoce. */
  remaining?: { label: string; progress: number };
} | null = {
  courseId: 'c1',
  lessonLabel: 'Unidad 3 · Lección 2',
  lessonTitle: 'Ecuaciones y funciones',
  modules: { done: 8, total: 12 },
  remaining: { label: '12:42', progress: 65 },
};

export type RankingEntry = { id: string; isMe: boolean; name: string; position: number };

const TOTAL = 60;
const MY_POSITION = 3;

/** Clasificación completa (participantes visibles con nombre genérico por privacidad). */
const entries: RankingEntry[] = Array.from({ length: TOTAL }, (_, index) => {
  const position = index + 1;
  const isMe = position === MY_POSITION;
  return {
    id: `r${position}`,
    isMe,
    name: isMe ? studentProfile.name : `Estudiante ${String(position).padStart(2, '0')}`,
    position,
  };
});

export const rankingMock: {
  /** Variación de posiciones respecto al periodo anterior (+ = sube); `undefined` si no existe. */
  change?: number;
  entries: RankingEntry[];
  /** Posición del alumno; `undefined` si no hay ranking calculable. */
  position?: number;
  period: string;
  periodShort: string;
  scope: string;
  total: number;
} = {
  change: 2,
  entries,
  period: 'Septiembre 2025',
  periodShort: 'Este mes',
  position: MY_POSITION,
  scope: 'Academia',
  total: TOTAL,
};
