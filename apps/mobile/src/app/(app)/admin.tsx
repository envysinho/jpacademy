import { PortalGuard } from '@/features/auth/components/PortalGuard';
import { useAuthSession } from '@/features/auth/AuthSession';
import { ProvisionalPortalScreen } from '@/features/dashboard/screens/ProvisionalPortalScreen';

export default function AdminPortalRoute() {
  const { signOut } = useAuthSession();
  return (
    <PortalGuard role="ADMIN">
      <ProvisionalPortalScreen onSignOut={() => void signOut()} role="ADMIN" />
    </PortalGuard>
  );
}
