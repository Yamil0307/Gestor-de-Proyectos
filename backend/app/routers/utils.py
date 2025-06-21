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

# Incluir todos los sub-routers
router.include_router(analytics_router)
router.include_router(management_projects_router)
router.include_router(multimedia_projects_router)
