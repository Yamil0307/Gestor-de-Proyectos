from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas
from app.api.operations import employee_operations

# ---- OPERACIONES CRUD PARA LÍDERES ----
def create_leader(db: Session, leader: schemas.LeaderCreate):
    """Crea un nuevo líder con sus datos de empleado"""
    # Crear el empleado primero
    db_employee = models.Employee(
        identity_card=leader.employee_data.identity_card,
        name=leader.employee_data.name,
        age=leader.employee_data.age,
        sex=leader.employee_data.sex,
        base_salary=leader.employee_data.base_salary,
        type="leader"
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    
    # Crear el líder
    db_leader = models.Leader(
        employee_id=db_employee.id,
        years_experience=leader.years_experience,
        projects_led=leader.projects_led
    )
    db.add(db_leader)
    db.commit()
    db.refresh(db_leader)
    return db_leader

def get_leader(db: Session, leader_id: int):
    """Obtiene un líder por su ID"""
    return db.query(models.Leader).filter(models.Leader.employee_id == leader_id).first()

def get_leaders(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene todos los líderes con paginación"""
    return db.query(models.Leader).offset(skip).limit(limit).all()

def update_leader(db: Session, leader_id: int, leader_update: schemas.LeaderUpdate):
    """Actualiza los datos de un líder"""
    db_leader = get_leader(db, leader_id)
    if db_leader:
        if leader_update.years_experience is not None:
            db_leader.years_experience = leader_update.years_experience
        if leader_update.projects_led is not None:
            db_leader.projects_led = leader_update.projects_led
        
        db.commit()
        db.refresh(db_leader)
    return db_leader

def delete_leader(db: Session, leader_id: int):
    """Elimina un líder y sus datos relacionados"""
    # Primero verificar si el líder está asignado a algún equipo
    team_exists = db.query(models.Team).filter(
        models.Team.leader_id == leader_id
    ).first()
    
    if team_exists:
        raise ValueError("No se puede eliminar un líder asignado a un equipo")
    
    # Eliminar el líder
    db.query(models.Leader).filter(
        models.Leader.employee_id == leader_id
    ).delete()
    
    # Eliminar el empleado
    db_employee = db.query(models.Employee).filter(
        models.Employee.id == leader_id
    ).first()
    
    if db_employee:
        db.delete(db_employee)
        db.commit()
        return True
    return False
