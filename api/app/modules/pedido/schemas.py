from typing import List, Optional, Literal
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

EstadoPedido = Literal["PENDIENTE", "EN_PREPARACION", "ENTREGADO", "CANCELADO"]
FormaPago = Literal["EFECTIVO", "TRANSFERENCIA"]


class DetallePedidoCreate(BaseModel):
    producto_id: int
    cantidad: int = Field(..., ge=1)


class DetallePedidoRead(BaseModel):
    id: int
    producto_id: int
    nombre_producto: str
    cantidad: int
    precio_unitario: float
    subtotal: float

    model_config = {"from_attributes": True}


class PedidoCreate(BaseModel):
    forma_pago: FormaPago
    direccion_entrega: str = Field(..., min_length=5, max_length=200)
    notas: Optional[str] = None
    detalles: List[DetallePedidoCreate]

    @field_validator("detalles")
    @classmethod
    def validar_detalles(cls, detalles):
        if not detalles:
            raise ValueError("El pedido debe tener al menos un detalle")
        productos = [d.producto_id for d in detalles]
        if len(productos) != len(set(productos)):
            raise ValueError("No se puede repetir el mismo producto en el pedido")
        return detalles


class PedidoUpdate(BaseModel):
    estado: EstadoPedido


class PedidoRead(BaseModel):
    id: int
    usuario_id: int
    estado: str
    forma_pago: str
    direccion_entrega: str
    notas: Optional[str]
    total: float
    created_at: datetime
    updated_at: datetime
    detalles: List[DetallePedidoRead] = []

    model_config = {"from_attributes": True}
