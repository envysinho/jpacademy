import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { FadeIn } from '@/components/FadeIn';
import { SceneStatTile } from '@/components/SceneStatTile';
import { spacing } from '@/theme';

import { DayAgenda } from '../components/calendar/DayAgenda';
import { CalendarLegend, MiniCalendar } from '../components/calendar/MiniCalendar';
import { EVENT_ORDER, eventTypes } from '../components/calendar/calendarVisuals';
import { calendarMonth, type CalendarEvent, type EventType } from '../mocks/studentCalendar';

/** Por debajo de este ancho, mes y agenda se apilan (y entonces sí hay scroll). */
const NARROW_WIDTH = 760;
const STAGGER = 70;

const WEEKDAY_NAMES = ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'];
const MONTH_NAMES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const statCaption: Record<EventType, string> = {
  activity: 'Con fecha este mes',
  help: 'Agendadas con docente',
  task: 'Con fecha límite',
};

const dayOf = (date: string) => Number(date.slice(8, 10));

/**
 * Calendario **asincrónico** en un solo viewport (lo comparten ambas modalidades; cambian los
 * eventos). Solo eventos con fecha: entregas, asesorías agendadas y simulacros o actividades.
 * Tocar un día muestra su agenda; un día sin eventos muestra un estado vacío.
 */
export function StudentCalendar({
  emptyAction,
  events,
}: {
  emptyAction?: { label: string; onPress: () => void };
  events: CalendarEvent[];
}) {
  const { days, firstWeekday, monthIndex, title, today, year } = calendarMonth;
  const [selectedDay, setSelectedDay] = useState(today);
  const [contentWidth, setContentWidth] = useState(0);
  const isNarrow = contentWidth > 0 && contentWidth < NARROW_WIDTH;

  const monthPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  const monthEvents = events.filter((event) => event.date.startsWith(monthPrefix));
  const byDay: Record<number, EventType[]> = {};
  monthEvents.forEach((event) => {
    (byDay[dayOf(event.date)] ??= []).push(event.type);
  });
  const dayEvents = monthEvents
    .filter((event) => dayOf(event.date) === selectedDay)
    .sort((a, b) => a.time.localeCompare(b.time));

  const weekday = WEEKDAY_NAMES[new Date(year, monthIndex, selectedDay).getDay()];
  const dayTitle = `${selectedDay === today ? 'Hoy, ' : ''}${weekday} ${selectedDay} de ${MONTH_NAMES[monthIndex]}`;

  const statsRow = (
    <View style={[styles.row, isNarrow && styles.stackedRow]}>
      {EVENT_ORDER.map((type, index) => {
        const { clay, palette, plural } = eventTypes[type];
        return (
          <FadeIn key={type} delay={STAGGER * index} style={styles.flex}>
            <SceneStatTile
              caption={statCaption[type]}
              chevron={false}
              kind={clay}
              label={plural}
              palette={palette}
              value={monthEvents.filter((event) => event.type === type).length}
            />
          </FadeIn>
        );
      })}
    </View>
  );

  const month = (
    <MiniCalendar
      days={days}
      events={byDay}
      fill={!isNarrow}
      firstWeekday={firstWeekday}
      onSelectDay={setSelectedDay}
      selectedDay={selectedDay}
      title={title}
      today={today}
    />
  );
  const agenda = (
    <DayAgenda
      emptyAction={emptyAction}
      fill={!isNarrow}
      items={dayEvents}
      onNext={selectedDay < days ? () => setSelectedDay(selectedDay + 1) : undefined}
      onPrev={selectedDay > 1 ? () => setSelectedDay(selectedDay - 1) : undefined}
      title={dayTitle}
    />
  );

  if (isNarrow) {
    return (
      <ScrollView
        contentContainerStyle={styles.scroll}
        onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
        showsVerticalScrollIndicator={false}
      >
        {statsRow}
        {month}
        <CalendarLegend />
        {agenda}
      </ScrollView>
    );
  }

  return (
    <View
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
      style={styles.screen}
    >
      {statsRow}
      <View style={[styles.row, styles.main]}>
        <FadeIn delay={STAGGER * 3} style={[styles.monthColumn, styles.column]}>
          {month}
          <CalendarLegend />
        </FadeIn>
        <FadeIn delay={STAGGER * 4} style={styles.agendaColumn}>
          {agenda}
        </FadeIn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: spacing.md, padding: spacing.lg },
  scroll: { gap: spacing.md, padding: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md },
  main: { flex: 1, minHeight: 0 },
  stackedRow: { flexDirection: 'column' },
  flex: { flex: 1 },
  column: { gap: spacing.md },
  monthColumn: { flexBasis: 360, flexGrow: 0, flexShrink: 1, minWidth: 0 },
  agendaColumn: { flex: 1, minWidth: 0 },
});
