from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# Esquemas para usuarios
class UserBase(BaseModel):
    username: str = Field(..., example="admin", min_length=3, max_length=50)
    email: str = Field(..., example="admin@empresa.com")

class UserCreate(UserBase):
    password: str = Field(..., example="admin123", min_length=6)

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Esquemas para autenticación
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str = Field(..., example="admin")
    password: str = Field(..., example="admin123")