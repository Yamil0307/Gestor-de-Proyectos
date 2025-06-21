# Tareas y Cambios del Backend

Este documento registra los cambios realizados en el backend del Sistema de Gestión de Proyectos y las tareas pendientes.

## Cambios Realizados

### Reorganización de Estructura (21/06/2025)

- **Consolidación de Rutas**: Se combinaron las rutas menos utilizadas en un solo archivo `utils.py`:
  - Rutas de analytics (métricas y reportes)
  - Rutas de management_projects (proyectos de gestión)
  - Rutas de multimedia_projects (proyectos multimedia)
  
- **Limpieza de Código**: Se eliminaron los archivos redundantes después de la consolidación:
  - `analytics.py`
  - `management_projects.py`
  - `multimedia_projects.py`

- **Actualización de Importaciones**: Se modificó el archivo `main.py` y `__init__.py` para reflejar los cambios en la estructura de rutas.

- **Documentación**: Se actualizó el README.md para reflejar la nueva estructura de carpetas y archivos.

### Unificación de Operaciones en API (21/06/2025)

- **Reorganización de Carpetas**: Se movieron las operaciones CRUD y de autenticación a la carpeta `api`:
  - Se creó `api/auth.py` que combina las funcionalidades de `auth_utils.py` y `auth_crud.py`
  - Se creó `api/operations.py` que contiene todas las operaciones CRUD de `crud.py`
  - Se creó `api/dependencies.py` con las dependencias de autenticación
  
- **Centralización de Configuración**: Se implementó un punto único de registro de routers:
  - Se creó `api/api.py` como punto centralizado para registrar todos los routers
  - Se actualizó `main.py` para usar este router principal

## Tareas Pendientes

### Reorganización de Estructura

- [x] Evaluar la carpeta `api` vacía y decidir si eliminarla o utilizarla para reorganizar el código.
- [x] Considerar mover las operaciones CRUD y autenticación a subcarpetas dentro de `api` para mejor organización.
- [ ] Eliminar los archivos obsoletos de las carpetas `auth` y `crud`
- [ ] Actualizar los imports en los archivos de routers para que usen la nueva estructura

### Mejoras de Seguridad

- [ ] Implementar limitación de tasa (rate limiting) para endpoints críticos.
- [ ] Mejorar la validación de datos en endpoints sensibles.
- [ ] Revisar y mejorar las políticas CORS para producción.

### Optimizaciones de Rendimiento

- [ ] Implementar caché para consultas frecuentes.
- [ ] Optimizar consultas de base de datos en endpoints con muchos datos.

### Documentación

- [ ] Agregar comentarios de docstring a todas las funciones y clases principales.
- [ ] Mejorar la documentación automática con ejemplos para cada endpoint.

### Pruebas

- [ ] Crear pruebas unitarias para modelos y operaciones CRUD.
- [ ] Implementar pruebas de integración para endpoints principales.
- [ ] Configurar CI/CD para ejecución automática de pruebas.

## Arquitectura Propuesta

Para futura reorganización, se propone la siguiente estructura:

```
app/
├── api/                # Toda la lógica de la API
│   ├── endpoints/      # Endpoints organizados por recurso
│   ├── crud/           # Operaciones CRUD
│   ├── schemas/        # Schemas para validación y serialización
│   └── dependencies/   # Dependencias de la API (auth, db, etc.)
├── core/               # Configuración central
│   ├── config.py       # Configuración de la aplicación
│   ├── security.py     # Lógica de seguridad
│   └── database.py     # Configuración de la base de datos
├── models/             # Modelos de la base de datos
└── main.py             # Punto de entrada de la aplicación
```

Esta estructura sigue más de cerca las mejores prácticas para aplicaciones FastAPI de tamaño mediano a grande.
