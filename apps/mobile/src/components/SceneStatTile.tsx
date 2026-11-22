import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, radius, shadows, spacing } from '@/theme';

import { Clay3DIcon, type Clay3DKind, type ClayPalette } from './Clay3DIcon';
import { SoftScene } from './SoftScene';

/**
 * Resumen con escena 3D: fondo `soft` con luz y colinas, cifra a la izquierda e icono 3D a la
 * derecha. Compartido por Calendario y Tareas.
 */
export function SceneStatTile({
  caption,
  kind,
  label,
  palette,
  value,
}: {
  caption: string;
  kind: Clay3DKind;
  label: string;
  palette: ClayPalette;
  value: number | string;
}) {
  return (
    <Pressable
      accessibilityLabel={`${label}: ${value}, ${caption}`}
      accessibilityRole="button"
      onPress={() => undefined}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: palette.soft },
        pressed && styles.pressed,
      ]}
    >
      <SoftScene base={palette.base} />

      <View style={styles.text}>
        {/* Sin truncar: con el sidebar desplegado las etiquetas pasan a dos líneas. */}
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        <View style={styles.captionRow}>
          <Text style={styles.caption}>{caption}</Text>
          <ChevronRight color={palette.ink} size={14} strokeWidth={2.4} />
        </View>
      </View>

      <View style={styles.icon}>
        <Clay3DIcon kind={kind} palette={palette} size={68} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    borderRadius: radius.card,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 118,
    overflow: 'hidden',
    paddingLeft: spacing.md,
    paddingRight: 10,
    paddingVertical: spacing.md,
    ...shadows.card,
  },
  pressed: { opacity: 0.85 },
  text: { flex: 1, gap: 2 },
  label: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 14 },
  value: {
    color: colors.text,
    fontFamily: fontFamily.extrabold,
    fontSize: 34,
    letterSpacing: -1,
    lineHeight: 40,
  },
  captionRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  caption: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 12 },
  icon: { alignSelf: 'flex-end', marginBottom: -6 },
});
