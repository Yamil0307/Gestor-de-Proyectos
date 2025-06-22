#!/bin/bash

# Script para iniciar tanto el backend como el frontend del Gestor de Proyectos
# Autor: Sistema de Gestión de Proyectos
# Fecha: $(date)

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Función para limpiar procesos al salir
cleanup() {
    info "Deteniendo servidores..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    exit 0
}

# Capturar señales para cleanup
trap cleanup SIGINT SIGTERM

# Directorio raíz del proyecto
PROJECT_ROOT="$(dirname "$0")"
cd "$PROJECT_ROOT"

log "🚀 Iniciando Gestor de Proyectos..."
log "📁 Directorio del proyecto: $(pwd)"

# =============================================================================
# CONFIGURACIÓN DEL BACKEND
# =============================================================================

log "🔧 Configurando Backend..."

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        error "Python no está instalado. Por favor instala Python 3.8 o superior."
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

# Verificar si pip está instalado
if ! command -v pip3 &> /dev/null; then
    if ! command -v pip &> /dev/null; then
        error "pip no está instalado. Por favor instala pip."
        exit 1
    else
        PIP_CMD="pip"
    fi
else
    PIP_CMD="pip3"
fi

info "Usando Python: $PYTHON_CMD"
info "Usando pip: $PIP_CMD"

# Navegar al directorio del backend
cd backend

# Instalar dependencias del backend
log "📦 Instalando dependencias del backend..."
$PIP_CMD install -r requirements.txt

# Inicializar la base de datos
log "🗄️ Inicializando base de datos SQLite..."
$PYTHON_CMD -m app.initialize_db

# Volver al directorio raíz
cd ..

# =============================================================================
# CONFIGURACIÓN DEL FRONTEND
# =============================================================================

log "🔧 Configurando Frontend..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    error "Node.js no está instalado. Por favor instala Node.js 18 o superior."
    exit 1
fi

# Verificar si pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    warning "pnpm no está instalado. Instalando pnpm..."
    npm install -g pnpm
fi

info "Usando Node.js: $(node --version)"
info "Usando pnpm: $(pnpm --version)"

# Navegar al directorio del frontend
cd frontend

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    log "📦 Instalando dependencias del frontend..."
    pnpm install
else
    info "Dependencias del frontend ya instaladas"
fi

# Volver al directorio raíz
cd ..

# =============================================================================
# INICIAR SERVIDORES
# =============================================================================

log "🚀 Iniciando servidores..."

# Iniciar backend en segundo plano
log "🔥 Iniciando servidor Backend (FastAPI) en puerto 8000..."
cd backend
$PYTHON_CMD -m app.main &
BACKEND_PID=$!
cd ..

# Esperar un momento para que el backend se inicie
sleep 3

# Verificar que el backend esté corriendo
if ps -p $BACKEND_PID > /dev/null; then
    log "✅ Backend iniciado correctamente (PID: $BACKEND_PID)"
else
    error "❌ Error al iniciar el backend"
    exit 1
fi

# Iniciar frontend en segundo plano
log "🎨 Iniciando servidor Frontend (Vite) en puerto 5173..."
cd frontend
pnpm run dev &
FRONTEND_PID=$!
cd ..

# Esperar un momento para que el frontend se inicie
sleep 5

# Verificar que el frontend esté corriendo
if ps -p $FRONTEND_PID > /dev/null; then
    log "✅ Frontend iniciado correctamente (PID: $FRONTEND_PID)"
else
    error "❌ Error al iniciar el frontend"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# =============================================================================
# INFORMACIÓN FINAL
# =============================================================================

echo ""
log "🎉 ¡Ambos servidores están corriendo!"
echo ""
info "📊 Backend (API):     http://localhost:8000"
info "🎨 Frontend (App):    http://localhost:5173"
info "📚 Documentación:     http://localhost:8000/docs"
info "🔧 Redoc:             http://localhost:8000/redoc"
echo ""
warning "Presiona Ctrl+C para detener ambos servidores"
echo ""

# =============================================================================
# MANTENER SCRIPT CORRIENDO
# =============================================================================

# Esperar indefinidamente hasta que se reciba una señal
while true; do
    # Verificar que ambos procesos sigan corriendo
    if ! ps -p $BACKEND_PID > /dev/null; then
        error "El servidor backend se ha detenido inesperadamente"
        cleanup
    fi
    
    if ! ps -p $FRONTEND_PID > /dev/null; then
        error "El servidor frontend se ha detenido inesperadamente"
        cleanup
    fi
    
    sleep 5
done
