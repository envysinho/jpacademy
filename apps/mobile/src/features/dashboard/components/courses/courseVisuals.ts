import { brand, categories } from '@/theme';

import type { CourseColor } from '../../mocks/studentCourses';

/** Paleta por materia: marca + colores del escudo (ESTILO_VISUAL §2.3, identificación de materias). */
export const courseColors: Record<CourseColor, { base: string; ink: string; soft: string }> = {
  brand: { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft },
  ...categories,
};

/** Texto y estado del botón principal según el avance. */
export function courseAction(progress: number) {
  if (progress >= 100) return 'Repasar';
  if (progress <= 0) return 'Empezar';
  return 'Continuar';
}
