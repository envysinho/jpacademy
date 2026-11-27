import Svg, { Path } from 'react-native-svg';

/**
 * Colores de marca de Google Meet. Excepción documentada a la regla de «colores solo desde
 * `@/theme`»: son de un tercero y no forman parte de la paleta de la academia.
 */
const MEET = {
  blue: '#4285F4',
  green: '#00AC47',
  greenDark: '#00832D',
  red: '#EA4335',
  yellow: '#FFBA00',
} as const;

/**
 * Icono estilo Google Meet (cámara en los colores de Google), dibujado en SVG para el prototipo.
 * Antes de producción sustituir por el recurso oficial siguiendo las normas de marca de Google.
 */
export function GoogleMeetIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg height={size} viewBox="0 0 48 40" width={size * 1.2}>
      {/* Lente (derecha) */}
      <Path d="M33 14 L45 5 Q47 4 47 6.5 V33.5 Q47 36 45 35 L33 26 Z" fill={MEET.green} />
      {/* Cuerpo: arriba amarillo, izquierda azul, abajo verde, esquina roja */}
      <Path d="M11 2 H29 Q34 2 34 7 V14 H11 Z" fill={MEET.yellow} />
      <Path d="M1 12 L11 2 V38 H6 Q1 38 1 33 Z" fill={MEET.blue} />
      <Path d="M11 26 H34 V33 Q34 38 29 38 H11 Z" fill={MEET.green} />
      <Path d="M1 12 L11 2 V12 Z" fill={MEET.red} />
      <Path d="M33 14 V26 L34 26.7 V13.3 Z" fill={MEET.greenDark} />
      {/* Centro blanco */}
      <Path d="M11 14 H34 V26 H11 Z" fill="#FFFFFF" />
    </Svg>
  );
}
