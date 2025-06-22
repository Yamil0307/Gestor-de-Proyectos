# Gestor de Proyectos - Frontend

Aplicación frontend para el sistema de gestión de proyectos, equipos y empleados.

## Tecnologías

- **React**: Biblioteca para construir interfaces de usuario
- **Material UI**: Componentes de interfaz de usuario con diseño Material Design
- **Axios**: Cliente HTTP para realizar peticiones a la API
- **React Router**: Enrutamiento en el lado del cliente
- **Vite**: Herramienta de construcción y desarrollo

## Estructura del Proyecto

```
frontend/
├── public/            # Archivos estáticos
├── src/               # Código fuente
│   ├── components/    # Componentes reutilizables
│   │   ├── common/    # Componentes comunes (ConfirmDialog, LoadingIndicator, etc.)
│   │   ├── employees/ # Componentes relacionados con empleados
│   │   ├── teams/     # Componentes relacionados con equipos
│   │   └── dashboard/ # Componentes relacionados con el dashboard
│   ├── context/       # Contextos de React (Auth, Notification, Confirmation)
│   ├── pages/         # Páginas principales
│   ├── services/      # Servicios para comunicación con la API
│   ├── utils/         # Utilidades y funciones helper
│   ├── theme/         # Configuración del tema de Material UI
│   ├── App.jsx        # Componente principal de la aplicación
│   └── index.jsx      # Punto de entrada
├── package.json       # Dependencias y scripts
└── vite.config.js     # Configuración de Vite
```

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
cd frontend
npm install
```

## Ejecución

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Vista previa de la construcción
npm run preview
```

## Características Principales

- Gestión de empleados (programadores y líderes)
- Gestión de equipos y asignación de miembros
- Autenticación y autorización
- Interfaz de usuario intuitiva con Material UI
- Notificaciones y diálogos de confirmación
- Manejo centralizado de errores

## Recursos Adicionales

- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/guide/)te

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
