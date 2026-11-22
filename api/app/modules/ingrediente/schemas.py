from typing import Annotated, Optional
from pydantic import BaseModel, Field, StringConstraints

# RN-10: nombre obligatorio, sin espacios en los extremos y mínimo 1 carácter
NombreIngrediente = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1)
]


class IngredienteBase(BaseModel):
    nombre: NombreIngrediente = Field(..., example="Muzzarella")


class IngredienteCreate(IngredienteBase):
    pass


class IngredienteUpdate(BaseModel):
    nombre: Optional[NombreIngrediente] = None


class IngredienteRead(IngredienteBase):
    id: int