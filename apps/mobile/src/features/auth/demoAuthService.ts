import {
  type AuthService,
  DemoAuthDisabledError,
  type DemoSession,
  InvalidCredentialsError,
} from './contracts';

type DemoAccount = DemoSession & { password: string; username: string };

/**
 * Únicamente cuentas públicas de desarrollo. Este módulo no hace solicitudes de red ni persiste
 * contraseñas. Para activar el adaptador se exige EXPO_PUBLIC_DEMO_AUTH_ENABLED=true y __DEV__.
 */
const demoAccounts: readonly DemoAccount[] = [
  {
    activeModality: 'REINFORCEMENT',
    displayName: 'Estudiante de reforzamiento',
    password: 'DemoRefuerzo26!',
    role: 'STUDENT',
    userId: 'demo-student-reinforcement',
    username: 'student.refuerzo@demo.test',
  },
  {
    activeModality: 'SCHOOL_SUPPORT',
    displayName: 'Estudiante de acompañamiento',
    password: 'DemoEscolar26!',
    role: 'STUDENT',
    userId: 'demo-student-school-support',
    username: 'student.escolar@demo.test',
  },
  {
    activeModality: null,
    displayName: 'Docente demo',
    password: 'DemoDocente26!',
    role: 'TEACHER',
    userId: 'demo-teacher',
    username: 'teacher.demo@demo.test',
  },
  {
    activeModality: null,
    displayName: 'Administrador demo',
    password: 'DemoAdmin26!',
    role: 'ADMIN',
    userId: 'demo-admin',
    username: 'admin.demo@demo.test',
  },
];

const isDemoAuthEnabled = __DEV__ && process.env.EXPO_PUBLIC_DEMO_AUTH_ENABLED === 'true';

let currentSession: DemoSession | null = null;

function withoutPassword({
  password: _password,
  username: _username,
  ...session
}: DemoAccount): DemoSession {
  return session;
}

export const demoAuthService: AuthService = {
  async getSession() {
    return currentSession;
  },

  async signIn(username, password) {
    if (!isDemoAuthEnabled) throw new DemoAuthDisabledError();

    const account = demoAccounts.find(
      (candidate) => candidate.username.toLocaleLowerCase() === username.trim().toLocaleLowerCase(),
    );
    if (!account || account.password !== password) throw new InvalidCredentialsError();

    currentSession = withoutPassword(account);
    return currentSession;
  },

  async signOut() {
    currentSession = null;
  },
};

export { isDemoAuthEnabled };
