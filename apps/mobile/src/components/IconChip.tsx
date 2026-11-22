import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { brand, radius } from '@/theme';

/** Icono azul de marca dentro de un cuadro de fondo suave (`brand.blueSoft`). */
export function IconChip({ icon: Icon, size = 48 }: { icon: LucideIcon; size?: number }) {
  return (
    <View style={[styles.chip, { height: size, width: size }]}>
      <Icon color={brand.blueDeep} size={Math.round(size * 0.46)} strokeWidth={2.2} />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: brand.blueSoft,
    borderRadius: radius.chip,
    justifyContent: 'center',
  },
});
