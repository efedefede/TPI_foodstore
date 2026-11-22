import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import apiInstance from '@/shared/api/axiosInstance'
import type { Producto } from '@/features/products'
import type { PedidoCreate, DetallePedidoCreate, FormaPago } from '../types/pedido'

interface ItemCarrito extends DetallePedidoCreate {
  nombre: string
  precio_base: number
}

interface Props {
  abierto: boolean
  onCerrar: () => void
  onSubmit: (data: PedidoCreate) => void
  isSubmitting: boolean
  errorServidor: string | null
}

export default function NuevoPedidoModal({ abierto, onCerrar, onSubmit, isSubmitting, errorServidor }: Props) {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [formaPago, setFormaPago] = useState<FormaPago>('EFECTIVO')
  const [direccion, setDireccion] = useState('')
  const [notas, setNotas] = useState('')
  const [cantidades, setCantidades] = useState<Record<number, number>>({})

  const { data: productos = [] } = useQuery({
    queryKey: ['productos-pedido'],
    queryFn: async () => {
      const { data } = await apiInstance.get<Producto[]>('/productos/?limit=50')
      return data.filter((p) => p.activo && p.disponible && p.stock > 0)
    },
    enabled: abierto,
  })

  function agregarAlCarrito(producto: Producto) {
    const cantidad = cantidades[producto.id] ?? 1
    setCarrito((prev) => {
      const existe = prev.find((i) => i.producto_id === producto.id)
      if (existe) {
        return prev.map((i) => i.producto_id === producto.id ? { ...i, cantidad } : i)
      }
      return [...prev, { producto_id: producto.id, cantidad, nombre: producto.nombre, precio_base: producto.precio_base }]
    })
  }

  function quitarDelCarrito(producto_id: number) {
    setCarrito((prev) => prev.filter((i) => i.producto_id !== producto_id))
  }

  const total = carrito.reduce((acc, i) => acc + i.precio_base * i.cantidad, 0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (carrito.length === 0) return
    onSubmit({
      forma_pago: formaPago,
      direccion_entrega: direccion,
      notas: notas || undefined,
      detalles: carrito.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
    })
  }

  if (!abierto) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 my-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Nuevo Pedido</h2>

        {errorServidor && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">{errorServidor}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Productos disponibles */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Productos disponibles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-2">
              {productos.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2 border rounded px-3 py-2 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{p.nombre}</p>
                    <p className="text-gray-500 text-xs">${p.precio_base.toFixed(2)} · stock: {p.stock}</p>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={p.stock}
                    value={cantidades[p.id] ?? 1}
                    onChange={(e) => setCantidades((prev) => ({ ...prev, [p.id]: Number(e.target.value) }))}
                    className="w-14 border rounded px-1 py-1 text-xs text-center"
                  />
                  <button
                    type="button"
                    onClick={() => agregarAlCarrito(p)}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Carrito */}
          {carrito.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Carrito</h3>
              <div className="space-y-1">
                {carrito.map((item) => (
                  <div key={item.producto_id} className="flex items-center justify-between text-sm border-b pb-1">
                    <span>{item.nombre} × {item.cantidad}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">${(item.precio_base * item.cantidad).toFixed(2)}</span>
                      <button type="button" onClick={() => quitarDelCarrito(item.producto_id)} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                    </div>
                  </div>
                ))}
                <p className="text-right font-bold text-gray-800 pt-1">Total: ${total.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Datos del pedido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Forma de pago</label>
              <select
                value={formaPago}
                onChange={(e) => setFormaPago(e.target.value as FormaPago)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de entrega</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
                minLength={5}
                maxLength={200}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="Av. Siempre Viva 123"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
              <input
                type="text"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="Sin cebolla, sin TACC..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCerrar} disabled={isSubmitting} className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300 transition disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting || carrito.length === 0} className="bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition disabled:opacity-50">
              {isSubmitting ? 'Enviando...' : `Confirmar pedido ($${total.toFixed(2)})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
