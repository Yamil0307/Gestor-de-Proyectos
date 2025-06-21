from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine
from app.models import models
from app.api.api import api_router

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