import { UserRound } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, spacing } from '@/theme';

import { roleNavigation, type DashboardRole } from '../config/roleNavigation';

export const SIDEBAR_WIDTH = 210;
export const COLLAPSED_SIDEBAR_WIDTH = 72;

/** Barra lateral reutilizable. La navegación se añadirá después del control de despliegue. */
export function Sidebar({ role }: { role: DashboardRole }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigationItems = roleNavigation[role];

  return (
    <View style={[styles.sidebar, isCollapsed && styles.sidebarCollapsed]}>
      <View style={styles.topActions}>
        <View style={styles.brandRow}>
          <Pressable
            accessibilityLabel={isCollapsed ? 'Desplegar barra lateral' : 'Contraer barra lateral'}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setIsCollapsed((currentValue) => !currentValue)}
            style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
          >
            <Image
              accessibilityLabel="Academia José Pisconte"
              resizeMode="contain"
              source={require('../../../../assets/images/logos/escudo.png')}
              style={styles.academyMark}
            />
          </Pressable>
          {!isCollapsed && (
            <View style={styles.logoTextCrop}>
              <Image
                accessibilityLabel="José Pisconte Reforzamiento Académico"
                resizeMode="stretch"
                source={require('../../../../assets/images/logos/logo_horizontal.png')}
                style={styles.logoText}
              />
            </View>
          )}
        </View>
        {navigationItems.map(({ icon: Icon, key, label }) => (
          <Pressable
            key={key}
            accessibilityLabel={label}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => undefined}
            style={({ pressed }) => [
              styles.navigationButton,
              !isCollapsed && styles.navigationButtonExpanded,
              pressed && styles.navigationButtonPressed,
            ]}
          >
            {({ pressed }) => (
              <>
                <View style={styles.navigationIcon}>
                  <Icon color={colors.text} size={22} strokeWidth={2} />
                </View>
                {!isCollapsed && <Text style={styles.navigationLabel}>{label}</Text>}
              </>
            )}
          </Pressable>
        ))}
      </View>
      <Pressable
        accessibilityLabel="Abrir perfil"
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => undefined}
        style={[styles.profileButton, !isCollapsed && styles.profileButtonExpanded]}
      >
        {({ pressed }) => (
          <>
            <View style={[styles.profileIcon, pressed && styles.profileIconPressed]}>
              <UserRound color={colors.text} size={22} strokeWidth={2} />
            </View>
            {!isCollapsed && <Text style={styles.profileLabel}>Estudiante</Text>}
          </>
        )}
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
  brandRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  logoTextCrop: { height: 46, overflow: 'hidden', width: 90 },
  logoText: { height: 46, left: -38, position: 'absolute', top: 0, width: 125 },
  academyMark: { height: 44, width: 44 },
  toggle: {
    alignItems: 'center',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  togglePressed: { backgroundColor: '#dddddd49' },
  navigationButton: {
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 48,
  },
  navigationButtonPressed: { backgroundColor: '#dddddd49' },
  navigationButtonExpanded: {
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  navigationIcon: {
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  navigationLabel: {
    color: colors.text,
    fontFamily: fontFamily.medium,
    fontSize: 17,
    marginLeft: spacing.sm,
  },
  profileButton: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  profileButtonExpanded: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  profileIcon: {
    alignItems: 'center',
    backgroundColor: '#dddddd49',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  profileIconPressed: { backgroundColor: '#dddddd' },
  profileLabel: {
    color: colors.text,
    fontFamily: fontFamily.medium,
    fontSize: 17,
    marginLeft: spacing.sm,
  },
});
