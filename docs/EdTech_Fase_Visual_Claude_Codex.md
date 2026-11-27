# EdTech Academy OS — Fase visual y autenticación simulada

**Destinatarios:** Claude y Codex  
**Etapa:** prototipo frontend navegable (noviembre de 2026)  
**Backend real:** diferido a diciembre de 2026.  
**Objetivo:** validar las experiencias de usuario y preparar una base modular para integrar servicios reales posteriormente, sin desarrollar infraestructura backend en esta etapa.

## 1. Instrucciones comunes

Trabajar sobre el repositorio existente. Antes de editar, inspeccionar su estructura, stack, navegación, componentes, estilos, assets y mecanismo de autenticación actual. No crear una aplicación paralela ni migrar el framework. Respetar el gestor de paquetes y convenciones existentes (pnpm si corresponde al repositorio). Conservar el diseño aprobado del estudiante de reforzamiento y consultar las especificaciones visuales previas disponibles en el proyecto, particularmente `EdTech_Student_UX_UI_Claude.md` si está presente.

Esta fase es un prototipo funcional de frontend: los botones, rutas, estados y datos simulados deben permitir demostrar los flujos principales, pero no representar servicios reales inexistentes. No instalar dependencias innecesarias. No introducir cambios destructivos ni sobrescribir trabajo de otro agente.

## 2. Modelo conceptual: tres roles, dos modalidades

| Rol | Modalidad | Experiencia |
|---|---|---|
| STUDENT | REINFORCEMENT | Reforzamiento académico, ruta curricular predefinida y avance individual |
| STUDENT | SCHOOL_SUPPORT | Acompañamiento escolar, aprendizaje a partir de tareas externas o búsqueda de temas |
| TEACHER | No aplica | Portal docente compartido para ambas modalidades |
| ADMIN | No aplica | Portal administrador compartido |

No crear dos roles de estudiante ni dos sistemas de login. La modalidad debe modelarse como una característica de la matrícula o acceso académico, separada del rol. Para el prototipo basta con una modalidad activa por estudiante. La modalidad combinada queda pendiente de decisión; no implementar un selector de modalidad comercial definitivo.

## 3. Responsabilidades por agente

| Actividad | Claude | Codex |
|---|---|---|
| Diseño, layout, assets y componentes | Responsable | Respetar |
| Pantallas y navegación visual | Responsable | Integrar rutas y verificar |
| Mock data visual | Responsable | Coordinar contratos |
| Sesión local y cuentas demo | Consumir contrato | Responsable |
| Selección de portal por rol/modalidad | Consumir contrato | Responsable |
| Pruebas de navegación y aislamiento de sesión | Apoyo | Responsable |
| Backend, base de datos, IA real | Fuera de alcance | Fuera de alcance |

Claude no debe construir un login alternativo ni decidir permisos de producción. Codex no debe rediseñar pantallas aprobadas ni iniciar la infraestructura backend. Ambos deben acordar los contratos frontend antes de conectar sus cambios.

## 4. Claude — instrucciones de UX/UI

### 4.1. Reforzamiento académico

Preservar el trabajo anterior, incluida la sidebar, tipografía, ilustraciones, colores, espaciados y componentes aprobados. No rehacer las vistas desde cero. Mantener Inicio, Cursos, Tareas, Calendario/Agenda y Progreso. La denominación Agenda es una propuesta, no una decisión definitiva: conservar el nombre actual si no se ha autorizado el cambio.

- Inicio: tarjeta del último curso activo (no curso fijo), racha, ranking contextual, horas y logros.
- Cursos: búsqueda a la izquierda; selectores Todos, En progreso, Completados y Favoritos junto a vista cuadrícula/lista a la derecha; eliminar filtros avanzados. Tarjetas de cursos generales (Álgebra, Geometría, Ciencia, etc.), no temas aislados.
- Interior: video y resumen escrito a la izquierda; progreso y pestañas Lección/Recursos a la derecha. Recursos con ejemplos, ejercicios y tareas PDF. Avance secuencial individual sin navegación hacia lecciones anteriores o futuras según lo acordado; condición exacta de desbloqueo pendiente. No fijar fechas colectivas para avanzar.
- Resolver tarea: reutilizar chat IA existente, adjuntos, contador de intentos, ayuda docente y entrega formal diferenciada de consultas. Compartir la misma pantalla desde Cursos y Tareas.
- Tareas: cuatro tarjetas superiores como navegación (Pendientes, Para hoy, Entregadas, Promedio), sin barra secundaria redundante. Pendientes por defecto; listado y detalle en dos columnas.
- Progreso: avance general, notas por curso, evolución, ranking y tarjeta académica visual. Usar datos ilustrativos; fórmula del ranking pendiente.

### 4.2. Calendario: adaptación transversal

La academia es asincrónica: cada alumno avanza a su propio ritmo. No inventar clases diarias ni fechas de lecciones ordinarias. Mostrar únicamente eventos con fechas reales o, en demo, ejemplos explícitamente simulados: entregas con vencimiento, asesorías programadas, videollamadas agendadas, simulacros y actividades especiales. Las solicitudes inmediatas pertenecen a Atenciones, no al calendario. Si no hay eventos, mostrar estado vacío amigable y eventualmente metas personales (propuesta).

Conservar el layout aprobado: calendario izquierdo, agenda derecha con vistas diaria/semanal/mensual, leyenda y tarjetas superiores pertinentes. Eliminar Próximos eventos, ajustar ambas columnas al mismo borde inferior, evitar huecos residuales y scroll global en tablet horizontal; permitir scroll interno cuando sea necesario. Las metas no condicionan el avance curricular. No forzar fechas límite en tareas que no las tengan.

### 4.3. Nueva modalidad: Acompañamiento escolar

Mantener la identidad visual y los componentes compartidos. Propuesta de navegación: Inicio, Aprender, Mis tareas, Calendario/Agenda, Progreso. No modificar la sidebar de reforzamiento para introducir esta modalidad.

**Inicio:** sustituir la tarjeta principal de último curso por «¿Qué vamos a aprender hoy?» con Escanear tarea y Buscar tema. Mostrar sesiones recientes o pendientes, tareas resueltas, temas aprendidos y racha. Este inicio corresponde únicamente al acompañamiento escolar.

**Escanear tarea:** permitir simular cámara/galería/PDF, vista previa, estado de análisis y confirmación del tema identificado. Mostrar asignatura, tema y ejercicios detectados; permitir corregir una identificación errónea. Si hay varios temas, representar bloques separados. No conectar OCR ni IA reales. No subir imágenes a servidores externos. Si se usa un selector de archivos local, limitarlo al prototipo y manejar cancelaciones y errores.

**Buscar tema:** búsqueda manual sobre catálogo mock. Mostrar resultados, selección y estado sin coincidencias. No exigir que exista una tarea original.

**Sesión personalizada:** reutilizar vista de aprendizaje existente: video o placeholder, resumen, ejemplos, ruta corta de aprendizaje, práctica similar y resolución de tarea original si existe. El contenido debe corresponder al tema confirmado. No matricular al alumno en el curso completo por una búsqueda. Los ejercicios de ejemplo deben ser coherentes; no afirmar que fueron generados o validados por IA real.

**Mis tareas:** historial de tareas escolares, estado, fecha opcional, acceso a sesión y resolución. Reutilizar el espacio de resolución con chat simulado, adjuntos, ayuda docente y evaluación ficticia. No confundir calificación interna con nota oficial del colegio.

**Progreso:** temas y competencias practicados, tareas resueltas, evolución de práctica. No usar porcentaje de un currículo completo si no existe un denominador definido. Ranking de acompañamiento queda pendiente; no inventar reglas comparativas entre modalidades.

### 4.4. Docente y administrador

La vista docente continúa en definición. Sidebar preliminar: Inicio, Aula en vivo, Estudiantes, Atenciones, Evaluaciones, Calendario y Rendimiento. Debe atender a ambas modalidades en un portal único. No implementar todavía reglas FIFO/prioridad, transferencias reales, evaluación humana obligatoria ni permisos detallados. Si el equipo necesita navegar estos portales en la demo, reutilizar las vistas existentes o crear shells claramente identificados como pendientes, sin diseñar módulos definitivos por iniciativa propia. El portal administrador también está pendiente de planificación.

### 4.5. Estados visuales y tablet

Incluir estados normales, carga simulada, vacío, error, éxito y bloqueo donde sean pertinentes. Conservar tablet horizontal como objetivo principal (referencia previa: Lenovo 8.7 pulgadas, 4 GB RAM). Evitar animaciones costosas y layouts dependientes de una resolución exacta. No reducir excesivamente fuentes o áreas táctiles para hacer caber componentes.

## 5. Codex — autenticación demo exclusivamente frontend

No desarrollar backend en esta fase. No crear servidores, endpoints, migraciones, seeds de base de datos, JWT de producción, OAuth, infraestructura, servicios IA, WebSockets ni integraciones externas. No cambiar el esquema real si existe. Si ya hay autenticación real, preservarla y aislar el modo demo, sin debilitar sus controles.

### 5.1. Cuentas de prueba propuestas

| Usuario | Contraseña demo | Rol | Modalidad |
|---|---|---|---|
| student.refuerzo | DemoRefuerzo26! | STUDENT | REINFORCEMENT |
| student.escolar | DemoEscolar26! | STUDENT | SCHOOL_SUPPORT |
| teacher.demo | DemoDocente26! | TEACHER | — |
| admin.demo | DemoAdmin26! | ADMIN | — |

Son credenciales públicas de prueba, no secretos ni cuentas reales. Adaptar sus identificadores al formulario existente si exige correo electrónico (por ejemplo, dominio reservado `.test`). No enviar estas credenciales a un servidor. No usar nombres ni datos reales de menores.

### 5.2. Contrato mínimo sugerido (adaptar al repositorio)

```ts
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type LearningModality = 'REINFORCEMENT' | 'SCHOOL_SUPPORT';
export type DemoSession = {
  userId: string;
  displayName: string;
} & (
  | { role: 'STUDENT'; activeModality: LearningModality }
  | { role: 'TEACHER' | 'ADMIN'; activeModality: null }
);
export interface AuthService {
  signIn(username: string, password: string): Promise<DemoSession>;
  getSession(): Promise<DemoSession | null>;
  signOut(): Promise<void>;
}
```

El nombre de tipos, ubicación y firma son sugeridos; no duplicar contratos existentes compatibles. El proveedor mock implementa la interfaz. Los componentes consumen el proveedor mediante el mecanismo de estado/contexto ya existente y no importan directamente la tabla de credenciales. En el futuro, un adaptador real reemplazará al mock sin rehacer las pantallas. No crear capas vacías excesivas ni abstracciones anticipadas.

### 5.3. Flujo de sesión

1. Login único existente recibe usuario y contraseña.
2. El proveedor demo compara con cuentas locales ficticias.
3. Si coincide, devuelve sesión con rol y modalidad; si no, muestra error genérico.
4. El router deriva la experiencia a partir de la sesión, no de una selección de rol introducida por el usuario.
5. Las rutas de otro rol o modalidad redirigen al portal permitido o al login.
6. Cerrar sesión elimina el estado y los datos de sesión asociados; limpiar cachés de usuario para no mezclar información entre cuentas.
7. Persistencia local de sesión solo si se necesita para probar recargas, usando el mecanismo de la plataforma y sin almacenar contraseñas. Preferir memoria si basta.

Estas barreras son de navegación para la demo, **no autorización segura**. Una aplicación distribuida al cliente puede ser manipulada. En producción la autorización se verificará en el servidor para cada recurso y operación.

### 5.4. Aislamiento del modo demo

Activar únicamente mediante configuración explícita de desarrollo/prueba, deshabilitada por defecto en builds productivos. Usar la convención del proyecto para variables/configuración (por ejemplo, flag público de demo, no secreto). Verificar que una build de producción no permita usar las cuentas demo ni incluya su proveedor o credenciales, según las capacidades del bundler. Si esto no se puede garantizar, no distribuir el prototipo como producción. No introducir una puerta trasera de acceso ni aceptar cualquier contraseña.

## 6. Base frontend para la integración futura

- Centralizar los tipos de sesión y navegación; evitar condicionales de rol repetidos por toda la UI.
- Separar componentes presentacionales, datos de pantalla y adaptadores mock mediante las convenciones del repositorio.
- Reutilizar reproductor, recursos, resolución de tareas, adjuntos, agenda y sistema visual entre modalidades.
- Mantener datos demo por usuario/modalidad con identificadores estables; no usar nombres visibles como claves.
- Preparar estados asíncronos y manejo de errores en los puntos de integración sin implementar llamadas reales.
- Mantener contratos mínimos para catálogo, sesión personalizada, tarea, progreso y atención cuando sean necesarios para las vistas. No diseñar ahora el esquema completo de base de datos.
- No añadir contraseñas, tokens API ni información personal real al código.

Ejemplo conceptual de organización, no mandato de reestructuración:

```text
frontend existente/
  auth/             # contrato y proveedor demo aislado
  navigation/       # selección de portal y guards de UX
  student/          # variantes de experiencia por modalidad
  teacher/          # existente o shell provisional
  admin/            # existente o shell provisional
  shared/           # UI y funcionalidades reutilizadas
  mocks/            # fixtures ficticias
```

## 7. Handoff y coordinación

Claude inspecciona y propone la implementación visual; Codex inspecciona autenticación/rutas y acuerda el contrato mínimo. Trabajar en ramas o commits separados, evitando editar simultáneamente archivos compartidos. Si ambos requieren modificar el router o tipos de sesión, asignar un responsable (Codex propuesto) y comunicar el contrato al otro. No realizar merges destructivos. Integrar el trabajo y ejecutar las pruebas existentes del repositorio. Documentar comandos y resultados realmente obtenidos.

## 8. Criterios de aceptación

- [ ] Las cuatro cuentas demo permiten acceder a las experiencias correspondientes.
- [ ] Login inválido muestra error; logout devuelve al login; cambio de cuenta no mezcla datos.
- [ ] Estudiante de reforzamiento conserva su inicio y diseño aprobado.
- [ ] Estudiante de acompañamiento ve Escanear tarea y Buscar tema; ambos flujos son navegables con datos simulados.
- [ ] No se obliga al alumno de acompañamiento a recorrer un curso completo.
- [ ] Los componentes compartidos no se duplican sin justificación.
- [ ] Agenda no presupone calendario curricular colectivo y cabe en el viewport objetivo.
- [ ] Las rutas ajenas al perfil no son accesibles mediante la navegación demo; se comprueba acceso directo también.
- [ ] Docente y admin tienen acceso a su portal existente o shell explícitamente provisional.
- [ ] No hay llamadas a IA, base de datos ni backend nuevos.
- [ ] Demo aislada de producción y sin datos reales.
- [ ] Se ejecutan lint, typecheck, pruebas y build disponibles; se documentan las limitaciones.

## 9. Fuera de alcance y decisiones pendientes

Backend real en diciembre: autenticación segura, RBAC, matrículas, base de datos, endpoints, almacenamiento de archivos, IA multimodal, búsqueda de videos, validación de ejercicios, ranking, sincronización, cola de atención y transferencias. No iniciar estas implementaciones ahora.

Pendientes funcionales: modalidad combinada, fórmula del ranking, condiciones de desbloqueo, reglas de atención y transferencia, evaluación, denominación Agenda/Calendario, métricas definitivas de acompañamiento y diseño completo de docente/administrador. Los mocks no constituyen aprobación de estas reglas.

## 10. Entrega esperada de cada agente

Resumen de cambios, archivos modificados, componentes reutilizados, rutas y cuentas demo, contratos acordados, instrucciones para ejecutar, pruebas realizadas y limitaciones. Si falta una vista o archivo de referencia, indicarlo; no reconstruirlo arbitrariamente. El objetivo final de esta fase es una demo visual sólida y una base frontend reemplazable, no un sistema productivo.
