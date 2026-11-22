import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiInstance from '@/shared/api/axiosInstance'
import { useNotificationStore } from '@/store/notificationStore'
import { useAuth } from '@/features/auth'
import type { Producto, ProductoCreate, ProductoUpdate } from '../types/producto'

export function useProducts() {
  const queryClient = useQueryClient()
  const show = useNotificationStore((s) => s.showNotification)
  const { isAdmin } = useAuth()

  const { data: productos = [], isLoading, isError, error } = useQuery({
    queryKey: ['productos', isAdmin ? 'admin' : 'user'],
    queryFn: async () => {
      const { data } = await apiInstance.get<Producto[]>('/productos/?limit=50')
      return data
    },
  })

  const createProducto = useMutation({
    mutationFn: (payload: ProductoCreate) =>
      apiInstance.post<Producto>('/productos/', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      show('Producto creado')
    },
    onError: (e: Error) => show(e.message),
  })

  const updateProducto = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoUpdate }) =>
      apiInstance.patch<Producto>(`/productos/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      show('Producto actualizado')
    },
    onError: (e: Error) => show(e.message),
  })

  const desactivarProducto = useMutation({
    mutationFn: (id: number) =>
      apiInstance.patch<Producto>(`/productos/${id}/desactivar`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })  // invalida ambas keys (admin y user)
      show('Producto desactivado')
    },
    onError: (e: Error) => show(e.message),
  })

  return { productos, isLoading, isError, error, createProducto, updateProducto, desactivarProducto }
}
