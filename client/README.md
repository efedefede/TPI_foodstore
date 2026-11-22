# Frontend - TP Integrador Unidad 10 (Arquitectura por Features)

Aplicación SPA desarrollada con React, TypeScript y Vite. Implementa una arquitectura **por features (vertical slice)** donde cada funcionalidad agrupa sus propias páginas, componentes, hooks y tipos, facilitando la escalabilidad y el mantenimiento.

## Tecnologías

- **React Router DOM** — Enrutamiento SPA.
- **Axios** — Cliente HTTP con interceptores y `withCredentials`.
- **Zustand** — Estado global del usuario autenticado y del tema (dark mode).
- **TanStack Query (v5)** — Estado del servidor (`useQuery`, `useMutation`).
- **TanStack Form** — Formularios tipados (login, registro, CRUD).
- **TanStack Table (v8)** — Tablas con ordenamiento y paginación.
- **Tailwind CSS** — Estilos utilitarios con soporte `darkMode: 'class'`.

## Estructura del proyecto

```text
client/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── LoginForm.tsx       # Formulario de login (TanStack Form)
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts          # Selector sobre authStore
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   └── AdminUsersPage.tsx  # Solo admin: activar/desactivar usuarios
│   │   │   ├── store/
│   │   │   │   └── authStore.ts        # Zustand (login, logout, checkAuth)
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts
│   │   │   └── index.ts                # Barrel export
│   │   ├── categories/
│   │   │   ├── components/
│   │   │   │   ├── CategoriaTable.tsx
│   │   │   │   └── CategoriaModal.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useCategories.ts
│   │   │   ├── pages/
│   │   │   │   └── CategoriasPage.tsx
│   │   │   ├── types/
│   │   │   │   └── categoria.ts
│   │   │   └── index.ts
│   │   ├── products/
│   │   │   ├── components/
│   │   │   │   ├── ProductoTable.tsx
│   │   │   │   └── ProductoModal.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useProducts.ts      # Query key diferenciada por rol (admin/user)
│   │   │   ├── pages/
│   │   │   │   └── ProductsPage.tsx
│   │   │   ├── types/
│   │   │   │   └── producto.ts
│   │   │   └── index.ts
│   │   ├── pedidos/
│   │   │   ├── components/
│   │   │   │   └── NuevoPedidoModal.tsx
│   │   │   ├── hooks/
│   │   │   │   └── usePedidos.ts
│   │   │   ├── pages/
│   │   │   │   └── PedidosPage.tsx
│   │   │   ├── types/
│   │   │   │   └── pedido.ts
│   │   │   └── index.ts
│   │   └── ingredients/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── pages/
│   │       ├── types/
│   │       └── index.ts
│   ├── shared/
│   │   ├── api/
│   │   │   ├── axiosInstance.ts        # Instancia Axios con withCredentials
│   │   │   ├── setupInterceptors.ts    # Interceptor 401 → logout
│   │   │   └── index.ts
│   │   └── components/
│   │       ├── ProtectedRoute.tsx      # Protege por sesión y por rol
│   │       ├── Navbar.tsx
│   │       ├── Toast.tsx
│   │       ├── UnauthorizedPage.tsx
│   │       ├── Estados.tsx
│   │       └── index.ts
│   ├── store/
│   │   ├── notificationStore.ts
│   │   └── themeStore.ts               # Zustand (darkMode toggle)
│   ├── routes/
│   │   └── AppRouter.tsx               # Rutas públicas y protegidas (Outlet)
│   ├── App.tsx                         # Aplica clase 'dark' al <html> según themeStore
│   ├── main.tsx
│   └── index.css
├── .env                                # VITE_API_URL=http://localhost:8000
├── .env.example
├── package.json
└── vite.config.ts
```

## Instalación y ejecución

1. Instalar dependencias:

   ```bash
   pnpm install
   ```

2. Configurar variables de entorno:
   - Copiar `.env.example` como `.env`.
   - `VITE_API_URL` debe usar `localhost` (no `127.0.0.1`) para que la cookie HttpOnly se envíe correctamente.

3. Levantar el servidor de desarrollo:

   ```bash
   pnpm dev
   ```

La aplicación queda disponible en `http://localhost:5173`.

## Rutas

| Ruta              | Página             | Acceso                  |
| :---------------- | :----------------- | :---------------------- |
| `/login`          | LoginPage          | Pública                 |
| `/register`       | RegisterPage       | Pública                 |
| `/unauthorized`   | UnauthorizedPage   | Pública                 |
| `/categorias`     | CategoriasPage     | Cualquier sesión activa |
| `/productos`      | ProductsPage       | Cualquier sesión activa |
| `/pedidos`        | PedidosPage        | Cualquier sesión activa |
| `/ingredientes`   | IngredientesPage   | Cualquier sesión activa |
| `/admin/usuarios` | AdminUsersPage     | Solo rol `admin`        |

## Comportamiento de autenticación

- Al iniciar la app se llama a `GET /api/v1/auth/me` para confirmar la sesión existente; `checking: true` en el store evita que `ProtectedRoute` redirija antes de que termine.
- El JWT viaja en una cookie HttpOnly; el frontend nunca lo lee ni lo guarda.
- El interceptor de Axios detecta respuestas `401` y limpia el `authStore`, redirigiendo al login.
- El rol del usuario es un campo plano (`role: "admin" | "user"`); la protección por rol se evalúa en `ProtectedRoute` con `allowedRoles`.

## Dark mode

- Zustand `themeStore` persiste la preferencia en `localStorage`.
- `App.tsx` aplica/retira la clase `dark` del elemento `<html>` vía `useEffect`.
- Tailwind está configurado con `darkMode: 'class'`.

## Autor

Federico Panella — Tecnicatura Universitaria en Programación a Distancia (TUPaD)
