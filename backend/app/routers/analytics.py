from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..crud import crud
from ..schemas import schemas

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/earliest-project", response_model=schemas.Project)
def get_earliest_finishing_project(db: Session = Depends(get_db)):
    project = crud.get_earliest_finishing_project(db)
    if project is None:
        raise HTTPException(status_code=404, detail="No projects found")
    return project

@router.get("/projects-count", response_model=List[schemas.ProjectTypeCount])
def count_projects_by_type(db: Session = Depends(get_db)):
    return crud.count_projects_by_type(db)

@router.get("/highest-paid-employees", response_model=List[schemas.SalaryInfo])
def get_highest_paid_employees(limit: int = 5, db: Session = Depends(get_db)):
    return crud.get_highest_paid_employees(db, limit=limit)