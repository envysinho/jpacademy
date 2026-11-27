import {
  CircleCheck,
  Clock,
  FileText,
  Image as ImageIcon,
  TriangleAlert,
  Trophy,
  File as FileIcon,
  type LucideIcon,
} from 'lucide-react-native';

import { categories, colors } from '@/theme';

import type { AttachmentKind, StudentTask } from '../../mocks/studentTasks';

const MONTHS = [
  'ene.',
  'feb.',
  'mar.',
  'abr.',
  'may.',
  'jun.',
  'jul.',
  'ago.',
  'sep.',
  'oct.',
  'nov.',
  'dic.',
];

/** «2025-09-12» → «12 sep.» (fecha de calendario, sin conversión de zona horaria). */
export function formatShortDate(isoDate: string) {
  const [, month, day] = isoDate.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]}`;
}

export const attachmentIcons: Record<AttachmentKind, LucideIcon> = {
  doc: FileIcon,
  image: ImageIcon,
  pdf: FileText,
};

/**
 * Chip de vencimiento/estado de una tarea. Naranja = vence hoy, rojo = vencida,
 * verde = entregada o calificada, neutro = pendiente sin urgencia.
 */
export function taskChip(task: StudentTask): {
  background: string;
  color: string;
  icon: LucideIcon;
  label: string;
} {
  switch (task.status) {
    case 'overdue':
      return {
        background: categories.red.soft,
        color: categories.red.ink,
        icon: TriangleAlert,
        label: 'Vencida',
      };
    case 'submitted':
      return {
        background: categories.green.soft,
        color: categories.green.ink,
        icon: CircleCheck,
        label: 'Por calificar',
      };
    case 'graded':
      return {
        background: categories.green.soft,
        color: categories.green.ink,
        icon: Trophy,
        label: `${task.grade}/${task.points}`,
      };
    default:
      return task.group === 'today'
        ? {
            background: categories.orange.soft,
            color: categories.orange.ink,
            icon: Clock,
            label: task.dueLabel,
          }
        : { background: colors.track, color: colors.text, icon: Clock, label: task.dueLabel };
  }
}

/** Píldora de estado de una tarea (tarjeta «Tu tarea» y cabecera del espacio de resolución). */
export function taskStatusPill(
  task: StudentTask,
  submittedInSession = false,
): { background: string; color: string; label: string } {
  if (submittedInSession || task.status === 'submitted') {
    return { background: categories.green.soft, color: categories.green.ink, label: 'En revisión' };
  }
  switch (task.status) {
    case 'graded':
      return {
        background: categories.green.soft,
        color: categories.green.ink,
        label: `Calificada · ${task.grade}/${task.points}`,
      };
    case 'overdue':
      return { background: categories.red.soft, color: categories.red.ink, label: 'Vencida' };
    default:
      return {
        background: categories.orange.soft,
        color: categories.orange.ink,
        label: 'Pendiente',
      };
  }
}
