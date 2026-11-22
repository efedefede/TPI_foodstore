import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiInstance from '@/shared/api/axiosInstance'
import { useNotificationStore } from '@/store/notificationStore'
import type { Ingrediente, IngredienteCreate } from '../types/ingrediente'

export function useIngredients() {
  const queryClient = useQueryClient()
  const show = useNotificationStore((s) => s.showNotification)

  const { data: ingredientes = [], isLoading, isError, error } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: async () => {
      const { data } = await apiInstance.get<Ingrediente[]>('/ingredientes/')
      return data
    },
  })

  const createIngrediente = useMutation({
    mutationFn: (payload: IngredienteCreate) =>
      apiInstance.post<Ingrediente>('/ingredientes/', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      show('Ingrediente creado')
    },
    onError: (e: Error) => show(e.message),
  })

  const updateIngrediente = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredienteCreate }) =>
      apiInstance.put<Ingrediente>(`/ingredientes/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      show('Ingrediente actualizado')
    },
    onError: (e: Error) => show(e.message),
  })

  const deleteIngrediente = useMutation({
    mutationFn: (id: number) =>
      apiInstance.delete(`/ingredientes/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      show('Ingrediente eliminado')
    },
    onError: (e: Error) => show(e.message),
  })

  return { ingredientes, isLoading, isError, error, createIngrediente, updateIngrediente, deleteIngrediente }
}
