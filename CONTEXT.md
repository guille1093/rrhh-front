# Sistema de Gestión de Personal (Nóminas)

## Entregas

### Entrega 1: Base del Sistema y Estructura Organizacional (Fecha Límite: 29 de septiembre)
- **Objetivo**: Digitalizar y hacer accesible la estructura de la empresa. Preparar las tablas para la asignación de empleados.
- **Entregable**: Pantalla de login y CRUD completo de la estructura de la empresa.
- **Tareas**:
    - Sistema de Autenticación y Roles (Usuario, RRHH, Admin).
    - CRUD de Empresa.
    - CRUD de Áreas (asignación a una empresa).
    - CRUD de Departamentos (asignación a un área).
    - CRUD de Puestos de trabajo (asignación a un departamento).

### Entrega 2: Gestión de Empleados - Datos Básicos (Fecha Límite: 13 de octubre)
- **Objetivo**: Centralizar la información fundamental de cada empleado.
- **Entregable**: ABM de Empleados con datos personales y contractuales básicos.
- **Tareas**:
    - CRUD de Empleados (alta, baja, modificación, listado).
    - Asignación de empleado a Departamento y Puesto.
    - Apartado Datos Personales: Información general, dirección, contactos de emergencia, documentación.
    - Apartado Datos Contractuales - Información General: Tipo de contrato, fecha de ingreso, etc.

### Entrega 3: Gestión de Solicitudes y Eventos (Fecha Límite: 27 de octubre)
- **Objetivo**: Gestionar eventos que afectan la asistencia y la liquidación.
- **Entregable**: Sistema de solicitudes y tablero de alarmas básico.
- **Tareas**:
    - CRUD de Solicitudes (Vacaciones, Licencias, Inasistencias) con estados.
    - Tablero Principal con alarma de "Solicitudes Pendientes de Aprobar".
    - CRUD de Días no laborables (Feriados).
    - Mejora del Tablero con alarma de "Próximos días no laborables".

### Entrega 4: Gestión de Datos Complementarios y Reportes Básicos (Fecha Límite: 10 de noviembre)
- **Objetivo**: Completar la ficha del empleado y extraer métricas de dotación.
- **Entregable**: Pantallas de Salud, Evaluación y Reportes de estructura.
- **Tareas**:
    - CRUD de Salud (Registro de exámenes).
    - CRUD de Evaluación de Personal (desempeño, capacitaciones).
    - Reportes:
        - Cantidad de empleados activos.
        - Empleados por Área, Departamento y Puesto.
        - Listado de Tipos de Contratos.

### Entrega 5: Integración, Depuración y MVP Final (Fecha Límite: 24 de noviembre)
- **Objetivo**: Entregar un módulo de Personal 100% funcional.
- **Entregable**: Módulo de Personal completo y probado.
- **Tareas**:
    - Desarrollar "Interfaces de comunicación" (opcional).
    - Carga de datos de prueba masiva.
    - Testing integral.
    - Depuración y optimización.

## Módulos Principales

### Empresa
- ABM de Empresa
- ABM de Áreas (asignadas a empresa)
- ABM de Departamentos (asignados a área)
- ABM de Puestos (asignados a departamento)

### Empleados
- **Datos Personales**: Información general, dirección, contactos de emergencia, documentación.
- **Datos Contractuales**: Información general, puesto, horario, salario, compensaciones.
- **Salud**: Pre-ocupacional.
- **Evaluación de Personal**: Desempeño, competencias, capacitación, autoevaluación.
- **Solicitudes**: Inasistencia, vacaciones, etc.

### Reportes
- Cantidad de empleados (activos en empresa y sistema).
- Cantidad de empleados por Área, Departamento, Puesto.
- Tipos de contratos y contratos registrados.

### Tablero
- Alarmas de solicitudes pendientes.
- Alarmas de próximos eventos.
- Alarmas de días no laborables.

## Referencias
- **FactorialHR**: [https://factorialhr.com.ar/](https://factorialhr.com.ar/)
- **Sistema PHP/MySQL (Demo 1)**: [http://programacionparacompartir.com/sis_recursoshh/index.php/admin/dashboard](http://programacionparacompartir.com/sis_recursoshh/index.php/admin/dashboard)
- **Sistema PHP/MySQL (Demo 2)**: [https://www.codigofuentegratis.net/sistema-recursos-humanos-php-mysql/](https://www.codigofuentegratis.net/sistema-recursos-humanos-php-mysql/)
- **Evaluación de Desempeño (Info)**: [https://www.rrhh-web.com/procedimiento_evaluacion_personal.html](https://www.rrhh-web.com/procedimiento_evaluacion_personal.html)
