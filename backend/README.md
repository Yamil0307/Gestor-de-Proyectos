# Sistema de Gestión de Proyectos - Backend

Este es el backend para el Sistema de Gestión de Proyectos, una aplicación diseñada para administrar empleados, equipos y proyectos en una empresa.

## Tecnologías Utilizadas

- **FastAPI**: Framework de Python para crear APIs RESTful de manera rápida
- **SQLAlchemy**: ORM para interactuar con la base de datos
- **SQLite**: Base de datos relacional integrada y sin servidor
- **Pydantic**: Validación de datos y serialización
- **JWT (JSON Web Tokens)**: Autenticación y autorización
- **Python-dotenv**: Gestión de variables de entorno

## Estructura del Proyecto

```
backend/
├── app/
│   ├── api/            # Configuración y operaciones de la API
│   │   ├── api.py      # Configuración centralizada de routers
│   │   ├── auth.py     # Funciones de autenticación y usuarios
│   │   ├── operations.py # Operaciones CRUD para todos los modelos
│   │   └── dependencies.py # Dependencias de la API (auth, etc.)
│   ├── database/       # Configuración de la base de datos
│   ├── models/         # Modelos SQLAlchemy
│   ├── routers/        # Endpoints de la API
│   │   ├── auth.py     # Rutas de autenticación
│   │   ├── employees.py # Rutas para gestionar empleados
│   │   ├── programmers.py # Rutas para programadores
│   │   ├── leaders.py  # Rutas para líderes
│   │   ├── teams.py    # Rutas para equipos
│   │   ├── projects.py # Rutas para proyectos
│   │   └── utils.py    # Rutas de utilidad (analytics, management_projects, multimedia_projects)
│   ├── schemas/        # Schemas Pydantic
│   ├── config.py       # Configuración de la aplicación
│   └── main.py         # Punto de entrada de la aplicación
├── requirements.txt    # Dependencias del proyecto
└── test_connection.py  # Script para probar la conexión a la base de datos
```

## Modelos de Datos

El sistema gestiona los siguientes modelos:

- **User**: Usuarios administradores del sistema
- **Employee**: Empleados (base para programadores y líderes)
- **Programmer**: Programadores con categoría (A, B, C)
- **Leader**: Líderes de equipo
- **Team**: Equipos de trabajo
- **Project**: Proyectos (base para proyectos de gestión y multimedia)
- **ManagementProject**: Proyectos de gestión
- **MultimediaProject**: Proyectos multimedia

## API Endpoints

### Autenticación

- `POST /auth/register`: Registrar un nuevo usuario
- `POST /auth/login`: Iniciar sesión y obtener token JWT
- `POST /auth/token`: Endpoint compatible con OAuth2
- `GET /auth/me`: Obtener información del usuario actual
- `GET /auth/protected`: Ruta protegida de ejemplo

### Proyectos

- `POST /projects/`: Crear un nuevo proyecto
- `GET /projects/{project_id}`: Obtener un proyecto específico
- `GET /projects/`: Listar todos los proyectos
- `PUT /projects/{project_id}`: Actualizar un proyecto
- `DELETE /projects/{project_id}`: Eliminar un proyecto
- `GET /projects/by-type/{project_type}`: Filtrar proyectos por tipo
- `GET /projects/{project_id}/details`: Obtener detalles completos de un proyecto

El sistema también incluye endpoints para gestionar empleados, programadores, líderes, equipos y análisis.

## Requisitos

Python 3.8 o superior y las siguientes dependencias:
- fastapi 0.104.1
- uvicorn 0.24.0
- sqlalchemy 2.0.23
- python-dotenv 1.0.0
- pydantic 2.5.0
- python-multipart 0.0.6
- python-jose 3.3.0
- passlib 1.7.4
- email-validator 2.1.0

## Configuración

1. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables (opcional, hay valores por defecto):

```
DATABASE_URL=sqlite:///ruta/a/tu/proyecto/project_management.db
SECRET_KEY=tu_clave_secreta_para_jwt
```

2. Instalar las dependencias:

```bash
pip install -r requirements.txt
```

3. Inicializar la base de datos SQLite:

```bash
# Método 1: Usando el script de inicialización
./init_sqlite.sh

# Método 2: Manual
python -m app.initialize_db
```

4. Probar la conexión a la base de datos:

```bash
python test_sqlite_connection.py
```

## Ejecución

Para iniciar el servidor de desarrollo:

```bash
cd backend
uvicorn app.main:app --reload
```

El servidor estará disponible en `http://localhost:8000`.

## Documentación de la API

La documentación interactiva estará disponible en:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Características

- Base de datos SQLite (sin necesidad de servidor externo)
- Autenticación JWT
- Validación de datos con Pydantic
- CRUD completo para todas las entidades
- Relaciones entre modelos (ORM)
- Endpoints optimizados para diferentes casos de uso
- Manejo de errores consistente
- Documentación automática de la API
