# Sistema de Gestión de Proyectos - Frontend

Este es el frontend para el Sistema de Gestión de Proyectos, una aplicación web desarrollada con React que permite administrar empleados, equipos y proyectos de una empresa.

## Tecnologías Utilizadas

- **React**: Biblioteca JavaScript para construir interfaces de usuario
- **React Router**: Enrutamiento para aplicaciones React
- **Axios**: Cliente HTTP para realizar peticiones a la API
- **Material-UI**: Biblioteca de componentes de interfaz de usuario
- **Context API**: Gestión de estado global para la autenticación

## Estructura del Proyecto

```
frontend/
├── public/              # Archivos públicos y estáticos
├── src/                 # Código fuente de la aplicación
│   ├── components/      # Componentes reutilizables
│   ├── context/         # Contextos de React (estado global)
│   ├── pages/           # Páginas principales de la aplicación
│   ├── services/        # Servicios para comunicación con la API
│   ├── App.js           # Componente principal y rutas
│   └── index.js         # Punto de entrada de la aplicación
└── package.json         # Dependencias y scripts
```

## Principales Características

- **Autenticación**: Sistema completo de registro, inicio de sesión y cierre de sesión con JWT
- **Rutas Protegidas**: Acceso a rutas solo para usuarios autenticados
- **Dashboard**: Panel principal con acceso a todas las funcionalidades
- **Gestión de Empleados**: Administración de programadores y líderes
- **Gestión de Equipos**: Creación y administración de equipos de trabajo
- **Gestión de Proyectos**: Control de proyectos de gestión y multimedia
- **Diseño Responsivo**: Interfaz adaptable a diferentes dispositivos

## Componentes Principales

### Autenticación

- **Login**: Formulario de inicio de sesión
- **Register**: Formulario de registro de usuarios
- **AuthContext**: Contexto global para gestionar el estado de autenticación

### Páginas

- **Dashboard**: Panel principal con acceso a todas las funcionalidades
- **Employees**: Gestión de empleados
- **Teams**: Administración de equipos
- **Projects**: Control de proyectos

### Servicios

- **authService**: Gestión de autenticación y manejo de tokens JWT
- **employeeService**: Operaciones CRUD para empleados
- **teamService**: Operaciones CRUD para equipos
- **programmerService**: Operaciones específicas para programadores
- **leaderService**: Operaciones específicas para líderes

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm start`

Ejecuta la aplicación en modo desarrollo.\
Abre [http://localhost:3000](http://localhost:3000) para verla en el navegador.

La página se recargará cuando hagas cambios.\
También verás errores de lint en la consola.

### `npm test`

Inicia el ejecutor de pruebas en modo interactivo.\
Consulta la sección sobre [ejecución de pruebas](https://facebook.github.io/create-react-app/docs/running-tests).

### `npm run build`

Compila la aplicación para producción en la carpeta `build`.\
Empaqueta React en modo producción y optimiza la compilación para obtener el mejor rendimiento.

## Requisitos

- Node.js 14.0 o superior
- npm 6.0 o superior

## Configuración

Por defecto, el frontend está configurado para conectarse a la API backend en `http://localhost:8000`. Si necesitas cambiar esta URL, puedes modificar la variable `API_URL` en el archivo `src/services/authService.js`.

## Características Adicionales

- Manejo de tokens JWT para autenticación segura
- Interceptores HTTP para incluir automáticamente el token en las peticiones
- Sistema de notificaciones para feedback al usuario
- Validación de formularios
- Rutas protegidas y públicas basadas en el estado de autenticación
- Diseño modular para facilitar el mantenimiento
