import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { useThemeStore } from '@/store/themeStore'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { darkMode, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded text-sm font-medium transition ${isActive ? 'bg-white text-blue-700' : 'text-white hover:bg-blue-600'}`

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/categorias" className="flex items-center gap-3">
          <span className="text-2xl">🏷️</span>
          <div>
            <h1 className="text-xl font-bold leading-tight">Gestión</h1>
            <p className="text-xs text-blue-200">TP Integrador · React + TS + FastAPI</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="text-white hover:bg-blue-600 px-2 py-1.5 rounded transition text-sm"
            title={darkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {user ? (
            <>
              <NavLink to="/categorias" className={linkClass}>Categorías</NavLink>
              <NavLink to="/productos" className={linkClass}>Productos</NavLink>
              <NavLink to="/pedidos" className={linkClass}>Pedidos</NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin/usuarios" className={linkClass}>Usuarios</NavLink>
              )}

              <div className="ml-3 flex items-center gap-3 pl-3 border-l border-blue-500">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium leading-tight">{user.full_name}</p>
                  <p className="text-xs text-blue-200">{user.role}</p>
                </div>
                <button onClick={handleLogout} className="text-xs bg-white text-blue-700 px-3 py-1.5 rounded font-medium hover:bg-blue-50 transition">
                  Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            <NavLink to="/login" className={linkClass}>Iniciar sesión</NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}
