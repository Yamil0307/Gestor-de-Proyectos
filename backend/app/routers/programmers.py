from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.api import operations
from app.schemas import schemas

router = APIRouter(prefix="/programmers", tags=["programmers"])

@router.post("/", response_model=schemas.Programmer)
def create_programmer(programmer: schemas.ProgrammerCreate, db: Session = Depends(get_db)):
    try:
        return operations.create_programmer(db=db, programmer=programmer)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{programmer_id}", response_model=schemas.Programmer)
def get_programmer(programmer_id: int, db: Session = Depends(get_db)):
    db_programmer = operations.get_programmer(db, programmer_id=programmer_id)
    if db_programmer is None:
        raise HTTPException(status_code=404, detail="Programmer not found")
    return db_programmer

@router.get("/", response_model=List[schemas.Programmer])
def get_programmers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return operations.get_programmers(db, skip=skip, limit=limit)

@router.put("/{programmer_id}", response_model=schemas.Programmer)
def update_programmer(programmer_id: int, programmer_update: schemas.ProgrammerUpdate, db: Session = Depends(get_db)):
    try:
        db_programmer = operations.update_programmer(db, programmer_id=programmer_id, programmer_update=programmer_update)
        if db_programmer is None:
            raise HTTPException(status_code=404, detail="Programmer not found")
        return db_programmer
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{programmer_id}")
def delete_programmer(programmer_id: int, db: Session = Depends(get_db)):
    try:
        success = operations.delete_programmer(db, programmer_id=programmer_id)
        if not success:
            raise HTTPException(status_code=404, detail="Programador no encontrado")
        return {"message": "Programador eliminado exitosamente"}
    except ValueError as e:
        # Para errores de validación como programador asignado a equipos
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        # Para otros errores inesperados
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.get("/by-project/{project_id}", response_model=List[schemas.Programmer])
def get_programmers_by_project(project_id: int, db: Session = Depends(get_db)):
    try:
        return operations.get_programmers_by_project(db, project_id=project_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/by-framework/{framework}", response_model=List[schemas.Programmer])
def get_programmers_by_framework(framework: str, db: Session = Depends(get_db)):
    return operations.get_programmers_by_framework(db, framework=framework)