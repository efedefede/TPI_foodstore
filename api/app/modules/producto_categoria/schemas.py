from pydantic import BaseModel


class ProductoCategoriaCreate(BaseModel):
    producto_id: int
    categoria_id: int


class ProductoCategoriaRead(BaseModel):
    id: int
    producto_id: int
    categoria_id: int