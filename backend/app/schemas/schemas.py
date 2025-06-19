from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# ---- ESQUEMAS BASE ----
class EmployeeBase(BaseModel):
    identity_card: str
    name: str
    age: int
    sex: str
    base_salary: float
    type: str

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    identity_card: Optional[str] = None
    name: Optional[str] = None
    age: Optional[int] = None
    sex: Optional[str] = None
    base_salary: Optional[float] = None
    type: Optional[str] = None

class Employee(EmployeeBase):
    id: int

    class Config:
        from_attributes = True

# ---- ESQUEMAS PARA PROGRAMADORES ----
class ProgrammerBase(BaseModel):
    category: str  # 'A', 'B', o 'C'

class ProgrammerCreate(ProgrammerBase):
    employee_data: EmployeeCreate
    languages: List[str]  # Lista de lenguajes que domina

class ProgrammerUpdate(BaseModel):
    category: Optional[str] = None
    languages: Optional[List[str]] = None

class Programmer(ProgrammerBase):
    employee_id: int
    employee: Employee
    languages: List[str] = []

    class Config:
        from_attributes = True

# ---- ESQUEMAS PARA LÍDERES ----
class LeaderBase(BaseModel):
    years_experience: int
    projects_led: int

class LeaderCreate(LeaderBase):
    employee_data: EmployeeCreate

class LeaderUpdate(BaseModel):
    years_experience: Optional[int] = None
    projects_led: Optional[int] = None

class Leader(LeaderBase):
    employee_id: int
    employee: Employee

    class Config:
        from_attributes = True

# ---- ESQUEMAS PARA EQUIPOS ----
class TeamBase(BaseModel):
    name: str
    leader_id: Optional[int] = None

class TeamCreate(TeamBase):
    pass  # No debería tener programmer_ids aquí

class Team(TeamBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ---- ESQUEMAS PARA MIEMBROS DE EQUIPO ----
class TeamMemberBase(BaseModel):
    team_id: int
    programmer_id: int

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMember(TeamMemberBase):
    team_id: int
    programmer_id: int

    class Config:
        from_attributes = True

# ---- ESQUEMAS PARA PROYECTOS ----
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    estimated_time: int
    price: float
    type: str  # 'management' o 'multimedia'
    team_id: int

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    estimated_time: Optional[int] = None
    price: Optional[float] = None
    type: Optional[str] = None
    team_id: Optional[int] = None

class Project(ProjectBase):
    id: int

    class Config:
        from_attributes = True

# ---- ESQUEMAS PARA PROYECTOS DE GESTIÓN ----
class ManagementProjectBase(BaseModel):
    database_type: str
    programming_language: str
    framework: str

class ManagementProjectCreate(ManagementProjectBase):
    project_data: ProjectCreate

class ManagementProject(ManagementProjectBase):
    project_id: int

    class Config:
        from_attributes = True

# ---- ESQUEMAS PARA PROYECTOS MULTIMEDIA ----
class MultimediaProjectBase(BaseModel):
    development_tool: str  # 'flash' o 'director'

class MultimediaProjectCreate(MultimediaProjectBase):
    project_data: ProjectCreate

class MultimediaProject(MultimediaProjectBase):
    project_id: int

    class Config:
        from_attributes = True

# ---- ESQUEMAS PARA FUNCIONES ESPECIALES ----
class ProjectTypeCount(BaseModel):
    project_type: str
    count: int

class SalaryInfo(BaseModel):
    employee_id: int
    name: str
    total_salary: float

class ProjectWithDetails(BaseModel):
    project: Project
    management_details: Optional[ManagementProject] = None
    multimedia_details: Optional[MultimediaProject] = None

class TeamWithProject(BaseModel):
    team: Team
    project: Optional[Project] = None