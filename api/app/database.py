import os
from typing import Annotated

from fastapi import Depends
from sqlmodel import SQLModel, Session, create_engine

# Lee la URL de una variable de entorno o usa el valor por defecto
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:1234@localhost:5432/tp_productos",
)

engine = create_engine(DATABASE_URL, echo=True)


def create_db_and_tables() -> None:
    """Crea las tablas a partir de los modelos SQLModel registrados."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependencia que entrega una sesión por request."""
    with Session(engine) as session:
        yield session


# Tipo reutilizable para inyectar la sesión en los endpoints
SessionDep = Annotated[Session, Depends(get_session)]