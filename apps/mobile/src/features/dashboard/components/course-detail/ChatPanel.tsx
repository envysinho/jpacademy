import {
  Camera,
  CircleCheck,
  FileText,
  Info,
  LifeBuoy,
  Paperclip,
  SendHorizontal,
  Sparkles,
  UserRound,
  type LucideIcon,
} from 'lucide-react-native';
import { useEffect, useRef, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card } from '@/components/Card';
import { Raised3D } from '@/components/Raised3D';
import { SoftScene } from '@/components/SoftScene';
import { brand, categories, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import type { ChatTab } from '../../data/StudentSession';
import type { ChatMessage } from '../../mocks/courseDetail';
import { studentProfile } from '../../mocks/studentProgress';

export type { ChatTab };

const TABS: { icon: LucideIcon; key: ChatTab; label: string }[] = [
  { icon: Sparkles, key: 'ai', label: 'Asistente IA' },
  { icon: UserRound, key: 'teacher', label: 'Docente' },
];

function Avatar({ from }: { from: ChatMessage['from'] }) {
  if (from === 'ai') {
    return (
      <Raised3D depth={2} faceStyle={styles.avatar} variant="primary">
        <Sparkles color={brand.onBlue} size={16} strokeWidth={2.2} />
      </Raised3D>
    );
  }
  return (
    <View
      style={[
        styles.avatar,
        styles.avatarFlat,
        { backgroundColor: from === 'teacher' ? categories.green.soft : brand.blueSoft },
      ]}
    >
      {/* Docente sin nombre ficticio: icono genérico hasta tener su foto. */}
      {from === 'teacher' ? (
        <UserRound color={categories.green.ink} size={16} strokeWidth={2.2} />
      ) : (
        <Text style={[styles.avatarText, { color: brand.blueDeep }]}>
          {studentProfile.initials}
        </Text>
      )}
    </View>
  );
}

function Bubble({
  message,
  onAction,
}: {
  message: ChatMessage;
  onAction?: (actionId: string) => void;
}) {
  const isStudent = message.from === 'student';

  return (
    <View style={[styles.messageRow, isStudent && styles.messageRowStudent]}>
      <Avatar from={message.from} />
      <View style={[styles.messageColumn, isStudent && styles.messageColumnStudent]}>
        <View style={[styles.bubble, isStudent ? styles.bubbleStudent : styles.bubbleOther]}>
          {message.attachment && (
            <View style={styles.attachment}>
              <View style={styles.attachmentIcon}>
                <FileText color={categories.red.ink} size={18} strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.attachmentName}>{message.attachment.name}</Text>
                <Text style={styles.meta}>{message.attachment.size}</Text>
              </View>
            </View>
          )}
          {message.text && <Text style={styles.text}>{message.text}</Text>}
          {message.title && <Text style={styles.textStrong}>{message.title}</Text>}
          {message.steps?.map((step, index) => (
            <Text key={step} style={styles.text}>
              {index + 1}. {step}
            </Text>
          ))}
          {message.analysis && (
            <View style={styles.analysis}>
              <View style={styles.analysisHeader}>
                <FileText color={colors.text} size={16} strokeWidth={2.2} />
                <Text style={[styles.textStrong, styles.flex]}>Orientación sobre tu avance</Text>
              </View>
              <Text style={styles.text}>{message.analysis.summary}</Text>
              {message.analysis.points.map((point) => (
                <Text key={point} style={styles.text}>
                  • {point}
                </Text>
              ))}
              <Text style={styles.textStrong}>{message.analysis.question}</Text>
            </View>
          )}
        </View>
        {message.actions && message.actions.length > 0 && (
          <View style={styles.actions}>
            {message.actions.map(({ id, label }) => (
              <Pressable
                key={id}
                accessibilityRole="button"
                disabled={!onAction}
                onPress={() => onAction?.(id)}
              >
                {({ pressed }) => (
                  <Raised3D depth={3} faceStyle={styles.actionButton} pressed={pressed}>
                    <Text style={styles.actionText}>{label}</Text>
                  </Raised3D>
                )}
              </Pressable>
            ))}
          </View>
        )}
        <Text style={styles.meta}>{message.time}</Text>
      </View>
    </View>
  );
}

/**
 * Chat del espacio de resolución: Asistente IA / Docente, con historial por tarea, borrador por
 * canal y envío. Consultar aquí **no** es entregar ni consume intentos.
 *
 * DESARROLLO: no hay IA, chat docente ni cámara/archivos conectados. Los mensajes enviados se
 * guardan solo en la sesión y no se simulan respuestas.
 */
export function ChatPanel({
  draft,
  helpRequested,
  messages,
  onAction,
  onChangeDraft,
  onRequestHelp,
  onSend,
  onTabChange,
  tab,
}: {
  draft: string;
  helpRequested: boolean;
  messages: ChatMessage[];
  /** Botones dentro de los mensajes (ver `ChatMessage.actions`). */
  onAction?: (actionId: string) => void;
  onChangeDraft: (text: string) => void;
  onRequestHelp: () => void;
  onSend: () => void;
  onTabChange: (tab: ChatTab) => void;
  tab: ChatTab;
}) {
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const hasUnanswered = messages.at(-1)?.id.startsWith('local-') ?? false;
  const canSend = draft.trim().length > 0;

  // Al llegar un mensaje nuevo o cambiar de canal, mostrar el final del historial.
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: false });
  }, [messages.length, tab]);

  return (
    <Card style={styles.card}>
      <View accessibilityRole="tablist" style={styles.tabs}>
        {TABS.map(({ icon: Icon, key, label }) => {
          const isActive = key === tab;
          const content = (
            <>
              <Icon color={isActive ? brand.onBlue : colors.text} size={16} strokeWidth={2.2} />
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{label}</Text>
            </>
          );
          return (
            <Pressable
              key={key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              onPress={() => onTabChange(key)}
              style={styles.flex}
            >
              {({ pressed }) =>
                isActive ? (
                  <Raised3D
                    depth={3}
                    faceStyle={styles.tab}
                    pressed={pressed}
                    radius={radius.chip}
                    variant="primary"
                  >
                    {content}
                  </Raised3D>
                ) : (
                  <View style={[styles.tab, styles.tabFlat]}>{content}</View>
                )
              }
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messages}
        keyboardShouldPersistTaps="handled"
        style={styles.flex}
      >
        {tab === 'teacher' && (
          <View style={styles.system}>
            {helpRequested && (
              <CircleCheck color={categories.green.ink} size={14} strokeWidth={2.4} />
            )}
            <Text style={styles.systemText}>
              {helpRequested
                ? 'Solicitud de ayuda enviada a tu docente. Te responderá por este chat.'
                : 'Aún no has pedido ayuda. Escribe a tu docente o usa «Contactar con docente».'}
            </Text>
          </View>
        )}
        {messages.length === 0 && tab === 'ai' && (
          <View style={styles.system}>
            <Text style={styles.systemText}>
              Pregunta por un paso que no entiendas. El asistente te orienta con pistas, no con la
              respuesta final.
            </Text>
          </View>
        )}
        {messages.map((message) => (
          <Bubble key={message.id} message={message} onAction={onAction} />
        ))}
        {hasUnanswered && (
          <View style={styles.notice}>
            <Info color={colors.textMuted} size={14} strokeWidth={2.2} />
            <Text style={[styles.systemText, styles.flex]}>
              {tab === 'ai'
                ? 'El asistente IA aún no está conectado: tu mensaje queda en el historial de esta tarea.'
                : 'El chat con el docente aún no está conectado: tu mensaje queda en el historial de esta tarea.'}
            </Text>
          </View>
        )}
        {/* Escalado: si la IA no basta, se pide ayuda al docente. */}
        {tab === 'ai' && (
          <View style={styles.escalation}>
            <SoftScene base={categories.green.base} />
            <LifeBuoy color={categories.green.ink} size={22} strokeWidth={2} />
            <Text style={[styles.text, styles.flex]}>
              ¿Sigue sin quedar claro? Un docente puede ayudarte.
            </Text>
            <Pressable accessibilityRole="button" onPress={onRequestHelp}>
              {({ pressed }) => (
                <Raised3D
                  depth={3}
                  faceStyle={styles.escalationButton}
                  palette={categories.green}
                  pressed={pressed}
                  variant="white"
                >
                  <Text style={styles.escalationText}>
                    {helpRequested ? 'Ver chat' : 'Pedir ayuda'}
                  </Text>
                </Raised3D>
              )}
            </Pressable>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputRow}>
        {(
          [
            { icon: Camera, label: 'Fotografiar tu desarrollo' },
            { icon: Paperclip, label: 'Adjuntar archivo' },
          ] as const
        ).map(({ icon: Icon, label }) => (
          <View
            key={label}
            accessibilityHint="Pendiente de integrar cámara y archivos"
            accessibilityLabel={label}
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            accessible
            style={[styles.iconButton, styles.iconButtonDisabled]}
          >
            <Icon color={colors.trackFill} size={18} strokeWidth={2.2} />
          </View>
        ))}
        <TextInput
          accessibilityLabel={
            tab === 'ai' ? 'Mensaje para el asistente' : 'Mensaje para el docente'
          }
          multiline
          onChangeText={onChangeDraft}
          placeholder={tab === 'ai' ? 'Escribe una pregunta o mensaje…' : 'Escribe a tu docente…'}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={draft}
        />
        <Pressable
          accessibilityLabel="Enviar"
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSend }}
          disabled={!canSend}
          onPress={onSend}
        >
          {({ pressed }) => (
            <Raised3D
              depth={3}
              faceStyle={styles.iconButton}
              pressed={pressed}
              variant={canSend ? 'primary' : 'white'}
            >
              <SendHorizontal
                color={canSend ? brand.onBlue : colors.textMuted}
                size={18}
                strokeWidth={2.2}
              />
            </Raised3D>
          )}
        </Pressable>
      </View>
      <Text style={styles.hint}>
        Fotos y archivos se podrán adjuntar al integrar la cámara. Consultar no consume intentos.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: spacing.md, padding: spacing.md },
  flex: { flex: 1 },
  tabs: {
    alignItems: 'flex-start',
    backgroundColor: colors.track,
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  tab: {
    alignItems: 'center',
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: 6,
    height: 44,
    justifyContent: 'center',
  },
  tabFlat: { marginBottom: 3 },
  tabText: { color: colors.text, fontFamily: fontFamily.medium, fontSize: 14 },
  tabTextActive: { color: brand.onBlue, fontFamily: fontFamily.bold },
  messages: { gap: spacing.md, paddingVertical: spacing.xs },
  messageRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm },
  messageRowStudent: { flexDirection: 'row-reverse' },
  messageColumn: { flexShrink: 1, gap: 4, maxWidth: '82%' },
  messageColumnStudent: { alignItems: 'flex-end' },
  avatar: { alignItems: 'center', height: 34, justifyContent: 'center', width: 34 },
  avatarFlat: { borderRadius: radius.pill },
  avatarText: { fontFamily: fontFamily.bold, fontSize: 11 },
  bubble: { borderRadius: radius.chip, gap: 4, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleStudent: { backgroundColor: brand.blueSoft, borderTopRightRadius: 4 },
  bubbleOther: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    ...shadows.card,
  },
  text: { color: colors.text, fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  textStrong: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 14, lineHeight: 20 },
  meta: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 11 },
  attachment: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: 4,
    padding: 8,
  },
  attachmentIcon: {
    alignItems: 'center',
    backgroundColor: categories.red.soft,
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  attachmentName: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 13 },
  analysis: { gap: 4 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  actionButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  actionText: { color: brand.blueDeep, fontFamily: fontFamily.bold, fontSize: 13 },
  analysisHeader: { alignItems: 'center', flexDirection: 'row', gap: 6, marginBottom: 2 },
  escalation: {
    alignItems: 'center',
    backgroundColor: categories.green.soft,
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: spacing.sm,
    overflow: 'hidden',
    padding: 12,
  },
  escalationButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  escalationText: { color: categories.green.ink, fontFamily: fontFamily.bold, fontSize: 13 },
  system: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.track,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  systemText: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 12 },
  notice: {
    alignItems: 'flex-start',
    backgroundColor: colors.track,
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: 6,
    padding: 10,
  },
  inputRow: { alignItems: 'flex-end', flexDirection: 'row', gap: spacing.sm },
  iconButton: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  iconButtonDisabled: {
    backgroundColor: colors.track,
    borderColor: colors.border,
    borderWidth: 1,
    marginBottom: 3,
  },
  hint: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 11 },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.chip,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    maxHeight: 120,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: 3,
  },
});
