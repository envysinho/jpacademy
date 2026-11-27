import { Redirect } from 'expo-router';

import { PortalGuard } from '@/features/auth/components/PortalGuard';
import { getPortalPath } from '@/features/auth/navigation';
import { useAuthSession } from '@/features/auth/AuthSession';

export default function DashboardRoute() {
  const { session } = useAuthSession();
  return <PortalGuard>{session ? <Redirect href={getPortalPath(session)} /> : null}</PortalGuard>;
}
