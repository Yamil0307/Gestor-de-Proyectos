from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.api.operations import create_employee, get_employee, get_employees, update_employee, delete_employee, calculate_salary
from app.schemas import schemas

router = APIRouter(prefix="/employees", tags=["employees"])

@router.post("/", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    try:
        return operations.create_employee(db=db, employee=employee)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{employee_id}", response_model=schemas.Employee)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = operations.get_employee(db, employee_id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

@router.get("/", response_model=List[schemas.Employee])
def get_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return operations.get_employees(db, skip=skip, limit=limit)

@router.put("/{employee_id}", response_model=schemas.Employee)
def update_employee(employee_id: int, employee_update: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    try:
        db_employee = operations.update_employee(db, employee_id=employee_id, employee_update=employee_update)
        if db_employee is None:
            raise HTTPException(status_code=404, detail="Employee not found")
        return db_employee
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    success = operations.delete_employee(db, employee_id=employee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}

@router.get("/{employee_id}/salary", response_model=float)
def calculate_employee_salary(employee_id: int, db: Session = Depends(get_db)):
    try:
        salary = calculate_salary(db, employee_id=employee_id)
        return salary
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))