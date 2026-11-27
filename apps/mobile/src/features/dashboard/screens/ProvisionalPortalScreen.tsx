import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, spacing } from '@/theme';

import type { DashboardRole } from '../config/roleNavigation';
import { DashboardShell } from '../components/DashboardShell';

const portalCopy: Record<DashboardRole, { description: string; title: string }> = {
  ADMIN: {
    description:
      'El portal administrador aún está pendiente de planificación. Esta es una entrada demo.',
    title: 'Portal administrador',
  },
  STUDENT: {
    description:
      'La interfaz visual de acompañamiento escolar se integrará aquí. Esta entrada demo conserva la modalidad aislada del reforzamiento.',
    title: 'Acompañamiento escolar',
  },
  TEACHER: {
    description:
      'El portal docente común a ambas modalidades sigue en definición. Esta es una entrada demo.',
    title: 'Portal docente',
  },
};

export function ProvisionalPortalScreen({
  onSignOut,
  role,
}: {
  onSignOut: () => void;
  role: DashboardRole;
}) {
  const copy = portalCopy[role];
  return (
    <DashboardShell activeKey="home" onSelect={() => undefined} onSignOut={onSignOut} role={role}>
      <View style={styles.content}>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.description}>{copy.description}</Text>
        <Text style={styles.note}>
          Contenido provisional · sin reglas de permisos ni datos reales.
        </Text>
      </View>
    </DashboardShell>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', padding: spacing.xxl },
  description: {
    color: colors.textMuted,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 580,
    marginTop: spacing.sm,
  },
  note: {
    color: colors.textMuted,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    marginTop: spacing.lg,
  },
  title: {
    color: colors.text,
    fontFamily: fontFamily.extrabold,
    fontSize: 32,
    letterSpacing: -0.6,
  },
});
