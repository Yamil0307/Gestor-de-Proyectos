from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime

# ---- ESQUEMAS BASE ----
class EmployeeBase(BaseModel):
    identity_card: str = Field(..., min_length=5, max_length=20, description="Cédula de identidad")
    name: str = Field(..., min_length=2, max_length=100, description="Nombre completo")
    age: int = Field(..., ge=18, le=70, description="Edad entre 18 y 70 años")
    sex: str = Field(..., pattern="^(M|F|Masculino|Femenino)$", description="Sexo: M, F, Masculino o Femenino")
    base_salary: float = Field(..., gt=0, description="Salario base mayor a 0")
    type: str = Field(..., pattern="^(programmer|leader)$", description="Tipo: programmer o leader")

    @validator('identity_card')
    def validate_identity_card(cls, v):
        if not v.replace('-', '').replace(' ', '').isalnum():
            raise ValueError('La cédula debe contener solo números, letras, guiones y espacios')
        return v.strip().upper()

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
    category: str = Field(..., pattern="^[ABC]$", description="Categoría: A, B o C")

class ProgrammerCreate(ProgrammerBase):
    employee_data: EmployeeCreate
    languages: List[str] = Field(..., min_items=1, description="Al menos un lenguaje de programación")

    @validator('languages')
    def validate_languages(cls, v):
        if not v:
            raise ValueError('Debe especificar al menos un lenguaje de programación')
        # Limpiar y validar lenguajes
        clean_languages = [lang.strip().title() for lang in v if lang.strip()]
        if not clean_languages:
            raise ValueError('Debe especificar al menos un lenguaje de programación válido')
        return clean_languages

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
    years_experience: int = Field(..., ge=1, le=50, description="Años de experiencia entre 1 y 50")
    projects_led: int = Field(..., ge=0, description="Número de proyectos liderados (0 o más)")

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
    name: str = Field(..., min_length=2, max_length=100, description="Nombre del equipo")
    leader_id: Optional[int] = Field(None, ge=1, description="ID del líder del equipo")

class TeamCreate(TeamBase):
    pass  # No debería tener programmer_ids aquí

class Team(TeamBase):
    id: int

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
    name: str = Field(..., min_length=2, max_length=100, description="Nombre del proyecto")
    description: Optional[str] = Field(None, max_length=1000, description="Descripción del proyecto")
    estimated_time: int = Field(..., gt=0, description="Tiempo estimado en horas (mayor a 0)")
    price: float = Field(..., gt=0, description="Precio del proyecto (mayor a 0)")
    type: str = Field(..., pattern="^(management|multimedia)$", description="Tipo: management o multimedia")
    team_id: int = Field(..., ge=1, description="ID del equipo asignado")

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
    database_type: str = Field(..., min_length=2, max_length=50, description="Tipo de base de datos")
    programming_language: str = Field(..., min_length=2, max_length=50, description="Lenguaje de programación")
    framework: str = Field(..., min_length=2, max_length=50, description="Framework utilizado")

class ManagementProjectCreate(ManagementProjectBase):
    project_data: ProjectCreate

class ManagementProject(ManagementProjectBase):
    project_id: int

    class Config:
        from_attributes = True

# ---- ESQUEMAS PARA PROYECTOS MULTIMEDIA ----
class MultimediaProjectBase(BaseModel):
    development_tool: str = Field(..., pattern="^(flash|director)$", description="Herramienta: flash o director")

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