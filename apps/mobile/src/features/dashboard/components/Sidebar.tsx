import { LinearGradient } from 'expo-linear-gradient';
import { LogOut, UserRound, X } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Clay3DIcon } from '@/components/Clay3DIcon';
import { Raised3D } from '@/components/Raised3D';
import { brand, categories, colors, fontFamily, radius, spacing } from '@/theme';
import { logos } from '@/theme/logos';

import {
  roleLabels,
  roleNavigation,
  type DashboardRole,
  type SidebarNavigationItem,
} from '../config/roleNavigation';

export const SIDEBAR_WIDTH = 240;
export const COLLAPSED_SIDEBAR_WIDTH = 72;

const ITEM_SIZE = 48;
const CLAY_SIZE = 34;

/**
 * Iconos 3D del alumno: inactivos con su color de `categories` (config por ítem); el activo pasa
 * a la paleta de marca sobre la píldora blanca.
 */
const CLAY_ACTIVE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };

/** Símbolos decorativos que recuerdan al fondo matemático del login. */
const DECORATIVE_SYMBOLS = [
  { symbol: '∑', style: { bottom: 96, fontSize: 120, right: -18 } },
  { symbol: 'π', style: { fontSize: 64, left: 24, top: '60%' } },
] as const;

/** Barra lateral reutilizable por rol, con la estética del login (azul de marca + acento naranja). */
export function Sidebar({
  activeKey,
  items,
  onSelect,
  onSignOut,
  role,
}: {
  activeKey: string;
  /** Navegación propia (p. ej. acompañamiento escolar); por defecto, la del rol. */
  items?: SidebarNavigationItem[];
  onSelect: (key: string) => void;
  onSignOut?: () => void;
  role: DashboardRole;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigationItems = items ?? roleNavigation[role];
  const roleLabel = roleLabels[role];

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
          {navigationItems.map(({ clay, icon: Icon, key, label }) => {
            const isActive = key === activeKey;

            return (
              <Pressable
                key={key}
                accessibilityLabel={label}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                hitSlop={4}
                onPress={() => onSelect(key)}
                style={({ pressed }) => [
                  styles.navigationButton,
                  !isCollapsed && styles.navigationButtonExpanded,
                  pressed && !isActive && styles.pressedOnBlue,
                  isActive && styles.navigationButtonActive,
                ]}
              >
                <View style={styles.navigationIcon}>
                  {clay ? (
                    <Clay3DIcon
                      kind={clay.kind}
                      palette={isActive ? CLAY_ACTIVE : categories[clay.color]}
                      shadow={false}
                      size={CLAY_SIZE}
                    />
                  ) : (
                    <Icon
                      color={isActive ? brand.accent : brand.onBlueMuted}
                      size={22}
                      strokeWidth={isActive ? 2.4 : 2}
                    />
                  )}
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
          onPress={() => setProfileOpen(true)}
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

      {/* Perfil (provisional): avatar 3D que luego será la foto del alumno y cerrar sesión. */}
      <Modal
        animationType="fade"
        onRequestClose={() => setProfileOpen(false)}
        transparent
        visible={profileOpen}
      >
        <View style={styles.modalBackdrop}>
          <View pointerEvents="none" style={styles.modalScrim} />
          <Pressable
            accessibilityLabel="Cerrar perfil"
            accessibilityRole="button"
            onPress={() => setProfileOpen(false)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.profileSheet}>
            <Pressable
              accessibilityLabel="Cerrar"
              accessibilityRole="button"
              onPress={() => setProfileOpen(false)}
              style={styles.sheetClose}
            >
              <X color={colors.text} size={20} strokeWidth={2.4} />
            </Pressable>
            <View style={styles.avatarHalo}>
              <Clay3DIcon kind="student" palette={CLAY_ACTIVE} size={104} />
            </View>
            <Text style={styles.sheetTitle}>{roleLabel}</Text>
            <Text style={styles.sheetHint}>Pronto verás aquí tu foto y tus datos de perfil.</Text>
            {onSignOut && (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setProfileOpen(false);
                  onSignOut();
                }}
                style={styles.sheetAction}
              >
                {({ pressed }) => (
                  <Raised3D faceStyle={styles.signOut} pressed={pressed} variant="white">
                    <LogOut color={categories.red.ink} size={18} strokeWidth={2.2} />
                    <Text style={styles.signOutText}>Cerrar sesión</Text>
                  </Raised3D>
                )}
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
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
  modalBackdrop: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: spacing.lg },
  modalScrim: {
    backgroundColor: brand.blueNight,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  profileSheet: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    gap: spacing.sm,
    maxWidth: 360,
    padding: spacing.lg,
    width: '100%',
  },
  sheetClose: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    top: 8,
    width: 48,
  },
  avatarHalo: {
    alignItems: 'center',
    backgroundColor: brand.blueSoft,
    borderRadius: radius.pill,
    height: 136,
    justifyContent: 'center',
    marginTop: spacing.sm,
    width: 136,
  },
  sheetTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 20 },
  sheetHint: {
    color: colors.textMuted,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    textAlign: 'center',
  },
  sheetAction: { alignSelf: 'stretch', marginTop: spacing.sm },
  signOut: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 48,
    justifyContent: 'center',
  },
  signOutText: { color: categories.red.ink, fontFamily: fontFamily.bold, fontSize: 15 },
  profileLabel: { color: brand.onBlue, fontFamily: fontFamily.semibold, fontSize: 15 },
  profileHint: { color: brand.onBlueMuted, fontFamily: fontFamily.regular, fontSize: 12 },
});
