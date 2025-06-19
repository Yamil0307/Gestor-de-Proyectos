from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database.database import engine
from .models import models
from .routers import (
    auth,
    employees,
    programmers,
    leaders,
    teams,
    projects,
    management_projects,
    multimedia_projects,
    analytics
)

# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Gestión de Proyectos",
    description="API para gestionar empleados, equipos y proyectos de una empresa",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar todos los routers
app.include_router(auth.router)               # NUEVO: Incluir router de autenticación
app.include_router(employees.router)
app.include_router(programmers.router)
app.include_router(leaders.router)
app.include_router(teams.router)
app.include_router(projects.router)
app.include_router(management_projects.router)
app.include_router(multimedia_projects.router)
app.include_router(analytics.router)

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