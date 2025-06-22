import os
from dotenv import load_dotenv
import pathlib

load_dotenv()

# Obtener la ruta base del proyecto
BASE_DIR = pathlib.Path(__file__).parent.parent.absolute()

class Settings:
    # SQLite URL
    DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/project_management.db")
    SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE-THIS-SECRET-KEY-IN-PRODUCTION-MINIMUM-32-CHARACTERS-LONG")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

settings = Settings()