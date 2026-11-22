from pydantic import BaseModel, Field
from typing import Optional


class ProductoCreate(BaseModel):
    categoria_id: int
    nombre: str = Field(..., min_length=1, example="Pizza Mozzarella")
    descripcion: Optional[str] = Field(None, example="Pizza con mozzarella y tomate")
    precio_base: float = Field(..., ge=0, example=1500.0)
    imagen_url: Optional[str] = Field(None, example="https://ejemplo.com/pizza.jpg")
    stock: int = Field(default=0, ge=0, example=20)
    disponible: bool = True


class ProductoUpdate(BaseModel):
    categoria_id: Optional[int] = None
    nombre: Optional[str] = Field(None, min_length=1)
    descripcion: Optional[str] = None
    precio_base: Optional[float] = Field(None, ge=0)
    imagen_url: Optional[str] = None
    disponible: Optional[bool] = None
    stock: Optional[int] = Field(None, ge=0)


class ProductoRead(BaseModel):
    id: int
    categoria_id: int
    nombre: str
    descripcion: Optional[str]
    precio_base: float
    imagen_url: Optional[str]
    stock: int
    disponible: bool
    activo: bool

    model_config = {"from_attributes": True}
