import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Clay3DIcon } from '@/components/Clay3DIcon';
import { SoftScene } from '@/components/SoftScene';
import { brand, colors, fontFamily, radius, spacing } from '@/theme';

import type { EventType } from '../../mocks/studentCalendar';

import { eventTypes } from './calendarVisuals';

const CALENDAR_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };
const DAY_WIDTH = 42;
const DAY_HEIGHT = 44;
const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

type Cell = { day: number; inMonth: boolean };

/** Celdas de 6 semanas (lunes primero) con días del mes siguiente atenuados. */
function buildCells(firstWeekday: number, days: number): Cell[][] {
  const cells: Cell[] = [];
  for (let i = firstWeekday; i > 0; i -= 1) cells.push({ day: 32 - i, inMonth: false });
  for (let day = 1; day <= days; day += 1) cells.push({ day, inMonth: true });
  let next = 1;
  while (cells.length % 7 !== 0) cells.push({ day: next++, inMonth: false });
  return Array.from({ length: cells.length / 7 }, (_, week) => cells.slice(week * 7, week * 7 + 7));
}

function NavButton({ direction, label }: { direction: 'prev' | 'next'; label: string }) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={8}
      onPress={() => undefined}
      style={({ pressed }) => [styles.nav, pressed && styles.navPressed]}
    >
      <Icon color={colors.text} size={20} strokeWidth={2.2} />
    </Pressable>
  );
}

/** Mes con el día de hoy destacado y puntos de color por tipo de evento. */
export function MiniCalendar({
  days,
  events,
  firstWeekday,
  title,
  today,
}: {
  days: number;
  events: Record<number, EventType[]>;
  firstWeekday: number;
  title: string;
  today: number;
}) {
  const weeks = buildCells(firstWeekday, days);

  return (
    <Card style={styles.card}>
      <SoftScene base={brand.blue} />
      <View style={styles.header}>
        <NavButton direction="prev" label="Mes anterior" />
        <View style={styles.titleRow}>
          <Clay3DIcon kind="calendar" palette={CALENDAR_PALETTE} shadow={false} size={34} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <NavButton direction="next" label="Mes siguiente" />
      </View>

      <View style={styles.week}>
        {WEEKDAYS.map((weekday) => (
          <Text key={weekday} style={styles.weekday}>
            {weekday}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.week}>
            {week.map(({ day, inMonth }, dayIndex) => {
              const isToday = inMonth && day === today;
              const dots = inMonth ? (events[day] ?? []) : [];

              return (
                <View key={dayIndex} style={styles.cell}>
                  {/* Hoy: botón 3D (lateral `blueNight` + cara con degradado de marca y brillo). */}
                  {isToday && (
                    <>
                      <View pointerEvents="none" style={styles.todayDepth} />
                      <LinearGradient
                        colors={[brand.blue, brand.blueDeep]}
                        end={{ x: 1, y: 1 }}
                        pointerEvents="none"
                        start={{ x: 0, y: 0 }}
                        style={styles.todayFace}
                      >
                        <View style={styles.todayShine} />
                      </LinearGradient>
                    </>
                  )}
                  <View style={styles.day}>
                    <Text
                      style={[
                        styles.dayText,
                        !inMonth && styles.dayOutside,
                        isToday && styles.dayTextToday,
                      ]}
                    >
                      {day}
                    </Text>
                    <View style={styles.dots}>
                      {dots.map((type, index) => (
                        <View
                          key={`${type}-${index}`}
                          style={[
                            styles.dot,
                            {
                              backgroundColor: isToday
                                ? brand.onBlue
                                : eventTypes[type].palette.base,
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </Card>
  );
}

/** Leyenda de colores por tipo de evento. */
export function CalendarLegend() {
  return (
    <Card style={styles.legend}>
      {(Object.keys(eventTypes) as EventType[]).map((type) => (
        <View key={type} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: eventTypes[type].palette.base }]} />
          <Text numberOfLines={1} style={styles.legendText}>
            {eventTypes[type].label}
          </Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: brand.blueSoft,
    gap: spacing.sm,
    overflow: 'hidden',
    padding: spacing.md,
  },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  title: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 17 },
  todayDepth: {
    alignSelf: 'center',
    backgroundColor: brand.blueNight,
    borderRadius: radius.chip,
    height: DAY_HEIGHT,
    position: 'absolute',
    top: 4,
    width: DAY_WIDTH,
  },
  todayFace: {
    alignSelf: 'center',
    borderRadius: radius.chip,
    height: DAY_HEIGHT,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    width: DAY_WIDTH,
  },
  todayShine: {
    backgroundColor: brand.onBlueSubtle,
    borderTopLeftRadius: radius.chip,
    borderTopRightRadius: radius.chip,
    height: DAY_HEIGHT / 2,
  },
  nav: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  navPressed: { backgroundColor: colors.track },
  week: { flexDirection: 'row' },
  weekday: {
    color: colors.textMuted,
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: 12,
    paddingVertical: 4,
    textAlign: 'center',
  },
  grid: { gap: 4 },
  cell: { alignItems: 'center', flex: 1 },
  day: {
    alignItems: 'center',
    borderRadius: radius.chip,
    height: DAY_HEIGHT,
    justifyContent: 'center',
    width: DAY_WIDTH,
  },
  dayText: { color: colors.text, fontFamily: fontFamily.medium, fontSize: 14 },
  dayOutside: { color: colors.trackFill },
  dayTextToday: { color: brand.onBlue, fontFamily: fontFamily.bold },
  dots: { flexDirection: 'row', gap: 2, height: 5, marginTop: 2 },
  dot: { borderRadius: radius.pill, height: 5, width: 5 },
  legend: {
    columnGap: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    rowGap: spacing.sm,
  },
  legendItem: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, width: '46%' },
  legendDot: { borderRadius: radius.pill, height: 12, width: 12 },
  legendText: { color: colors.text, flex: 1, fontFamily: fontFamily.medium, fontSize: 13 },
});
