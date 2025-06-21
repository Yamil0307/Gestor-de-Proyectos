"""
Script para inicializar la base de datos SQLite
"""
from database.database import engine
from models.models import Base

def init_db():
    """
    Crea todas las tablas en la base de datos SQLite
    """
    print("Creando tablas en la base de datos SQLite...")
    Base.metadata.create_all(bind=engine)
    print("¡Base de datos inicializada con éxito!")

if __name__ == "__main__":
    init_db()
