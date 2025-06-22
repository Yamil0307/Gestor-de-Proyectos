#!/bin/bash

# Script simple para iniciar el Gestor de Proyectos
# Uso: ./start_simple.sh

# Directorio del proyecto
cd "$(dirname "$0")"

echo "🚀 Iniciando Gestor de Proyectos..."

# Función para cleanup
cleanup() {
    echo "🛑 Deteniendo servidores..."
    jobs -p | xargs -r kill
    exit 0
}

trap cleanup SIGINT SIGTERM

# Backend
echo "📡 Iniciando Backend..."
cd backend
python3 -m app.main &
cd ..

# Esperar un poco
sleep 3

# Frontend  
echo "🎨 Iniciando Frontend..."
cd frontend
pnpm run dev &
cd ..

echo ""
echo "✅ Servidores iniciados:"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "Presiona Ctrl+C para detener"

# Mantener el script corriendo
wait
