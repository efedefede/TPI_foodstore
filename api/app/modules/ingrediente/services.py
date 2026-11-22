from typing import List, Optional
from sqlmodel import select, Session
from fastapi import HTTPException, status

from .models import Ingrediente
from .schemas import IngredienteCreate


def crear(session: Session, data: IngredienteCreate) -> Ingrediente:
    # La unicidad es opcional según el PDF (RN-10), pero la dejamos por buenas prácticas
    existente = session.exec(
        select(Ingrediente).where(Ingrediente.nombre == data.nombre)
    ).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un ingrediente con ese nombre",
        )
        
    nuevo = Ingrediente(**data.model_dump())
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    return nuevo


def obtener_todos(session: Session, skip: int, limit: int) -> List[Ingrediente]:
    return session.exec(select(Ingrediente).offset(skip).limit(limit)).all()


def obtener_por_id(session: Session, id: int) -> Optional[Ingrediente]:
    return session.get(Ingrediente, id)


def actualizar_total(session: Session, id: int, data: IngredienteCreate) -> Optional[Ingrediente]:
    ingrediente = session.get(Ingrediente, id)
    if not ingrediente:
        return None

    if data.nombre != ingrediente.nombre:
        dup = session.exec(
            select(Ingrediente).where(
                Ingrediente.nombre == data.nombre, Ingrediente.id != id
            )
        ).first()
        if dup:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe otro ingrediente con ese nombre",
            )

    for campo, valor in data.model_dump().items():
        setattr(ingrediente, campo, valor)

    session.add(ingrediente)
    session.commit()
    session.refresh(ingrediente)
    return ingrediente


def eliminar(session: Session, id: int) -> bool:
    # Como Ingrediente no tiene borrado lógico, hacemos borrado físico
    ingrediente = session.get(Ingrediente, id)
    if not ingrediente:
        return False

    session.delete(ingrediente)
    session.commit()
    return True