/**
 * Datos ficticios de "Mis cursos". Solo visual; en el futuro vendrán de la base de datos.
 * No incluyen docente: los cursos se listan por materia.
 */

export type CourseColor = 'brand' | 'blue' | 'orange' | 'red' | 'green';
export type CourseIcon = 'sigma' | 'flask' | 'puzzle' | 'book' | 'landmark' | 'globe';

export type StudentCourse = {
  bookmarked: boolean;
  color: CourseColor;
  hours: number;
  icon: CourseIcon;
  id: string;
  lessons: number;
  progress: number;
  subject: string;
  title: string;
};

export const studentCoursesMock: StudentCourse[] = [
  {
    bookmarked: false,
    color: 'brand',
    hours: 6,
    icon: 'sigma',
    id: 'c1',
    lessons: 18,
    progress: 72,
    subject: 'Matemática',
    title: 'Ecuaciones y funciones',
  },
  {
    bookmarked: false,
    color: 'green',
    hours: 4,
    icon: 'flask',
    id: 'c2',
    lessons: 12,
    progress: 45,
    subject: 'Ciencia',
    title: 'El ciclo del agua',
  },
  {
    bookmarked: false,
    color: 'orange',
    hours: 5,
    icon: 'puzzle',
    id: 'c3',
    lessons: 15,
    progress: 0,
    subject: 'Razonamiento',
    title: 'Sucesiones y patrones',
  },
  {
    bookmarked: false,
    color: 'red',
    hours: 3,
    icon: 'book',
    id: 'c4',
    lessons: 10,
    progress: 100,
    subject: 'Comunicación',
    title: 'Comprensión lectora',
  },
  {
    bookmarked: true,
    color: 'blue',
    hours: 4,
    icon: 'landmark',
    id: 'c5',
    lessons: 14,
    progress: 36,
    subject: 'Historia',
    title: 'Perú en el siglo XX',
  },
  {
    bookmarked: false,
    color: 'green',
    hours: 3,
    icon: 'globe',
    id: 'c6',
    lessons: 9,
    progress: 100,
    subject: 'Geografía',
    title: 'Relieve del Perú',
  },
];
