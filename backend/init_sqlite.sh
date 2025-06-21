#!/bin/bash

# Navegar al directorio del backend
cd "$(dirname "$0")"

# Instalar dependencias si es necesario
echo "Instalando dependencias..."
pip install -r requirements.txt

# Ejecutar el script de inicialización de la base de datos
echo "Inicializando la base de datos SQLite..."
python -m app.initialize_db

echo "¡Configuración completada!"
