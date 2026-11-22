export type EstadoPedido = 'PENDIENTE' | 'EN_PREPARACION' | 'ENTREGADO' | 'CANCELADO'
export type FormaPago = 'EFECTIVO' | 'TRANSFERENCIA'

export interface DetallePedidoCreate {
  producto_id: number
  cantidad: number
}

export interface DetallePedidoRead {
  id: number
  producto_id: number
  nombre_producto: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface PedidoCreate {
  forma_pago: FormaPago
  direccion_entrega: string
  notas?: string
  detalles: DetallePedidoCreate[]
}

export interface PedidoRead {
  id: number
  usuario_id: number
  estado: EstadoPedido
  forma_pago: FormaPago
  direccion_entrega: string
  notas: string | null
  total: number
  created_at: string
  updated_at: string
  detalles: DetallePedidoRead[]
}
