from fastapi import APIRouter, HTTPException, Path, Query, status, Depends
from typing import List

from sqlmodel import select
from app.database import get_session
from app.core.security import get_current_active_user
from app.modules.usuarios.models import Usuario
from .models import DetallePedido
from .schemas import PedidoCreate, PedidoRead, PedidoUpdate, DetallePedidoRead
from .unit_of_work import PedidoUnitOfWork
from .service import PedidoService, _build_read
from .exceptions import ProductoNoEncontrado, PedidoNoEncontrado

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


def get_pedido_service(session=Depends(get_session)) -> PedidoService:
    uow = PedidoUnitOfWork(session)
    return PedidoService(uow)


@router.post("/", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def alta_pedido(
    data: PedidoCreate,
    service: PedidoService = Depends(get_pedido_service),
    current_user: Usuario = Depends(get_current_active_user),
):
    try:
        return service.crear(data, current_user.id)
    except ProductoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/", response_model=List[PedidoRead], status_code=status.HTTP_200_OK)
def listar_pedidos(
    service: PedidoService = Depends(get_pedido_service),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=50),
    current_user: Usuario = Depends(get_current_active_user),
    session=Depends(get_session),
):
    es_admin = current_user.role == "admin"
    pedidos = service.obtener_todos(skip, limit, current_user.id, es_admin)
    result = []
    for p in pedidos:
        detalles = session.exec(
            select(DetallePedido).where(DetallePedido.pedido_id == p.id)
        ).all()
        result.append(_build_read(p, detalles))
    return result


@router.get("/{id}", response_model=PedidoRead, status_code=status.HTTP_200_OK)
def detalle_pedido(
    id: int = Path(..., gt=0),
    service: PedidoService = Depends(get_pedido_service),
    current_user: Usuario = Depends(get_current_active_user),
):
    try:
        es_admin = current_user.role == "admin"
        pedido, detalles = service.obtener_por_id(id, current_user.id, es_admin)
        return _build_read(pedido, detalles)
    except PedidoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.patch("/{id}/estado", response_model=PedidoRead, status_code=status.HTTP_200_OK)
def cambiar_estado(
    data: PedidoUpdate,
    id: int = Path(..., gt=0),
    service: PedidoService = Depends(get_pedido_service),
    current_user: Usuario = Depends(get_current_active_user),
    session=Depends(get_session),
):
    try:
        es_admin = current_user.role == "admin"
        pedido = service.cambiar_estado(id, data, current_user.id, es_admin)
        detalles = session.exec(
            select(DetallePedido).where(DetallePedido.pedido_id == pedido.id)
        ).all()
        return _build_read(pedido, detalles)
    except PedidoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
