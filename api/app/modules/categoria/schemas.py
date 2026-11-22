from pydantic import BaseModel, Field
from typing import Optional


class CategoriaCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100, example="Pizzas")
    descripcion: Optional[str] = Field(None, example="Pizzas artesanales con masa fresca")


class CategoriaRead(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str]
    activo: bool

    model_config = {"from_attributes": True}
