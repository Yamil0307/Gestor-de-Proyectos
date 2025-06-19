from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..crud import crud
from ..schemas import schemas

router = APIRouter(prefix="/management-projects", tags=["management-projects"])

@router.post("/", response_model=schemas.ManagementProject)
def create_management_project(management_project: schemas.ManagementProjectCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_management_project(db=db, management_project=management_project)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{project_id}", response_model=schemas.ManagementProject)
def get_management_project(project_id: int, db: Session = Depends(get_db)):
    db_management_project = crud.get_management_project(db, project_id=project_id)
    if db_management_project is None:
        raise HTTPException(status_code=404, detail="Management project not found")
    return db_management_project