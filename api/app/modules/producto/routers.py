from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from typing import List

from app.database import SessionDep
from app.core.security import get_current_active_user, require_role
from app.modules.usuarios.models import Usuario
from . import schemas, services

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.post("/", response_model=schemas.ProductoRead, status_code=status.HTTP_201_CREATED)
def alta_producto(
    producto: schemas.ProductoCreate,
    session: SessionDep,
    _: Usuario = Depends(require_role(["admin"])),
):
    return services.crear(session, producto)


@router.get("/", response_model=List[schemas.ProductoRead], status_code=status.HTTP_200_OK)
def listar_productos(
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=50),
    current_user: Usuario = Depends(get_current_active_user),
):
    solo_activos = current_user.role != "admin"
    return services.obtener_todos(session, skip, limit, solo_activos)


@router.get("/{id}", response_model=schemas.ProductoRead, status_code=status.HTTP_200_OK)
def detalle_producto(
    id: int = Path(..., gt=0),
    session: SessionDep = None,
    _: Usuario = Depends(get_current_active_user),
):
    producto = services.obtener_por_id(session, id)
    if not producto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return producto


@router.patch("/{id}", response_model=schemas.ProductoRead, status_code=status.HTTP_200_OK)
def actualizar_producto(
    producto: schemas.ProductoUpdate,
    id: int = Path(..., gt=0),
    session: SessionDep = None,
    _: Usuario = Depends(require_role(["admin"])),
):
    actualizado = services.actualizar(session, id, producto)
    if not actualizado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return actualizado


@router.patch("/{id}/desactivar", response_model=schemas.ProductoRead, status_code=status.HTTP_200_OK)
def desactivar_producto(
    id: int = Path(..., gt=0),
    session: SessionDep = None,
    _: Usuario = Depends(require_role(["admin"])),
):
    desactivado = services.desactivar(session, id)
    if not desactivado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return desactivado
