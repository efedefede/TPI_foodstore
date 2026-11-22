from typing import List, Optional
from sqlmodel import select, Session
from fastapi import HTTPException, status

from .models import ProductoCategoria
from ..producto.models import Producto
from ..categoria.models import Categoria
from .schemas import ProductoCategoriaCreate


def crear(session: Session, data: ProductoCategoriaCreate) -> ProductoCategoria:
    # Validar que existan el producto y la categoría
    producto = session.get(Producto, data.producto_id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {data.producto_id} no encontrado",
        )

    categoria = session.get(Categoria, data.categoria_id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con id {data.categoria_id} no encontrada",
        )

    # Evitar duplicados
    existente = session.exec(
        select(ProductoCategoria).where(
            ProductoCategoria.producto_id == data.producto_id,
            ProductoCategoria.categoria_id == data.categoria_id,
        )
    ).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="La relación producto-categoría ya existe",
        )

    nueva = ProductoCategoria(**data.model_dump())
    session.add(nueva)
    session.commit()
    session.refresh(nueva)
    return nueva


def obtener_todas(session: Session, skip: int, limit: int) -> List[ProductoCategoria]:
    return session.exec(
        select(ProductoCategoria).offset(skip).limit(limit)
    ).all()


def obtener_por_id(session: Session, id: int) -> Optional[ProductoCategoria]:
    return session.get(ProductoCategoria, id)


def eliminar(session: Session, id: int) -> Optional[ProductoCategoria]:
    """Borrado físico: es una tabla intermedia, no tiene sentido lógico."""
    relacion = session.get(ProductoCategoria, id)
    if not relacion:
        return None

    session.delete(relacion)
    session.commit()
    return relacion