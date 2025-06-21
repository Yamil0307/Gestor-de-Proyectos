from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas
from app.api.operations import employee_operations

# ---- OPERACIONES CRUD PARA PROGRAMADORES ----
def create_programmer(db: Session, programmer: schemas.ProgrammerCreate):
    """Crea un nuevo programador con sus datos de empleado y lenguajes"""
    # Crear el empleado primero
    db_employee = models.Employee(
        identity_card=programmer.employee_data.identity_card,
        name=programmer.employee_data.name,
        age=programmer.employee_data.age,
        sex=programmer.employee_data.sex,
        base_salary=programmer.employee_data.base_salary,
        type="programmer"
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    
    # Crear el programador
    db_programmer = models.Programmer(
        employee_id=db_employee.id,
        category=programmer.category
    )
    db.add(db_programmer)
    
    # Agregar lenguajes si existen
    if programmer.languages:
        for language in programmer.languages:
            db_language = models.ProgrammerLanguage(
                programmer_id=db_employee.id,
                language=language
            )
            db.add(db_language)
    
    db.commit()
    db.refresh(db_programmer)
    return db_programmer

def get_programmer(db: Session, programmer_id: int):
    """Obtiene un programador por su ID"""
    return db.query(models.Programmer).filter(models.Programmer.employee_id == programmer_id).first()

def get_programmers(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene todos los programadores con paginación"""
    return db.query(models.Programmer).offset(skip).limit(limit).all()

def update_programmer(db: Session, programmer_id: int, programmer_update: schemas.ProgrammerUpdate):
    """Actualiza los datos de un programador"""
    db_programmer = get_programmer(db, programmer_id)
    if db_programmer:
        # Actualizar datos básicos
        if programmer_update.category:
            db_programmer.category = programmer_update.category
        
        # Actualizar lenguajes si se proporcionan
        if programmer_update.languages is not None:
            # Eliminar lenguajes existentes
            db.query(models.ProgrammerLanguage).filter(
                models.ProgrammerLanguage.programmer_id == programmer_id
            ).delete()
            
            # Agregar nuevos lenguajes
            for language in programmer_update.languages:
                db_language = models.ProgrammerLanguage(
                    programmer_id=programmer_id,
                    language=language
                )
                db.add(db_language)
        
        db.commit()
        db.refresh(db_programmer)
    return db_programmer

def delete_programmer(db: Session, programmer_id: int):
    """Elimina un programador y sus datos relacionados"""
    # Primero eliminar los lenguajes asociados
    db.query(models.ProgrammerLanguage).filter(
        models.ProgrammerLanguage.programmer_id == programmer_id
    ).delete()
    
    # Luego eliminar el programador
    db.query(models.Programmer).filter(
        models.Programmer.employee_id == programmer_id
    ).delete()
    
    # Finalmente eliminar el empleado
    db_employee = db.query(models.Employee).filter(
        models.Employee.id == programmer_id
    ).first()
    
    if db_employee:
        db.delete(db_employee)
        db.commit()
        return True
    return False

def add_programmer_language(db: Session, programmer_id: int, language: str):
    """Añade un lenguaje a un programador"""
    db_language = models.ProgrammerLanguage(
        programmer_id=programmer_id,
        language=language
    )
    db.add(db_language)
    db.commit()
    db.refresh(db_language)
    return db_language

def remove_programmer_language(db: Session, programmer_id: int, language: str):
    """Elimina un lenguaje específico de un programador"""
    db.query(models.ProgrammerLanguage).filter(
        models.ProgrammerLanguage.programmer_id == programmer_id,
        models.ProgrammerLanguage.language == language
    ).delete()
    db.commit()
    return True

def get_programmer_languages(db: Session, programmer_id: int):
    """Obtiene los lenguajes que domina un programador"""
    return db.query(models.ProgrammerLanguage.language).filter(
        models.ProgrammerLanguage.programmer_id == programmer_id
    ).all()
