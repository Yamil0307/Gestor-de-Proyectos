import os
from dotenv import load_dotenv
import pathlib

load_dotenv()

# Obtener la ruta base del proyecto
BASE_DIR = pathlib.Path(__file__).parent.parent.absolute()

class Settings:
    # SQLite URL
    DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/project_management.db")
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

settings = Settings()