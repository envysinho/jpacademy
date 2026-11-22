import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { brand, colors, radius as radii } from '@/theme';

import { SoftScene } from './SoftScene';

type Palette = { base: string; soft: string };

const BRAND_PALETTE: Palette = { base: brand.blue, soft: brand.blueSoft };

/**
 * Superficie con volumen para botones y selecciones (mismo lenguaje que el día de hoy del
 * calendario y las portadas 3D): un canto inferior de `depth` dp y una cara encima.
 *
 * - `primary`: cara con degradado de marca + brillo; canto `blueNight`. Para lo seleccionado.
 * - `soft`: cara `soft` con escena 3D; canto del color `base` translúcido. Para acciones.
 * - `white`: cara blanca con borde; canto `colors.border`. Para botones secundarios.
 *
 * No es pulsable por sí misma: va dentro de un `Pressable`, que le pasa `pressed` para
 * hundir la cara.
 */
export function Raised3D({
  children,
  depth = 4,
  faceStyle,
  palette = BRAND_PALETTE,
  pressed = false,
  radius = radii.pill,
  style,
  variant = 'soft',
}: {
  children: ReactNode;
  depth?: number;
  faceStyle?: StyleProp<ViewStyle>;
  palette?: Palette;
  pressed?: boolean;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'soft' | 'white';
}) {
  const face = [
    styles.face,
    { borderRadius: radius, transform: [{ translateY: pressed ? depth * 0.6 : 0 }] },
    faceStyle,
  ];

  return (
    <View style={[{ paddingBottom: depth }, style]}>
      <View
        pointerEvents="none"
        style={[
          styles.edge,
          { borderRadius: radius, top: depth },
          variant === 'primary' && styles.edgePrimary,
          variant === 'white' && styles.edgeWhite,
          variant === 'soft' && { backgroundColor: palette.base, opacity: 0.28 },
        ]}
      />
      {variant === 'primary' ? (
        <LinearGradient
          colors={[brand.blue, brand.blueDeep]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={face}
        >
          <View
            pointerEvents="none"
            style={[styles.shine, { borderTopLeftRadius: radius, borderTopRightRadius: radius }]}
          />
          {children}
        </LinearGradient>
      ) : (
        <View
          style={[face, variant === 'white' ? styles.faceWhite : { backgroundColor: palette.soft }]}
        >
          {variant === 'soft' && <SoftScene base={palette.base} />}
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  edge: { bottom: 0, left: 0, position: 'absolute', right: 0 },
  edgePrimary: { backgroundColor: brand.blueNight },
  edgeWhite: { backgroundColor: colors.border },
  face: { overflow: 'hidden' },
  faceWhite: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
  shine: {
    backgroundColor: brand.onBlueSubtle,
    height: '50%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
