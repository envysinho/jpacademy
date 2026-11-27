import { LinearGradient } from 'expo-linear-gradient';
import { Check, ChevronDown, ChevronUp, Lock, Play } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Clay3DIcon } from '@/components/Clay3DIcon';
import { SoftScene } from '@/components/SoftScene';
import { brand, categories, colors, fontFamily, radius, shadows, spacing } from '@/theme';

import { canStudyLesson, lessonStatusLabel } from '../../data/learningRules';
import type { LessonStatus, RoadmapItem, RoadmapUnit } from '../../mocks/courseDetail';
import { CardHeader } from '../home/CardHeader';

const NODE = 28;
const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };

/** Altura máxima del temario antes de desplazarse por dentro (cursos largos). */
const MAX_LIST_HEIGHT = 520;

/** Nodo 3D del roadmap: hecho (verde con check), actual (azul con play) o bloqueado (candado). */
function StatusNode({ size = NODE, status }: { size?: number; status: LessonStatus }) {
  if (status === 'pending') {
    return (
      <View style={[styles.nodePending, { borderRadius: size / 2, height: size, width: size }]}>
        <Lock color={colors.textMuted} size={size * 0.46} strokeWidth={2.4} />
      </View>
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

/**
 * Fila del temario. No es navegable: el avance es secuencial y la lección activa ya está abierta
 * a la izquierda. Expandir una unidad solo permite ver su estructura.
 */
function LessonRow({ isLast, item }: { isLast: boolean; item: RoadmapItem }) {
  const isCurrent = canStudyLesson(item.status);
  const isLocked = item.status === 'pending';
  const stateLabel = item.kind === 'task' ? 'Tarea' : lessonStatusLabel[item.status];

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
      <View
        accessibilityLabel={`${item.title}. ${stateLabel}`}
        accessible
        style={[styles.lesson, isCurrent && styles.lessonCurrent]}
      >
        {isCurrent && <SoftScene base={brand.blue} />}
        <View style={styles.lessonText}>
          <Text
            numberOfLines={2}
            style={[
              styles.lessonTitle,
              isCurrent && styles.lessonTitleCurrent,
              isLocked && styles.lessonTitleLocked,
            ]}
          >
            {item.title}
          </Text>
          <Text style={styles.lessonMeta}>
            {[item.duration, item.kind === 'lesson' && !isCurrent ? stateLabel : undefined]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </View>
        {isCurrent && <Text style={styles.nowPill}>En curso</Text>}
      </View>
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
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
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
                accessibilityLabel={`${unit.title}, ${done} de ${lessons.length} lecciones`}
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
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm, padding: spacing.md },
  nodePending: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.trackFill,
    borderWidth: 2,
    justifyContent: 'center',
  },
  list: { maxHeight: MAX_LIST_HEIGHT },
  listContent: { gap: spacing.sm },
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
  lessonText: { flex: 1, gap: 2 },
  lessonTitle: { color: colors.text, fontFamily: fontFamily.medium, fontSize: 14 },
  lessonTitleCurrent: { color: brand.blueDeep, fontFamily: fontFamily.bold },
  lessonTitleLocked: { color: colors.textMuted },
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
