from app.core.unit_of_work import BaseUnitOfWork
from .repository import PedidoRepository, DetallePedidoRepository, ProductoRepository


class PedidoUnitOfWork(BaseUnitOfWork):
    def __enter__(self):
        super().__enter__()
        # Instanciamos los repositorios pasándoles la sesión actual
        self.pedidos = PedidoRepository(self.session)
        self.detalles = DetallePedidoRepository(self.session)
        self.productos = ProductoRepository(self.session)
        return self