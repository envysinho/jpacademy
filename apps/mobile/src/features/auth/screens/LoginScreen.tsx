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
import {
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserPlus,
  type LucideIcon,
} from 'lucide-react-native';

import { Clay3DIcon, type ClayPalette } from '@/components/Clay3DIcon';
import { Raised3D } from '@/components/Raised3D';
import { SoftScene } from '@/components/SoftScene';
import { brand, categories, colors, fontFamily, radius, spacing } from '@/theme';
import { logos } from '@/theme/logos';

import { DemoAuthDisabledError, InvalidCredentialsError } from '../contracts';
import { useAuthSession } from '../AuthSession';
import { getPortalPath } from '../navigation';
import { FloatingClay } from '../components/FloatingClay';
import { MathBackground } from '../components/MathBackground';

const handlePendingAction = () => undefined;

const ICON_SIZE = 20;
const ICON_STROKE = 2;

/** Paleta de marca para los objetos 3D sobre blanco. */
const BRAND_CLAY: ClayPalette = { base: brand.blue, ink: brand.blueNight, soft: brand.blueSoft };
const BRAND_SOFT = { base: brand.blue, soft: brand.blueSoft };

type Field = 'email' | 'password';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<Field | null>(null);
  const { signIn } = useAuthSession();
  const { width } = useWindowDimensions();
  const showHero = width >= 768;
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (isSubmitting) return;
    setErrorMessage(undefined);
    setIsSubmitting(true);
    try {
      const session = await signIn(email, password);
      router.replace(getPortalPath(session));
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof DemoAuthDisabledError
          ? 'La autenticación demo no está habilitada en esta compilación.'
          : error instanceof InvalidCredentialsError
            ? 'Usuario o contraseña incorrectos.'
            : 'No se pudo iniciar sesión. Inténtalo nuevamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
                {/* Objetos 3D con los colores del escudo (mismo recurso que el sidebar). */}
                <FloatingClay
                  kind="book"
                  palette={categories.red}
                  rotate={-12}
                  size={84}
                  style={styles.clayBook}
                />
                <FloatingClay
                  delay={900}
                  kind="trophy"
                  palette={categories.orange}
                  rotate={10}
                  size={88}
                  style={styles.clayTrophy}
                />
                <FloatingClay
                  delay={1700}
                  kind="calendar"
                  palette={categories.green}
                  rotate={-6}
                  size={64}
                  style={styles.clayCalendar}
                />

                {/* Contorno blanco: siluetas teñidas desplazadas alrededor del logo. */}
                {LOGO_OUTLINE_OFFSETS.map(({ x, y }) => (
                  <Image
                    key={`${x},${y}`}
                    resizeMode="contain"
                    source={logos.vertical}
                    style={[
                      styles.heroLogoLayer,
                      {
                        tintColor: brand.onBlue,
                        transform: [{ translateX: x }, { translateY: y }],
                      },
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
            {/* Tarjeta de "arcilla" blanca: canto lavanda debajo y cara encima. */}
            <View style={styles.cardWrap}>
              <View pointerEvents="none" style={styles.cardEdge} />
              <View style={styles.formCard}>
                <View style={styles.header}>
                  <View style={styles.headerTile}>
                    <SoftScene base={brand.blue} />
                    <Clay3DIcon kind="student" palette={BRAND_CLAY} size={52} />
                  </View>
                  <View style={styles.headerText}>
                    <Text style={styles.heading}>Iniciar sesión</Text>
                    <Text style={styles.subheading}>Ingresa tus datos para continuar.</Text>
                  </View>
                </View>

                <InputField
                  focused={focusedField === 'email'}
                  icon={Mail}
                  input={
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
                  }
                />

                <InputField
                  focused={focusedField === 'password'}
                  icon={LockKeyhole}
                  input={
                    <TextInput
                      autoComplete="current-password"
                      onBlur={() => setFocusedField(null)}
                      onChangeText={setPassword}
                      onFocus={() => setFocusedField('password')}
                      onSubmitEditing={() => void submit()}
                      placeholder="Contraseña"
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry={!showPassword}
                      style={styles.input}
                      value={password}
                    />
                  }
                  spaced
                  trailing={
                    <Pressable
                      accessibilityLabel={
                        showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                      }
                      accessibilityRole="button"
                      onPress={() => setShowPassword((visible) => !visible)}
                      style={styles.visibilityButton}
                    >
                      {showPassword ? (
                        <EyeOff
                          color={colors.textMuted}
                          size={ICON_SIZE + 2}
                          strokeWidth={ICON_STROKE}
                        />
                      ) : (
                        <Eye
                          color={colors.textMuted}
                          size={ICON_SIZE + 2}
                          strokeWidth={ICON_STROKE}
                        />
                      )}
                    </Pressable>
                  }
                />

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
                  accessibilityState={{ busy: isSubmitting, disabled: isSubmitting }}
                  disabled={isSubmitting}
                  onPress={() => void submit()}
                  style={[styles.submitButton, isSubmitting && styles.submitButtonBusy]}
                >
                  {({ pressed }) => (
                    <Raised3D
                      depth={5}
                      faceStyle={styles.buttonFace}
                      pressed={pressed || isSubmitting}
                      radius={FIELD_RADIUS}
                      variant="accent"
                    >
                      <Text style={styles.submitLabel}>
                        {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
                      </Text>
                      <ArrowRight
                        color={brand.onBlue}
                        size={24}
                        strokeWidth={2.4}
                        style={styles.arrow}
                      />
                    </Raised3D>
                  )}
                </Pressable>

                {errorMessage ? (
                  <View accessibilityRole="alert" style={styles.errorBox}>
                    <CircleAlert
                      color={categories.red.ink}
                      size={ICON_SIZE}
                      strokeWidth={ICON_STROKE}
                    />
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                  </View>
                ) : null}

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>o</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Pressable accessibilityRole="button" onPress={handlePendingAction}>
                  {({ pressed }) => (
                    <Raised3D
                      depth={4}
                      faceStyle={styles.buttonFace}
                      pressed={pressed}
                      radius={FIELD_RADIUS}
                      variant="white"
                    >
                      <UserPlus
                        color={brand.blueDeep}
                        size={ICON_SIZE + 2}
                        strokeWidth={ICON_STROKE}
                        style={styles.registerIcon}
                      />
                      <Text style={styles.registerLabel}>Regístrate aquí</Text>
                    </Raised3D>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

/**
 * Campo del formulario: el icono va en un chip 3D (`soft` en reposo, `primary` al enfocar),
 * mismo patrón de selección que el resto de la app.
 */
function InputField({
  focused,
  icon: Icon,
  input,
  spaced = false,
  trailing,
}: {
  focused: boolean;
  icon: LucideIcon;
  input: React.ReactNode;
  spaced?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <View
      style={[styles.inputRow, spaced && styles.inputRowSpaced, focused && styles.inputRowFocused]}
    >
      <Raised3D
        depth={3}
        faceStyle={styles.inputChip}
        palette={BRAND_SOFT}
        radius={12}
        style={styles.inputChipWrap}
        variant={focused ? 'primary' : 'soft'}
      >
        <Icon
          color={focused ? brand.onBlue : brand.blueDeep}
          size={ICON_SIZE}
          strokeWidth={ICON_STROKE}
        />
      </Raised3D>
      {input}
      {trailing}
    </View>
  );
}

const FIELD_HEIGHT = 60;
const FIELD_RADIUS = 18;
const CARD_RADIUS = 32;
/** Grosor del canto de la tarjeta. */
const CARD_DEPTH = 10;
/** Alto del logo en dp; el ancho sale de la proporción del logo vertical (320:391). */
const HERO_LOGO_HEIGHT = 470;
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
  // Esquinas libres junto al escudo (abajo está el nombre).
  clayBook: { left: -34, top: 36 },
  clayTrophy: { right: -40, top: 20 },
  clayCalendar: { left: 0, top: 200 },
  formPanel: {
    alignItems: 'flex-end',
    flex: 1.15,
    justifyContent: 'center',
    paddingHorizontal: 64,
  },
  formPanelCentered: { alignItems: 'center', paddingHorizontal: spacing.lg },
  cardWrap: { maxWidth: 520, paddingBottom: CARD_DEPTH, width: '100%' },
  cardEdge: {
    backgroundColor: brand.blueSoft,
    borderRadius: CARD_RADIUS,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: CARD_DEPTH,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: CARD_RADIUS,
    elevation: 16,
    paddingHorizontal: 40,
    paddingVertical: 34,
    shadowColor: brand.blueNight,
    shadowOffset: { height: 20, width: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
  },
  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  headerTile: {
    alignItems: 'center',
    backgroundColor: brand.blueSoft,
    borderRadius: radius.card,
    height: 72,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 72,
  },
  headerText: { flex: 1 },
  heading: {
    color: colors.text,
    fontFamily: fontFamily.extrabold,
    fontSize: 36,
    includeFontPadding: false,
    letterSpacing: -0.8,
    lineHeight: 42,
  },
  subheading: {
    color: colors.textMuted,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    marginTop: spacing.xs,
  },
  inputRow: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.borderStrong,
    borderRadius: FIELD_RADIUS,
    borderWidth: 1,
    flexDirection: 'row',
    height: FIELD_HEIGHT,
  },
  inputRowSpaced: { marginTop: 14 },
  // Al enfocar: cara blanca y borde de marca más grueso (no depende solo del color del chip).
  inputRowFocused: { backgroundColor: colors.surface, borderColor: brand.blue, borderWidth: 2 },
  inputChipWrap: { marginLeft: 10 },
  inputChip: { alignItems: 'center', height: 38, justifyContent: 'center', width: 38 },
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 17,
    height: '100%',
    paddingHorizontal: 12,
  },
  visibilityButton: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  forgotPasswordButton: { alignSelf: 'flex-end', marginTop: 12 },
  // Enlace en azul: el naranja queda reservado al botón principal (una acción naranja por zona).
  forgotPassword: { color: brand.blueDeep, fontFamily: fontFamily.semibold, fontSize: 15 },
  submitButton: { marginTop: 20 },
  submitButtonBusy: { opacity: 0.85 },
  buttonFace: {
    alignItems: 'center',
    flexDirection: 'row',
    height: FIELD_HEIGHT,
    justifyContent: 'center',
  },
  submitLabel: { color: brand.onBlue, fontFamily: fontFamily.bold, fontSize: 18 },
  arrow: { position: 'absolute', right: 24 },
  errorBox: {
    alignItems: 'center',
    backgroundColor: categories.red.soft,
    borderRadius: radius.chip,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  errorMessage: {
    color: colors.danger,
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: 14,
  },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: 18,
  },
  dividerLine: { backgroundColor: colors.border, flex: 1, height: 1 },
  dividerText: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 14 },
  registerIcon: { marginRight: 12 },
  registerLabel: { color: colors.text, fontFamily: fontFamily.semibold, fontSize: 17 },
});
