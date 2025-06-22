from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
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
        return create_employee_op(db=db, employee=employee)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{employee_id}", response_model=schemas.Employee)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = get_employee_op(db, employee_id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

@router.get("/", response_model=List[schemas.Employee])
def get_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_employees_op(db, skip=skip, limit=limit)

@router.put("/{employee_id}", response_model=schemas.Employee)
def update_employee(employee_id: int, employee_update: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    try:
        db_employee = update_employee_op(db, employee_id=employee_id, employee_update=employee_update)
        if db_employee is None:
            raise HTTPException(status_code=404, detail="Employee not found")
        return db_employee
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    success = delete_employee_op(db, employee_id=employee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}

@router.get("/{employee_id}/salary", response_model=float)
def calculate_employee_salary(employee_id: int, db: Session = Depends(get_db)):
    try:
        salary = calculate_salary_op(db, employee_id=employee_id)
        return salary
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))