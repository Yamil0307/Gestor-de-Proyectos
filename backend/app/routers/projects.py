from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..api import operations
from ..schemas import schemas

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    try:
        return operations.create_project(db=db, project=project)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{project_id}", response_model=schemas.Project)
def get_project(project_id: int, db: Session = Depends(get_db)):
    db_project = operations.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@router.get("/", response_model=List[schemas.Project])
def get_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return operations.get_projects(db, skip=skip, limit=limit)

@router.put("/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project_update: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    try:
        db_project = operations.update_project(db, project_id=project_id, project_update=project_update)
        if db_project is None:
            raise HTTPException(status_code=404, detail="Project not found")
        return db_project
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    success = operations.delete_project(db, project_id=project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

@router.get("/by-type/{project_type}", response_model=List[schemas.Project])
def get_projects_by_type(project_type: str, db: Session = Depends(get_db)):
    return operations.get_projects_by_type(db, project_type=project_type)

@router.get("/{project_id}/details", response_model=schemas.ProjectWithDetails)
def get_project_with_details(project_id: int, db: Session = Depends(get_db)):
    db_project = operations.get_project_with_details(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project