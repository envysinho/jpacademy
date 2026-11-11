import type { ReactNode } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme';

import { Sidebar } from './Sidebar';

/** Estructura común del dashboard (sidebar + contenido). El contenido se recibe como hijos. */
export function DashboardShell({ children }: { children?: ReactNode }) {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.root}>
          <Sidebar />
          <View style={styles.content}>{children}</View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  root: { flex: 1, flexDirection: 'row' },
  content: { backgroundColor: colors.background, flex: 1 },
});
