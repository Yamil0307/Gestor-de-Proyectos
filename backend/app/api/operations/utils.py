from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import models
from app.schemas import schemas
from typing import List
from app.api.operations import employee_operations, programmer_operations, leader_operations, project_operations

# ---- FUNCIONES DE UTILIDAD ----

def calculate_salary(db: Session, employee_id: int) -> float:
    """
    Calcula el salario total de un empleado basado en su rol:
    
    Programador:
    salario = salario_básico + 5% del precio del proyecto + 3 * cantidad_lenguajes
    
    Líder:
    salario = salario_básico + 10% del precio del proyecto + 5 * años_experiencia
    
    Si no tiene proyecto:
    Programador: salario_básico + 3 * cantidad_lenguajes
    Líder: salario_básico + 5 * años_experiencia
    """
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise ValueError("Empleado no encontrado")

    base_salary = employee.base_salary
    total_salary = base_salary

    if employee.type == "programmer":
        programmer = db.query(models.Programmer).filter(models.Programmer.employee_id == employee_id).first()
        # Cantidad de lenguajes
        languages_count = db.query(models.ProgrammerLanguage).filter(
            models.ProgrammerLanguage.programmer_id == employee_id
        ).count()
        # Proyecto asignado
        from app.api.operations.utils import get_project_by_programmer_identity
        project = None
        try:
            project = get_project_by_programmer_identity(db, employee.identity_card)
        except Exception:
            project = None
        if project:
            total_salary += 0.05 * project.price
        total_salary += 3 * languages_count

    elif employee.type == "leader":
        leader = db.query(models.Leader).filter(models.Leader.employee_id == employee_id).first()
        years_exp = leader.years_experience if leader else 0
        # Proyecto asignado
        project = db.query(models.Project).filter(models.Project.team_id == 
            db.query(models.Team).filter(models.Team.leader_id == employee_id).first().id
        ).first() if db.query(models.Team).filter(models.Team.leader_id == employee_id).first() else None
        if project:
            total_salary += 0.10 * project.price
        total_salary += 5 * years_exp

    return float(total_salary)

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

def get_project_by_programmer_identity(db: Session, identity_card: str):
    """Obtiene el proyecto al que está asignado un programador dado su carnet de identidad"""
    # Buscar el empleado por su carnet de identidad
    employee = db.query(models.Employee).filter(
        models.Employee.identity_card == identity_card,
        models.Employee.type == "programmer"
    ).first()
    
    if not employee:
        raise ValueError("No se encontró un programador con ese carnet de identidad")
    
    # Buscar si el programador está asignado a algún equipo
    team_member = db.query(models.TeamMember).filter(
        models.TeamMember.programmer_id == employee.id
    ).first()
    
    if not team_member:
        return None  # El programador no está asignado a ningún equipo
    
    # Buscar si el equipo está asignado a algún proyecto
    project = db.query(models.Project).filter(
        models.Project.team_id == team_member.team_id
    ).first()
    
    return project  # Puede ser None si el equipo no está asignado a un proyecto

def format_project_to_txt(db: Session, project_with_details: schemas.ProjectWithDetails) -> str:
    """Formatea la información completa de un proyecto y su equipo a texto plano"""
    project = project_with_details.project
    lines = []
    lines.append(f"Nombre del proyecto: {project.name}")
    lines.append(f"Descripción: {project.description or '-'}")
    lines.append(f"Fecha de inicio: {getattr(project, 'start_date', '-')}")
    lines.append(f"Fecha de fin: {getattr(project, 'end_date', '-')}")
    lines.append(f"Tiempo estimado (horas): {project.estimated_time}")
    lines.append(f"Precio: {project.price}")
    lines.append("")
    lines.append(f"Tipo de proyecto: {project.type}")

    # Detalles específicos según tipo
    if project.type == "management" and project_with_details.management_details:
        md = project_with_details.management_details
        lines.append("---- Detalles de Gestión ----")
        lines.append(f"Base de datos: {md.database_type}")
        lines.append(f"Lenguaje de programación: {md.programming_language}")
        lines.append(f"Framework: {md.framework}")
    elif project.type == "multimedia" and project_with_details.multimedia_details:
        mm = project_with_details.multimedia_details
        lines.append("---- Detalles Multimedia ----")
        lines.append(f"Herramienta de desarrollo: {mm.development_tool}")

    # Equipo
    team = db.query(models.Team).filter(models.Team.id == project.team_id).first()
    lines.append("\n=== Equipo Asociado ===")
    lines.append(f"Nombre del equipo: {team.name if team else '-'}")

    # Líder
    leader_name = "-"
    if team and team.leader_id:
        leader = db.query(models.Leader).filter(models.Leader.employee_id == team.leader_id).first()
        if leader:
            employee = db.query(models.Employee).filter(models.Employee.id == leader.employee_id).first()
            if employee:
                leader_name = employee.name
    lines.append(f"Líder: {leader_name}")

    # Programadores
    lines.append("Programadores:")
    if team:
        from app.api.operations.team_operations import get_team_members
        programmers = get_team_members(db, team.id)
        for prog in programmers:
            name = prog["employee"]["name"]
            lines.append(f"  - {name}")
    else:
        lines.append("  -")

    return "\n".join(lines)

from fastapi import APIRouter, Depends
from app.database.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/total-salary")
def get_total_salary(db: Session = Depends(get_db)):
    """
    Devuelve el total de la nómina mensual sumando el salario de todos los empleados.
    """
    from app.api.operations.utils import calculate_salary
    from app.api.operations import employee_operations

    employees = employee_operations.get_employees(db)
    total = 0
    for emp in employees:
        total += calculate_salary(db, emp.id)
    return {"total": total}
