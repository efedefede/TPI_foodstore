"""Carga los datos iniciales en la base de datos."""
import os
from dotenv import load_dotenv
from sqlmodel import Session, select, create_engine, SQLModel

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:1234@localhost:5432/tp_productos",
)

engine = create_engine(DATABASE_URL)

# Importar todos los modelos para que SQLModel los registre
import app.modules.categoria.models  # noqa
import app.modules.producto.models  # noqa
import app.modules.producto_categoria.models  # noqa
import app.modules.ingrediente.models  # noqa
import app.modules.pedido.models  # noqa
from app.modules.usuarios.models import Rol, Usuario, UsuarioRol
from app.core.security import hash_password


def seed():
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        roles_iniciales = [
            {"nombre": "admin", "descripcion": "Administrador con acceso completo"},
            {"nombre": "user", "descripcion": "Usuario con acceso de lectura"},
        ]
        for data in roles_iniciales:
            existente = session.exec(select(Rol).where(Rol.nombre == data["nombre"])).first()
            if not existente:
                rol = Rol(**data)
                session.add(rol)
                print(f"  Rol '{data['nombre']}' creado.")
            else:
                print(f"  Rol '{data['nombre']}' ya existe.")
        session.commit()

        # Crear usuario admin por defecto si no existe
        admin_email = "admin@foodstore.com"
        admin_existente = session.exec(select(Usuario).where(Usuario.email == admin_email)).first()
        if not admin_existente:
            admin = Usuario(
                nombre="Admin",
                apellido="Food Store",
                email=admin_email,
                password_hash=hash_password("admin1234"),
            )
            session.add(admin)
            session.commit()
            session.refresh(admin)

            rol_admin = session.exec(select(Rol).where(Rol.nombre == "admin")).first()
            if rol_admin:
                ur = UsuarioRol(usuario_id=admin.id, rol_id=rol_admin.id)
                session.add(ur)
                session.commit()
            print(f"  Usuario admin creado: {admin_email} / admin1234")
        else:
            print(f"  Usuario admin ya existe.")

    print("Seed completado.")


if __name__ == "__main__":
    seed()
