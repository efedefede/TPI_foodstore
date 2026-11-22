# Food Store — TPI Integrador (Unidad 10)

Aplicación full-stack de e-commerce de comida desarrollada como Trabajo Práctico Integrador de la Tecnicatura Universitaria en Programación a Distancia (TUPaD).

- **Repositorio GitHub:** https://github.com/efedefede/TPI_foodstore
- **Video de demostración:** https://drive.google.com/file/d/12UUYddNKcq26KwpijhQcilNX7HBcOMEr/view?usp=sharing

---

## Estructura del proyecto

```text
├── api/     # API REST (FastAPI + SQLModel + PostgreSQL)
├── client/    # SPA (React + TypeScript + Vite + TailwindCSS)
└── README.md
```

---

## Backend

### Tecnologías

- Python 3.10+, FastAPI, SQLModel, PostgreSQL, Uvicorn
- Autenticación JWT en cookie HttpOnly, bcrypt, python-jose

### Variables de entorno

Copiar `backend/.env.example` como `backend/.env` y completar:

```env
DATABASE_URL=postgresql+psycopg://usuario:contraseña@localhost:5432/foodstore
SECRET_KEY=cambia_esta_clave_secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Instalación y ejecución

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate   # Windows (Git Bash) — en Linux/Mac: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

> Las tablas se crean automáticamente al arrancar. El seed de admin, categorías y productos se ejecuta en el startup de la app.

### Seed inicial

| Campo      | Valor                 |
| :--------- | :-------------------- |
| Email      | `admin@foodstore.com` |
| Contraseña | `admin1234`           |
| Rol        | `admin`               |

---

## Frontend

### Tecnologías

- React 19, TypeScript, Vite, TailwindCSS
- Zustand, TanStack Query v5, TanStack Form, TanStack Table v8, Axios

### Variables de entorno

Copiar `frontend/.env.example` como `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

> Importante: usar `localhost` (no `127.0.0.1`) para que la cookie HttpOnly se envíe correctamente.

### Instalación y ejecución (desarrollo)

```bash
cd frontend
pnpm install
pnpm dev
```

La app queda disponible en `http://localhost:5173`.

### Build de producción

```bash
pnpm build
```

---

## Autor

Federico Panella — Tecnicatura Universitaria en Programación a Distancia (TUPaD)
