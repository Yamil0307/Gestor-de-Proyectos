from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine
from app.models import models
from app.api.api import api_router
from app.config import settings

# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Gestión de Proyectos",
    description="API para gestionar empleados, equipos y proyectos de una empresa",
    version="1.0.0"
)

# Configurar CORS de manera más segura
allowed_origins = [
    "http://localhost:3000",  # React development server (Create React App)
    "http://localhost:5173",  # Vite development server
    "http://localhost:5174",  # Vite development server alternativo
    "http://localhost:8080",  # Vue development server
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",  # Vite development server (127.0.0.1)
    "http://127.0.0.1:5174",  # Vite development server alternativo (127.0.0.1)
    "http://127.0.0.1:8080",
    "*",  # Permitir cualquier origen durante desarrollo - REMOVER EN PRODUCCIÓN
]

# En producción, usar solo los dominios específicos
if settings.ENVIRONMENT == "production":
    allowed_origins = [
        "https://tu-dominio-frontend.com",
        # Agrega aquí los dominios de producción
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

# Registrar el router principal de la API
app.include_router(api_router)

@app.get("/")
def read_root():
    return {
        "message": "Sistema de Gestión de Proyectos API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)