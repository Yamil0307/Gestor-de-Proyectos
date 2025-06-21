from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from typing import Optional
from datetime import datetime
from ..schemas.auth_schemas import TokenData
from ..database.database import get_db
from ..config import settings
from . import auth

# Esquema OAuth2 para obtener el token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    """Obtener el usuario actual a partir del token JWT"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decodificar el token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    # Buscar el usuario en la base de datos
    user = auth.get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    
    return user

def get_current_active_user(current_user = Depends(get_current_user)):
    """Verificar que el usuario esté activo"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo"
        )
    return current_user
