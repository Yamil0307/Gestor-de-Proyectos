from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..crud import crud
from ..schemas import schemas

router = APIRouter(prefix="/multimedia-projects", tags=["multimedia-projects"])

@router.post("/", response_model=schemas.MultimediaProject)
def create_multimedia_project(multimedia_project: schemas.MultimediaProjectCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_multimedia_project(db=db, multimedia_project=multimedia_project)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{project_id}", response_model=schemas.MultimediaProject)
def get_multimedia_project(project_id: int, db: Session = Depends(get_db)):
    db_multimedia_project = crud.get_multimedia_project(db, project_id=project_id)
    if db_multimedia_project is None:
        raise HTTPException(status_code=404, detail="Multimedia project not found")
    return db_multimedia_project