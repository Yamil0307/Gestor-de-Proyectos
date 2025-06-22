#!/bin/bash

# Script para reiniciar solo el backend
# Útil cuando haces cambios solo en el backend

echo "🔄 Reiniciando Backend..."

# Buscar y matar procesos del backend
echo "🛑 Deteniendo servidor backend actual..."
pkill -f "python.*app.main" 2>/dev/null || true
sleep 2

# Navegar al directorio del backend
cd "$(dirname "$0")/backend"

# Iniciar el backend
echo "🚀 Iniciando Backend en puerto 8000..."
python3 -m app.main &

echo "✅ Backend reiniciado"
echo "📡 Backend disponible en: http://localhost:8000"
echo "📚 Documentación: http://localhost:8000/docs"
