import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { brand, colors } from '@/theme';

/**
 * Barra de progreso de 0 a 100 que se llena al aparecer. Con el color por defecto, el
 * relleno es un degradado de marca con brillo (volumen, como los botones 3D); con un color
 * propio (p. ej. blanco sobre azul) es liso.
 */
export function ProgressBar({
  color = brand.blueDeep,
  trackColor = colors.border,
  value,
}: {
  color?: string;
  trackColor?: string;
  value: number;
}) {
  const percent = Math.min(100, Math.max(0, value));
  const [fill] = useState(() => new Animated.Value(0));
  const isBrand = color === brand.blueDeep;

  useEffect(() => {
    Animated.timing(fill, {
      delay: 250,
      duration: 900,
      toValue: percent,
      useNativeDriver: false,
    }).start();
  }, [fill, percent]);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ max: 100, min: 0, now: percent }}
      style={[styles.track, { backgroundColor: trackColor }]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: fill.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          },
        ]}
      >
        {isBrand && (
          <>
            <LinearGradient
              colors={[brand.blue, brand.blueDeep]}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.shine} />
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { borderRadius: 5, height: 10, overflow: 'hidden' },
  fill: { borderRadius: 5, height: 10, overflow: 'hidden' },
  shine: {
    backgroundColor: brand.onBlueSubtle,
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 1,
  },
});
