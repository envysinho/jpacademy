import {
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Clay3DIcon } from '@/components/Clay3DIcon';
import { SoftScene } from '@/components/SoftScene';
import { brand, colors, fontFamily, radius, spacing } from '@/theme';

import { Raised3D } from '@/components/Raised3D';

import type { CalendarEvent } from '../../mocks/studentCalendar';

import { eventTypes } from './calendarVisuals';

type ViewKey = 'day' | 'week' | 'month';

const EMPTY_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };

const VIEWS: { icon: LucideIcon; key: ViewKey; label: string }[] = [
  { icon: CalendarDays, key: 'day', label: 'Diaria' },
  { icon: CalendarRange, key: 'week', label: 'Semanal' },
  { icon: LayoutGrid, key: 'month', label: 'Mensual' },
];

/**
 * Agenda del día: selector de vista, fecha y línea de tiempo de eventos. Con `fill` ocupa el
 * alto disponible y la lista se desplaza por dentro si hay más eventos de los que caben.
 */
export function DayAgenda({
  emptyAction,
  fill = false,
  items,
  onNext,
  onPrev,
  title,
}: {
  /** Acción del estado vacío (p. ej. volver a estudiar). */
  emptyAction?: { label: string; onPress: () => void };
  fill?: boolean;
  items: CalendarEvent[];
  onNext?: () => void;
  onPrev?: () => void;
  title: string;
}) {
  // Solo visual: la vista semanal y la mensual aún no tienen contenido propio.
  const [view, setView] = useState<ViewKey>('day');

  return (
    <Card style={[styles.card, fill && styles.cardFill]}>
      <View style={styles.views}>
        {VIEWS.map(({ icon: Icon, key, label }) => {
          const isActive = key === view;
          return (
            <Pressable
              key={key}
              accessibilityLabel={`Vista ${label.toLowerCase()}`}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              onPress={() => setView(key)}
              style={[styles.viewTab, isActive && styles.viewTabActive]}
            >
              <Icon
                color={isActive ? brand.blueDeep : colors.textMuted}
                size={16}
                strokeWidth={2}
              />
              <Text numberOfLines={1} style={[styles.viewText, isActive && styles.viewTextActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <View style={styles.navs}>
          {[
            { Icon: ChevronLeft, label: 'Día anterior', onPress: onPrev },
            { Icon: ChevronRight, label: 'Día siguiente', onPress: onNext },
          ].map(({ Icon, label, onPress }) => (
            <Pressable
              key={label}
              accessibilityLabel={label}
              accessibilityRole="button"
              disabled={!onPress}
              hitSlop={6}
              onPress={onPress}
              style={({ pressed }) => [styles.nav, pressed && styles.navPressed]}
            >
              <Icon color={colors.text} size={20} strokeWidth={2.2} />
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.timeline}
        nestedScrollEnabled
        scrollEnabled={fill}
        style={fill && styles.timelineFill}
      >
        {items.length === 0 && (
          <View style={styles.emptyBox}>
            <Clay3DIcon kind="calendar" palette={EMPTY_PALETTE} size={72} />
            <Text style={styles.emptyTitle}>Sin eventos este día</Text>
            <Text style={styles.emptyText}>
              Aquí solo aparecen entregas, asesorías y actividades con fecha. Avanza a tu ritmo.
            </Text>
            {emptyAction && (
              <Pressable accessibilityRole="button" onPress={emptyAction.onPress}>
                {({ pressed }) => (
                  <Raised3D faceStyle={styles.emptyButton} pressed={pressed}>
                    <Text style={styles.emptyButtonText}>{emptyAction.label}</Text>
                  </Raised3D>
                )}
              </Pressable>
            )}
          </View>
        )}
        {items.map(({ duration, id, status, subtitle, time, title: itemTitle, type }) => {
          const { clay, palette } = eventTypes[type];

          return (
            <View key={id} style={styles.row}>
              <Text style={styles.time}>{time}</Text>
              <Pressable
                accessibilityLabel={`${time}, ${itemTitle}. ${subtitle}`}
                accessibilityRole="button"
                onPress={() => undefined}
                style={({ pressed }) => [
                  styles.event,
                  { backgroundColor: palette.soft },
                  pressed && styles.eventPressed,
                ]}
              >
                <SoftScene base={palette.base} />
                <Clay3DIcon kind={clay} palette={palette} shadow={false} size={42} />
                <View style={styles.eventText}>
                  <Text numberOfLines={1} style={styles.eventTitle}>
                    {itemTitle}
                  </Text>
                  <Text numberOfLines={1} style={styles.eventSubtitle}>
                    {subtitle}
                  </Text>
                </View>
                <View style={styles.eventSide}>
                  {status ? (
                    <View style={styles.statusPill}>
                      <Text style={[styles.statusText, { color: palette.ink }]}>{status}</Text>
                    </View>
                  ) : (
                    duration && (
                      <View style={styles.durationPill}>
                        <Text style={styles.durationText}>{duration}</Text>
                      </View>
                    )
                  )}
                </View>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, padding: spacing.md },
  cardFill: { flex: 1 },
  timelineFill: { flex: 1 },
  emptyBox: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  emptyTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 16 },
  emptyText: {
    color: colors.textMuted,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    maxWidth: 340,
    textAlign: 'center',
  },
  emptyButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyButtonText: { color: brand.blueDeep, fontFamily: fontFamily.bold, fontSize: 14 },
  views: {
    backgroundColor: colors.track,
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  viewTab: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    height: 48,
    justifyContent: 'center',
  },
  viewTabActive: { backgroundColor: colors.surface },
  viewText: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 13 },
  viewTextActive: { color: brand.blueDeep, fontFamily: fontFamily.semibold },
  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  title: { color: colors.text, flex: 1, fontFamily: fontFamily.bold, fontSize: 17 },
  navs: { flexDirection: 'row', gap: 4 },
  nav: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  navPressed: { backgroundColor: colors.track },
  timeline: { gap: 10 },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  time: {
    color: colors.textMuted,
    fontFamily: fontFamily.medium,
    fontSize: 13,
    width: 44,
  },
  event: {
    alignItems: 'center',
    borderRadius: radius.chip,
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 68,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  eventPressed: { opacity: 0.8 },
  eventText: { flex: 1, gap: 2 },
  eventTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 15 },
  eventSubtitle: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  eventSide: { alignItems: 'flex-end', gap: 6 },
  durationPill: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  durationText: { color: colors.text, fontFamily: fontFamily.medium, fontSize: 11 },
  statusPill: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: { fontFamily: fontFamily.semibold, fontSize: 11 },
});
