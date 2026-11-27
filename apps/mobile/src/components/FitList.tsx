import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

/**
 * Lista sin scroll para pantallas de un solo viewport: ocupa el alto disponible, apila las filas
 * desde arriba y muestra solo las que caben **enteras**; el resto no se muestra. Las filas deben
 * tener alto fijo (`rowHeight`).
 */
export function FitList<T>({
  gap = 6,
  items,
  keyOf,
  renderItem,
  rowHeight,
  style,
}: {
  gap?: number;
  items: T[];
  keyOf: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  rowHeight: number;
  style?: StyleProp<ViewStyle>;
}) {
  const [height, setHeight] = useState(0);
  const fits = height > 0 ? Math.max(0, Math.floor((height + gap) / (rowHeight + gap))) : 0;

  return (
    <View
      onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
      style={[styles.list, { gap }, style]}
    >
      {items.slice(0, fits).map((item) => (
        <View key={keyOf(item)} style={{ height: rowHeight }}>
          {renderItem(item)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, minHeight: 0, overflow: 'hidden' },
});
