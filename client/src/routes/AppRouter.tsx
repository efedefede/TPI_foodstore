import { Outlet, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/shared/components/ProtectedRoute'
import Navbar from '@/shared/components/Navbar'
import UnauthorizedPage from '@/shared/components/UnauthorizedPage'
import { LoginPage, RegisterPage, AdminUsersPage } from '@/features/auth'
import { CategoriasPage } from '@/features/categories'
import { ProductsPage } from '@/features/products'
import { PedidosPage } from '@/features/pedidos'

function Layout() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </>
  )
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Rutas protegidas (cualquier usuario autenticado) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
        </Route>
      </Route>

      {/* Rutas de admin */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<Layout />}>
          <Route path="/admin/usuarios" element={<AdminUsersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<LoginPage />} />
    </Routes>
  )
}
