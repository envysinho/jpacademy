# Autenticación demo móvil

Última actualización: 2026-11-26 (UTC).

La autenticación actual es un adaptador local exclusivo para desarrollo y pruebas visuales. No usa API, base de datos, JWT, almacenamiento de contraseñas ni servicios externos. Sus barreras de rutas no son autorización de producción.

## Activación

Copiar o editar `apps/mobile/.env` y habilitar explícitamente:

```dotenv
EXPO_PUBLIC_DEMO_AUTH_ENABLED=true
```

El adaptador exige además `__DEV__`, por lo que una compilación de producción no admite estas cuentas aunque la variable se haya definido. La sesión se conserva solo en memoria: una recarga pide iniciar sesión otra vez y al cerrar sesión se desmontan los estados demo del usuario anterior.

Con `EXPO_PUBLIC_DEMO_AUTH_ENABLED` ausente (el caso de esta exportación), la exportación Android eliminó las cuatro contraseñas del bundle: se comprobó con `rg` sobre `apps/mobile/dist`. La integración de autenticación real sustituirá el adaptador `demoAuthService` detrás del contrato `AuthService`. Aun así, este flujo no constituye autorización de producción: esta deberá verificarse en servidor para cada recurso y operación.

## Cuentas públicas ficticias

El formulario existente solicita correo electrónico, por lo que los identificadores usan el dominio reservado `.test`.

| Usuario                      | Contraseña        | Rol       | Modalidad        | Destino                   |
| ---------------------------- | ----------------- | --------- | ---------------- | ------------------------- |
| `student.refuerzo@demo.test` | `DemoRefuerzo26!` | `STUDENT` | `REINFORCEMENT`  | `/student-reinforcement`  |
| `student.escolar@demo.test`  | `DemoEscolar26!`  | `STUDENT` | `SCHOOL_SUPPORT` | `/student-school-support` |
| `teacher.demo@demo.test`     | `DemoDocente26!`  | `TEACHER` | —                | `/teacher`                |
| `admin.demo@demo.test`       | `DemoAdmin26!`    | `ADMIN`   | —                | `/admin`                  |

`/student-reinforcement` reutiliza el dashboard aprobado. La interfaz de acompañamiento escolar sigue siendo responsabilidad de la fase visual; mientras se integra, su ruta muestra un shell explícitamente provisional, aislado de reforzamiento. Docente y administrador también usan shells provisionales.

## Contrato y rutas

- `features/auth/contracts.ts`: `UserRole`, `LearningModality`, `DemoSession` y `AuthService`.
- `features/auth/demoAuthService.ts`: única tabla de cuentas demo y adaptador local.
- `features/auth/AuthSession.tsx`: contexto de sesión intercambiable mediante `AuthService`.
- `features/auth/navigation.ts`: único selector de portal por rol/modalidad.
- `features/auth/components/PortalGuard.tsx`: redirección de navegación para accesos directos no permitidos.

El login y los componentes visuales no importan credenciales. Al sustituir el mock, se implementará el mismo contrato y se inyectará en `AuthSessionProvider`; la selección de portal y las pantallas no necesitan conocer su origen.

## Verificación

```bash
pnpm --filter @academy/mobile typecheck
pnpm --filter @academy/mobile lint
pnpm --filter @academy/mobile build
```

No hay pruebas automatizadas configuradas actualmente para el workspace móvil. La comprobación manual debe cubrir inicio inválido, las cuatro cuentas, cierre de sesión y el acceso directo cruzado entre los cuatro destinos.
