import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_NAME } from '@academy/shared';

import { colors, spacing } from '@/theme';

const benefits = [
  { icon: '▷', label: 'Cursos\ninteractivos' },
  { icon: '□', label: 'Clases\nprogramadas' },
  { icon: '▥', label: 'Seguimiento\nde tu progreso' },
];

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!email.trim() || !password) {
      setError('Ingresa tu correo electrónico y contraseña.');
      return;
    }

    setError('El inicio de sesión estará disponible al conectar el servicio de autenticación.');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <View pointerEvents="none" style={[styles.backgroundShape, styles.backgroundShapeTop]} />
        <View pointerEvents="none" style={[styles.backgroundShape, styles.backgroundShapeBottom]} />

        <View style={styles.presentationPanel}>
          <View style={styles.logoRow}>
            <Text style={styles.logoIcon}>▰</Text>
            <Text style={styles.logoStrong}>EdTech</Text>
            <Text style={styles.logoName}> Academy</Text>
          </View>

          <View style={styles.messageBlock}>
            <Text style={styles.heroTitle}>Tu espacio{`\n`}de aprendizaje</Text>
            <Text style={styles.heroDescription}>
              Accede a tus cursos, tareas y clases{`\n`}desde un solo lugar.
            </Text>
          </View>

          <View style={styles.benefits}>
            {benefits.map((benefit) => (
              <View key={benefit.label} style={styles.benefit}>
                <View style={styles.benefitIcon}>
                  <Text style={styles.benefitIconText}>{benefit.icon}</Text>
                </View>
                <Text style={styles.benefitLabel}>{benefit.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.pagination}>
            <View style={styles.paginationActive} />
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
          </View>
        </View>

        <View style={styles.formPanel}>
          <View style={styles.formCard}>
            <Text style={styles.heading}>Iniciar sesión</Text>
            <Text style={styles.intro}>Continúa con tu cuenta de {APP_NAME}</Text>

            <View style={styles.fieldGroup}>
              <View style={styles.inputRow}>
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onChangeText={(value) => {
                    setEmail(value);
                    setError(null);
                  }}
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
                <Text style={styles.inputIcon}>▣</Text>
                <TextInput
                  autoComplete="current-password"
                  onChangeText={(value) => {
                    setPassword(value);
                    setError(null);
                  }}
                  onSubmitEditing={handleSubmit}
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
                  <Text style={styles.visibilityText}>{showPassword ? 'Ocultar' : '◉'}</Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={() =>
                setError('La recuperación de contraseña estará disponible próximamente.')
              }
            >
              <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            {error ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              onPress={handleSubmit}
              style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]}
            >
              <Text style={styles.submitLabel}>Iniciar sesión</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => setError('El acceso con Google estará disponible próximamente.')}
              style={({ pressed }) => [styles.googleButton, pressed && styles.googleButtonPressed]}
            >
              <Text style={styles.googleMark}>G</Text>
              <Text style={styles.googleLabel}>Continuar con Google</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F5FF' },
  screen: { backgroundColor: '#F6F5FF', flex: 1, flexDirection: 'row', overflow: 'hidden' },
  backgroundShape: { backgroundColor: '#E7E3FF', borderRadius: 9999, position: 'absolute' },
  backgroundShapeTop: { height: 620, left: -270, top: -420, width: 920 },
  backgroundShapeBottom: { bottom: -500, height: 780, left: 10, width: 910 },
  presentationPanel: {
    flex: 1.17,
    justifyContent: 'center',
    paddingHorizontal: 64,
    paddingVertical: spacing.xl,
  },
  logoRow: { alignItems: 'center', flexDirection: 'row', position: 'absolute', top: 52 },
  logoIcon: {
    color: '#5B3CC4',
    fontSize: 27,
    marginRight: spacing.sm,
    transform: [{ rotate: '-22deg' }],
  },
  logoStrong: { color: colors.text, fontSize: 25, fontWeight: '800' },
  logoName: { color: colors.text, fontSize: 25, fontWeight: '400' },
  messageBlock: { marginTop: 44 },
  heroTitle: {
    color: colors.text,
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -1.2,
    lineHeight: 62,
  },
  heroDescription: { color: '#505B70', fontSize: 19, lineHeight: 29, marginTop: spacing.md },
  benefits: { flexDirection: 'row', gap: 32, marginTop: 66 },
  benefit: { alignItems: 'center', width: 102 },
  benefitIcon: {
    alignItems: 'center',
    backgroundColor: '#EAE7FF',
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  benefitIconText: { color: '#4F35C5', fontSize: 28, fontWeight: '500' },
  benefitLabel: {
    color: '#4B5568',
    fontSize: 14,
    lineHeight: 18,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  pagination: { flexDirection: 'row', gap: 8, marginTop: 68 },
  paginationActive: { backgroundColor: '#5B3CC4', borderRadius: 6, height: 10, width: 28 },
  paginationDot: { backgroundColor: '#DCDCEA', borderRadius: 6, height: 10, width: 22 },
  formPanel: {
    alignItems: 'center',
    flex: 1.15,
    justifyContent: 'center',
    paddingHorizontal: 40,
    zIndex: 1,
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.84)',
    borderRadius: 40,
    maxWidth: 550,
    padding: 40,
    shadowColor: '#5A5580',
    shadowOffset: { height: 12, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    width: '100%',
  },
  heading: { color: '#101424', fontSize: 36, fontWeight: '800', letterSpacing: -0.8 },
  intro: { color: '#667085', fontSize: 17, marginTop: spacing.sm },
  fieldGroup: { marginTop: 22 },
  inputRow: {
    alignItems: 'center',
    borderColor: '#D9DAE5',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    height: 62,
  },
  inputIcon: { color: '#70798B', fontSize: 23, marginLeft: 20, width: 31 },
  input: {
    color: colors.text,
    flex: 1,
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
  visibilityText: { color: '#6D7587', fontSize: 16, fontWeight: '600' },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#4126D1',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 14,
  },
  error: { color: colors.danger, fontSize: 13, lineHeight: 18, marginTop: spacing.md },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#5638C5',
    borderRadius: 18,
    flexDirection: 'row',
    height: 62,
    justifyContent: 'center',
    marginTop: 32,
  },
  submitButtonPressed: { backgroundColor: '#4126A2' },
  submitLabel: { color: colors.surface, fontSize: 18, fontWeight: '700' },
  arrow: {
    color: colors.surface,
    fontSize: 32,
    fontWeight: '300',
    position: 'absolute',
    right: 24,
    top: 11,
  },
  divider: { alignItems: 'center', flexDirection: 'row', gap: 16, marginTop: 27 },
  dividerLine: { backgroundColor: '#E0E1E9', flex: 1, height: 1 },
  dividerText: { color: '#70798B', fontSize: 20 },
  googleButton: {
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
  googleButtonPressed: { backgroundColor: '#F1F1F5' },
  googleMark: { color: '#4285F4', fontSize: 27, fontWeight: '800', marginRight: 17 },
  googleLabel: { color: '#171A26', fontSize: 17, fontWeight: '600' },
});
