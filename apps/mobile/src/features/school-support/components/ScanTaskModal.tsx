import {
  Camera,
  CircleAlert,
  FileText,
  Image as ImageIcon,
  Upload,
  X,
  type LucideIcon,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Clay3DIcon } from '@/components/Clay3DIcon';
import { Raised3D } from '@/components/Raised3D';
import { brand, categories, colors, fontFamily, radius, spacing } from '@/theme';

import { scanSamples, type ScanSource, type TaskBlock } from '../mocks/schoolSupport';

type Step = 'source' | 'preview' | 'uploading' | 'error';

const SOURCES: { caption: string; icon: LucideIcon; key: ScanSource; label: string }[] = [
  { caption: 'Toma una foto de tu cuaderno', icon: Camera, key: 'camera', label: 'Cámara' },
  { caption: 'Elige una imagen guardada', icon: ImageIcon, key: 'gallery', label: 'Galería' },
  { caption: 'Sube la ficha en PDF', icon: FileText, key: 'pdf', label: 'Archivo PDF' },
];

/** Duración de la «subida» simulada (ms). */
const UPLOAD_MS = 1200;
const BRAND_PALETTE = { base: brand.blue, ink: brand.blueDeep, soft: brand.blueSoft };

function ActionButton({
  icon: Icon,
  label,
  onPress,
  variant = 'primary',
}: {
  icon?: LucideIcon;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'white';
}) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {({ pressed }) => (
        <Raised3D depth={3} faceStyle={styles.button} pressed={pressed} variant={variant}>
          {Icon && (
            <Icon color={isPrimary ? brand.onBlue : colors.text} size={18} strokeWidth={2.2} />
          )}
          <Text style={[styles.buttonText, isPrimary && styles.buttonTextPrimary]}>{label}</Text>
        </Raised3D>
      )}
    </Pressable>
  );
}

/**
 * Subir tarea (simulado): origen → vista previa → subida. Al terminar, el padre abre el chat de
 * la tarea, donde el asistente responde con los temas encontrados. Si la imagen no se puede leer
 * (la galería lo simula), se muestra el error aquí.
 *
 * DESARROLLO: no usa cámara, galería ni archivos reales; no hay OCR ni IA ni se sube nada. El
 * padre lo monta al abrirlo, así que cada apertura empieza desde el primer paso.
 */
export function ScanTaskModal({
  onClose,
  onUploaded,
}: {
  onClose: () => void;
  onUploaded: (result: { blocks: TaskBlock[]; fileName: string; subject: string }) => void;
}) {
  const [step, setStep] = useState<Step>('source');
  const [source, setSource] = useState<ScanSource>();
  const sample = source ? scanSamples[source] : undefined;

  // Subida simulada; se cancela si el alumno cierra o vuelve antes de terminar.
  useEffect(() => {
    if (step !== 'uploading') return;
    const timer = setTimeout(() => {
      if (sample) onUploaded(sample);
      else setStep('error');
    }, UPLOAD_MS);
    return () => clearTimeout(timer);
  }, [onUploaded, sample, step]);

  const retry = () => {
    setSource(undefined);
    setStep('source');
  };

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible>
      <View style={styles.backdrop}>
        <View pointerEvents="none" style={styles.scrim} />
        <View style={styles.panel}>
          <View style={styles.header}>
            <Clay3DIcon kind="camera" palette={BRAND_PALETTE} shadow={false} size={40} />
            <View style={styles.flex}>
              <Text style={styles.title}>Subir tarea</Text>
              <Text style={styles.subtitle}>
                Simulación de prototipo: no se usa la cámara ni se sube ningún archivo.
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Cerrar"
              accessibilityRole="button"
              onPress={onClose}
              style={styles.close}
            >
              <X color={colors.text} size={20} strokeWidth={2.4} />
            </Pressable>
          </View>

          {step === 'source' && (
            <View style={styles.sources}>
              {SOURCES.map(({ caption, icon: Icon, key, label }) => (
                <Pressable
                  key={key}
                  accessibilityRole="button"
                  onPress={() => {
                    setSource(key);
                    setStep('preview');
                  }}
                  style={styles.flex}
                >
                  {({ pressed }) => (
                    <Raised3D
                      depth={4}
                      faceStyle={styles.source}
                      pressed={pressed}
                      radius={radius.card}
                    >
                      <View style={styles.sourceIcon}>
                        <Icon color={brand.blueDeep} size={28} strokeWidth={2} />
                      </View>
                      <Text style={styles.sourceLabel}>{label}</Text>
                      <Text style={styles.sourceCaption}>{caption}</Text>
                    </Raised3D>
                  )}
                </Pressable>
              ))}
            </View>
          )}

          {step === 'preview' && (
            <View style={styles.body}>
              <View style={styles.paper}>
                <Text style={styles.paperName}>{sample?.fileName ?? 'imagen-galeria.jpg'}</Text>
                {(sample?.preview ?? ['(imagen borrosa)', '…', '…']).map((line, index) => (
                  <Text
                    key={`${line}-${index}`}
                    style={[styles.paperLine, !sample && styles.paperBlur]}
                  >
                    {line}
                  </Text>
                ))}
              </View>
              <View style={styles.actions}>
                <ActionButton label="Elegir otra" onPress={retry} variant="white" />
                <ActionButton
                  icon={Upload}
                  label="Subir tarea"
                  onPress={() => setStep('uploading')}
                />
              </View>
            </View>
          )}

          {step === 'uploading' && (
            <View style={styles.center}>
              <ActivityIndicator color={brand.blue} size="large" />
              <Text style={styles.centerTitle}>Subiendo tu tarea…</Text>
              <Text style={styles.subtitle}>Enseguida se abre el chat de la tarea.</Text>
              <ActionButton label="Cancelar" onPress={retry} variant="white" />
            </View>
          )}

          {step === 'error' && (
            <View style={styles.center}>
              <CircleAlert color={categories.red.ink} size={40} strokeWidth={2} />
              <Text style={styles.centerTitle}>No pudimos leer la tarea</Text>
              <Text style={styles.subtitle}>
                La imagen está borrosa. Prueba con otra foto con buena luz o con el PDF.
              </Text>
              <ActionButton label="Intentar con otra" onPress={retry} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: spacing.lg },
  scrim: {
    backgroundColor: brand.blueNight,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    gap: spacing.md,
    maxHeight: '96%',
    maxWidth: 760,
    padding: spacing.lg,
    width: '100%',
  },
  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  title: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 20 },
  subtitle: { color: colors.textMuted, fontFamily: fontFamily.regular, fontSize: 13 },
  close: { alignItems: 'center', height: 48, justifyContent: 'center', width: 48 },
  sources: { flexDirection: 'row', gap: spacing.md },
  source: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  sourceIcon: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  sourceLabel: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 16 },
  sourceCaption: {
    color: colors.textMuted,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    textAlign: 'center',
  },
  body: { gap: spacing.md },
  paper: {
    backgroundColor: categories.orange.soft,
    borderColor: colors.border,
    borderRadius: radius.chip,
    borderWidth: 1,
    gap: 6,
    padding: spacing.lg,
    transform: [{ rotate: '-1deg' }],
  },
  paperName: {
    color: colors.textMuted,
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    marginBottom: 4,
  },
  paperLine: { color: colors.text, fontFamily: fontFamily.medium, fontSize: 16 },
  paperBlur: { color: colors.trackFill },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'flex-end' },
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 48,
    paddingHorizontal: 18,
  },
  buttonText: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 14 },
  buttonTextPrimary: { color: brand.onBlue },
  center: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  centerTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 17 },
});
