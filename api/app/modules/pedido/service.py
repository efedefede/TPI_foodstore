from datetime import datetime, timezone
from sqlmodel import select
from fastapi import HTTPException, status

from .models import Pedido, DetallePedido
from .schemas import PedidoCreate, PedidoUpdate, PedidoRead, DetallePedidoRead
from .exceptions import ProductoNoEncontrado, PedidoNoEncontrado
from .unit_of_work import PedidoUnitOfWork

TRANSICIONES_ADMIN = {
    "PENDIENTE": {"EN_PREPARACION", "CANCELADO"},
    "EN_PREPARACION": {"ENTREGADO", "CANCELADO"},
}
TRANSICIONES_USER = {
    "PENDIENTE": {"CANCELADO"},
}


def _build_read(pedido: Pedido, detalles: list) -> PedidoRead:
    return PedidoRead(
        id=pedido.id,
        usuario_id=pedido.usuario_id,
        estado=pedido.estado,
        forma_pago=pedido.forma_pago,
        direccion_entrega=pedido.direccion_entrega,
        notas=pedido.notas,
        total=pedido.total,
        created_at=pedido.created_at,
        updated_at=pedido.updated_at,
        detalles=[
            DetallePedidoRead(
                id=d.id,
                producto_id=d.producto_id,
                nombre_producto=d.nombre_producto,
                cantidad=d.cantidad,
                precio_unitario=d.precio_unitario,
                subtotal=d.subtotal,
            ) for d in detalles
        ]
    )


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork):
        self.uow = uow

    def crear(self, data: PedidoCreate, usuario_id: int) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.create(Pedido(
                usuario_id=usuario_id,
                estado="PENDIENTE",
                forma_pago=data.forma_pago,
                direccion_entrega=data.direccion_entrega,
                notas=data.notas,
                total=0.0,
            ))
            total = 0.0

            for item in data.detalles:
                producto = uow.productos.get_by_id(item.producto_id)
                if not producto:
                    raise ProductoNoEncontrado(item.producto_id)

                # RN-01: solo vender si activo, disponible y stock suficiente
                if not producto.activo or not producto.disponible:
                    raise HTTPException(
                        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                        detail=f"El producto '{producto.nombre}' no está disponible",
                    )
                if producto.stock < item.cantidad:
                    raise HTTPException(
                        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                        detail=f"Stock insuficiente para '{producto.nombre}' (disponible: {producto.stock})",
                    )

                subtotal = producto.precio_base * item.cantidad
                detalle = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=producto.id,
                    cantidad=item.cantidad,
                    nombre_producto=producto.nombre,     # RN-05: copia inmutable
                    precio_unitario=producto.precio_base, # RN-05: copia inmutable
                    subtotal=subtotal,
                )
                uow.detalles.create(detalle)

                # RN-01: descontar stock
                producto.stock -= item.cantidad
                uow.session.add(producto)

                total += subtotal

            pedido.total = total
            uow.session.add(pedido)
            uow.session.flush()

            detalles_db = uow.session.exec(
                select(DetallePedido).where(DetallePedido.pedido_id == pedido.id)
            ).all()

            return _build_read(pedido, detalles_db)

    def obtener_todos(self, skip: int, limit: int, usuario_id: int, es_admin: bool):
        with self.uow as uow:
            if es_admin:
                pedidos = uow.pedidos.get_todos(skip, limit)
            else:
                pedidos = uow.pedidos.get_por_usuario(usuario_id, skip, limit)
            return pedidos

    def obtener_por_id(self, id: int, usuario_id: int, es_admin: bool):
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(id)
            if not pedido:
                raise PedidoNoEncontrado(id)
            if not es_admin and pedido.usuario_id != usuario_id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tenés acceso a este pedido")

            detalles = uow.session.exec(
                select(DetallePedido).where(DetallePedido.pedido_id == id)
            ).all()
            return pedido, detalles

    def cambiar_estado(self, id: int, data: PedidoUpdate, usuario_id: int, es_admin: bool):
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(id)
            if not pedido:
                raise PedidoNoEncontrado(id)

            # RN-04: control de acceso por rol
            if es_admin:
                transiciones = TRANSICIONES_ADMIN
            else:
                if pedido.usuario_id != usuario_id:
                    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tenés acceso a este pedido")
                transiciones = TRANSICIONES_USER

            # RN-02: validar transición de estado
            permitidos = transiciones.get(pedido.estado, set())
            if data.estado not in permitidos:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"No se puede pasar de '{pedido.estado}' a '{data.estado}'",
                )

            # RN-03: restituir stock al cancelar
            if data.estado == "CANCELADO":
                detalles = uow.session.exec(
                    select(DetallePedido).where(DetallePedido.pedido_id == id)
                ).all()
                for d in detalles:
                    producto = uow.productos.get_by_id(d.producto_id)
                    if producto:
                        producto.stock += d.cantidad
                        uow.session.add(producto)

            pedido.estado = data.estado
            pedido.updated_at = datetime.now(timezone.utc)
            uow.session.add(pedido)

            return pedido
