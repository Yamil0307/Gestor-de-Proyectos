# Scripts de Inicio - Gestor de Proyectos

Este directorio contiene scripts para facilitar el inicio de la aplicación completa (backend + frontend).

## Scripts Disponibles

### 1. `start_servers.sh` (Recomendado)
Script completo con verificaciones, logging detallado y manejo robusto de errores.

**Características:**
- ✅ Verificación de dependencias (Python, Node.js, pnpm)
- ✅ Instalación automática de dependencias
- ✅ Inicialización de base de datos
- ✅ Logging con colores y timestamps
- ✅ Manejo de errores y cleanup automático
- ✅ Monitoreo de procesos

**Uso:**
```bash
./start_servers.sh
```

### 2. `start_simple.sh` (Rápido)
Script minimalista para inicio rápido sin verificaciones extensas.

**Características:**
- ⚡ Inicio rápido
- 🔧 Mínimo logging
- 🎯 Solo inicia servidores

**Uso:**
```bash
./start_simple.sh
```

## URLs de la Aplicación

Una vez iniciados los servidores, puedes acceder a:

- **Frontend (Aplicación):** http://localhost:5173
- **Backend (API):** http://localhost:8000
- **Documentación API:** http://localhost:8000/docs
- **Redoc:** http://localhost:8000/redoc

## Requisitos Previos

### Backend
- Python 3.8 o superior
- pip

### Frontend
- Node.js 18 o superior
- pnpm (se instala automáticamente si no está presente)

## Detener los Servidores

Para detener ambos servidores, simplemente presiona `Ctrl+C` en la terminal donde ejecutaste el script.

## Solución de Problemas

### Error: Python no encontrado
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install python3 python3-pip

# CentOS/RHEL/Fedora
sudo yum install python3 python3-pip
# o
sudo dnf install python3 python3-pip

# macOS
brew install python3
```

### Error: Node.js no encontrado
```bash
# Instalar Node.js usando nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# O descarga desde https://nodejs.org/
```

### Error: pnpm no encontrado
```bash
npm install -g pnpm
```

### Puerto en uso
Si los puertos 8000 o 5173 están en uso:

```bash
# Encontrar proceso usando el puerto
lsof -i :8000
lsof -i :5173

# Matar proceso
kill -9 <PID>
```

## Estructura del Proyecto

```
Gestor-de-Proyectos/
├── start_servers.sh      # Script principal
├── start_simple.sh       # Script simple
├── README.md            # Este archivo
├── backend/             # Código del backend (FastAPI)
│   ├── app/
│   ├── requirements.txt
│   └── init_sqlite.sh
└── frontend/            # Código del frontend (React + Vite)
    ├── src/
    ├── package.json
    └── pnpm-lock.yaml
```

## Desarrollo

Para desarrollo, se recomienda usar `start_servers.sh` ya que:
- Configura automáticamente el entorno
- Proporciona logs útiles para debugging
- Maneja errores de manera elegante
- Permite restart fácil de servicios

## Notas

- Los servidores se ejecutan en modo desarrollo con hot-reload activado
- El backend se ejecuta en modo debug para mejor experiencia de desarrollo
- Los logs se muestran en tiempo real en la terminal
