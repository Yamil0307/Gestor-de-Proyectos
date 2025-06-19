from sqlalchemy import Column, Integer, String, Text, DECIMAL, ForeignKey, CheckConstraint, CHAR, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

# NUEVO: Modelo para usuarios admin
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    identity_card = Column(String(20), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    sex = Column(String(10), nullable=False)
    base_salary = Column(DECIMAL(10, 2), nullable=False)
    type = Column(String(20), nullable=False)
    
    __table_args__ = (
        CheckConstraint("type IN ('programmer', 'leader')", name='employee_type_check'),
    )

class Programmer(Base):
    __tablename__ = "programmers"
    
    employee_id = Column(Integer, ForeignKey('employees.id'), primary_key=True)
    category = Column(CHAR(1), nullable=False)
    
    employee = relationship("Employee")
    
    __table_args__ = (
        CheckConstraint("category IN ('A', 'B', 'C')", name='programmer_category_check'),
    )

class ProgrammerLanguage(Base):
    __tablename__ = "programmer_languages"
    
    programmer_id = Column(Integer, ForeignKey('programmers.employee_id'), primary_key=True)
    language = Column(String(50), primary_key=True)

class Leader(Base):
    __tablename__ = "leaders"
    
    employee_id = Column(Integer, ForeignKey('employees.id'), primary_key=True)
    years_experience = Column(Integer, nullable=False)
    projects_led = Column(Integer, nullable=False)
    
    employee = relationship("Employee")

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    leader_id = Column(Integer, ForeignKey('leaders.employee_id'))
    
    leader = relationship("Leader")

class TeamMember(Base):
    __tablename__ = "team_members"
    
    team_id = Column(Integer, ForeignKey('teams.id'), primary_key=True)
    programmer_id = Column(Integer, ForeignKey('programmers.employee_id'), primary_key=True)

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    estimated_time = Column(Integer, nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)
    type = Column(String(20), nullable=False)
    team_id = Column(Integer, ForeignKey('teams.id'), unique=True)
    
    __table_args__ = (
        CheckConstraint("type IN ('management', 'multimedia')", name='project_type_check'),
    )

class ManagementProject(Base):
    __tablename__ = "management_projects"
    
    project_id = Column(Integer, ForeignKey('projects.id'), primary_key=True)
    database_type = Column(String(50), nullable=False)
    programming_language = Column(String(50), nullable=False)
    framework = Column(String(50), nullable=False)

class MultimediaProject(Base):
    __tablename__ = "multimedia_projects"
    
    project_id = Column(Integer, ForeignKey('projects.id'), primary_key=True)
    development_tool = Column(String(20), nullable=False)
    
    __table_args__ = (
        CheckConstraint("development_tool IN ('flash', 'director')", name='multimedia_tool_check'),
    )