import type { ImageSourcePropType } from 'react-native';

/**
 * Logos de marca. React Native elige solo la densidad correcta (@1x/@2x/@3x) a partir del
 * nombre base, así que cada entrada usa el nombre base sin sufijo (Metro no acepta `@1x` en el require).
 * Uso: <Image source={logos.horizontal} />. Ver docs/ASSETS.md.
 */
export const logos = {
  /** Logo horizontal (relación 2083:767 ≈ 2,72:1). */
  horizontal: require('../../assets/images/logos/logo_horizontal.png'),
  /** Logo horizontal con más aire alrededor (1719:972 ≈ 1,77:1). */
  horizontalWide: require('../../assets/images/logos/logo_horizontal_amplio.png'),
  /** Logo vertical (1093:1336 ≈ 0,82:1). */
  vertical: require('../../assets/images/logos/logo_vertical.png'),
  /** Solo el escudo (1252:1126 ≈ 1,11:1). */
  shield: require('../../assets/images/logos/escudo.png'),
} as const satisfies Record<string, ImageSourcePropType>;
