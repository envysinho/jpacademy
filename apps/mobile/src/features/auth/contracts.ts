/** Roles disponibles para la navegación del prototipo. */
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

/** La modalidad académica es un atributo de estudiante, no un rol adicional. */
export type LearningModality = 'REINFORCEMENT' | 'SCHOOL_SUPPORT';

export type DemoSession = {
  displayName: string;
  userId: string;
} & (
  | { activeModality: LearningModality; role: 'STUDENT' }
  | { activeModality: null; role: 'TEACHER' | 'ADMIN' }
);

/**
 * Contrato que conservará la UI cuando el adaptador demo sea sustituido por uno remoto.
 * No representa un mecanismo de autorización de producción.
 */
export interface AuthService {
  getSession(): Promise<DemoSession | null>;
  signIn(username: string, password: string): Promise<DemoSession>;
  signOut(): Promise<void>;
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Credenciales inválidas');
    this.name = 'InvalidCredentialsError';
  }
}

export class DemoAuthDisabledError extends Error {
  constructor() {
    super('La autenticación demo no está habilitada');
    this.name = 'DemoAuthDisabledError';
  }
}
