import { Redirect } from 'expo-router';

import { useAuthSession } from '@/features/auth/AuthSession';
import { getPortalPath } from '@/features/auth/navigation';

export default function Index() {
  const { isLoading, session } = useAuthSession();
  if (isLoading) return null;
  return <Redirect href={session ? getPortalPath(session) : '/login'} />;
}
