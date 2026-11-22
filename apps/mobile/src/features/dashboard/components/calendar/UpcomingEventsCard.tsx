import { ArrowRight, CalendarClock, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Clay3DIcon } from '@/components/Clay3DIcon';
import { SoftScene } from '@/components/SoftScene';
import { brand, colors, fontFamily, radius, spacing } from '@/theme';

import type { EventType } from '../../mocks/studentCalendar';
import { CardHeader } from '../home/CardHeader';

import { eventTypes } from './calendarVisuals';

/** Próximos eventos de los siguientes días: escena 3D y color por tipo. */
export function UpcomingEventsCard({
  items,
}: {
  items: { id: string; subtitle: string; title: string; type: EventType }[];
}) {
  return (
    <Card style={styles.card}>
      <CardHeader
        icon={CalendarClock}
        right={
          <Pressable
            accessibilityRole="button"
            hitSlop={12}
            onPress={() => undefined}
            style={styles.seeAll}
          >
            <Text style={styles.seeAllText}>Ver todos</Text>
            <ArrowRight color={brand.blueDeep} size={16} strokeWidth={2.2} />
          </Pressable>
        }
        title="Próximos eventos"
      />

      <View style={styles.list}>
        {items.map(({ id, subtitle, title, type }) => {
          const { clay, palette } = eventTypes[type];

          return (
            <Pressable
              key={id}
              accessibilityLabel={`${title}. ${subtitle}`}
              accessibilityRole="button"
              onPress={() => undefined}
              style={({ pressed }) => [
                styles.item,
                { backgroundColor: palette.soft },
                pressed && styles.pressed,
              ]}
            >
              <SoftScene base={palette.base} />
              <Clay3DIcon kind={clay} palette={palette} shadow={false} size={40} />
              <View style={styles.text}>
                <Text numberOfLines={1} style={styles.title}>
                  {title}
                </Text>
                <Text numberOfLines={1} style={styles.subtitle}>
                  {subtitle}
                </Text>
              </View>
              <View style={styles.chevron}>
                <ChevronRight color={palette.ink} size={18} strokeWidth={2.2} />
              </View>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, padding: spacing.md },
  seeAll: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  seeAllText: { color: brand.blueDeep, fontFamily: fontFamily.semibold, fontSize: 13 },
  list: { gap: spacing.sm },
  item: {
    alignItems: 'center',
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 64,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pressed: { opacity: 0.85 },
  text: { flex: 1, gap: 2 },
  title: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 14 },
  subtitle: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 12 },
  chevron: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
});
