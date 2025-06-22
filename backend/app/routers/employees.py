from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models import models
from app.api.operations import (
    create_employee as create_employee_op,
    get_employee as get_employee_op,
    get_employees as get_employees_op,
    update_employee as update_employee_op,
    delete_employee as delete_employee_op,
    calculate_salary as calculate_salary_op
)
from app.schemas import schemas

router = APIRouter(prefix="/employees", tags=["employees"])

@router.post("/", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    try:
        # Validar si ya existe un empleado con esa cédula
        existing_employee = db.query(models.Employee).filter(
            models.Employee.identity_card == employee.identity_card
        ).first()
        
        if existing_employee:
            raise HTTPException(
                status_code=400, 
                detail=f"Ya existe un empleado con la cédula {employee.identity_card}"
            )
            
        return create_employee_op(db=db, employee=employee)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.get("/{employee_id}", response_model=schemas.Employee)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    try:
        db_employee = get_employee_op(db, employee_id=employee_id)
        if db_employee is None:
            raise HTTPException(
                status_code=404, 
                detail=f"Empleado con ID {employee_id} no encontrado"
            )
        return db_employee
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener empleado: {str(e)}")

@router.get("/", response_model=List[schemas.Employee])
def get_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_employees_op(db, skip=skip, limit=limit)

@router.put("/{employee_id}", response_model=schemas.Employee)
def update_employee(employee_id: int, employee_update: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    try:
        # Verificar si el empleado existe
        existing_employee = get_employee_op(db, employee_id=employee_id)
        if existing_employee is None:
            raise HTTPException(
                status_code=404, 
                detail=f"Empleado con ID {employee_id} no encontrado"
            )
        
        # Si se está actualizando la cédula, verificar que no exista otro empleado con esa cédula
        if employee_update.identity_card:
            duplicate = db.query(models.Employee).filter(
                models.Employee.identity_card == employee_update.identity_card,
                models.Employee.id != employee_id
            ).first()
            
            if duplicate:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Ya existe otro empleado con la cédula {employee_update.identity_card}"
                )
        
        db_employee = update_employee_op(db, employee_id=employee_id, employee_update=employee_update)
        return db_employee
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar empleado: {str(e)}")

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    try:
        # Verificar si el empleado existe
        existing_employee = get_employee_op(db, employee_id=employee_id)
        if existing_employee is None:
            raise HTTPException(
                status_code=404, 
                detail=f"Empleado con ID {employee_id} no encontrado"
            )
        
        # Verificar si el empleado es un líder asignado a un equipo
        if existing_employee.type == "leader":
            team = db.query(models.Team).filter(models.Team.leader_id == employee_id).first()
            if team:
                raise HTTPException(
                    status_code=400,
                    detail=f"No se puede eliminar el líder porque está asignado al equipo '{team.name}'"
                )
        
        # Verificar si el empleado es un programador asignado a un equipo
        if existing_employee.type == "programmer":
            team_member = db.query(models.TeamMember).filter(
                models.TeamMember.programmer_id == employee_id
            ).first()
            if team_member:
                team = db.query(models.Team).filter(models.Team.id == team_member.team_id).first()
                raise HTTPException(
                    status_code=400,
                    detail=f"No se puede eliminar el programador porque está asignado a un equipo"
                )
        
        success = delete_employee_op(db, employee_id=employee_id)
        return {"message": f"Empleado con ID {employee_id} eliminado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar empleado: {str(e)}")

@router.get("/{employee_id}/salary", response_model=float)
def calculate_employee_salary(employee_id: int, db: Session = Depends(get_db)):
    try:
        # Verificar si el empleado existe
        existing_employee = get_employee_op(db, employee_id=employee_id)
        if existing_employee is None:
            raise HTTPException(
                status_code=404, 
                detail=f"Empleado con ID {employee_id} no encontrado"
            )
        
        salary = calculate_salary_op(db, employee_id=employee_id)
        return salary
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al calcular salario: {str(e)}")