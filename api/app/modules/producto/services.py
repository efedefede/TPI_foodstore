from typing import List, Optional
from sqlmodel import select, Session
from fastapi import HTTPException, status

from .models import Producto
from .schemas import ProductoCreate, ProductoUpdate


def crear(session: Session, data: ProductoCreate) -> Producto:
    existente = session.exec(
        select(Producto).where(Producto.nombre == data.nombre)
    ).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un producto con ese nombre",
        )

    nuevo = Producto(**data.model_dump())
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    return nuevo


def obtener_todos(session: Session, skip: int, limit: int, solo_activos: bool = True) -> List[Producto]:
    stmt = select(Producto)
    if solo_activos:
        stmt = stmt.where(Producto.activo == True)
    return list(session.exec(stmt.offset(skip).limit(limit)).all())


def obtener_por_id(session: Session, id: int) -> Optional[Producto]:
    return session.get(Producto, id)


def actualizar(session: Session, id: int, data: ProductoUpdate) -> Optional[Producto]:
    producto = session.get(Producto, id)
    if not producto:
        return None

    if data.nombre and data.nombre != producto.nombre:
        dup = session.exec(
            select(Producto).where(Producto.nombre == data.nombre, Producto.id != id)
        ).first()
        if dup:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe otro producto con ese nombre",
            )

    for campo, valor in data.model_dump(exclude_unset=True).items():
        setattr(producto, campo, valor)

    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


def desactivar(session: Session, id: int) -> Optional[Producto]:
    producto = session.get(Producto, id)
    if not producto:
        return None

    if not producto.activo:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El producto ya está desactivado",
        )

    producto.activo = False
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto
