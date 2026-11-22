from fastapi import APIRouter, HTTPException, Path, Query, status
from typing import List

from app.database import SessionDep
from . import schemas, services

router = APIRouter(prefix="/producto-categoria", tags=["Producto-Categoría"])


@router.post("/", response_model=schemas.ProductoCategoriaRead,
             status_code=status.HTTP_201_CREATED)
def alta_relacion(relacion: schemas.ProductoCategoriaCreate, session: SessionDep):
    return services.crear(session, relacion)


@router.get("/", response_model=List[schemas.ProductoCategoriaRead],
            status_code=status.HTTP_200_OK)
def listar_relaciones(
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=50),
):
    return services.obtener_todas(session, skip, limit)


@router.get("/{id}", response_model=schemas.ProductoCategoriaRead,
            status_code=status.HTTP_200_OK)
def detalle_relacion(id: int = Path(..., gt=0), session: SessionDep = None):
    relacion = services.obtener_por_id(session, id)
    if not relacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relación no encontrada",
        )
    return relacion


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_relacion(id: int = Path(..., gt=0), session: SessionDep = None):
    eliminada = services.eliminar(session, id)
    if not eliminada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relación no encontrada",
        )
    return None