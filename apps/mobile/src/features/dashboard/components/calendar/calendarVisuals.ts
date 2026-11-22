import type { Clay3DKind } from '@/components/Clay3DIcon';
import { brand, categories } from '@/theme';

import type { EventIcon, EventType } from '../../mocks/studentCalendar';

type Palette = { base: string; ink: string; soft: string };

/**
 * Paleta por tipo de evento (ESTILO_VISUAL §2.3: los colores del escudo identifican
 * categorías). Clase = marca, entrega = naranja, asesoría/ayuda = verde.
 * `clay` = icono 3D del tipo.
 */
export const eventTypes: Record<EventType, { clay: Clay3DKind; label: string; palette: Palette }> =
  {
    class: {
      clay: 'book',
      label: 'Clase',
      palette: { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft },
    },
    task: { clay: 'clipboard', label: 'Entrega', palette: categories.orange },
    help: { clay: 'badge', label: 'Asesoría / Ayuda', palette: categories.green },
  };

/** Icono 3D por icono de evento (agenda). */
export const eventClayIcons: Record<EventIcon, Clay3DKind> = {
  book: 'book',
  flask: 'flask',
  help: 'badge',
  task: 'clipboard',
};
