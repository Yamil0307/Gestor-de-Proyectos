from sqlalchemy.orm import Session
from ...models import models
from ...schemas import schemas

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
