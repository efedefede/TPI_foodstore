import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiInstance from '@/shared/api/axiosInstance'
import { useNotificationStore } from '@/store/notificationStore'
import type { PedidoCreate, PedidoRead, EstadoPedido } from '../types/pedido'

export function usePedidos() {
  const queryClient = useQueryClient()
  const show = useNotificationStore((s) => s.showNotification)

  const { data: pedidos = [], isLoading, isError, error } = useQuery({
    queryKey: ['pedidos'],
    queryFn: async () => {
      const { data } = await apiInstance.get<PedidoRead[]>('/pedidos/?limit=50')
      return data
    },
  })

  const crearPedido = useMutation({
    mutationFn: (payload: PedidoCreate) =>
      apiInstance.post<PedidoRead>('/pedidos/', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      show('Pedido creado correctamente')
    },
    onError: (e: Error) => show(e.message),
  })

  const cambiarEstado = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) =>
      apiInstance.patch<PedidoRead>(`/pedidos/${id}/estado`, { estado }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      show('Estado actualizado')
    },
    onError: (e: Error) => show(e.message),
  })

  return { pedidos, isLoading, isError, error, crearPedido, cambiarEstado }
}
