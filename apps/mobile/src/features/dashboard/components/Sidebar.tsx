import { LinearGradient } from 'expo-linear-gradient';
import { UserRound } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { brand, fontFamily, spacing } from '@/theme';
import { logos } from '@/theme/logos';

import { roleLabels, roleNavigation, type DashboardRole } from '../config/roleNavigation';

export const SIDEBAR_WIDTH = 240;
export const COLLAPSED_SIDEBAR_WIDTH = 72;

const ITEM_SIZE = 48;

/** Símbolos decorativos que recuerdan al fondo matemático del login. */
const DECORATIVE_SYMBOLS = [
  { symbol: '∑', style: { bottom: 96, fontSize: 120, right: -18 } },
  { symbol: 'π', style: { fontSize: 64, left: 24, top: '60%' } },
] as const;

/** Barra lateral reutilizable por rol, con la estética del login (azul de marca + acento naranja). */
export function Sidebar({ role }: { role: DashboardRole }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigationItems = roleNavigation[role];
  const roleLabel = roleLabels[role];
  // Temporal: el ítem activo es estado local hasta que la navegación use rutas reales.
  const [activeKey, setActiveKey] = useState(navigationItems[0]?.key);

  return (
    <LinearGradient
      colors={[brand.blue, brand.blueDeep, brand.blueNight]}
      end={{ x: 0.6, y: 1 }}
      locations={[0, 0.45, 1]}
      start={{ x: 0, y: 0 }}
      style={[styles.sidebar, isCollapsed && styles.sidebarCollapsed]}
    >
      {!isCollapsed &&
        DECORATIVE_SYMBOLS.map(({ symbol, style }) => (
          <Text key={symbol} pointerEvents="none" style={[styles.decorativeSymbol, style]}>
            {symbol}
          </Text>
        ))}

      <View style={[styles.topActions, isCollapsed && styles.centered]}>
        <View style={styles.brandRow}>
          <Pressable
            accessibilityLabel={isCollapsed ? 'Desplegar barra lateral' : 'Contraer barra lateral'}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setIsCollapsed((currentValue) => !currentValue)}
            style={({ pressed }) => [styles.toggle, pressed && styles.pressedOnBlue]}
          >
            <Image
              accessibilityLabel="Academia José Pisconte"
              resizeMode="contain"
              source={logos.shield}
              style={styles.shield}
            />
          </Pressable>
          {!isCollapsed && (
            <View style={styles.wordmark}>
              <Text numberOfLines={1} style={styles.wordmarkTitle}>
                José Pisconte
              </Text>
              <Text numberOfLines={1} style={styles.wordmarkSubtitle}>
                Reforzamiento Académico
              </Text>
            </View>
          )}
        </View>

        <View style={styles.navigation}>
          {navigationItems.map(({ icon: Icon, key, label }) => {
            const isActive = key === activeKey;

            return (
              <Pressable
                key={key}
                accessibilityLabel={label}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                hitSlop={4}
                onPress={() => setActiveKey(key)}
                style={({ pressed }) => [
                  styles.navigationButton,
                  !isCollapsed && styles.navigationButtonExpanded,
                  pressed && !isActive && styles.pressedOnBlue,
                  isActive && styles.navigationButtonActive,
                ]}
              >
                <View style={styles.navigationIcon}>
                  <Icon
                    color={isActive ? brand.accent : brand.onBlueMuted}
                    size={22}
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                </View>
                {!isCollapsed && (
                  <Text
                    numberOfLines={1}
                    style={[styles.navigationLabel, isActive && styles.navigationLabelActive]}
                  >
                    {label}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.footer, isCollapsed && styles.centered]}>
        <View style={[styles.divider, isCollapsed && styles.dividerCollapsed]} />
        <Pressable
          accessibilityLabel="Abrir perfil"
          accessibilityRole="button"
          hitSlop={4}
          onPress={() => undefined}
          style={({ pressed }) => [
            styles.profileButton,
            !isCollapsed && styles.profileButtonExpanded,
            pressed && styles.pressedOnBlue,
          ]}
        >
          <View style={styles.profileIcon}>
            <UserRound color={brand.onBlue} size={22} strokeWidth={2} />
          </View>
          {!isCollapsed && (
            <View style={styles.profileText}>
              <Text numberOfLines={1} style={styles.profileLabel}>
                {roleLabel}
              </Text>
              <Text numberOfLines={1} style={styles.profileHint}>
                Ver perfil
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    borderBottomRightRadius: 28,
    borderTopRightRadius: 28,
    elevation: 12,
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: spacing.lg,
    width: SIDEBAR_WIDTH,
  },
  sidebarCollapsed: { paddingHorizontal: 0, width: COLLAPSED_SIDEBAR_WIDTH },
  centered: { alignItems: 'center' },
  decorativeSymbol: {
    color: brand.onBlue,
    fontFamily: fontFamily.bold,
    opacity: 0.06,
    position: 'absolute',
  },
  topActions: { gap: spacing.lg },
  brandRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  toggle: {
    alignItems: 'center',
    borderRadius: 14,
    height: ITEM_SIZE,
    justifyContent: 'center',
    width: ITEM_SIZE,
  },
  shield: { height: 42, width: 42 },
  wordmark: { flex: 1 },
  wordmarkTitle: {
    color: brand.onBlue,
    fontFamily: fontFamily.extrabold,
    fontSize: 18,
    includeFontPadding: false,
    letterSpacing: -0.4,
    lineHeight: 20,
  },
  wordmarkSubtitle: {
    color: brand.onBlueMuted,
    fontFamily: fontFamily.medium,
    fontSize: 9.5,
    includeFontPadding: false,
    letterSpacing: -0.05,
    lineHeight: 13,
  },
  navigation: { gap: 6 },
  navigationButton: {
    alignItems: 'center',
    borderRadius: ITEM_SIZE / 2,
    height: ITEM_SIZE,
    justifyContent: 'center',
    width: ITEM_SIZE,
  },
  navigationButtonExpanded: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  navigationButtonActive: {
    backgroundColor: brand.onBlue,
    elevation: 6,
    shadowColor: brand.blueNight,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  navigationIcon: {
    alignItems: 'center',
    height: ITEM_SIZE,
    justifyContent: 'center',
    width: ITEM_SIZE,
  },
  navigationLabel: {
    color: brand.onBlueMuted,
    flexShrink: 1,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    marginLeft: spacing.xs,
  },
  navigationLabelActive: { color: brand.blueDeep, fontFamily: fontFamily.bold },
  pressedOnBlue: { backgroundColor: brand.onBlueSubtle },
  footer: { gap: spacing.md },
  divider: { backgroundColor: brand.onBlueSubtle, height: 1, marginHorizontal: spacing.xs },
  dividerCollapsed: { marginHorizontal: 0, width: 40 },
  profileButton: {
    alignItems: 'center',
    borderRadius: ITEM_SIZE / 2,
    height: ITEM_SIZE + 4,
    justifyContent: 'center',
    width: ITEM_SIZE + 4,
  },
  profileButtonExpanded: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
    width: '100%',
  },
  profileIcon: {
    alignItems: 'center',
    backgroundColor: brand.onBlueSubtle,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    borderRadius: ITEM_SIZE / 2,
    borderWidth: 1,
    height: ITEM_SIZE,
    justifyContent: 'center',
    width: ITEM_SIZE,
  },
  profileText: { flex: 1, marginLeft: spacing.sm },
  profileLabel: { color: brand.onBlue, fontFamily: fontFamily.semibold, fontSize: 15 },
  profileHint: { color: brand.onBlueMuted, fontFamily: fontFamily.regular, fontSize: 12 },
});
