import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Clay3DIcon, type Clay3DKind, type ClayPalette } from '@/components/Clay3DIcon';
import { colors, radius, spacing, typography } from '@/theme';

/**
 * Cabecera de tarjeta: icono, título y un elemento opcional a la derecha.
 * Con `clay` muestra un icono 3D (estilo premium); si no, el icono plano en círculo gris.
 */
export function CardHeader({
  clay,
  icon: Icon,
  right,
  title,
}: {
  clay?: { kind: Clay3DKind; palette: ClayPalette };
  icon: LucideIcon;
  right?: ReactNode;
  title: string;
}) {
  return (
    <View style={styles.header}>
      {clay ? (
        <Clay3DIcon kind={clay.kind} palette={clay.palette} shadow={false} size={40} />
      ) : (
        <View style={styles.iconCircle}>
          <Icon color={colors.text} size={18} strokeWidth={2} />
        </View>
      )}
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: colors.track,
    borderRadius: radius.pill,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  title: { ...typography.title, color: colors.text, flex: 1, fontSize: 16 },
});
