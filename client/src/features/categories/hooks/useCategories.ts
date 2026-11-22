import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiInstance from '@/shared/api/axiosInstance'
import { useNotificationStore } from '@/store/notificationStore'
import type { Categoria, CategoriaCreate } from '../types/categoria'

export function useCategories() {
  const queryClient = useQueryClient()
  const show = useNotificationStore((s) => s.showNotification)

  const { data: categorias = [], isLoading, isError, error } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data } = await apiInstance.get<Categoria[]>('/categorias/')
      return data
    },
  })

  const createCategoria = useMutation({
    mutationFn: (payload: CategoriaCreate) =>
      apiInstance.post<Categoria>('/categorias/', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      show('Categoría creada')
    },
    onError: (e: Error) => show(e.message),
  })

  const updateCategoria = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaCreate }) =>
      apiInstance.put<Categoria>(`/categorias/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      show('Categoría actualizada')
    },
    onError: (e: Error) => show(e.message),
  })

  const desactivarCategoria = useMutation({
    mutationFn: (id: number) =>
      apiInstance.patch<Categoria>(`/categorias/${id}/desactivar`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      show('Categoría desactivada')
    },
    onError: (e: Error) => show(e.message),
  })

  return { categorias, isLoading, isError, error, createCategoria, updateCategoria, desactivarCategoria }
}
