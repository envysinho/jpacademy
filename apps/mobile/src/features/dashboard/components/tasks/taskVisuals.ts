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

import type { AttachmentKind, StudentTask, TaskGroup } from '../../mocks/studentTasks';

export const groupLabels: Record<TaskGroup, string> = {
  today: 'Hoy',
  week: 'Esta semana',
  later: 'Más adelante',
};

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
        label: 'Entregada',
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
