import { useAuthSession } from '@/features/auth/AuthSession';
import { PortalGuard } from '@/features/auth/components/PortalGuard';
import { getPortalPath } from '@/features/auth/navigation';
import { DashboardScreen } from '@/features/dashboard/screens/DashboardScreen';
import { Redirect } from 'expo-router';

export default function ReinforcementStudentPortalRoute() {
  const { session, signOut } = useAuthSession();
  const isAllowed = session?.role === 'STUDENT' && session.activeModality === 'REINFORCEMENT';
  return (
    <PortalGuard role="STUDENT">
      {isAllowed ? (
        <DashboardScreen onSignOut={() => void signOut()} />
      ) : session ? (
        <Redirect href={getPortalPath(session)} />
      ) : null}
    </PortalGuard>
  );
}
