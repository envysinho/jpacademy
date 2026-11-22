import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { FadeIn } from '@/components/FadeIn';
import { spacing } from '@/theme';

import { DayAgenda } from '../components/calendar/DayAgenda';
import { CalendarLegend, MiniCalendar } from '../components/calendar/MiniCalendar';
import { StatTile } from '../components/calendar/StatTile';
import { UpcomingEventsCard } from '../components/calendar/UpcomingEventsCard';
import { studentCalendarMock } from '../mocks/studentCalendar';

/** Por debajo de este ancho, mes y agenda se apilan. */
const NARROW_WIDTH = 760;
const STAGGER = 70;

/**
 * Calendario del alumno: resúmenes por tipo; a la izquierda mes, leyenda y próximos
 * eventos; a la derecha la agenda del día. Solo visual, con datos ficticios.
 */
export function StudentCalendar() {
  const { day, month, stats, upcoming } = studentCalendarMock;
  const [contentWidth, setContentWidth] = useState(0);
  const isNarrow = contentWidth > 0 && contentWidth < NARROW_WIDTH;

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
      showsVerticalScrollIndicator={false}
    >
      {/* Resumen por tipo */}
      <View style={[styles.row, isNarrow && styles.stackedRow]}>
        {stats.map(({ id, ...stat }, index) => (
          <FadeIn key={id} delay={STAGGER * index} style={styles.flex}>
            <StatTile {...stat} />
          </FadeIn>
        ))}
      </View>

      <View style={[styles.row, isNarrow && styles.stackedRow]}>
        {/* Mes + leyenda + próximos eventos */}
        <FadeIn
          delay={STAGGER * 3}
          style={[styles.monthColumn, styles.column, isNarrow && styles.fullWidth]}
        >
          <MiniCalendar {...month} />
          <CalendarLegend />
          <UpcomingEventsCard items={upcoming} />
        </FadeIn>

        {/* Agenda del día */}
        <FadeIn delay={STAGGER * 4} style={[styles.agendaColumn, isNarrow && styles.fullWidth]}>
          <DayAgenda items={day.items} title={day.title} />
        </FadeIn>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: spacing.md, padding: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md },
  stackedRow: { flexDirection: 'column' },
  flex: { flex: 1 },
  column: { gap: spacing.md },
  monthColumn: { flexBasis: 340, flexGrow: 0, flexShrink: 1, minWidth: 0 },
  agendaColumn: { flex: 1, minWidth: 0 },
  fullWidth: { flexBasis: 'auto', width: '100%' },
});
