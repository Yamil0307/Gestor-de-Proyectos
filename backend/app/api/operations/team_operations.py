from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas
from app.api.operations import programmer_operations, leader_operations

# ---- OPERACIONES CRUD PARA EQUIPOS (TEAMS) ----
def create_team(db: Session, team: schemas.TeamCreate):
    """
    Crea un nuevo equipo con su líder.
    Valida que el líder exista si se especifica uno.
    """
    # Verificar que el líder exista si se especifica
    if team.leader_id:
        db_leader = db.query(models.Leader).filter(
            models.Leader.employee_id == team.leader_id
        ).first()
        if not db_leader:
            raise ValueError("El líder especificado no existe")

    # Crear el equipo
    db_team = models.Team(
        name=team.name,
        leader_id=team.leader_id
    )
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    
    return db_team
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

    # Verificar si hay un proyecto asociado a este equipo
    db_project = db.query(models.Project).filter(
        models.Project.team_id == team_id
    ).first()

    # Desasociar proyecto si existe
    if db_project:
        db_project.team_id = None
        db.add(db_project)

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
    # Primero verificamos que el equipo exista
    db_team = get_team(db, team_id)
    if not db_team:
        raise ValueError("Equipo no encontrado")
        
    # Luego verificamos que el programador exista
    db_programmer = db.query(models.Programmer).filter(
        models.Programmer.employee_id == programmer_id
    ).first()
    if not db_programmer:
        raise ValueError("Programador no encontrado")
    
    # Finalmente verificamos que el programador esté en el equipo
    db_member = db.query(models.TeamMember).filter(
        models.TeamMember.team_id == team_id,
        models.TeamMember.programmer_id == programmer_id
    ).first()
    if not db_member:
        raise ValueError("El programador no está en este equipo")

    try:
        db.delete(db_member)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise ValueError(f"Error al remover el miembro del equipo: {str(e)}")

def get_team_members(db: Session, team_id: int):
    """Obtiene todos los programadores de un equipo específico"""
    # Primero obtener los miembros del equipo
    team_members = db.query(models.TeamMember).filter(
        models.TeamMember.team_id == team_id
    ).all()
    
    # Luego, para cada miembro, obtenemos la información completa del programador
    # incluyendo su información de empleado
    result = []
    for member in team_members:
        # Obtener el programador
        programmer = db.query(models.Programmer).filter(
            models.Programmer.employee_id == member.programmer_id
        ).first()
        
        if programmer:
            # Obtener el empleado
            employee = db.query(models.Employee).filter(
                models.Employee.id == programmer.employee_id
            ).first()
            
            if employee:
                # Obtener los lenguajes del programador
                languages = db.query(models.ProgrammerLanguage.language).filter(
                    models.ProgrammerLanguage.programmer_id == programmer.employee_id
                ).all()
                
                # Añadir a resultados con toda la información
                result.append({
                    "team_member_id": member.programmer_id,
                    "programmer_id": programmer.employee_id,
                    "employee": {
                        "id": employee.id,
                        "name": employee.name,
                        "identity_card": employee.identity_card,
                        "age": employee.age,
                        "sex": employee.sex,
                        "base_salary": employee.base_salary,
                        "type": employee.type
                    },
                    "category": programmer.category,
                    "languages": [lang[0] for lang in languages]
                })
    
    return result

def get_team_by_leader(db: Session, leader_id: int):
    """Obtiene el equipo que lidera un líder específico"""
    return db.query(models.Team).filter(
        models.Team.leader_id == leader_id
    ).first()
