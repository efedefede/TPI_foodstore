from typing import List, Optional
from sqlmodel import select, Session
from fastapi import HTTPException, status

from .models import Categoria
from .schemas import CategoriaCreate


def crear(session: Session, data: CategoriaCreate) -> Categoria:
    existente = session.exec(
        select(Categoria).where(Categoria.nombre == data.nombre)
    ).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una categoría con ese nombre",
        )
    nueva = Categoria(**data.model_dump())
    session.add(nueva)
    session.commit()
    session.refresh(nueva)
    return nueva


def obtener_todas(session: Session, skip: int, limit: int) -> List[Categoria]:
    return list(session.exec(
        select(Categoria).offset(skip).limit(limit)
    ).all())


def obtener_por_id(session: Session, id: int) -> Optional[Categoria]:
    return session.get(Categoria, id)


def actualizar_total(session: Session, id: int, data: CategoriaCreate) -> Optional[Categoria]:
    categoria = session.get(Categoria, id)
    if not categoria:
        return None

    if data.nombre != categoria.nombre:
        dup = session.exec(
            select(Categoria).where(
                Categoria.nombre == data.nombre, Categoria.id != id
            )
        ).first()
        if dup:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe otra categoría con ese nombre",
            )

    for campo, valor in data.model_dump().items():
        setattr(categoria, campo, valor)

    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


def desactivar(session: Session, id: int) -> Optional[Categoria]:
    categoria = session.get(Categoria, id)
    if not categoria:
        return None

    if not categoria.activo:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="La categoría ya está desactivada",
        )

    categoria.activo = False
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria
