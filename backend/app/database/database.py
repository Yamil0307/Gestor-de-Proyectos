from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import pathlib

# Cargar variables de entorno
load_dotenv()

# Obtener la ruta base del proyecto
BASE_DIR = pathlib.Path(__file__).parent.parent.parent.absolute()

# Obtener la URL de la base de datos del archivo .env o usar SQLite por defecto
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/project_management.db")

# Crear el engine de SQLAlchemy
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Configuración específica para SQLite para habilitar las restricciones de clave foránea
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if DATABASE_URL.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

# Crear la clase SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crear la clase Base
Base = declarative_base()

# Función para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()