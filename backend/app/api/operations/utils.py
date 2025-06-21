from sqlalchemy.orm import Session
from sqlalchemy import func
from ...models import models
from ...schemas import schemas
from typing import List
from . import employee_operations, programmer_operations, leader_operations, project_operations

# ---- FUNCIONES DE UTILIDAD ----

def calculate_salary(db: Session, employee_id: int) -> float:
    """
    Calcula el salario total de un empleado basado en su rol:
    - Programadores: salario base + 200 por cada lenguaje que dominan
    - Líderes: salario base + 300 por cada año de experiencia + 500 por cada proyecto liderado
    """
    employee = employee_operations.get_employee(db, employee_id)
    if not employee:
        raise ValueError("Empleado no encontrado")
    
    total_salary = employee.base_salary
    
    if employee.type == "programmer":
        programmer = programmer_operations.get_programmer(db, employee_id)
        if programmer:
            languages_count = len(programmer.languages)
            total_salary += languages_count * 200
    
    elif employee.type == "leader":
        leader = leader_operations.get_leader(db, employee_id)
        if leader:
            total_salary += leader.years_experience * 300
            total_salary += leader.projects_led * 500
    
    return total_salary

def get_earliest_finishing_project(db: Session):
    """Obtiene el proyecto que termina más pronto (menor tiempo estimado)"""
    return db.query(models.Project).order_by(models.Project.estimated_time.asc()).first()

def count_projects_by_type(db: Session) -> List[schemas.ProjectTypeCount]:
    """Cuenta la cantidad de proyectos por tipo"""
    results = db.query(
        models.Project.type,
        func.count(models.Project.id).label('count')
    ).group_by(models.Project.type).all()
    
    return [schemas.ProjectTypeCount(project_type=result.type, count=result.count) for result in results]

def get_highest_paid_employees(db: Session, limit: int = 5) -> List[schemas.SalaryInfo]:
    """Obtiene los empleados mejor pagados calculando su salario total"""
    employees = employee_operations.get_employees(db)
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
    project = project_operations.get_project(db, project_id)
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
    project = project_operations.get_project(db, project_id)
    if not project:
        return None
    
    result = schemas.ProjectWithDetails(project=project)
    
    if project.type == "management":
        management_details = project_operations.get_management_project(db, project_id)
        result.management_details = management_details
    elif project.type == "multimedia":
        multimedia_details = project_operations.get_multimedia_project(db, project_id)
        result.multimedia_details = multimedia_details
    
    return result
