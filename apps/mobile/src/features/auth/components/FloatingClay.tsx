import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';

import { Clay3DIcon, type Clay3DKind, type ClayPalette } from '@/components/Clay3DIcon';

/**
 * Icono 3D decorativo que flota despacio (sube y baja) junto al logo del login.
 * Solo `transform` con el driver nativo (D-04); quieto si el sistema pide reducir movimiento.
 */
export function FloatingClay({
  delay = 0,
  kind,
  palette,
  rotate = 0,
  size,
  style,
}: {
  delay?: number;
  kind: Clay3DKind;
  palette: ClayPalette;
  /** Giro en grados para que no parezcan alineados. */
  rotate?: number;
  size: number;
  style: StyleProp<ViewStyle>;
}) {
  const [float] = useState(() => new Animated.Value(0));

  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce || cancelled) return;
      const half = (toValue: number) =>
        Animated.timing(float, {
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          toValue,
          useNativeDriver: true,
        });
      loop = Animated.loop(Animated.sequence([Animated.delay(delay), half(1), half(0)]));
      loop.start();
    });
    return () => {
      cancelled = true;
      loop?.stop();
    };
  }, [delay, float]);

  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', transform: [{ translateY }, { rotate: `${rotate}deg` }] },
        style,
      ]}
    >
      <Clay3DIcon kind={kind} palette={palette} size={size} />
    </Animated.View>
  );
}
