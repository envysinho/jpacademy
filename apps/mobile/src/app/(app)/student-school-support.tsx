import { Redirect } from 'expo-router';

import { useAuthSession } from '@/features/auth/AuthSession';
import { PortalGuard } from '@/features/auth/components/PortalGuard';
import { getPortalPath } from '@/features/auth/navigation';
import { SchoolSupportScreen } from '@/features/school-support/screens/SchoolSupportScreen';

export default function SchoolSupportStudentPortalRoute() {
  const { session, signOut } = useAuthSession();
  const isAllowed = session?.role === 'STUDENT' && session.activeModality === 'SCHOOL_SUPPORT';
  return (
    <PortalGuard role="STUDENT">
      {isAllowed ? (
        <SchoolSupportScreen onSignOut={() => void signOut()} />
      ) : session ? (
        <Redirect href={getPortalPath(session)} />
      ) : null}
    </PortalGuard>
  );
}
