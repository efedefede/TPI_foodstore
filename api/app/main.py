from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.database import create_db_and_tables, engine
from app.modules.producto.routers import router as producto_router
from app.modules.categoria.routers import router as categoria_router
from app.modules.pedido.routers import router as pedido_router
from app.modules.usuarios.router import router as auth_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    _run_seed()
    yield


def _run_seed():
    from sqlmodel import Session, select
    from app.modules.usuarios.models import Usuario
    from app.modules.categoria.models import Categoria
    from app.modules.producto.models import Producto
    from app.core.security import hash_password

    with Session(engine) as session:
        # Admin
        admin_email = "admin@foodstore.com"
        if not session.exec(select(Usuario).where(Usuario.email == admin_email)).first():
            admin = Usuario(
                username="admin",
                full_name="Admin Food Store",
                email=admin_email,
                hashed_password=hash_password("admin1234"),
                role="admin",
            )
            session.add(admin)
            session.commit()

        # Categorías
        if not session.exec(select(Categoria)).first():
            categorias = [
                Categoria(nombre="Hamburguesas", descripcion="Hamburguesas artesanales"),
                Categoria(nombre="Pizzas", descripcion="Pizzas a la piedra"),
                Categoria(nombre="Bebidas", descripcion="Bebidas frías y calientes"),
                Categoria(nombre="Postres", descripcion="Postres y dulces"),
            ]
            for c in categorias:
                session.add(c)
            session.commit()
            for c in categorias:
                session.refresh(c)

            # Productos
            productos = [
                Producto(categoria_id=categorias[0].id, nombre="Hamburguesa Clásica", descripcion="Pan brioche, carne 200g, lechuga, tomate", precio_base=1500.0, stock=50, disponible=True),
                Producto(categoria_id=categorias[0].id, nombre="Hamburguesa BBQ", descripcion="Pan brioche, carne 200g, bacon, cheddar, salsa BBQ", precio_base=1800.0, stock=40, disponible=True),
                Producto(categoria_id=categorias[0].id, nombre="Hamburguesa Veggie", descripcion="Pan integral, medallón de legumbres, rúcula, tomate", precio_base=1400.0, stock=30, disponible=True),
                Producto(categoria_id=categorias[1].id, nombre="Pizza Mozzarella", descripcion="Salsa de tomate, mozzarella fresca, albahaca", precio_base=1200.0, stock=20, disponible=True),
                Producto(categoria_id=categorias[1].id, nombre="Pizza Napolitana", descripcion="Salsa de tomate, mozzarella, tomate, orégano, ajo", precio_base=1300.0, stock=20, disponible=True),
                Producto(categoria_id=categorias[1].id, nombre="Pizza Especial", descripcion="Salsa de tomate, mozzarella, jamón, morrones, aceitunas", precio_base=1600.0, stock=15, disponible=True),
                Producto(categoria_id=categorias[2].id, nombre="Coca-Cola 500ml", descripcion="Bebida gaseosa", precio_base=500.0, stock=100, disponible=True),
                Producto(categoria_id=categorias[2].id, nombre="Agua Mineral 500ml", descripcion="Agua sin gas", precio_base=300.0, stock=100, disponible=True),
                Producto(categoria_id=categorias[2].id, nombre="Jugo de Naranja", descripcion="Jugo natural exprimido", precio_base=700.0, stock=30, disponible=True),
                Producto(categoria_id=categorias[3].id, nombre="Brownie con Helado", descripcion="Brownie casero con una bocha de helado de vainilla", precio_base=900.0, stock=25, disponible=True),
                Producto(categoria_id=categorias[3].id, nombre="Cheesecake", descripcion="Cheesecake de frutos rojos", precio_base=850.0, stock=20, disponible=True),
            ]
            for p in productos:
                session.add(p)
            session.commit()


def create_app() -> FastAPI:
    app = FastAPI(
        title="API Integradora - Unidad 5",
        description="CRUD persistente con SQLModel + PostgreSQL",
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router)
    app.include_router(producto_router)
    app.include_router(categoria_router)
    app.include_router(pedido_router)

    return app


app = create_app()
