import {
  CalendarClock,
  CircleCheck,
  Download,
  FileText,
  ListChecks,
  MessageCircle,
  Presentation,
  Sparkles,
  type LucideIcon,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GoogleMeetIcon } from '@/components/brand/GoogleMeetIcon';
import { Card } from '@/components/Card';
import { Clay3DIcon } from '@/components/Clay3DIcon';
import { Raised3D } from '@/components/Raised3D';
import { SoftScene } from '@/components/SoftScene';
import { brand, categories, colors, fontFamily, radius, spacing } from '@/theme';

import type { MaterialSource, ResourceKind } from '../../mocks/courseDetail';
import type { StudentTask } from '../../mocks/studentTasks';
import { CardHeader } from '../home/CardHeader';
import { attachmentIcons, taskStatusPill } from '../tasks/taskVisuals';

const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };

const resourceStyle: Record<
  ResourceKind,
  { icon: LucideIcon; palette: { ink: string; soft: string } }
> = {
  pdf: { icon: FileText, palette: categories.red },
  sheet: { icon: FileText, palette: categories.green },
  slides: { icon: Presentation, palette: categories.orange },
};

/**
 * Material de estudio de la lección activa. Los ejercicios generados con IA se marcan como tales;
 * hoy son datos de muestra (no hay servicio de generación). Abrir/descargar aún no está conectado.
 */
export function MaterialsCard({
  materials,
}: {
  materials: {
    id: string;
    kind: ResourceKind;
    meta: string;
    name: string;
    source: MaterialSource;
  }[];
}) {
  return (
    <Card style={styles.card}>
      <CardHeader
        clay={{ kind: 'book', palette: BRAND_PALETTE }}
        icon={FileText}
        title="Material de estudio"
      />
      {materials.length === 0 && (
        <Text style={styles.meta}>Esta lección aún no tiene material complementario.</Text>
      )}
      {materials.map(({ id, kind, meta, name, source }) => {
        const { icon: Icon, palette } = resourceStyle[kind];
        return (
          <View key={id} style={styles.resource}>
            <View style={[styles.resourceIcon, { backgroundColor: palette.soft }]}>
              <Icon color={palette.ink} size={20} strokeWidth={2} />
            </View>
            <View style={styles.flex}>
              <Text numberOfLines={2} style={styles.resourceName}>
                {name}
              </Text>
              <View style={styles.metaRow}>
                {source === 'ai' && (
                  <View style={styles.aiPill}>
                    <Sparkles color={brand.blueDeep} size={11} strokeWidth={2.4} />
                    <Text style={styles.aiText}>Generado con IA</Text>
                  </View>
                )}
                <Text style={styles.meta}>{meta}</Text>
              </View>
            </View>
            <Pressable
              accessibilityHint="Pendiente de integración con archivos"
              accessibilityLabel={`Abrir ${name}`}
              accessibilityRole="button"
              onPress={() => undefined}
            >
              {({ pressed }) => (
                <Raised3D depth={3} faceStyle={styles.download} pressed={pressed} variant="white">
                  <Download color={colors.text} size={18} strokeWidth={2.2} />
                </Raised3D>
              )}
            </Pressable>
          </View>
        );
      })}
    </Card>
  );
}

/** Botón principal 3D de ancho completo (Resolver tarea, Entregar tarea). */
export function TaskActionButton({
  disabled = false,
  hint,
  icon: Icon,
  label,
  onPress,
}: {
  disabled?: boolean;
  hint?: string;
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityHint={hint}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
    >
      {({ pressed }) => (
        <Raised3D
          faceStyle={[styles.button, disabled && styles.buttonDisabled]}
          pressed={pressed}
          variant={disabled ? 'white' : 'primary'}
        >
          <Icon color={disabled ? colors.textMuted : brand.onBlue} size={18} strokeWidth={2.2} />
          <Text style={disabled ? styles.buttonTextDisabled : styles.buttonTextPrimary}>
            {label}
          </Text>
        </Raised3D>
      )}
    </Pressable>
  );
}

/**
 * Tarjeta «Tu tarea»: estado, plazo, intentos, PDF de la tarea y una acción (Resolver tarea en
 * el curso y en Tareas; Entregar tarea en el espacio de resolución).
 */
export function TaskSideCard({
  action,
  attemptsUsed,
  showInstructions = false,
  submittedInSession = false,
  task,
}: {
  action?: ReactNode;
  attemptsUsed: number;
  showInstructions?: boolean;
  submittedInSession?: boolean;
  task: StudentTask;
}) {
  const pill = taskStatusPill(task, submittedInSession);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>Tu tarea</Text>
        <View style={[styles.pill, { backgroundColor: pill.background }]}>
          <Text style={[styles.pillText, { color: pill.color }]}>{pill.label}</Text>
        </View>
      </View>
      <View style={styles.taskRow}>
        <Clay3DIcon kind="clipboard" palette={categories.orange} shadow={false} size={48} />
        <View style={styles.flex}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.metaRow}>
            <CalendarClock color={colors.textMuted} size={14} strokeWidth={2} />
            <Text style={styles.meta}>{task.dueLabel}</Text>
          </View>
          <View style={styles.metaRow}>
            <ListChecks color={colors.textMuted} size={14} strokeWidth={2} />
            <Text style={styles.meta}>
              Intentos de entrega: {attemptsUsed} de {task.attempts.max}
            </Text>
          </View>
        </View>
      </View>
      {showInstructions && (
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Instrucciones</Text>
          <Text style={styles.helpText}>{task.instructions}</Text>
        </View>
      )}
      {task.attachments.length > 0 && (
        <View style={styles.attachments}>
          {task.attachments.map(({ kind, name }) => {
            const Icon = attachmentIcons[kind];
            return (
              <Pressable
                key={name}
                accessibilityHint="Pendiente de integración con archivos"
                accessibilityLabel={`Abrir ${name}`}
                accessibilityRole="button"
                onPress={() => undefined}
              >
                {({ pressed }) => (
                  <Raised3D
                    depth={3}
                    faceStyle={styles.attachment}
                    pressed={pressed}
                    radius={radius.chip}
                    variant="white"
                  >
                    <Icon color={categories.red.ink} size={16} strokeWidth={2.2} />
                    <Text numberOfLines={1} style={styles.attachmentText}>
                      {name}
                    </Text>
                  </Raised3D>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
      {action}
    </Card>
  );
}

/**
 * Ayuda del docente: si el asistente IA no basta, el alumno envía una solicitud y continúa la
 * conversación con el docente en la pestaña «Docente» (sin videollamadas).
 */
export function TeacherHelpCard({
  onOpenChat,
  onRequest,
  requested,
}: {
  onOpenChat: () => void;
  onRequest: () => void;
  requested: boolean;
}) {
  return (
    <View style={styles.help}>
      <SoftScene base={categories.green.base} />
      <View style={styles.helpHeader}>
        <View style={styles.flex}>
          <Text style={styles.cardTitle}>¿Necesitas a tu docente?</Text>
          <Text style={styles.helpText}>
            Si el asistente no resolvió tu duda, envía una solicitud y tu docente te responderá por
            el chat.
          </Text>
        </View>
        <Clay3DIcon kind="badge" palette={categories.green} size={64} />
      </View>

      {requested ? (
        <View style={styles.requested}>
          <View style={styles.requestedRow}>
            <CircleCheck color={categories.green.ink} size={18} strokeWidth={2.4} />
            <Text style={styles.requestedTitle}>Solicitud enviada</Text>
          </View>
          <Text style={styles.meta}>
            Tu docente ya tiene tu consulta. Recibirás la respuesta en la pestaña «Docente».
          </Text>
          <Pressable accessibilityRole="button" onPress={onOpenChat}>
            {({ pressed }) => (
              <Raised3D faceStyle={styles.button} pressed={pressed} variant="white">
                <MessageCircle color={colors.text} size={18} strokeWidth={2.2} />
                <Text style={styles.buttonText}>Ir al chat con el docente</Text>
              </Raised3D>
            )}
          </Pressable>
        </View>
      ) : (
        <Pressable accessibilityRole="button" onPress={onRequest}>
          {({ pressed }) => (
            <Raised3D
              faceStyle={styles.button}
              palette={categories.green}
              pressed={pressed}
              variant="white"
            >
              <GoogleMeetIcon size={22} />
              <Text style={[styles.buttonText, { color: categories.green.ink }]}>
                Contactar con docente
              </Text>
            </Raised3D>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: spacing.md, padding: spacing.md },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 18 },
  pill: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  instructions: { gap: 2 },
  instructionsTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 14 },
  pillText: { fontFamily: fontFamily.semibold, fontSize: 12 },
  attachments: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  attachment: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 44,
    maxWidth: 260,
    paddingHorizontal: 12,
  },
  attachmentText: {
    color: colors.text,
    flexShrink: 1,
    fontFamily: fontFamily.medium,
    fontSize: 13,
  },
  resource: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 64,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resourceIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  resourceName: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 14 },
  aiPill: {
    alignItems: 'center',
    backgroundColor: brand.blueSoft,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  aiText: { color: brand.blueDeep, fontFamily: fontFamily.semibold, fontSize: 11 },
  download: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  taskRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  taskTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 15, marginBottom: 4 },
  metaRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  meta: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 18 },
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  buttonText: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 14 },
  buttonTextPrimary: { color: brand.onBlue, fontFamily: fontFamily.bold, fontSize: 14 },
  buttonDisabled: { backgroundColor: colors.track },
  buttonTextDisabled: { color: colors.textMuted, fontFamily: fontFamily.bold, fontSize: 14 },
  help: {
    backgroundColor: categories.green.soft,
    borderRadius: radius.card,
    gap: spacing.md,
    overflow: 'hidden',
    padding: spacing.md,
  },
  helpHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  helpText: {
    color: colors.textMuted,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  requested: {
    backgroundColor: colors.surface,
    borderRadius: radius.chip,
    gap: spacing.sm,
    padding: 12,
  },
  requestedRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  requestedTitle: { color: categories.green.ink, fontFamily: fontFamily.bold, fontSize: 14 },
});
