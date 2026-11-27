/**
 * DATOS DE DESARROLLO (mock). Catálogo de cursos del alumno; en el futuro vendrá de la API.
 * Cada tarjeta es un **curso general** (Álgebra, Ciencia…), no un tema. La jerarquía objetivo es
 * Área → Curso → Unidad → Tema → Lección; aquí solo se modelan área y curso, y el resto vive en
 * el detalle del curso. Los nombres y cifras son ilustrativos, no el catálogo oficial.
 */

export type CourseColor = 'brand' | 'blue' | 'orange' | 'red' | 'green';
export type CourseIcon = 'sigma' | 'flask' | 'puzzle' | 'book' | 'landmark' | 'globe';

export type StudentCourse = {
  /** Área académica (etiqueta de la portada). */
  area: string;
  bookmarked: boolean;
  color: CourseColor;
  hours: number;
  icon: CourseIcon;
  id: string;
  /** Lecciones del curso completo. */
  lessons: number;
  lessonsDone: number;
  /** Avance del curso completo (0–100), derivado de `lessonsDone / lessons`. */
  progress: number;
  /** Nombre del curso general. */
  title: string;
};

const COURSES: Omit<StudentCourse, 'progress'>[] = [
  {
    area: 'Matemática',
    bookmarked: false,
    color: 'brand',
    hours: 6,
    icon: 'sigma',
    id: 'c1',
    lessons: 18,
    lessonsDone: 13,
    title: 'Álgebra',
  },
  {
    area: 'Ciencia y Tecnología',
    bookmarked: false,
    color: 'green',
    hours: 4,
    icon: 'flask',
    id: 'c2',
    lessons: 12,
    lessonsDone: 5,
    title: 'Ciencia',
  },
  {
    area: 'Matemática',
    bookmarked: false,
    color: 'orange',
    hours: 5,
    icon: 'puzzle',
    id: 'c3',
    lessons: 15,
    lessonsDone: 0,
    title: 'Razonamiento Matemático',
  },
  {
    area: 'Humanidades',
    bookmarked: false,
    color: 'red',
    hours: 3,
    icon: 'book',
    id: 'c4',
    lessons: 10,
    lessonsDone: 10,
    title: 'Comunicación',
  },
  {
    area: 'Ciencias Sociales',
    bookmarked: true,
    color: 'blue',
    hours: 4,
    icon: 'landmark',
    id: 'c5',
    lessons: 14,
    lessonsDone: 5,
    title: 'Historia',
  },
  {
    area: 'Ciencias Sociales',
    bookmarked: false,
    color: 'green',
    hours: 3,
    icon: 'globe',
    id: 'c6',
    lessons: 9,
    lessonsDone: 9,
    title: 'Geografía',
  },
];

export const studentCoursesMock: StudentCourse[] = COURSES.map((course) => ({
  ...course,
  progress: Math.round((course.lessonsDone / course.lessons) * 100),
}));

export function findCourse(id: string | undefined) {
  return studentCoursesMock.find((course) => course.id === id);
}
