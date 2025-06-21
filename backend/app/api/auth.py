from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional
from passlib.context import CryptContext
from ..models.models import User
from ..schemas.auth_schemas import UserCreate, TokenData
from ..config import settings

# Contexto de encriptación para contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """Verificar si la contraseña en texto plano coincide con el hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Generar un hash de la contraseña"""
    return pwd_context.hash(password)

def create_user(db: Session, user: UserCreate):
    """Crear un nuevo usuario"""
    # Verificar si el usuario ya existe
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise ValueError("El nombre de usuario ya está en uso")
    
    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        raise ValueError("El correo electrónico ya está registrado")
    
    # Crear nuevo usuario
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

def get_user(db: Session, username: str):
    """Obtener un usuario por su nombre de usuario"""
    return db.query(User).filter(User.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    """Autenticar un usuario"""
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Crear un token de acceso JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
