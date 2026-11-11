import { House, PanelLeftClose, PanelLeftOpen, UserRound } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

export const SIDEBAR_WIDTH = 240;
export const COLLAPSED_SIDEBAR_WIDTH = 72;

/** Barra lateral reutilizable. La navegación se añadirá después del control de despliegue. */
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const ToggleIcon = isCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <View style={[styles.sidebar, isCollapsed && styles.sidebarCollapsed]}>
      <View style={styles.topActions}>
        <Pressable
          accessibilityLabel={isCollapsed ? 'Desplegar barra lateral' : 'Contraer barra lateral'}
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => setIsCollapsed((currentValue) => !currentValue)}
          style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
        >
          <ToggleIcon color={colors.text} size={22} strokeWidth={2} />
        </Pressable>
        <Pressable
          accessibilityLabel="Inicio"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => undefined}
          style={({ pressed }) => [styles.homeButton, pressed && styles.homeButtonPressed]}
        >
          <House color={colors.text} size={22} strokeWidth={2} />
        </Pressable>
      </View>
      <Pressable
        accessibilityLabel="Abrir perfil"
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => undefined}
        style={({ pressed }) => [styles.profileButton, pressed && styles.profileButtonPressed]}
      >
        <UserRound color={colors.text} size={22} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderBottomRightRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingHorizontal: 11,
    width: SIDEBAR_WIDTH,
  },
  sidebarCollapsed: { alignItems: 'center', paddingHorizontal: 0, width: COLLAPSED_SIDEBAR_WIDTH },
  topActions: { gap: spacing.sm },
  toggle: {
    alignItems: 'center',
    backgroundColor: '#dddddd49',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  togglePressed: { backgroundColor: '#dddddd' },
  homeButton: {
    alignItems: 'center',
    backgroundColor: '#dddddd49',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  homeButtonPressed: { backgroundColor: '#dddddd' },
  profileButton: {
    alignItems: 'center',
    backgroundColor: '#dddddd49',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  profileButtonPressed: { backgroundColor: '#dddddd' },
});
