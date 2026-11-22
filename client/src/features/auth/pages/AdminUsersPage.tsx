import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiInstance from '@/shared/api/axiosInstance'
import type { UserAdminItem } from '@/features/auth'
import { Cargando, ErrorMsg, Vacio } from '@/shared/components/Estados'

async function fetchUsuarios(): Promise<UserAdminItem[]> {
  const { data } = await apiInstance.get<UserAdminItem[]>('/api/v1/auth/admin/usuarios')
  return data
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient()

  const { data: usuarios = [], isLoading, isError, error } = useQuery({
    queryKey: ['admin-usuarios'],
    queryFn: fetchUsuarios,
  })

  const activarMutation = useMutation({
    mutationFn: (id: number) =>
      apiInstance.post(`/api/v1/auth/admin/usuarios/${id}/activar`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] }),
    onError: (e: Error) => alert(e.message),
  })

  const desactivarMutation = useMutation({
    mutationFn: (id: number) =>
      apiInstance.post(`/api/v1/auth/admin/usuarios/${id}/desactivar`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] }),
    onError: (e: Error) => alert(e.message),
  })

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Gestión de usuarios</h2>

      {isLoading ? (
        <Cargando />
      ) : isError ? (
        <ErrorMsg mensaje={error instanceof Error ? error.message : 'Error al cargar'} />
      ) : usuarios.length === 0 ? (
        <Vacio mensaje="No hay usuarios registrados." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Usuario</th>
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Rol</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
                <th className="px-4 py-3 text-left font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{u.username}</td>
                  <td className="px-4 py-3">{u.full_name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${!u.disabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {!u.disabled ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!u.disabled ? (
                      <button
                        onClick={() => desactivarMutation.mutate(u.id)}
                        disabled={desactivarMutation.isPending}
                        className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition disabled:opacity-50"
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => activarMutation.mutate(u.id)}
                        disabled={activarMutation.isPending}
                        className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition disabled:opacity-50"
                      >
                        Activar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
