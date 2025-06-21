from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas
from app.api.operations import programmer_operations, leader_operations

# ---- OPERACIONES CRUD PARA EQUIPOS (TEAMS) ----
def create_team(db: Session, team: schemas.TeamCreate):
    """
    Crea un nuevo equipo con su líder y programadores asociados.
    Valida que el líder exista y que los programadores no estén en otro equipo.
    """
    # Verificar que el líder exista
    db_leader = db.query(models.Leader).filter(
        models.Leader.employee_id == team.leader_id
    ).first()
    if not db_leader:
        raise ValueError("El líder especificado no existe")

    # Verificar que los programadores existan y no estén en otro equipo
    for programmer_id in team.programmer_ids:
        db_programmer = db.query(models.Programmer).filter(
            models.Programmer.employee_id == programmer_id
        ).first()
        if not db_programmer:
            raise ValueError(f"El programador con ID {programmer_id} no existe")
        
        existing_member = db.query(models.TeamMember).filter(
            models.TeamMember.programmer_id == programmer_id
        ).first()
        if existing_member:
            raise ValueError(f"El programador con ID {programmer_id} ya está en otro equipo")

    # Crear el equipo
    db_team = models.Team(
        name=team.name,
        leader_id=team.leader_id
    )
    db.add(db_team)
    db.commit()
    db.refresh(db_team)

    # Agregar miembros al equipo
    for programmer_id in team.programmer_ids:
        db_member = models.TeamMember(
            team_id=db_team.id,
            programmer_id=programmer_id
        )
        db.add(db_member)
    
    db.commit()
    return db_team

def get_team(db: Session, team_id: int):
    """Obtiene un equipo por su ID, incluyendo su líder y miembros"""
    return db.query(models.Team).filter(models.Team.id == team_id).first()

def get_teams(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene todos los equipos con paginación"""
    return db.query(models.Team).offset(skip).limit(limit).all()

def update_team(db: Session, team_id: int, team: schemas.TeamCreate):
    """Actualizar un equipo"""
    db_team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not db_team:
        return None
    
    # Actualizar los campos
    db_team.name = team.name
    db_team.leader_id = team.leader_id
    
    db.commit()
    db.refresh(db_team)
    return db_team

def delete_team(db: Session, team_id: int):
    """Elimina un equipo, sus miembros y desasocia su proyecto (si existe)"""
    db_team = get_team(db, team_id)
    if not db_team:
        raise ValueError("Equipo no encontrado")

    # Desasociar proyecto si existe
    if db_team.project:
        db_team.project.team_id = None
        db.add(db_team.project)

    # Eliminar miembros del equipo
    db.query(models.TeamMember).filter(
        models.TeamMember.team_id == team_id
    ).delete()

    # Eliminar el equipo
    db.delete(db_team)
    db.commit()
    return True

def add_team_member(db: Session, team_id: int, programmer_id: int):
    """Añade un programador a un equipo existente"""
    # Verificar que el programador no esté en otro equipo
    existing_member = db.query(models.TeamMember).filter(
        models.TeamMember.programmer_id == programmer_id
    ).first()
    if existing_member:
        raise ValueError("El programador ya está en otro equipo")

    # Verificar que el programador exista
    db_programmer = db.query(models.Programmer).filter(
        models.Programmer.employee_id == programmer_id
    ).first()
    if not db_programmer:
        raise ValueError("Programador no encontrado")

    # Verificar que el equipo exista
    db_team = get_team(db, team_id)
    if not db_team:
        raise ValueError("Equipo no encontrado")

    db_member = models.TeamMember(
        team_id=team_id,
        programmer_id=programmer_id
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

def remove_team_member(db: Session, team_id: int, programmer_id: int):
    """Elimina un programador de un equipo"""
    db_member = db.query(models.TeamMember).filter(
        models.TeamMember.team_id == team_id,
        models.TeamMember.programmer_id == programmer_id
    ).first()
    if not db_member:
        raise ValueError("El programador no está en este equipo")

    db.delete(db_member)
    db.commit()
    return True

def get_team_members(db: Session, team_id: int):
    """Obtiene todos los programadores de un equipo específico"""
    return db.query(models.Programmer).join(
        models.TeamMember,
        models.TeamMember.programmer_id == models.Programmer.employee_id
    ).filter(
        models.TeamMember.team_id == team_id
    ).all()

def get_team_by_leader(db: Session, leader_id: int):
    """Obtiene el equipo que lidera un líder específico"""
    return db.query(models.Team).filter(
        models.Team.leader_id == leader_id
    ).first()
