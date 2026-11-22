from typing import List
from fastapi import HTTPException, status
from sqlmodel import Session

from .models import Usuario
from .schemas import UserCreate, UserPublic, UserAdminList
from . import repository
from app.core.security import hash_password


def registrar(session: Session, data: UserCreate) -> UserPublic:
    if repository.get_by_email(session, data.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El email ya está registrado")
    if repository.get_by_username(session, data.username):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El username ya está en uso")

    usuario = Usuario(
        username=data.username,
        full_name=data.full_name,
        email=data.email,
        hashed_password=hash_password(data.password),
        role="user",
    )
    usuario = repository.create_usuario(session, usuario)
    return UserPublic.model_validate(usuario)


def listar_todos(session: Session) -> List[UserAdminList]:
    usuarios = repository.get_all(session)
    return [UserAdminList.model_validate(u) for u in usuarios]


def activar(session: Session, id: int) -> UserPublic:
    usuario = repository.get_by_id(session, id)
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    usuario.disabled = False
    repository.save(session, usuario)
    return UserPublic.model_validate(usuario)


def desactivar(session: Session, id: int) -> UserPublic:
    usuario = repository.get_by_id(session, id)
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    usuario.disabled = True
    repository.save(session, usuario)
    return UserPublic.model_validate(usuario)
