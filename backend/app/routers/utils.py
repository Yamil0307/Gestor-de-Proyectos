from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.api import operations
from app.schemas import schemas

# Router para utils (combinación de analytics, multimedia_projects y management_projects)
router = APIRouter()

# ================= ANALYTICS ROUTES =================
analytics_router = APIRouter(prefix="/analytics", tags=["analytics"])

@analytics_router.get("/earliest-project", response_model=schemas.Project)
def get_earliest_finishing_project(db: Session = Depends(get_db)):
    project = operations.get_earliest_finishing_project(db)
    if project is None:
        raise HTTPException(status_code=404, detail="No projects found")
    return project

@analytics_router.get("/projects-count", response_model=List[schemas.ProjectTypeCount])
def count_projects_by_type(db: Session = Depends(get_db)):
    return operations.count_projects_by_type(db)

@analytics_router.get("/highest-paid-employees", response_model=List[schemas.SalaryInfo])
def get_highest_paid_employees(limit: int = 5, db: Session = Depends(get_db)):
    return operations.get_highest_paid_employees(db, limit=limit)

# ================= MANAGEMENT PROJECTS ROUTES =================
management_projects_router = APIRouter(prefix="/management-projects", tags=["management-projects"])

@management_projects_router.post("/", response_model=schemas.ManagementProject)
def create_management_project(management_project: schemas.ManagementProjectCreate, db: Session = Depends(get_db)):
    try:
        return operations.create_management_project(db=db, management_project=management_project)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@management_projects_router.get("/{project_id}", response_model=schemas.ManagementProject)
def get_management_project(project_id: int, db: Session = Depends(get_db)):
    db_management_project = operations.get_management_project(db, project_id=project_id)
    if db_management_project is None:
        raise HTTPException(status_code=404, detail="Management project not found")
    return db_management_project

@management_projects_router.get("/", response_model=List[schemas.ManagementProject])
def get_all_management_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtiene todos los proyectos de gestión"""
    return operations.get_all_management_projects(db=db, skip=skip, limit=limit)

@management_projects_router.put("/{project_id}", response_model=schemas.ManagementProject)
def update_management_project(project_id: int, management_update: schemas.ManagementProjectBase, db: Session = Depends(get_db)):
    """Actualiza un proyecto de gestión existente"""
    try:
        db_management = operations.update_management_project(db=db, project_id=project_id, management_update=management_update)
        if db_management is None:
            raise HTTPException(status_code=404, detail="Management project not found")
        return db_management
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@management_projects_router.delete("/{project_id}")
def delete_management_project(project_id: int, db: Session = Depends(get_db)):
    """Elimina un proyecto de gestión"""
    # Verificamos primero que el proyecto exista y sea de tipo gestión
    db_project = operations.get_project(db, project_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if db_project.type != "management":
        raise HTTPException(status_code=400, detail="Project is not a management project")
        
    # Usamos la función existente para eliminar el proyecto y sus detalles
    success = operations.delete_project(db, project_id=project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Management project deleted successfully"}

# ================= MULTIMEDIA PROJECTS ROUTES =================
multimedia_projects_router = APIRouter(prefix="/multimedia-projects", tags=["multimedia-projects"])

@multimedia_projects_router.post("/", response_model=schemas.MultimediaProject)
def create_multimedia_project(multimedia_project: schemas.MultimediaProjectCreate, db: Session = Depends(get_db)):
    try:
        return operations.create_multimedia_project(db=db, multimedia_project=multimedia_project)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@multimedia_projects_router.get("/{project_id}", response_model=schemas.MultimediaProject)
def get_multimedia_project(project_id: int, db: Session = Depends(get_db)):
    db_multimedia_project = operations.get_multimedia_project(db, project_id=project_id)
    if db_multimedia_project is None:
        raise HTTPException(status_code=404, detail="Multimedia project not found")
    return db_multimedia_project

@multimedia_projects_router.get("/", response_model=List[schemas.MultimediaProject])
def get_all_multimedia_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtiene todos los proyectos multimedia"""
    return operations.get_all_multimedia_projects(db=db, skip=skip, limit=limit)

@multimedia_projects_router.put("/{project_id}", response_model=schemas.MultimediaProject)
def update_multimedia_project(project_id: int, multimedia_update: schemas.MultimediaProjectBase, db: Session = Depends(get_db)):
    """Actualiza un proyecto multimedia existente"""
    try:
        db_multimedia = operations.update_multimedia_project(db=db, project_id=project_id, multimedia_update=multimedia_update)
        if db_multimedia is None:
            raise HTTPException(status_code=404, detail="Multimedia project not found")
        return db_multimedia
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@multimedia_projects_router.delete("/{project_id}")
def delete_multimedia_project(project_id: int, db: Session = Depends(get_db)):
    """Elimina un proyecto multimedia"""
    # Verificamos primero que el proyecto exista y sea de tipo multimedia
    db_project = operations.get_project(db, project_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if db_project.type != "multimedia":
        raise HTTPException(status_code=400, detail="Project is not a multimedia project")
        
    # Usamos la función existente para eliminar el proyecto y sus detalles
    success = operations.delete_project(db, project_id=project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Multimedia project deleted successfully"}

# Incluir todos los sub-routers
router.include_router(analytics_router)
router.include_router(management_projects_router)
router.include_router(multimedia_projects_router)
