import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { AuthService, DemoSession } from './contracts';
import { demoAuthService } from './demoAuthService';

type AuthSessionValue = {
  error: Error | null;
  isLoading: boolean;
  session: DemoSession | null;
  signIn: (username: string, password: string) => Promise<DemoSession>;
  signOut: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionValue | null>(null);

export function AuthSessionProvider({
  children,
  service = demoAuthService,
}: {
  children: ReactNode;
  /** Inyección puntual para pruebas o para el futuro adaptador remoto. */
  service?: AuthService;
}) {
  const [session, setSession] = useState<DemoSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    void service
      .getSession()
      .then((storedSession) => {
        if (active) setSession(storedSession);
      })
      .catch((cause: unknown) => {
        if (active)
          setError(cause instanceof Error ? cause : new Error('No se pudo recuperar la sesión'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [service]);

  const signIn = useCallback(
    async (username: string, password: string) => {
      setError(null);
      const nextSession = await service.signIn(username, password);
      setSession(nextSession);
      return nextSession;
    },
    [service],
  );

  const signOut = useCallback(async () => {
    await service.signOut();
    // Los estados de pantalla se desmontan al salir del grupo protegido; no se comparten entre cuentas.
    setSession(null);
    setError(null);
  }, [service]);

  const value = useMemo(
    () => ({ error, isLoading, session, signIn, signOut }),
    [error, isLoading, session, signIn, signOut],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const value = useContext(AuthSessionContext);
  if (!value) throw new Error('useAuthSession debe usarse dentro de AuthSessionProvider');
  return value;
}
