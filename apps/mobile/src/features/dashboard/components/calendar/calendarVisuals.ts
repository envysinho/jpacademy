import type { Clay3DKind } from '@/components/Clay3DIcon';
import { brand, categories } from '@/theme';

import type { EventType } from '../../mocks/studentCalendar';

type Palette = { base: string; ink: string; soft: string };

/**
 * Paleta e icono 3D por tipo de evento (ESTILO_VISUAL §2.3). Calendario asincrónico: entrega =
 * naranja, asesoría agendada = verde, simulacro o actividad especial = marca.
 */
export const eventTypes: Record<
  EventType,
  { clay: Clay3DKind; label: string; palette: Palette; plural: string }
> = {
  task: { clay: 'clipboard', label: 'Entrega', palette: categories.orange, plural: 'Entregas' },
  help: { clay: 'badge', label: 'Asesoría', palette: categories.green, plural: 'Asesorías' },
  activity: {
    clay: 'calendar',
    label: 'Simulacro / actividad',
    palette: { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft },
    plural: 'Simulacros y actividades',
  },
};

/** Orden de las tarjetas superiores y de la leyenda. */
export const EVENT_ORDER: EventType[] = ['task', 'activity', 'help'];
