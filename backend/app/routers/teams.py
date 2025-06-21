from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.schemas.schemas import Team, TeamCreate
from app.api import operations
from app.api.dependencies import get_current_active_user

router = APIRouter(prefix="/teams", tags=["teams"])

@router.post("/", response_model=Team)
def create_team(team: TeamCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Crear un nuevo equipo"""
    try:
        return operations.create_team(db=db, team=team)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[Team])
def read_teams(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Obtener lista de equipos"""
    teams = operations.get_teams(db, skip=skip, limit=limit)
    return teams

@router.get("/{team_id}", response_model=Team)
def read_team(team_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Obtener equipo por ID"""
    db_team = operations.get_team(db, team_id=team_id)
    if db_team is None:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return db_team

@router.put("/{team_id}", response_model=Team)
def update_team(team_id: int, team: TeamCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Actualizar equipo"""
    db_team = operations.update_team(db, team_id=team_id, team=team)
    if db_team is None:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return db_team

@router.delete("/{team_id}")
def delete_team(team_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Eliminar equipo"""
    success = operations.delete_team(db, team_id=team_id)
    if not success:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return {"message": "Equipo eliminado exitosamente"}

# Endpoints para gestión de miembros
@router.get("/{team_id}/members")
def get_team_members(team_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Obtener miembros de un equipo"""
    return operations.get_team_members(db, team_id=team_id)

@router.post("/{team_id}/members")
def add_team_member(team_id: int, request: dict, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Agregar miembro a un equipo"""
    try:
        programmer_id = request.get("programmer_id")
        if not programmer_id:
            raise HTTPException(status_code=400, detail="programmer_id es requerido")
        
        return operations.add_team_member(db, team_id=team_id, programmer_id=programmer_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{team_id}/members/{programmer_id}")
def remove_team_member(team_id: int, programmer_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    """Remover miembro de un equipo"""
    try:
        return operations.remove_team_member(db, team_id=team_id, programmer_id=programmer_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))