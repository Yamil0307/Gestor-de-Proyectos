from fastapi import APIRouter
from ..routers import (
    auth,
    employees,
    programmers,
    leaders,
    teams,
    projects,
    utils
)

# Crear un router principal para la API
api_router = APIRouter()

# Incluir todos los routers
api_router.include_router(auth.router)
api_router.include_router(employees.router)
api_router.include_router(programmers.router)
api_router.include_router(leaders.router)
api_router.include_router(teams.router)
api_router.include_router(projects.router)
api_router.include_router(utils.router)
