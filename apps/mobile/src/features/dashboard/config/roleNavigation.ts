import {
  BookOpen,
  CalendarDays,
  ChartLine,
  ClipboardList,
  House,
  TrendingUp,
  UsersRound,
  type LucideIcon,
} from 'lucide-react-native';

export type DashboardRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export type SidebarNavigationItem = {
  icon: LucideIcon;
  key: string;
  label: string;
};

/** Navegación temporal por rol. Se completará mientras diseñamos cada dashboard. */
export const roleNavigation: Record<DashboardRole, SidebarNavigationItem[]> = {
  STUDENT: [
    { icon: House, key: 'home', label: 'Inicio' },
    { icon: BookOpen, key: 'courses', label: 'Cursos' },
    { icon: ClipboardList, key: 'tasks', label: 'Tareas' },
    { icon: CalendarDays, key: 'calendar', label: 'Calendario' },
    { icon: TrendingUp, key: 'progress', label: 'Progreso' },
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
