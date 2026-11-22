from typing import Optional, List
from sqlmodel import Session, select

from .models import Usuario


def get_by_email(session: Session, email: str) -> Optional[Usuario]:
    return session.exec(select(Usuario).where(Usuario.email == email)).first()


def get_by_username(session: Session, username: str) -> Optional[Usuario]:
    return session.exec(select(Usuario).where(Usuario.username == username)).first()


def get_by_id(session: Session, id: int) -> Optional[Usuario]:
    return session.get(Usuario, id)


def get_all(session: Session) -> List[Usuario]:
    return list(session.exec(select(Usuario)).all())


def create_usuario(session: Session, usuario: Usuario) -> Usuario:
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    return usuario


def save(session: Session, usuario: Usuario) -> Usuario:
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    return usuario
