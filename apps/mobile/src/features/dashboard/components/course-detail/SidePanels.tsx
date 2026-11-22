import { CalendarClock, CircleCheck, ListChecks, MessageCircle, Upload } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Clay3DIcon } from '@/components/Clay3DIcon';
import { Raised3D } from '@/components/Raised3D';
import { SoftScene } from '@/components/SoftScene';
import { brand, categories, colors, fontFamily, radius, spacing } from '@/theme';

/** Tarea del curso: datos clave y botón 3D para entregar. */
export function TaskSideCard({
  attempts,
  due,
  title,
}: {
  attempts: string;
  due: string;
  title: string;
}) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>Tu tarea</Text>
        <View style={styles.pendingPill}>
          <Text style={styles.pendingText}>Pendiente</Text>
        </View>
      </View>
      <View style={styles.taskRow}>
        <Clay3DIcon kind="clipboard" palette={categories.orange} shadow={false} size={48} />
        <View style={styles.flex}>
          <Text style={styles.taskTitle}>{title}</Text>
          <View style={styles.metaRow}>
            <CalendarClock color={colors.textMuted} size={14} strokeWidth={2} />
            <Text style={styles.meta}>Entrega: {due}</Text>
          </View>
          <View style={styles.metaRow}>
            <ListChecks color={colors.textMuted} size={14} strokeWidth={2} />
            <Text style={styles.meta}>Intentos: {attempts}</Text>
          </View>
        </View>
      </View>
      <Pressable accessibilityRole="button" onPress={() => undefined}>
        {({ pressed }) => (
          <Raised3D faceStyle={styles.button} pressed={pressed} variant="primary">
            <Upload color={brand.onBlue} size={18} strokeWidth={2.2} />
            <Text style={styles.buttonTextPrimary}>Subir o entregar tarea</Text>
          </Raised3D>
        )}
      </Pressable>
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
  teacher,
}: {
  onOpenChat: () => void;
  onRequest: () => void;
  requested: boolean;
  teacher: string;
}) {
  return (
    <View style={styles.help}>
      <SoftScene base={categories.green.base} />
      <View style={styles.helpHeader}>
        <View style={styles.flex}>
          <Text style={styles.cardTitle}>¿Necesitas a tu docente?</Text>
          <Text style={styles.helpText}>
            Si el asistente no resolvió tu duda, envía una solicitud y {teacher} te responderá por
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
            {teacher} ya tiene tu consulta. Recibirás la respuesta en la pestaña «Docente».
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
              <MessageCircle color={categories.green.ink} size={18} strokeWidth={2.2} />
              <Text style={[styles.buttonText, { color: categories.green.ink }]}>
                Pedir ayuda al docente
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
  pendingPill: {
    backgroundColor: categories.orange.soft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pendingText: { color: categories.orange.ink, fontFamily: fontFamily.semibold, fontSize: 12 },
  taskRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  taskTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 15, marginBottom: 4 },
  metaRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
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
