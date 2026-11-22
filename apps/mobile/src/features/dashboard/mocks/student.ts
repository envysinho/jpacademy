/** Datos ficticios del Inicio del alumno. Solo visual; se reemplazan por la API más adelante. */

export type StreakDay = 'done' | 'empty' | 'today';
export type MedalKey = 'star' | 'trophy' | 'medal' | 'flame' | 'sigma' | 'book' | 'target';

/**
 * Racha en 4 filas de 10 días, igual que la referencia.
 * `x` = día estudiado, `o` = día sin estudiar, `t` = hoy.
 */
const STREAK_ROWS = ['ooooooooot', 'ooooooooox', 'ooxooooxox', 'xooooooxxx'];
const streakDayByChar: Record<string, StreakDay> = { o: 'empty', t: 'today', x: 'done' };

export const studentHomeMock = {
  resume: {
    eyebrow: 'Continúa aprendiendo',
    modules: { done: 8, total: 12 },
    remaining: '12:42',
    remainingProgress: 65,
    subject: 'Matemática',
    topic: 'Ecuaciones y funciones',
  },
  streak: {
    days: 12,
    toNextAchievement: 3,
    goalPercent: 80,
    rows: STREAK_ROWS.map((row) => row.split('').map((char) => streakDayByChar[char] ?? 'empty')),
  },
  courses: {
    enrolled: 3,
    caption: 'Estás en el 10 % superior de tu grupo este mes.',
    teachers: ['VR', 'DM'],
    items: [
      { active: false, id: 'mat', lessons: 12, name: 'Matemática', progress: 64 },
      { active: true, id: 'com', lessons: 8, name: 'Comunicación', progress: 42 },
      { active: false, id: 'cie', lessons: 10, name: 'Ciencia', progress: 78 },
    ],
  },
  durations: {
    caption: '+3 h respecto a la semana pasada',
    goalHours: 40,
    hours: 24,
    /** Horas acumuladas por punto; 4 semanas. */
    points: [3, 8, 6, 12, 10, 17, 24],
    weeks: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    yTicks: [30, 20, 10, 0],
  },
  achievements: {
    latest: { subject: 'Álgebra', title: 'Primer 20/20', when: 'Hace 2 días' },
    medals: [
      { id: 'm1', key: 'star' },
      { id: 'm2', key: 'trophy' },
      { id: 'm3', key: 'sigma' },
      { id: 'm4', key: 'medal' },
      { id: 'm5', key: 'target' },
    ] satisfies { id: string; key: MedalKey }[],
    /** Índice de la medalla destacada (la más reciente), en el centro de la fila. */
    selected: 2,
  },
};
