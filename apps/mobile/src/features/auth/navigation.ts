import type { DemoSession } from './contracts';

export type PortalPath =
  '/student-reinforcement' | '/student-school-support' | '/teacher' | '/admin';

/** Punto único para convertir la sesión en destino de navegación. */
export function getPortalPath(session: DemoSession): PortalPath {
  if (session.role === 'STUDENT') {
    return session.activeModality === 'REINFORCEMENT'
      ? '/student-reinforcement'
      : '/student-school-support';
  }
  return session.role === 'TEACHER' ? '/teacher' : '/admin';
}
