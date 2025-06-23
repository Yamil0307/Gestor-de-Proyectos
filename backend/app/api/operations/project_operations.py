from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas
from app.api.operations import team_operations

# ---- OPERACIONES CRUD PARA PROYECTOS ----
def create_project(db: Session, project: schemas.ProjectCreate):
    """Crea un nuevo proyecto y lo asocia a un equipo"""
    # Verificar que el equipo exista
    db_team = db.query(models.Team).filter(models.Team.id == project.team_id).first()
    if not db_team:
        raise ValueError("El equipo especificado no existe")
    
    # Verificar que el equipo no tenga ya un proyecto asignado
    existing_project = db.query(models.Project).filter(models.Project.team_id == project.team_id).first()
    if existing_project:
        raise ValueError("El equipo ya tiene un proyecto asignado")
    
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_project(db: Session, project_id: int):
    """Obtiene un proyecto por su ID"""
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene todos los proyectos con paginación"""
    return db.query(models.Project).offset(skip).limit(limit).all()

def update_project(db: Session, project_id: int, project_update: schemas.ProjectBase):
    """Actualiza los datos de un proyecto"""
    db_project = get_project(db, project_id)
    if db_project:
        for key, value in project_update.dict(exclude_unset=True).items():
            if key == "team_id" and value != db_project.team_id:
                # Verificar que el nuevo equipo exista
                new_team = db.query(models.Team).filter(models.Team.id == value).first()
                if not new_team:
                    raise ValueError("El nuevo equipo no existe")
                # Verificar que el nuevo equipo no tenga ya un proyecto
                existing_project = db.query(models.Project).filter(
                    models.Project.team_id == value,
                    models.Project.id != project_id
                ).first()
                if existing_project:
                    raise ValueError("El nuevo equipo ya tiene un proyecto asignado")
            setattr(db_project, key, value)
        db.commit()
        db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: int):
    """Elimina un proyecto y sus datos relacionados"""
    # Eliminar proyectos de gestión asociados
    db.query(models.ManagementProject).filter(
        models.ManagementProject.project_id == project_id
    ).delete()
    
    # Eliminar proyectos multimedia asociados
    db.query(models.MultimediaProject).filter(
        models.MultimediaProject.project_id == project_id
    ).delete()
    
    # Eliminar el proyecto
    db_project = get_project(db, project_id)
    if db_project:
        db.delete(db_project)
        db.commit()
        return True
    return False

def get_projects_by_type(db: Session, project_type: str):
    """Obtiene todos los proyectos de un tipo específico"""
    return db.query(models.Project).filter(models.Project.type == project_type).all()

# ---- OPERACIONES CRUD PARA PROYECTOS DE GESTIÓN ----
def create_management_project(db: Session, management_project: schemas.ManagementProjectCreate):
    """Crea un nuevo proyecto de gestión con sus datos de proyecto"""
    # Verificar que el equipo exista y no tenga proyecto asignado
    db_team = db.query(models.Team).filter(models.Team.id == management_project.project_data.team_id).first()
    if not db_team:
        raise ValueError("El equipo especificado no existe")
    
    existing_project = db.query(models.Project).filter(models.Project.team_id == management_project.project_data.team_id).first()
    if existing_project:
        raise ValueError("El equipo ya tiene un proyecto asignado")
    
    # Crear el proyecto primero
    project_data = management_project.project_data.dict()
    project_data["type"] = "management"  # Forzar el tipo
    
    db_project = models.Project(**project_data)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    # Crear el proyecto de gestión
    db_management_project = models.ManagementProject(
        project_id=db_project.id,
        database_type=management_project.database_type,
        programming_language=management_project.programming_language,
        framework=management_project.framework
    )
    db.add(db_management_project)
    db.commit()
    db.refresh(db_management_project)
    return db_management_project

def get_management_project(db: Session, project_id: int):
    """Obtiene un proyecto de gestión por su ID de proyecto"""
    return db.query(models.ManagementProject).filter(models.ManagementProject.project_id == project_id).first()

def get_all_management_projects(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene todos los proyectos de gestión con paginación"""
    # Join con la tabla de proyectos para obtener solo los de tipo "management"
    management_projects = db.query(models.ManagementProject).join(
        models.Project,
        models.ManagementProject.project_id == models.Project.id
    ).filter(
        models.Project.type == "management"
    ).offset(skip).limit(limit).all()
    
    return management_projects

def update_management_project(db: Session, project_id: int, management_update: schemas.ManagementProjectBase):
    """Actualiza los detalles específicos de un proyecto de gestión"""
    # Verificar que existe el proyecto y es de tipo gestión
    db_project = get_project(db, project_id)
    if not db_project:
        return None
    if db_project.type != "management":
        raise ValueError("El proyecto no es de tipo gestión")
    
    # Obtener los detalles del proyecto de gestión
    db_management = get_management_project(db, project_id)
    if not db_management:
        return None
    
    # Actualizar campos
    db_management.database_type = management_update.database_type
    db_management.programming_language = management_update.programming_language
    db_management.framework = management_update.framework
    
    db.commit()
    db.refresh(db_management)
    return db_management

# ---- OPERACIONES CRUD PARA PROYECTOS MULTIMEDIA ----
def create_multimedia_project(db: Session, multimedia_project: schemas.MultimediaProjectCreate):
    """Crea un nuevo proyecto multimedia con sus datos de proyecto"""
    # Verificar que el equipo exista y no tenga proyecto asignado
    db_team = db.query(models.Team).filter(models.Team.id == multimedia_project.project_data.team_id).first()
    if not db_team:
        raise ValueError("El equipo especificado no existe")
    
    existing_project = db.query(models.Project).filter(models.Project.team_id == multimedia_project.project_data.team_id).first()
    if existing_project:
        raise ValueError("El equipo ya tiene un proyecto asignado")
    
    # Crear el proyecto primero
    project_data = multimedia_project.project_data.dict()
    project_data["type"] = "multimedia"  # Forzar el tipo
    
    db_project = models.Project(**project_data)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    # Crear el proyecto multimedia
    db_multimedia_project = models.MultimediaProject(
        project_id=db_project.id,
        development_tool=multimedia_project.development_tool
    )
    db.add(db_multimedia_project)
    db.commit()
    db.refresh(db_multimedia_project)
    return db_multimedia_project

def get_multimedia_project(db: Session, project_id: int):
    """Obtiene un proyecto multimedia por su ID de proyecto"""
    return db.query(models.MultimediaProject).filter(models.MultimediaProject.project_id == project_id).first()

def get_all_multimedia_projects(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene todos los proyectos multimedia con paginación"""
    # Join con la tabla de proyectos para obtener solo los de tipo "multimedia"
    multimedia_projects = db.query(models.MultimediaProject).join(
        models.Project,
        models.MultimediaProject.project_id == models.Project.id
    ).filter(
        models.Project.type == "multimedia"
    ).offset(skip).limit(limit).all()
    
    return multimedia_projects

def update_multimedia_project(db: Session, project_id: int, multimedia_update: schemas.MultimediaProjectBase):
    """Actualiza los detalles específicos de un proyecto multimedia"""
    # Verificar que existe el proyecto y es de tipo multimedia
    db_project = get_project(db, project_id)
    if not db_project:
        return None
    if db_project.type != "multimedia":
        raise ValueError("El proyecto no es de tipo multimedia")
    
    # Obtener los detalles del proyecto multimedia
    db_multimedia = get_multimedia_project(db, project_id)
    if not db_multimedia:
        return None
    
    # Actualizar campos
    db_multimedia.development_tool = multimedia_update.development_tool
    
    db.commit()
    db.refresh(db_multimedia)
    return db_multimedia
