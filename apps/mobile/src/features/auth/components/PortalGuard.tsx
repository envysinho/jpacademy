import type { ReactNode } from 'react';
import { Redirect } from 'expo-router';

import type { UserRole } from '../contracts';
import { getPortalPath } from '../navigation';
import { useAuthSession } from '../AuthSession';

/** Barrera de navegación del prototipo; la autorización real será responsabilidad del servidor. */
export function PortalGuard({ children, role }: { children: ReactNode; role?: UserRole }) {
  const { isLoading, session } = useAuthSession();

  if (isLoading) return null;
  if (!session) return <Redirect href="/login" />;
  if (role && session.role !== role) return <Redirect href={getPortalPath(session)} />;
  return <>{children}</>;
}
