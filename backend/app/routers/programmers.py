from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..crud import crud
from ..schemas import schemas

router = APIRouter(prefix="/programmers", tags=["programmers"])

@router.post("/", response_model=schemas.Programmer)
def create_programmer(programmer: schemas.ProgrammerCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_programmer(db=db, programmer=programmer)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{programmer_id}", response_model=schemas.Programmer)
def get_programmer(programmer_id: int, db: Session = Depends(get_db)):
    db_programmer = crud.get_programmer(db, programmer_id=programmer_id)
    if db_programmer is None:
        raise HTTPException(status_code=404, detail="Programmer not found")
    return db_programmer

@router.get("/", response_model=List[schemas.Programmer])
def get_programmers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_programmers(db, skip=skip, limit=limit)

@router.put("/{programmer_id}", response_model=schemas.Programmer)
def update_programmer(programmer_id: int, programmer_update: schemas.ProgrammerUpdate, db: Session = Depends(get_db)):
    try:
        db_programmer = crud.update_programmer(db, programmer_id=programmer_id, programmer_update=programmer_update)
        if db_programmer is None:
            raise HTTPException(status_code=404, detail="Programmer not found")
        return db_programmer
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{programmer_id}")
def delete_programmer(programmer_id: int, db: Session = Depends(get_db)):
    success = crud.delete_programmer(db, programmer_id=programmer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Programmer not found")
    return {"message": "Programmer deleted successfully"}

@router.get("/by-project/{project_id}", response_model=List[schemas.Programmer])
def get_programmers_by_project(project_id: int, db: Session = Depends(get_db)):
    try:
        return crud.get_programmers_by_project(db, project_id=project_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/by-framework/{framework}", response_model=List[schemas.Programmer])
def get_programmers_by_framework(framework: str, db: Session = Depends(get_db)):
    return crud.get_programmers_by_framework(db, framework=framework)