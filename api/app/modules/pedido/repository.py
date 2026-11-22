from sqlmodel import select
from app.core.repository import BaseRepository
from .models import Pedido, DetallePedido
from ..producto.models import Producto


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session):
        super().__init__(Pedido, session)

    def get_todos(self, skip: int = 0, limit: int = 100):
        statement = select(Pedido).offset(skip).limit(limit)
        return self.session.exec(statement).all()

    def get_por_usuario(self, usuario_id: int, skip: int = 0, limit: int = 100):
        statement = (
            select(Pedido)
            .where(Pedido.usuario_id == usuario_id)
            .offset(skip)
            .limit(limit)
        )
        return self.session.exec(statement).all()


class DetallePedidoRepository(BaseRepository[DetallePedido]):
    def __init__(self, session):
        super().__init__(DetallePedido, session)


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session):
        super().__init__(Producto, session)