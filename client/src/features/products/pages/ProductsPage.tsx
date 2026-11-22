import { useState } from 'react'
import { useAuth } from '@/features/auth'
import { useProducts } from '@/features/products'
import type { Producto, ProductoCreate } from '@/features/products'
import ProductoTable from '../components/ProductoTable'
import ProductoModal from '../components/ProductoModal'
import { Cargando, ErrorMsg, Vacio } from '@/shared/components/Estados'

export default function ProductsPage() {
  const { isAdmin } = useAuth()
  const { productos, isLoading, isError, error, createProducto, updateProducto, desactivarProducto } = useProducts()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null)
  const [errorServidor, setErrorServidor] = useState<string | null>(null)

  function abrirModalCrear() { setErrorServidor(null); setProductoEditar(null); setModalAbierto(true) }
  function abrirModalEditar(prod: Producto) { setErrorServidor(null); setProductoEditar(prod); setModalAbierto(true) }
  function cerrarModal() { setModalAbierto(false); setProductoEditar(null); setErrorServidor(null) }

  function handleSubmit(data: ProductoCreate) {
    setErrorServidor(null)
    if (productoEditar) {
      updateProducto.mutate({ id: productoEditar.id, data }, { onSuccess: cerrarModal, onError: (e: Error) => setErrorServidor(e.message) })
    } else {
      createProducto.mutate(data, { onSuccess: cerrarModal, onError: (e: Error) => setErrorServidor(e.message) })
    }
  }

  function handleDesactivar(id: number) {
    if (!confirm('¿Desactivar este producto?')) return
    desactivarProducto.mutate(id)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
        {isAdmin && (
          <button onClick={abrirModalCrear} className="bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition">
            + Nuevo Producto
          </button>
        )}
      </div>

      {isLoading ? (
        <Cargando />
      ) : isError ? (
        <ErrorMsg mensaje={error instanceof Error ? error.message : 'Error'} />
      ) : productos.length === 0 ? (
        <Vacio mensaje="No hay productos cargados." />
      ) : (
        <ProductoTable
          productos={productos}
          onEditar={isAdmin ? abrirModalEditar : undefined}
          onEliminar={isAdmin ? handleDesactivar : undefined}
        />
      )}

      <ProductoModal
        key={productoEditar ? `edit-${productoEditar.id}` : 'crear'}
        abierto={modalAbierto}
        productoEditar={productoEditar}
        onCerrar={cerrarModal}
        onSubmit={handleSubmit}
        isSubmitting={createProducto.isPending || updateProducto.isPending}
        errorServidor={errorServidor}
      />
    </section>
  )
}
