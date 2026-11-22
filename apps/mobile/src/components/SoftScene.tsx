import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse } from 'react-native-svg';

import { colors } from '@/theme';

/**
 * Fondo "escena" de las portadas 3D: luz blanca suave, colinas blancas translúcidas y un
 * círculo grande del color base. Se coloca detrás del contenido (`absoluteFill`) de una
 * superficie con fondo `soft`. Mismo lenguaje que las portadas de Cursos.
 *
 * La luz se hace con elipses superpuestas y no con degradado radial: estirado con
 * `preserveAspectRatio="none"`, Android corta el degradado en un borde recto.
 */
export function SoftScene({
  base,
  glow = 'right',
}: {
  base: string;
  /** Dónde cae la luz principal. */
  glow?: 'left' | 'right';
}) {
  const x = glow === 'right' ? 160 : 40;

  return (
    // Capa a tamaño completo: el `100 %` del SVG se resuelve sobre ella y no sobre el área
    // interior (sin padding) de la tarjeta, que dejaba un borde sin escena.
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg height="100%" preserveAspectRatio="none" viewBox="0 0 200 100" width="100%">
        {/* Luz: tres capas concéntricas, cada vez más pequeñas e intensas. */}
        <Ellipse cx={x} cy={0} fill={colors.surface} opacity={0.22} rx={95} ry={70} />
        <Ellipse cx={x} cy={0} fill={colors.surface} opacity={0.22} rx={65} ry={48} />
        <Ellipse cx={x} cy={0} fill={colors.surface} opacity={0.2} rx={38} ry={28} />
        <Circle cx={glow === 'right' ? 178 : 22} cy={86} fill={base} opacity={0.1} r={46} />
        <Ellipse cx={50} cy={110} fill={colors.surface} opacity={0.45} rx={90} ry={26} />
        <Ellipse cx={170} cy={114} fill={colors.surface} opacity={0.3} rx={80} ry={24} />
      </Svg>
    </View>
  );
}
