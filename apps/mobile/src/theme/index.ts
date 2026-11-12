export const colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
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
} as const;

export const radius = { card: 12 } as const;
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
} as const;
