import { SceneStatTile } from '@/components/SceneStatTile';

import type { EventType } from '../../mocks/studentCalendar';

import { eventTypes } from './calendarVisuals';

/** Resumen por tipo de evento (escena 3D con el color e icono 3D del tipo). */
export function StatTile({
  caption,
  label,
  type,
  value,
}: {
  caption: string;
  label: string;
  type: EventType;
  value: number;
}) {
  const { clay, palette } = eventTypes[type];

  return (
    <SceneStatTile caption={caption} kind={clay} label={label} palette={palette} value={value} />
  );
}
