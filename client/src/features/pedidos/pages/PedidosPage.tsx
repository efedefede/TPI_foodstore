import { useState } from 'react'
import { useAuth } from '@/features/auth'
import { usePedidos } from '../hooks/usePedidos'
import NuevoPedidoModal from '../components/NuevoPedidoModal'
import { Cargando, ErrorMsg, Vacio } from '@/shared/components/Estados'
import type { PedidoCreate, EstadoPedido, PedidoRead } from '../types/pedido'

const ESTADO_BADGE: Record<string, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  EN_PREPARACION: 'bg-blue-100 text-blue-700',
  ENTREGADO: 'bg-green-100 text-green-700',
  CANCELADO: 'bg-red-100 text-red-700',
}

const TRANSICIONES_ADMIN: Record<string, EstadoPedido[]> = {
  PENDIENTE: ['EN_PREPARACION', 'CANCELADO'],
  EN_PREPARACION: ['ENTREGADO', 'CANCELADO'],
}

const TRANSICIONES_USER: Record<string, EstadoPedido[]> = {
  PENDIENTE: ['CANCELADO'],
}

function PedidoRow({ pedido, isAdmin, onCambiarEstado }: {
  pedido: PedidoRead
  isAdmin: boolean
  onCambiarEstado: (id: number, estado: EstadoPedido) => void
}) {
  const [expandido, setExpandido] = useState(false)
  const transiciones = isAdmin ? TRANSICIONES_ADMIN[pedido.estado] ?? [] : TRANSICIONES_USER[pedido.estado] ?? []

  return (
    <>
      <tr
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => setExpandido((v) => !v)}
      >
        <td className="px-4 py-3 font-mono text-xs text-gray-500">#{pedido.id}</td>
        <td className="px-4 py-3 text-sm">{new Date(pedido.created_at).toLocaleDateString('es-AR')}</td>
        <td className="px-4 py-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_BADGE[pedido.estado] ?? ''}`}>
            {pedido.estado}
          </span>
        </td>
        <td className="px-4 py-3 text-sm">{pedido.forma_pago}</td>
        <td className="px-4 py-3 text-sm font-medium">${pedido.total.toFixed(2)}</td>
        <td className="px-4 py-3">
          <div className="flex gap-1 flex-wrap" onClick={(e) => e.stopPropagation()}>
            {transiciones.map((estado) => (
              <button
                key={estado}
                onClick={() => onCambiarEstado(pedido.id, estado)}
                className={`text-xs px-2 py-1 rounded font-medium transition ${
                  estado === 'CANCELADO'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                → {estado}
              </button>
            ))}
          </div>
        </td>
      </tr>
      {expandido && (
        <tr>
          <td colSpan={6} className="bg-gray-50 px-6 py-3">
            <p className="text-xs text-gray-500 mb-1">📍 {pedido.direccion_entrega}{pedido.notas ? ` · ${pedido.notas}` : ''}</p>
            <table className="text-xs w-full">
              <thead>
                <tr className="text-gray-500">
                  <th className="text-left pb-1">Producto</th>
                  <th className="text-right pb-1">Cant.</th>
                  <th className="text-right pb-1">Precio unit.</th>
                  <th className="text-right pb-1">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pedido.detalles.map((d) => (
                  <tr key={d.id}>
                    <td className="py-0.5">{d.nombre_producto}</td>
                    <td className="text-right">{d.cantidad}</td>
                    <td className="text-right">${d.precio_unitario.toFixed(2)}</td>
                    <td className="text-right font-medium">${d.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  )
}

export default function PedidosPage() {
  const { isAdmin } = useAuth()
  const { pedidos, isLoading, isError, error, crearPedido, cambiarEstado } = usePedidos()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [errorServidor, setErrorServidor] = useState<string | null>(null)

  function handleSubmit(data: PedidoCreate) {
    setErrorServidor(null)
    crearPedido.mutate(data, {
      onSuccess: () => setModalAbierto(false),
      onError: (e: Error) => setErrorServidor(e.message),
    })
  }

  function handleCambiarEstado(id: number, estado: EstadoPedido) {
    cambiarEstado.mutate({ id, estado })
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {isAdmin ? 'Gestión de Pedidos' : 'Mis Pedidos'}
        </h2>
        {!isAdmin && (
          <button
            onClick={() => { setErrorServidor(null); setModalAbierto(true) }}
            className="bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition"
          >
            + Nuevo Pedido
          </button>
        )}
      </div>

      {isLoading ? (
        <Cargando />
      ) : isError ? (
        <ErrorMsg mensaje={error instanceof Error ? error.message : 'Error'} />
      ) : pedidos.length === 0 ? (
        <Vacio mensaje={isAdmin ? 'No hay pedidos aún.' : 'Todavía no realizaste ningún pedido.'} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
                <th className="px-4 py-3 text-left font-medium">Pago</th>
                <th className="px-4 py-3 text-left font-medium">Total</th>
                <th className="px-4 py-3 text-left font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pedidos.map((p) => (
                <PedidoRow
                  key={p.id}
                  pedido={p}
                  isAdmin={isAdmin}
                  onCambiarEstado={handleCambiarEstado}
                />
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-1">Hacé clic en una fila para ver los detalles del pedido.</p>
        </div>
      )}

      <NuevoPedidoModal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onSubmit={handleSubmit}
        isSubmitting={crearPedido.isPending}
        errorServidor={errorServidor}
      />
    </section>
  )
}
