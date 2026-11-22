import { LinearGradient } from 'expo-linear-gradient';
import { Check, ChevronDown, ChevronUp, Play } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Clay3DIcon } from '@/components/Clay3DIcon';
import { SoftScene } from '@/components/SoftScene';
import { brand, categories, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import type { LessonStatus, RoadmapItem, RoadmapUnit } from '../../mocks/courseDetail';
import { CardHeader } from '../home/CardHeader';

const NODE = 28;
const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };

/** Nodo 3D del roadmap: hecho (verde con check), actual (azul con play) o pendiente (anillo). */
function StatusNode({ size = NODE, status }: { size?: number; status: LessonStatus }) {
  if (status === 'pending') {
    return (
      <View style={[styles.nodePending, { borderRadius: size / 2, height: size, width: size }]} />
    );
  }

  const isDone = status === 'done';
  return (
    <View style={{ height: size + 3, width: size }}>
      <View
        style={[
          styles.nodeEdge,
          {
            backgroundColor: isDone ? categories.green.ink : brand.blueNight,
            borderRadius: size / 2,
            height: size,
            width: size,
          },
        ]}
      />
      <LinearGradient
        colors={
          isDone ? [categories.green.base, categories.green.ink] : [brand.blue, brand.blueDeep]
        }
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[styles.nodeFace, { borderRadius: size / 2, height: size, width: size }]}
      >
        {isDone ? (
          <Check color={brand.onBlue} size={size * 0.55} strokeWidth={3} />
        ) : (
          <Play color={brand.onBlue} fill={brand.onBlue} size={size * 0.42} />
        )}
      </LinearGradient>
    </View>
  );
}

function unitStatus(unit: RoadmapUnit): LessonStatus {
  if (unit.items.every((item) => item.status === 'done')) return 'done';
  if (unit.items.some((item) => item.status !== 'pending')) return 'current';
  return 'pending';
}

function LessonRow({ isLast, item }: { isLast: boolean; item: RoadmapItem }) {
  const isCurrent = item.status === 'current';

  return (
    <View style={styles.lessonRow}>
      {/* Columna del recorrido: nodo + línea hacia el siguiente. */}
      <View style={styles.rail}>
        {item.kind === 'task' ? (
          <Clay3DIcon kind="clipboard" palette={categories.orange} shadow={false} size={30} />
        ) : (
          <StatusNode size={24} status={item.status} />
        )}
        {!isLast && (
          <View style={[styles.railLine, item.status === 'done' && styles.railLineDone]} />
        )}
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => undefined}
        style={({ pressed }) => [
          styles.lesson,
          isCurrent && styles.lessonCurrent,
          pressed && !isCurrent && styles.lessonPressed,
        ]}
      >
        {isCurrent && <SoftScene base={brand.blue} />}
        <View style={styles.lessonText}>
          <Text
            numberOfLines={2}
            style={[styles.lessonTitle, isCurrent && styles.lessonTitleCurrent]}
          >
            {item.title}
          </Text>
          {item.duration && <Text style={styles.lessonMeta}>{item.duration}</Text>}
        </View>
        {isCurrent && <Text style={styles.nowPill}>En curso</Text>}
      </Pressable>
    </View>
  );
}

/** Roadmap del curso: unidades desplegables con el recorrido de lecciones y la tarea. */
export function RoadmapCard({ units }: { units: RoadmapUnit[] }) {
  const [openId, setOpenId] = useState<string | undefined>(
    units.find((unit) => unitStatus(unit) === 'current')?.id ?? units[0]?.id,
  );

  return (
    <Card style={styles.card}>
      <CardHeader
        clay={{ kind: 'book', palette: BRAND_PALETTE }}
        icon={Play}
        title="Contenido del curso"
      />
      {units.map((unit) => {
        const isOpen = unit.id === openId;
        const status = unitStatus(unit);
        const lessons = unit.items.filter((item) => item.kind === 'lesson');
        const done = lessons.filter((item) => item.status === 'done').length;
        const Chevron = isOpen ? ChevronUp : ChevronDown;

        return (
          <View key={unit.id} style={[styles.unit, isOpen && styles.unitOpen]}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              onPress={() => setOpenId(isOpen ? undefined : unit.id)}
              style={styles.unitHeader}
            >
              <StatusNode status={status} />
              <View style={styles.unitText}>
                <Text numberOfLines={2} style={styles.unitTitle}>
                  {unit.title}
                </Text>
                <Text style={styles.unitMeta}>
                  {done} / {lessons.length} lecciones
                </Text>
              </View>
              <Chevron color={colors.textMuted} size={20} strokeWidth={2.2} />
            </Pressable>
            {isOpen && (
              <View style={styles.lessons}>
                {unit.items.map((item, index) => (
                  <LessonRow key={item.id} isLast={index === unit.items.length - 1} item={item} />
                ))}
              </View>
            )}
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm, padding: spacing.md },
  nodePending: { backgroundColor: colors.surface, borderColor: colors.trackFill, borderWidth: 2 },
  nodeEdge: { position: 'absolute', top: 3 },
  nodeFace: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  unit: { borderRadius: radius.chip, padding: 10 },
  unitOpen: { backgroundColor: colors.background },
  unitHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, minHeight: 48 },
  unitText: { flex: 1, gap: 2 },
  unitTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 15 },
  unitMeta: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  lessons: { marginTop: spacing.sm },
  lessonRow: { flexDirection: 'row', gap: spacing.sm },
  rail: { alignItems: 'center', width: NODE + 2 },
  railLine: { backgroundColor: colors.border, flex: 1, marginVertical: 2, width: 3 },
  railLineDone: { backgroundColor: categories.green.base },
  lesson: {
    alignItems: 'center',
    borderRadius: radius.chip,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: 6,
    minHeight: 48,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  lessonCurrent: { backgroundColor: brand.blueSoft, ...shadows.card },
  lessonPressed: { backgroundColor: colors.track },
  lessonText: { flex: 1, gap: 2 },
  lessonTitle: { color: colors.text, fontFamily: fontFamily.medium, fontSize: 14 },
  lessonTitleCurrent: { color: brand.blueDeep, fontFamily: fontFamily.bold },
  lessonMeta: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  nowPill: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    color: brand.blueDeep,
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});
