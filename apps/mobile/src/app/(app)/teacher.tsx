import { PortalGuard } from '@/features/auth/components/PortalGuard';
import { useAuthSession } from '@/features/auth/AuthSession';
import { ProvisionalPortalScreen } from '@/features/dashboard/screens/ProvisionalPortalScreen';

export default function TeacherPortalRoute() {
  const { signOut } = useAuthSession();
  return (
    <PortalGuard role="TEACHER">
      <ProvisionalPortalScreen onSignOut={() => void signOut()} role="TEACHER" />
    </PortalGuard>
  );
}
