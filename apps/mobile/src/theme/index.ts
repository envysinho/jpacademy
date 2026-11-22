export const colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  /** Borde de campos de formulario (≥ 3:1 sobre blanco, WCAG 1.4.11). */
  borderStrong: '#878894',
  text: '#0F172A',
  textMuted: '#64748B',
  /** Pista de barras y fondo de iconos de cabecera de tarjeta. */
  track: '#F1F5F9',
  /** Relleno neutro (barras inactivas, libros de la racha sin estudiar). */
  trackFill: '#CBD5E1',
  primary: '#2563EB',
  primaryPressed: '#1D4ED8',
  primarySoft: '#DBEAFE',
  danger: '#B91C1C',
} as const;

/** Colores de marca tomados del login (fondo azul y botón principal naranja). */
export const brand = {
  blue: '#1F1FFF',
  blueDeep: '#0B0BC4',
  blueNight: '#06065E',
  accent: '#F67700',
  accentPressed: '#B55800',
  onBlue: '#FFFFFF',
  onBlueMuted: 'rgba(255, 255, 255, 0.72)',
  onBlueSubtle: 'rgba(255, 255, 255, 0.14)',
  /** Borde de superficies de vidrio sobre azul. */
  onBlueBorder: 'rgba(255, 255, 255, 0.24)',
  /** Fondo suave de chips de marca sobre blanco (≈ 10 % de `blue`). */
  blueSoft: '#E8E8FF',
} as const;

/**
 * Colores del escudo como categorías (iconos y chips del área de trabajo).
 * `base`: color del escudo · `soft`: fondo del chip · `ink`: icono/texto sobre `soft` (≥ 4,5:1).
 */
export const categories = {
  blue: { base: '#0040A0', soft: '#E6ECF6', ink: '#0040A0' },
  orange: { base: '#F89800', soft: '#FEF5E6', ink: '#B55800' },
  red: { base: '#C00000', soft: '#F9E6E6', ink: '#C00000' },
  green: { base: '#00A018', soft: '#E6F6E8', ink: '#007A12' },
} as const;

export type CategoryColor = keyof typeof categories;

/** Radios unificados: tarjetas 20, chips 14, píldoras totalmente redondas. */
export const radius = { card: 20, chip: 14, pill: 999 } as const;

/** Sombras con tinte de marca (nunca negro puro). */
export const shadows = {
  card: {
    elevation: 3,
    shadowColor: brand.blueNight,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
} as const;
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
} as const;

/** Estilos de texto compartidos del área de trabajo. */
export const typography = {
  /** Título de sección y de tarjeta (único tamaño de título en el dashboard). */
  title: { fontFamily: fontFamily.bold, fontSize: 18, letterSpacing: -0.2 },
} as const;
