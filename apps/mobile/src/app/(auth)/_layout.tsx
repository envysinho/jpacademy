import { Redirect, Stack } from 'expo-router';

import { useAuthSession } from '@/features/auth/AuthSession';
import { getPortalPath } from '@/features/auth/navigation';

export default function AuthLayout() {
  const { isLoading, session } = useAuthSession();
  if (isLoading) return null;
  if (session) return <Redirect href={getPortalPath(session)} />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
