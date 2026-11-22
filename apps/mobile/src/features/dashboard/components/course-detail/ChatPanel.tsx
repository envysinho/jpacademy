import {
  CircleCheck,
  FileText,
  LifeBuoy,
  Paperclip,
  SendHorizontal,
  Sparkles,
  UserRound,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card } from '@/components/Card';
import { Raised3D } from '@/components/Raised3D';
import { SoftScene } from '@/components/SoftScene';
import { brand, categories, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import type { ChatMessage } from '../../mocks/courseDetail';

export type ChatTab = 'ai' | 'teacher';

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
      <Text
        style={[
          styles.avatarText,
          { color: from === 'teacher' ? categories.green.ink : brand.blueDeep },
        ]}
      >
        {from === 'teacher' ? 'VR' : 'JP'}
      </Text>
    </View>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
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
                <Text style={[styles.textStrong, styles.flex]}>Análisis de tu tarea</Text>
                <View style={styles.estimate}>
                  <CircleCheck color={categories.green.ink} size={13} strokeWidth={2.4} />
                  <Text style={styles.estimateText}>Estimada: {message.analysis.estimate}</Text>
                </View>
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
        <Text style={styles.meta}>{message.time}</Text>
      </View>
    </View>
  );
}

/** Chat de la lección: asistente IA y, si no basta, el docente. Solo visual. */
export function ChatPanel({
  aiMessages,
  helpRequested,
  onRequestHelp,
  onTabChange,
  tab,
  teacher,
  teacherMessages,
}: {
  aiMessages: ChatMessage[];
  helpRequested: boolean;
  onRequestHelp: () => void;
  onTabChange: (tab: ChatTab) => void;
  tab: ChatTab;
  teacher: string;
  teacherMessages: ChatMessage[];
}) {
  return (
    <Card style={styles.card}>
      <View style={styles.tabs}>
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

      <View style={styles.messages}>
        {tab === 'ai' ? (
          <>
            {aiMessages.map((message) => (
              <Bubble key={message.id} message={message} />
            ))}
            {/* Escalado: si la IA no basta, se pide ayuda al docente. */}
            <View style={styles.escalation}>
              <SoftScene base={categories.green.base} />
              <LifeBuoy color={categories.green.ink} size={22} strokeWidth={2} />
              <Text style={[styles.text, styles.flex]}>
                ¿Sigue sin quedar claro? {teacher} puede ayudarte.
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
          </>
        ) : (
          <>
            {helpRequested ? (
              <View style={styles.system}>
                <CircleCheck color={categories.green.ink} size={14} strokeWidth={2.4} />
                <Text style={styles.systemText}>
                  Solicitud de ayuda enviada a {teacher} · 15:38
                </Text>
              </View>
            ) : (
              <View style={styles.system}>
                <Text style={styles.systemText}>
                  Escribe a {teacher}. Responde en horario de clases.
                </Text>
              </View>
            )}
            {teacherMessages.map((message) => (
              <Bubble key={message.id} message={message} />
            ))}
          </>
        )}
      </View>

      <View style={styles.inputRow}>
        <Pressable
          accessibilityLabel="Adjuntar archivo"
          accessibilityRole="button"
          onPress={() => undefined}
        >
          {({ pressed }) => (
            <Raised3D depth={3} faceStyle={styles.iconButton} pressed={pressed} variant="white">
              <Paperclip color={colors.text} size={18} strokeWidth={2.2} />
            </Raised3D>
          )}
        </Pressable>
        <TextInput
          placeholder={tab === 'ai' ? 'Escribe una pregunta o mensaje…' : `Escribe a ${teacher}…`}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <Pressable accessibilityLabel="Enviar" accessibilityRole="button" onPress={() => undefined}>
          {({ pressed }) => (
            <Raised3D depth={3} faceStyle={styles.iconButton} pressed={pressed} variant="primary">
              <SendHorizontal color={brand.onBlue} size={18} strokeWidth={2.2} />
            </Raised3D>
          )}
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, padding: spacing.md },
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
  messages: { gap: spacing.md },
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
  analysisHeader: { alignItems: 'center', flexDirection: 'row', gap: 6, marginBottom: 2 },
  estimate: {
    alignItems: 'center',
    backgroundColor: categories.green.soft,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  estimateText: { color: categories.green.ink, fontFamily: fontFamily.semibold, fontSize: 11 },
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
  inputRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm },
  iconButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    height: 44,
    paddingHorizontal: spacing.md,
  },
});
