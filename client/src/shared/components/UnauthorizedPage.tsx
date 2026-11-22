import { Link } from 'react-router-dom'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-2">403</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Acceso denegado</h2>
        <p className="text-gray-600 mb-6">No tenés permisos para acceder a esta sección.</p>
        <Link to="/categorias" className="bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
