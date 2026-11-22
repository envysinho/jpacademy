import { useEffect, useState, type ReactNode } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { brand, colors } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** Anillo de progreso de 0 a 100 que se llena al aparecer, con contenido centrado opcional. */
export function ProgressRing({
  children,
  color = brand.blueDeep,
  size = 120,
  strokeWidth = 12,
  trackColor = colors.border,
  value,
}: {
  children?: ReactNode;
  color?: string;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  value: number;
}) {
  const percent = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const [fill] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fill, {
      delay: 250,
      duration: 1000,
      toValue: percent,
      useNativeDriver: false,
    }).start();
  }, [fill, percent]);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ max: 100, min: 0, now: percent }}
      style={[styles.root, { height: size, width: size }]}
    >
      <Svg height={size} style={StyleSheet.absoluteFill} width={size}>
        <Circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={color}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={fill.interpolate({
            inputRange: [0, 100],
            outputRange: [circumference, 0],
          })}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center' },
});
