"""
Script para probar la conexión a la base de datos SQLite
"""
import os
import sys
import pathlib

# Agregar el directorio raíz al path
base_dir = pathlib.Path(__file__).parent.absolute()
sys.path.append(str(base_dir))

from sqlalchemy import text
from app.database.database import engine

def test_connection():
    """
    Prueba la conexión a la base de datos SQLite
    """
    try:
        # Probar la conexión ejecutando una consulta simple
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            for row in result:
                print(f"Conexión exitosa a SQLite: {row[0]}")
        
        # Mostrar la ruta del archivo de base de datos
        db_path = str(base_dir / "project_management.db")
        if os.path.exists(db_path):
            print(f"Archivo de base de datos SQLite: {db_path}")
            print(f"Tamaño del archivo: {os.path.getsize(db_path)} bytes")
        else:
            print(f"Archivo de base de datos SQLite aún no creado en: {db_path}")
            
        return True
    except Exception as e:
        print(f"Error al conectar a la base de datos SQLite: {e}")
        return False

if __name__ == "__main__":
    if test_connection():
        print("Prueba de conexión completada con éxito.")
        sys.exit(0)
    else:
        print("Prueba de conexión fallida.")
        sys.exit(1)
