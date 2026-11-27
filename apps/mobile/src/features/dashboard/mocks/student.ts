/**
 * DATOS DE DESARROLLO (mock) del Inicio: racha, horas y logros. La última actividad y el ranking
 * viven en `studentProgress.ts` (compartidos con Progreso).
 */

export type StreakDay = 'done' | 'empty' | 'today';
export type MedalKey = 'star' | 'trophy' | 'medal' | 'flame' | 'sigma' | 'book' | 'target';

/**
 * Racha en 4 filas de 10 días, igual que la referencia.
 * `x` = día estudiado, `o` = día sin estudiar, `t` = hoy.
 */
const STREAK_ROWS = ['ooooooooot', 'ooooooooox', 'ooxooooxox', 'xooooooxxx'];
const streakDayByChar: Record<string, StreakDay> = { o: 'empty', t: 'today', x: 'done' };

export const studentHomeMock = {
  streak: {
    days: 12,
    toNextAchievement: 3,
    goalPercent: 80,
    rows: STREAK_ROWS.map((row) => row.split('').map((char) => streakDayByChar[char] ?? 'empty')),
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
    unlocked: 8,
    total: 24,
    /** Próximo logro. La racha de 15 días se alcanza con los 12 días actuales + 3. */
    next: { current: 12, target: 15, title: 'Racha de 15 días' },
  },
};
