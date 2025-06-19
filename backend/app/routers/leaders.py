from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..crud import crud
from ..schemas import schemas

router = APIRouter(prefix="/leaders", tags=["leaders"])

@router.post("/", response_model=schemas.Leader)
def create_leader(leader: schemas.LeaderCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_leader(db=db, leader=leader)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{leader_id}", response_model=schemas.Leader)
def get_leader(leader_id: int, db: Session = Depends(get_db)):
    db_leader = crud.get_leader(db, leader_id=leader_id)
    if db_leader is None:
        raise HTTPException(status_code=404, detail="Leader not found")
    return db_leader

@router.get("/", response_model=List[schemas.Leader])
def get_leaders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_leaders(db, skip=skip, limit=limit)

@router.put("/{leader_id}", response_model=schemas.Leader)
def update_leader(leader_id: int, leader_update: schemas.LeaderUpdate, db: Session = Depends(get_db)):
    try:
        db_leader = crud.update_leader(db, leader_id=leader_id, leader_update=leader_update)
        if db_leader is None:
            raise HTTPException(status_code=404, detail="Leader not found")
        return db_leader
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{leader_id}")
def delete_leader(leader_id: int, db: Session = Depends(get_db)):
    success = crud.delete_leader(db, leader_id=leader_id)
    if not success:
        raise HTTPException(status_code=404, detail="Leader not found")
    return {"message": "Leader deleted successfully"}