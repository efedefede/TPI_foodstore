from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from typing import List

from app.database import SessionDep
from app.core.security import get_current_active_user, require_role
from app.modules.usuarios.models import Usuario
from . import schemas, services

router = APIRouter(prefix="/categorias", tags=["Categorías"])


@router.post("/", response_model=schemas.CategoriaRead, status_code=status.HTTP_201_CREATED)
def alta_categoria(
    categoria: schemas.CategoriaCreate,
    session: SessionDep,
    _: Usuario = Depends(require_role(["admin"])),
):
    return services.crear(session, categoria)


@router.get("/", response_model=List[schemas.CategoriaRead], status_code=status.HTTP_200_OK)
def listar_categorias(
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=50),
    _: Usuario = Depends(get_current_active_user),
):
    return services.obtener_todas(session, skip, limit)


@router.get("/{id}", response_model=schemas.CategoriaRead, status_code=status.HTTP_200_OK)
def detalle_categoria(
    id: int = Path(..., gt=0),
    session: SessionDep = None,
    _: Usuario = Depends(get_current_active_user),
):
    categoria = services.obtener_por_id(session, id)
    if not categoria:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
    return categoria


@router.put("/{id}", response_model=schemas.CategoriaRead, status_code=status.HTTP_200_OK)
def actualizar_categoria(
    categoria: schemas.CategoriaCreate,
    id: int = Path(..., gt=0),
    session: SessionDep = None,
    _: Usuario = Depends(require_role(["admin"])),
):
    actualizada = services.actualizar_total(session, id, categoria)
    if not actualizada:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
    return actualizada


@router.patch("/{id}/desactivar", response_model=schemas.CategoriaRead, status_code=status.HTTP_200_OK)
def desactivar_categoria(
    id: int = Path(..., gt=0),
    session: SessionDep = None,
    _: Usuario = Depends(require_role(["admin"])),
):
    desactivada = services.desactivar(session, id)
    if not desactivada:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
    return desactivada
