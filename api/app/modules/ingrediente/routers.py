from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from typing import List

from app.database import SessionDep
from app.core.security import get_current_active_user, require_role
from app.modules.usuarios.models import Usuario
from . import schemas, services

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])


@router.post("/", response_model=schemas.IngredienteRead,
             status_code=status.HTTP_201_CREATED)
def alta_ingrediente(
    ingrediente: schemas.IngredienteCreate,
    session: SessionDep,
    _: Usuario = Depends(require_role(["admin"])),
):
    return services.crear(session, ingrediente)


@router.get("/", response_model=List[schemas.IngredienteRead],
            status_code=status.HTTP_200_OK)
def listar_ingredientes(
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=100),
    _: Usuario = Depends(get_current_active_user),
):
    return services.obtener_todos(session, skip, limit)


@router.get("/{id}", response_model=schemas.IngredienteRead,
            status_code=status.HTTP_200_OK)
def detalle_ingrediente(
    id: int = Path(..., gt=0),
    session: SessionDep = None,
    _: Usuario = Depends(get_current_active_user),
):
    ingrediente = services.obtener_por_id(session, id)
    if not ingrediente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingrediente no encontrado",
        )
    return ingrediente


@router.put("/{id}", response_model=schemas.IngredienteRead,
            status_code=status.HTTP_200_OK)
def actualizar_ingrediente(
    ingrediente: schemas.IngredienteCreate,
    id: int = Path(..., gt=0),
    session: SessionDep = None,
    _: Usuario = Depends(require_role(["admin"])),
):
    actualizado = services.actualizar_total(session, id, ingrediente)
    if not actualizado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingrediente no encontrado",
        )
    return actualizado


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_ingrediente(
    id: int = Path(..., gt=0),
    session: SessionDep = None,
    _: Usuario = Depends(require_role(["admin"])),
):
    eliminado = services.eliminar(session, id)
    if not eliminado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingrediente no encontrado",
        )
    return None