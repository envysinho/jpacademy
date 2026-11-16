import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserPlus } from 'lucide-react-native';

import { brand, colors, fontFamily, spacing } from '@/theme';
import { logos } from '@/theme/logos';

import { MathBackground } from '../components/MathBackground';

const handlePendingAction = () => undefined;

const ICON_SIZE = 22;
const ICON_STROKE = 2;

type Field = 'email' | 'password';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<Field | null>(null);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const showHero = width >= 768;
  // Temporal: sin autenticación real, el botón entra directo al dashboard.
  const goToDashboard = () => router.replace('/dashboard');

  const iconColor = (field: Field) => (focusedField === field ? brand.blueDeep : colors.textMuted);

  return (
    <View style={styles.root}>
      {/* El fondo cubre también la barra de estado y la de navegación. */}
      <MathBackground />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.screen}
        >
          {showHero ? (
            <View pointerEvents="none" style={styles.heroPanel}>
              <View style={styles.heroLogo}>
                {/* Contorno blanco: siluetas teñidas desplazadas alrededor del logo. */}
                {LOGO_OUTLINE_OFFSETS.map(({ x, y }) => (
                  <Image
                    key={`${x},${y}`}
                    resizeMode="contain"
                    source={logos.vertical}
                    style={[
                      styles.heroLogoLayer,
                      { tintColor: brand.onBlue, transform: [{ translateX: x }, { translateY: y }] },
                    ]}
                  />
                ))}
                <Image
                  accessibilityLabel="José Pisconte, Reforzamiento Académico"
                  resizeMode="contain"
                  source={logos.vertical}
                  style={styles.heroLogoLayer}
                />
              </View>
            </View>
          ) : null}

          <View style={[styles.formPanel, !showHero && styles.formPanelCentered]}>
            <View style={styles.formCard}>
              <Text style={styles.heading}>Iniciar sesión</Text>
              <Text style={styles.subheading}>Ingresa tus datos para continuar.</Text>

              <View
                style={[styles.inputRow, focusedField === 'email' && styles.inputRowFocused]}
              >
                <Mail
                  color={iconColor('email')}
                  size={ICON_SIZE}
                  strokeWidth={ICON_STROKE}
                  style={styles.inputIcon}
                />
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onBlur={() => setFocusedField(null)}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField('email')}
                  placeholder="Correo electrónico"
                  placeholderTextColor={colors.textMuted}
                  returnKeyType="next"
                  style={styles.input}
                  value={email}
                />
              </View>

              <View
                style={[
                  styles.inputRow,
                  styles.inputRowSpaced,
                  focusedField === 'password' && styles.inputRowFocused,
                ]}
              >
                <LockKeyhole
                  color={iconColor('password')}
                  size={ICON_SIZE}
                  strokeWidth={ICON_STROKE}
                  style={styles.inputIcon}
                />
                <TextInput
                  autoComplete="current-password"
                  onBlur={() => setFocusedField(null)}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField('password')}
                  onSubmitEditing={handlePendingAction}
                  placeholder="Contraseña"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                />
                <Pressable
                  accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  accessibilityRole="button"
                  onPress={() => setShowPassword((visible) => !visible)}
                  style={styles.visibilityButton}
                >
                  {showPassword ? (
                    <EyeOff color={colors.textMuted} size={ICON_SIZE} strokeWidth={ICON_STROKE} />
                  ) : (
                    <Eye color={colors.textMuted} size={ICON_SIZE} strokeWidth={ICON_STROKE} />
                  )}
                </Pressable>
              </View>

              <Pressable
                accessibilityRole="link"
                hitSlop={12}
                onPress={handlePendingAction}
                style={styles.forgotPasswordButton}
              >
                <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={goToDashboard}
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && styles.submitButtonPressed,
                ]}
              >
                <Text style={styles.submitLabel}>Iniciar sesión</Text>
                <ArrowRight
                  color={colors.surface}
                  size={24}
                  strokeWidth={2.4}
                  style={styles.arrow}
                />
              </Pressable>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={handlePendingAction}
                style={({ pressed }) => [
                  styles.registerButton,
                  pressed && styles.registerButtonPressed,
                ]}
              >
                <UserPlus
                  color={colors.text}
                  size={ICON_SIZE}
                  strokeWidth={ICON_STROKE}
                  style={styles.registerIcon}
                />
                <Text style={styles.registerLabel}>Regístrate aquí</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const FIELD_HEIGHT = 62;
const FIELD_RADIUS = 18;
/** Alto del logo en dp; el ancho sale de la proporción del logo vertical (320:391). */
const HERO_LOGO_HEIGHT = 500;
/** Grosor del contorno blanco del logo. */
const LOGO_OUTLINE_WIDTH = 3;
const LOGO_OUTLINE_STEPS = 16;
const LOGO_OUTLINE_OFFSETS = Array.from({ length: LOGO_OUTLINE_STEPS }, (_, i) => {
  const angle = (i / LOGO_OUTLINE_STEPS) * 2 * Math.PI;
  return {
    x: Math.round(Math.cos(angle) * LOGO_OUTLINE_WIDTH * 10) / 10,
    y: Math.round(Math.sin(angle) * LOGO_OUTLINE_WIDTH * 10) / 10,
  };
});

const styles = StyleSheet.create({
  root: { backgroundColor: brand.blueDeep, flex: 1 },
  safeArea: { flex: 1 },
  screen: { flex: 1, flexDirection: 'row' },
  heroPanel: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingLeft: 64 },
  heroLogo: { height: HERO_LOGO_HEIGHT, width: (HERO_LOGO_HEIGHT * 320) / 391 },
  heroLogoLayer: { height: '100%', left: 0, position: 'absolute', top: 0, width: '100%' },
  formPanel: {
    alignItems: 'flex-end',
    flex: 1.15,
    justifyContent: 'center',
    paddingHorizontal: 64,
  },
  formPanelCentered: { alignItems: 'center', paddingHorizontal: spacing.lg },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 32,
    elevation: 16,
    maxWidth: 520,
    padding: 40,
    shadowColor: brand.blueNight,
    shadowOffset: { height: 20, width: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    width: '100%',
  },
  heading: {
    color: colors.text,
    fontFamily: fontFamily.extrabold,
    fontSize: 36,
    letterSpacing: -0.8,
  },
  subheading: {
    color: colors.textMuted,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  inputRow: {
    alignItems: 'center',
    borderColor: colors.borderStrong,
    borderRadius: FIELD_RADIUS,
    borderWidth: 1,
    flexDirection: 'row',
    height: FIELD_HEIGHT,
  },
  inputRowSpaced: { marginTop: spacing.md },
  inputRowFocused: { borderColor: brand.blueDeep },
  inputIcon: { marginLeft: 20, width: 31 },
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 17,
    height: '100%',
    paddingHorizontal: spacing.sm,
  },
  visibilityButton: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  forgotPasswordButton: { alignSelf: 'flex-end', marginTop: 14 },
  // Enlace en azul: el naranja queda reservado al botón principal (una acción naranja por zona).
  forgotPassword: { color: brand.blueDeep, fontFamily: fontFamily.semibold, fontSize: 15 },
  submitButton: {
    alignItems: 'center',
    backgroundColor: brand.accent,
    borderRadius: FIELD_RADIUS,
    flexDirection: 'row',
    height: FIELD_HEIGHT,
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  submitButtonPressed: { backgroundColor: brand.accentPressed },
  submitLabel: { color: colors.surface, fontFamily: fontFamily.bold, fontSize: 18 },
  arrow: { position: 'absolute', right: 24 },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: 20,
  },
  dividerLine: { backgroundColor: colors.border, flex: 1, height: 1 },
  dividerText: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 14 },
  registerButton: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: FIELD_RADIUS,
    borderWidth: 1,
    flexDirection: 'row',
    height: FIELD_HEIGHT,
    justifyContent: 'center',
  },
  registerButtonPressed: { backgroundColor: colors.border },
  registerIcon: { marginRight: 12 },
  registerLabel: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 17 },
});
