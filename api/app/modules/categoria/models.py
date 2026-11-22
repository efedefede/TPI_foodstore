from typing import Optional
from sqlmodel import SQLModel, Field


class Categoria(SQLModel, table=True):
    __tablename__ = "categoria"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, min_length=2, max_length=100, index=True)
    descripcion: Optional[str] = Field(default=None)
    activo: bool = Field(default=True)
