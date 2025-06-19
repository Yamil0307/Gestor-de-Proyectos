from sqlalchemy.orm import Session
from ..models.models import User
from ..schemas.auth_schemas import UserCreate
from ..auth.auth_utils import get_password_hash, verify_password
from typing import Optional

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Obtener usuario por nombre de usuario"""
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Obtener usuario por email"""
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate) -> User:
    """Crear nuevo usuario"""
    # Verificar que el usuario no exista
    if get_user_by_username(db, user.username):
        raise ValueError("El nombre de usuario ya existe")
    
    if get_user_by_email(db, user.email):
        raise ValueError("El email ya está registrado")
    
    # Crear el usuario
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """Autenticar usuario"""
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user