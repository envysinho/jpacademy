import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserPlus } from 'lucide-react-native';

import { colors, fontFamily, spacing } from '@/theme';

import { MathBackground } from '../components/MathBackground';

const handlePendingAction = () => undefined;

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { width } = useWindowDimensions();
  const showHero = width >= 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <MathBackground />

        {/* Espacio reservado para contenido de marca (pendiente) */}
        {showHero ? <View pointerEvents="none" style={styles.heroPanel} /> : null}

        <View style={[styles.formPanel, !showHero && styles.formPanelCentered]}>
          <View style={styles.formCard}>
            <Text style={styles.heading}>Iniciar sesión</Text>

            <View style={styles.fieldGroup}>
              <View style={styles.inputRow}>
                <Mail color="#70798B" size={22} strokeWidth={2} style={styles.inputIcon} />
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="Correo electrónico"
                  placeholderTextColor={colors.textMuted}
                  returnKeyType="next"
                  style={styles.input}
                  value={email}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.inputRow}>
                <LockKeyhole color="#70798B" size={21} strokeWidth={2} style={styles.inputIcon} />
                <TextInput
                  autoComplete="current-password"
                  onChangeText={setPassword}
                  onSubmitEditing={handlePendingAction}
                  placeholder="Contraseña"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                />
                <Pressable
                  accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onPress={() => setShowPassword((visible) => !visible)}
                  style={styles.visibilityButton}
                >
                  {showPassword ? (
                    <EyeOff color="#6D7587" size={22} strokeWidth={2} />
                  ) : (
                    <Eye color="#6D7587" size={22} strokeWidth={2} />
                  )}
                </Pressable>
              </View>
            </View>

            <Pressable onPress={handlePendingAction}>
              <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={handlePendingAction}
              style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]}
            >
              <Text style={styles.submitLabel}>Iniciar sesión</Text>
              <ArrowRight
                color={colors.surface}
                size={29}
                strokeWidth={2.25}
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
              <UserPlus color="#000000" size={23} strokeWidth={2.25} style={styles.registerIcon} />
              <Text style={styles.registerLabel}>Regístrate aquí</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1F1FFF' },
  screen: { backgroundColor: '#0B0BC4', flex: 1, flexDirection: 'row', overflow: 'hidden' },
  heroPanel: { flex: 1 },
  formPanel: {
    alignItems: 'flex-end',
    flex: 1.15,
    justifyContent: 'center',
    paddingHorizontal: 64,
    zIndex: 1,
  },
  formPanelCentered: { alignItems: 'center', paddingHorizontal: spacing.lg },
  formCard: {
    backgroundColor: '#ffffffe2',
    borderRadius: 32,
    elevation: 16,
    maxWidth: 520,
    padding: 40,
    shadowColor: '#020230',
    shadowOffset: { height: 20, width: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    width: '100%',
  },
  heading: {
    color: '#101424',
    fontFamily: fontFamily.extrabold,
    fontSize: 36,
    letterSpacing: -0.8,
  },
  fieldGroup: { marginTop: 22 },
  inputRow: {
    alignItems: 'center',
    borderColor: '#878894',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    height: 62,
  },
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
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#f67700',
    fontFamily: fontFamily.bold,
    fontSize: 15,
    marginTop: 14,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#f67700',
    borderRadius: 18,
    flexDirection: 'row',
    height: 62,
    justifyContent: 'center',
    marginTop: 32,
  },
  submitButtonPressed: { backgroundColor: '#b55800' },
  submitLabel: { color: colors.surface, fontFamily: fontFamily.bold, fontSize: 18 },
  arrow: { position: 'absolute', right: 24 },
  divider: { alignItems: 'center', flexDirection: 'row', gap: 16, marginTop: 27 },
  dividerLine: { backgroundColor: '#E0E1E9', flex: 1, height: 1 },
  dividerText: { color: '#70798B', fontFamily: fontFamily.regular, fontSize: 20 },
  registerButton: {
    alignItems: 'center',
    backgroundColor: '#FAFAFC',
    borderColor: '#E2E3EA',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    height: 62,
    justifyContent: 'center',
    marginTop: 27,
  },
  registerButtonPressed: { backgroundColor: '#F1F1F5' },
  registerIcon: { marginRight: 12 },
  registerLabel: { color: '#171A26', fontFamily: fontFamily.semibold, fontSize: 17 },
});
