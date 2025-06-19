from sqlalchemy.orm import Session
from ..models import models
from ..schemas import schemas
from typing import List, Optional

# ---- Operaciones CRUD para Empleados ----
def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def get_employee(db: Session, employee_id: int):
    return db.query(models.Employee).filter(models.Employee.id == employee_id).first()

def get_employee_by_identity(db: Session, identity_card: str):
    return db.query(models.Employee).filter(models.Employee.identity_card == identity_card).first()

def get_employees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Employee).offset(skip).limit(limit).all()

def update_employee(db: Session, employee_id: int, employee_update: schemas.EmployeeBase):
    db_employee = get_employee(db, employee_id)
    if db_employee:
        for key, value in employee_update.dict().items():
            setattr(db_employee, key, value)
        db.commit()
        db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, employee_id: int):
    db_employee = get_employee(db, employee_id)
    if db_employee:
        db.delete(db_employee)
        db.commit()
    return db_employee



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




# ---- FUNCIONES ESPECIALES ----
def calculate_salary(db: Session, employee_id: int) -> float:
    """
    Calcula el salario total de un empleado basado en su rol:
    - Programadores: salario base + 200 por cada lenguaje que dominan
    - Líderes: salario base + 300 por cada año de experiencia + 500 por cada proyecto liderado
    """
    employee = get_employee(db, employee_id)
    if not employee:
        raise ValueError("Empleado no encontrado")
    
    total_salary = employee.base_salary
    
    if employee.type == "programmer":
        programmer = get_programmer(db, employee_id)
        if programmer:
            languages_count = len(programmer.languages)
            total_salary += languages_count * 200
    
    elif employee.type == "leader":
        leader = get_leader(db, employee_id)
        if leader:
            total_salary += leader.years_experience * 300
            total_salary += leader.projects_led * 500
    
    return total_salary

def get_earliest_finishing_project(db: Session):
    """Obtiene el proyecto que termina más pronto (menor tiempo estimado)"""
    return db.query(models.Project).order_by(models.Project.estimated_time.asc()).first()

def count_projects_by_type(db: Session) -> List[schemas.ProjectTypeCount]:
    """Cuenta la cantidad de proyectos por tipo"""
    from sqlalchemy import func
    
    results = db.query(
        models.Project.type,
        func.count(models.Project.id).label('count')
    ).group_by(models.Project.type).all()
    
    return [schemas.ProjectTypeCount(project_type=result.type, count=result.count) for result in results]

def get_highest_paid_employees(db: Session, limit: int = 5) -> List[schemas.SalaryInfo]:
    """Obtiene los empleados mejor pagados calculando su salario total"""
    employees = get_employees(db)
    salary_info = []
    
    for employee in employees:
        total_salary = calculate_salary(db, employee.id)
        salary_info.append(schemas.SalaryInfo(
            employee_id=employee.id,
            name=employee.name,
            total_salary=total_salary
        ))
    
    # Ordenar por salario total descendente y limitar
    salary_info.sort(key=lambda x: x.total_salary, reverse=True)
    return salary_info[:limit]

def get_programmers_by_project(db: Session, project_id: int):
    """Obtiene todos los programadores asignados a un proyecto específico"""
    project = get_project(db, project_id)
    if not project:
        raise ValueError("Proyecto no encontrado")
    
    return db.query(models.Programmer).join(
        models.TeamMember,
        models.TeamMember.programmer_id == models.Programmer.employee_id
    ).filter(
        models.TeamMember.team_id == project.team_id
    ).all()

def get_programmers_by_framework(db: Session, framework: str):
    """Obtiene todos los programadores que trabajan en proyectos con un framework específico"""
    return db.query(models.Programmer).join(
        models.TeamMember,
        models.TeamMember.programmer_id == models.Programmer.employee_id
    ).join(
        models.Team,
        models.Team.id == models.TeamMember.team_id
    ).join(
        models.Project,
        models.Project.team_id == models.Team.id
    ).join(
        models.ManagementProject,
        models.ManagementProject.project_id == models.Project.id
    ).filter(
        models.ManagementProject.framework == framework
    ).distinct().all()

# Función adicional para obtener proyecto con detalles
def get_project_with_details(db: Session, project_id: int):
    """Obtiene un proyecto con sus detalles específicos según el tipo"""
    project = get_project(db, project_id)
    if not project:
        return None
    
    result = schemas.ProjectWithDetails(project=project)
    
    if project.type == "management":
        management_details = get_management_project(db, project_id)
        result.management_details = management_details
    elif project.type == "multimedia":
        multimedia_details = get_multimedia_project(db, project_id)
        result.multimedia_details = multimedia_details
    
    return result