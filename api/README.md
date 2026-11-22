# Backend - TP Integrador Unidad 10 (Patrón Unit of Work)

API REST desarrollada con FastAPI, SQLModel y PostgreSQL. Extiende la Unidad 9 incorporando el patrón **Unit of Work** para la gestión transaccional de pedidos y el módulo de pedidos completo con sus detalles.

## Tecnologías

- **FastAPI** — Framework web.
- **SQLModel** — ORM y validación de datos.
- **PostgreSQL** — Base de datos relacional.
- **Uvicorn** — Servidor ASGI.
- **psycopg** — Driver de PostgreSQL.
- **python-jose** — Generación y validación de JWT.
- **bcrypt** — Hash de contraseñas.
- **python-dotenv** — Variables de entorno.

## Arquitectura

El proyecto sigue una estructura modular con la arquitectura **Models-Schemas-Repository-Service-Router**. El módulo `pedido` implementa adicionalmente el patrón **Unit of Work** para garantizar la atomicidad de la creación de un pedido y sus detalles.

### Estructura de carpetas

```text
api/
├── app/
│   ├── core/
│   │   ├── security.py         # JWT, bcrypt, dependencias de auth
│   │   ├── repository.py       # BaseRepository genérico
│   │   └── unit_of_work.py     # BaseUnitOfWork (context manager transaccional)
│   ├── modules/
│   │   ├── categoria/
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── services.py
│   │   │   └── routers.py
│   │   ├── ingrediente/
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── services.py
│   │   │   └── routers.py
│   │   ├── pedido/
│   │   │   ├── models.py           # Pedido + DetallePedido
│   │   │   ├── schemas.py          # PedidoCreate, PedidoRead, DetallePedidoRead
│   │   │   ├── repository.py       # PedidoRepository, DetallePedidoRepository
│   │   │   ├── unit_of_work.py     # PedidoUnitOfWork
│   │   │   ├── service.py          # PedidoService (crear, listar, cambiar estado)
│   │   │   ├── exceptions.py
│   │   │   └── routers.py
│   │   ├── producto/
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── services.py         # obtener_todos acepta solo_activos: bool
│   │   │   └── routers.py          # admin ve productos inactivos; user solo activos
│   │   ├── producto_categoria/
│   │   └── usuarios/
│   │       ├── models.py           # role: str ("admin" | "user") — campo plano
│   │       ├── schemas.py
│   │       ├── repository.py
│   │       ├── service.py
│   │       └── router.py
│   ├── database.py
│   └── main.py                     # CORS, routers, seed de categorías y productos
├── .env.example
├── requirements.txt
└── README.md
```

## Requisitos previos

- Python 3.10+
- PostgreSQL (corriendo en `localhost:5432`)

## Instalación y ejecución

1. Crear y activar el entorno virtual:

   ```bash
   python -m venv .venv
   source .venv/Scripts/activate  # En Windows (Git Bash)
   ```

2. Instalar dependencias:

   ```bash
   pip install -r requirements.txt
   ```

3. Configurar variables de entorno:
   - Copiar `.env.example` como `.env` y completar los valores.

4. Levantar el servidor:

   ```bash
   uvicorn app.main:app --reload
   ```

   Al arrancar se crean las tablas automáticamente y se ejecuta el seed inicial (usuario admin, categorías y productos de ejemplo).

   - **Email admin:** `admin@foodstore.com`
   - **Contraseña:** `admin1234`

## Endpoints

### Autenticación (`/api/v1/auth`)

| Método | Endpoint                                      | Acceso  | Descripción                           |
| :----- | :-------------------------------------------- | :------ | :------------------------------------ |
| POST   | `/api/v1/auth/register`                       | Público | Registrar usuario (asigna rol `user`) |
| POST   | `/api/v1/auth/token`                          | Público | Login — emite JWT en cookie HttpOnly  |
| POST   | `/api/v1/auth/logout`                         | Sesión  | Logout — borra la cookie              |
| GET    | `/api/v1/auth/me`                             | Sesión  | Datos del usuario autenticado         |
| GET    | `/api/v1/auth/admin/usuarios`                 | admin   | Listar todos los usuarios             |
| POST   | `/api/v1/auth/admin/usuarios/{id}/activar`    | admin   | Activar usuario                       |
| POST   | `/api/v1/auth/admin/usuarios/{id}/desactivar` | admin   | Desactivar usuario                    |

### Categorías (`/categorias`)

| Método | Endpoint                      | Acceso | Descripción             |
| :----- | :---------------------------- | :----- | :---------------------- |
| POST   | `/categorias/`                | admin  | Crear categoría         |
| GET    | `/categorias/`                | Sesión | Listar (con paginación) |
| GET    | `/categorias/{id}`            | Sesión | Detalle                 |
| PUT    | `/categorias/{id}`            | admin  | Actualizar              |
| PUT    | `/categorias/{id}/desactivar` | admin  | Desactivar              |

### Productos (`/productos`)

| Método | Endpoint                     | Acceso | Descripción                                       |
| :----- | :--------------------------- | :----- | :------------------------------------------------ |
| POST   | `/productos/`                | admin  | Crear producto                                    |
| GET    | `/productos/`                | Sesión | Listar — admin ve todos; user solo activos        |
| GET    | `/productos/{id}`            | Sesión | Detalle                                           |
| PATCH  | `/productos/{id}`            | admin  | Actualizar                                        |
| PATCH  | `/productos/{id}/desactivar` | admin  | Desactivar (soft-delete via campo `activo`)       |

### Pedidos (`/pedidos`)

| Método | Endpoint              | Acceso | Descripción                                        |
| :----- | :-------------------- | :----- | :------------------------------------------------- |
| POST   | `/pedidos/`           | Sesión | Crear pedido con detalles (Unit of Work)           |
| GET    | `/pedidos/`           | Sesión | Listar — admin ve todos; user solo los propios     |
| GET    | `/pedidos/{id}`       | Sesión | Detalle de un pedido                               |
| PATCH  | `/pedidos/{id}/estado`| admin  | Cambiar estado del pedido                          |

### Ingredientes (`/ingredientes`)

| Método | Endpoint              | Acceso | Descripción             |
| :----- | :-------------------- | :----- | :---------------------- |
| POST   | `/ingredientes/`      | admin  | Crear ingrediente       |
| GET    | `/ingredientes/`      | Sesión | Listar                  |
| GET    | `/ingredientes/{id}`  | Sesión | Detalle                 |
| PATCH  | `/ingredientes/{id}`  | admin  | Actualizar              |

## Seguridad

- El JWT se transmite exclusivamente en una **cookie HttpOnly** (`access_token`), inaccesible desde JavaScript.
- Las contraseñas se almacenan con hash **bcrypt**.
- El campo `role` en `Usuario` es un string plano (`"admin"` o `"user"`).
- Soft-delete via campo `activo: bool` en `Categoria` y `Producto`; `disabled: bool` en `Usuario`.
- CORS configurado con `allow_credentials=True` para `http://localhost:5173` y `http://localhost:3000`.

## Documentación

- Swagger UI: `http://localhost:8000/docs`

## Autor

Federico Panella — Tecnicatura Universitaria en Programación a Distancia (TUPaD)
