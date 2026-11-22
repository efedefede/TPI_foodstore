from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from typing import List

from app.database import get_session, SessionDep
from app.core.security import (
    verify_password,
    create_access_token,
    get_current_active_user,
    require_role,
)
from app.modules.usuarios.models import Usuario
from app.modules.usuarios import repository, service
from app.modules.usuarios.schemas import UserCreate, UserPublic, UserAdminList

router = APIRouter(prefix="/api/v1/auth", tags=["Autenticación"])


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, session: SessionDep):
    return service.registrar(session, data)


@router.post("/token")
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    usuario = repository.get_by_email(session, form_data.username)
    if not usuario or not verify_password(form_data.password, usuario.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )
    if usuario.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta de usuario desactivada",
        )

    token = create_access_token({"sub": str(usuario.id)})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
    )
    return {"message": "Login exitoso"}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Sesión cerrada"}


@router.get("/me", response_model=UserPublic)
def me(current_user: Usuario = Depends(get_current_active_user)):
    return UserPublic.model_validate(current_user)


@router.get("/admin/usuarios", response_model=List[UserAdminList])
def listar_usuarios(
    _: Usuario = Depends(require_role(["admin"])),
    session: Session = Depends(get_session),
):
    return service.listar_todos(session)


@router.post("/admin/usuarios/{id}/activar", response_model=UserPublic)
def activar_usuario(
    id: int,
    _: Usuario = Depends(require_role(["admin"])),
    session: Session = Depends(get_session),
):
    return service.activar(session, id)


@router.post("/admin/usuarios/{id}/desactivar", response_model=UserPublic)
def desactivar_usuario(
    id: int,
    _: Usuario = Depends(require_role(["admin"])),
    session: Session = Depends(get_session),
):
    return service.desactivar(session, id)
