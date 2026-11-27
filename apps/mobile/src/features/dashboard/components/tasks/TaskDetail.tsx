import {
  CalendarClock,
  CircleAlert,
  LifeBuoy,
  ListChecks,
  PenLine,
  Star,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { ProgressRing } from '@/components/ProgressRing';
import { Raised3D } from '@/components/Raised3D';
import { SoftScene } from '@/components/SoftScene';
import { brand, categories, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import type { StudentTask } from '../../mocks/studentTasks';
import { CourseBanner } from '../courses/CourseBanner';
import { courseColors } from '../courses/courseVisuals';

import { attachmentIcons, formatShortDate, taskChip } from './taskVisuals';

function ActionButton({
  hint,
  icon: Icon,
  label,
  onPress,
  variant,
}: {
  hint?: string;
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  variant: 'primary' | 'white';
}) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      accessibilityHint={hint}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.actionPressable}
    >
      {({ pressed }) => (
        <Raised3D faceStyle={styles.action} pressed={pressed} variant={variant}>
          <Icon color={isPrimary ? brand.onBlue : colors.text} size={18} strokeWidth={2.2} />
          <Text style={[styles.actionText, isPrimary && styles.actionTextPrimary]}>{label}</Text>
        </Raised3D>
      )}
    </Pressable>
  );
}

/**
 * Detalle de la tarea seleccionada: portada 3D, datos, material y, según el estado, avance y
 * «Resolver tarea» (pendiente), el detalle de la entrega y la nota (historial) o el aviso de
 * vencida (ya no se puede resolver; queda para el registro).
 */
export function TaskDetail({
  fill = false,
  onAskHelp,
  onResolve,
  task,
}: {
  /** Ocupa el alto disponible: el contenido se desplaza y las acciones quedan fijas abajo. */
  fill?: boolean;
  onAskHelp: () => void;
  onResolve: () => void;
  task: StudentTask;
}) {
  // Solo las pendientes: una vencida ya no se puede resolver (queda para el registro).
  const canResolve = task.status === 'pending';
  const deliveredOn = task.submittedAt
    ? `Entregada el ${formatShortDate(task.submittedAt)} · intento ${task.attempts.used} de ${task.attempts.max}`
    : undefined;
  const chip = taskChip(task);
  const ChipIcon = chip.icon;
  const palette = courseColors[task.color];
  const progressPercent = Math.round((task.progress.done / task.progress.total) * 100);

  return (
    <Card style={[styles.card, fill && styles.cardFill]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={fill}
        style={fill && styles.scroll}
      >
        <View>
          <CourseBanner
            color={task.color}
            icon={task.icon}
            style={styles.banner}
            uid={`task-detail-${task.id}`}
          />
          <View style={styles.subjectPill}>
            <Text style={[styles.subjectText, { color: palette.ink }]}>{task.subject}</Text>
          </View>
        </View>

        <View style={styles.head}>
          <Text style={styles.title}>{task.title}</Text>
          <View style={styles.chips}>
            <View style={[styles.chip, { backgroundColor: chip.background }]}>
              <ChipIcon color={chip.color} size={14} strokeWidth={2.2} />
              <Text style={[styles.chipText, { color: chip.color }]}>{chip.label}</Text>
            </View>
            {task.status !== 'pending' && (
              <View style={[styles.chip, styles.chipNeutral]}>
                <CalendarClock color={colors.text} size={14} strokeWidth={2.2} />
                <Text style={styles.chipText}>{task.dueLabel}</Text>
              </View>
            )}
            <View style={[styles.chip, styles.chipNeutral]}>
              <Star color={colors.text} size={14} strokeWidth={2.2} />
              <Text style={styles.chipText}>{task.points} pts</Text>
            </View>
            <View style={[styles.chip, styles.chipNeutral]}>
              <ListChecks color={colors.text} size={14} strokeWidth={2.2} />
              <Text style={styles.chipText}>{task.type}</Text>
            </View>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Instrucciones</Text>
          <Text style={styles.body}>{task.instructions}</Text>
        </View>

        {task.attachments.length > 0 && (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Material</Text>
            <View style={styles.attachments}>
              {task.attachments.map(({ kind, name }) => {
                const Icon = attachmentIcons[kind];
                return (
                  <Pressable key={name} accessibilityRole="button" onPress={() => undefined}>
                    {({ pressed }) => (
                      <Raised3D
                        depth={3}
                        faceStyle={styles.attachment}
                        pressed={pressed}
                        radius={radius.chip}
                        variant="white"
                      >
                        <View style={[styles.attachmentIcon, { backgroundColor: palette.soft }]}>
                          <Icon color={palette.ink} size={16} strokeWidth={2.2} />
                        </View>
                        <Text numberOfLines={1} style={styles.attachmentText}>
                          {name}
                        </Text>
                      </Raised3D>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Estado: nota (calificada), revisión (entregada), vencida o avance (pendiente). */}
        {task.status === 'graded' ? (
          <View style={styles.result}>
            <SoftScene base={categories.green.base} />
            <ProgressRing
              color={categories.green.base}
              size={72}
              strokeWidth={8}
              trackColor={colors.surface}
              value={((task.grade ?? 0) / task.points) * 100}
            >
              <Text style={styles.resultValue}>{task.grade}</Text>
            </ProgressRing>
            <View style={styles.resultText}>
              <Text style={styles.blockTitle}>Comentario del docente</Text>
              <Text style={styles.body}>{task.feedback}</Text>
              {deliveredOn && <Text style={styles.meta}>{deliveredOn}</Text>}
            </View>
          </View>
        ) : task.status === 'submitted' ? (
          <View style={styles.result}>
            <SoftScene base={categories.green.base} />
            <View style={styles.resultText}>
              <Text style={styles.blockTitle}>Por calificar</Text>
              <Text style={styles.body}>
                Tu entrega está en revisión. Verás la nota aquí cuando el docente la califique.
              </Text>
              {deliveredOn && <Text style={styles.meta}>{deliveredOn}</Text>}
            </View>
          </View>
        ) : task.status === 'overdue' ? (
          <View style={[styles.result, styles.resultOverdue]}>
            <SoftScene base={categories.red.base} />
            <CircleAlert color={categories.red.ink} size={28} strokeWidth={2.2} />
            <View style={styles.resultText}>
              <Text style={styles.blockTitle}>Plazo vencido</Text>
              <Text style={styles.body}>
                Esta tarea no se entregó a tiempo y ya no se puede resolver. Queda en tu registro.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.block}>
            <View style={styles.progressHeader}>
              <Text style={styles.blockTitle}>Tu avance</Text>
              <Text style={styles.progressValue}>
                {task.progress.done}/{task.progress.total}
              </Text>
            </View>
            <ProgressBar trackColor={colors.track} value={progressPercent} />
            <Text style={styles.meta}>
              Intentos de entrega: {task.attempts.used} de {task.attempts.max}
            </Text>
          </View>
        )}
      </ScrollView>

      {canResolve && (
        <View style={styles.actions}>
          <ActionButton
            hint="Abre el espacio de resolución. No envía la tarea ni consume intentos."
            icon={PenLine}
            label="Resolver tarea"
            onPress={onResolve}
            variant="primary"
          />
          <ActionButton
            hint="Abre el chat con el docente de esta tarea"
            icon={LifeBuoy}
            label="Pedir ayuda"
            onPress={onAskHelp}
            variant="white"
          />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, padding: 12 },
  cardFill: { flex: 1 },
  scroll: { flex: 1 },
  content: { gap: spacing.md },
  banner: { height: 110 },
  subjectPill: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    position: 'absolute',
    top: 12,
    ...shadows.card,
  },
  subjectText: { fontFamily: fontFamily.semibold, fontSize: 12 },
  head: { gap: spacing.sm, paddingHorizontal: 6 },
  title: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 20, letterSpacing: -0.4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    alignItems: 'center',
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipNeutral: { backgroundColor: colors.track },
  chipText: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 12 },
  block: { gap: 6, paddingHorizontal: 6 },
  blockTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 14 },
  body: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  meta: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 12 },
  attachments: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  attachment: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 44,
    maxWidth: 240,
    paddingHorizontal: 10,
  },
  attachmentIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  attachmentText: {
    color: colors.text,
    flexShrink: 1,
    fontFamily: fontFamily.medium,
    fontSize: 13,
  },
  result: {
    alignItems: 'center',
    backgroundColor: categories.green.soft,
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: spacing.md,
    overflow: 'hidden',
    padding: spacing.md,
  },
  resultOverdue: { backgroundColor: categories.red.soft },
  resultValue: { color: colors.text, fontFamily: fontFamily.extrabold, fontSize: 22 },
  resultText: { flex: 1, gap: 4 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  progressValue: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 13 },
  actions: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: 6, paddingBottom: 4 },
  actionPressable: { flex: 1 },
  action: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  actionText: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 15 },
  actionTextPrimary: { color: brand.onBlue },
});
