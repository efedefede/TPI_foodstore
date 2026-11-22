from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator


class UserCreate(BaseModel):
    username: str
    full_name: str
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        return v


class UserPublic(BaseModel):
    id: int
    username: str
    full_name: str
    email: str
    role: str
    disabled: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserAdminList(BaseModel):
    id: int
    username: str
    full_name: str
    email: str
    role: str
    disabled: bool

    model_config = {"from_attributes": True}
