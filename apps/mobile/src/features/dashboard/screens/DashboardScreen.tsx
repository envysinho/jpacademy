import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily } from '@/theme';

import { DashboardShell } from '../components/DashboardShell';

import { StudentCalendar } from './StudentCalendar';
import { StudentCourses } from './StudentCourses';
import { StudentHome } from './StudentHome';
import { StudentTasks } from './StudentTasks';

/**
 * Dashboard del alumno (solo visual). Temporal: la sección activa es estado local
 * hasta que la navegación use rutas reales (DASHBOARD.md §6).
 */
export function DashboardScreen() {
  const [activeKey, setActiveKey] = useState('home');

  return (
    <DashboardShell activeKey={activeKey} onSelect={setActiveKey} role="STUDENT">
      {activeKey === 'home' && <StudentHome />}
      {activeKey === 'courses' && <StudentCourses />}
      {activeKey === 'calendar' && <StudentCalendar />}
      {activeKey === 'tasks' && <StudentTasks />}
      {!['home', 'courses', 'calendar', 'tasks'].includes(activeKey) && (
        <View style={styles.pending}>
          <Text style={styles.pendingText}>Sección en diseño.</Text>
        </View>
      )}
    </DashboardShell>
  );
}

const styles = StyleSheet.create({
  pending: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  pendingText: { color: colors.textMuted, fontFamily: fontFamily.medium, fontSize: 15 },
});
