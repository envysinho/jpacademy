import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, radius, shadows, spacing } from '@/theme';

import { Clay3DIcon, type Clay3DKind, type ClayPalette } from './Clay3DIcon';
import { SoftScene } from './SoftScene';

/**
 * Resumen con escena 3D: fondo `soft` con luz y colinas, cifra a la izquierda e icono 3D a la
 * derecha. Compartido por Calendario y Tareas. Con `selected` funciona como selector: borde
 * grueso del color del tipo y barra inferior (no depende solo del color).
 */
export function SceneStatTile({
  caption,
  chevron = true,
  compact = false,
  kind,
  label,
  onPress,
  palette,
  selected,
  value,
}: {
  caption: string;
  /** Flecha junto al pie (indica que la tarjeta lleva a algún sitio). */
  chevron?: boolean;
  /** Versión baja (pantallas que deben caber en un viewport). */
  compact?: boolean;
  kind: Clay3DKind;
  label: string;
  onPress?: () => void;
  palette: ClayPalette;
  /** `undefined` = no es seleccionable. */
  selected?: boolean;
  value: number | string;
}) {
  const isSelectable = selected !== undefined;

  return (
    <Pressable
      accessibilityLabel={`${label}: ${value}, ${caption}`}
      accessibilityRole={isSelectable ? 'tab' : onPress ? 'button' : 'summary'}
      accessibilityState={isSelectable ? { selected } : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: palette.soft },
        compact && styles.tileCompact,
        isSelectable && styles.selectable,
        selected && { borderColor: palette.ink },
        pressed && styles.pressed,
      ]}
    >
      <SoftScene base={palette.base} />
      {selected && <View style={[styles.selectedBar, { backgroundColor: palette.ink }]} />}

      <View style={styles.text}>
        {/* Sin truncar: con el sidebar desplegado las etiquetas pasan a dos líneas. */}
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, compact && styles.valueCompact]}>{value}</Text>
        <View style={styles.captionRow}>
          <Text style={styles.caption}>{caption}</Text>
          {chevron && <ChevronRight color={palette.ink} size={14} strokeWidth={2.4} />}
        </View>
      </View>

      <View style={styles.icon}>
        <Clay3DIcon kind={kind} palette={palette} size={compact ? 56 : 68} />
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
  tileCompact: { minHeight: 92, paddingVertical: 12 },
  valueCompact: { fontSize: 28, lineHeight: 34 },
  selectable: { borderColor: 'transparent', borderWidth: 2 },
  selectedBar: { bottom: 0, height: 5, left: 0, position: 'absolute', right: 0 },
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
