from typing import Optional
from sqlmodel import SQLModel, Field


class Producto(SQLModel, table=True):
    __tablename__ = "producto"

    id: Optional[int] = Field(default=None, primary_key=True)
    categoria_id: int = Field(foreign_key="categoria.id")
    nombre: str = Field(min_length=1, index=True)
    descripcion: Optional[str] = Field(default=None)
    precio_base: float = Field(ge=0)
    imagen_url: Optional[str] = Field(default=None)
    stock: int = Field(default=0, ge=0)
    disponible: bool = Field(default=True)
    activo: bool = Field(default=True)
