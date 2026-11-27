import {
  BookOpen,
  Lightbulb,
  CalendarDays,
  ChartLine,
  ClipboardList,
  House,
  TrendingUp,
  UsersRound,
  type LucideIcon,
} from 'lucide-react-native';

import type { Clay3DKind } from '@/components/Clay3DIcon';

export type DashboardRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export type SidebarNavigationItem = {
  /** Icono 3D «arcilla» y color (de `categories`); si existe, el sidebar lo usa en lugar del Lucide (hoy solo el alumno). */
  clay?: { color: 'green' | 'orange' | 'red'; kind: Clay3DKind };
  icon: LucideIcon;
  key: string;
  label: string;
};

/** Navegación temporal por rol. Se completará mientras diseñamos cada dashboard. */
export const roleNavigation: Record<DashboardRole, SidebarNavigationItem[]> = {
  STUDENT: [
    { clay: { color: 'green', kind: 'monitor' }, icon: House, key: 'home', label: 'Inicio' },
    { clay: { color: 'red', kind: 'book' }, icon: BookOpen, key: 'courses', label: 'Cursos' },
    {
      clay: { color: 'orange', kind: 'clipboard' },
      icon: ClipboardList,
      key: 'tasks',
      label: 'Tareas',
    },
    {
      clay: { color: 'green', kind: 'calendar' },
      icon: CalendarDays,
      key: 'calendar',
      label: 'Calendario',
    },
    {
      clay: { color: 'orange', kind: 'trophy' },
      icon: TrendingUp,
      key: 'progress',
      label: 'Progreso',
    },
  ],
  TEACHER: [
    { icon: House, key: 'home', label: 'Inicio' },
    { icon: BookOpen, key: 'classes', label: 'Clases' },
    { icon: UsersRound, key: 'students', label: 'Estudiantes' },
    { icon: CalendarDays, key: 'calendar', label: 'Calendario' },
    { icon: ChartLine, key: 'reports', label: 'Reportes' },
  ],
  ADMIN: [{ icon: House, key: 'home', label: 'Inicio' }],
};

export const roleLabels: Record<DashboardRole, string> = {
  STUDENT: 'Estudiante',
  TEACHER: 'Docente',
  ADMIN: 'Administrador',
};

/**
 * Navegación del alumno de **Acompañamiento escolar** (propuesta de la fase visual). Mismo
 * sidebar y estilo que reforzamiento; solo cambia la lista. No altera la de reforzamiento.
 */
export const schoolSupportNavigation: SidebarNavigationItem[] = [
  { clay: { color: 'green', kind: 'monitor' }, icon: House, key: 'home', label: 'Inicio' },
  { clay: { color: 'red', kind: 'book' }, icon: Lightbulb, key: 'learn', label: 'Aprender' },
  {
    clay: { color: 'orange', kind: 'clipboard' },
    icon: ClipboardList,
    key: 'tasks',
    label: 'Mis tareas',
  },
  {
    clay: { color: 'green', kind: 'calendar' },
    icon: CalendarDays,
    key: 'calendar',
    label: 'Calendario',
  },
  {
    clay: { color: 'orange', kind: 'trophy' },
    icon: TrendingUp,
    key: 'progress',
    label: 'Progreso',
  },
];
