import { useState } from 'react'
import { useAuth } from '@/features/auth'
import { useCategories } from '@/features/categories'
import type { Categoria, CategoriaCreate } from '@/features/categories'
import CategoriaTable from '../components/CategoriaTable'
import CategoriaModal from '../components/CategoriaModal'
import { Cargando, ErrorMsg, Vacio } from '@/shared/components/Estados'

export default function CategoriasPage() {
  const { isAdmin } = useAuth()
  const { categorias, isLoading, isError, error, createCategoria, updateCategoria, desactivarCategoria } = useCategories()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null)
  const [errorServidor, setErrorServidor] = useState<string | null>(null)

  function abrirModalCrear() { setErrorServidor(null); setCategoriaEditar(null); setModalAbierto(true) }
  function abrirModalEditar(categoria: Categoria) { setErrorServidor(null); setCategoriaEditar(categoria); setModalAbierto(true) }
  function cerrarModal() { setModalAbierto(false); setCategoriaEditar(null); setErrorServidor(null) }

  function handleSubmit(data: CategoriaCreate) {
    setErrorServidor(null)
    if (categoriaEditar) {
      updateCategoria.mutate({ id: categoriaEditar.id, data }, { onSuccess: cerrarModal, onError: (e: Error) => setErrorServidor(e.message) })
    } else {
      createCategoria.mutate(data, { onSuccess: cerrarModal, onError: (e: Error) => setErrorServidor(e.message) })
    }
  }

  function handleEliminar(id: number) {
    if (!confirm('¿Desactivar esta categoría?')) return
    desactivarCategoria.mutate(id)
  }

  const isSubmitting = createCategoria.isPending || updateCategoria.isPending

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Categorías</h2>
        {isAdmin && (
          <button onClick={abrirModalCrear} className="bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition">
            + Nueva Categoría
          </button>
        )}
      </div>

      {isLoading ? (
        <Cargando />
      ) : isError ? (
        <ErrorMsg mensaje={error instanceof Error ? error.message : 'Error al cargar'} />
      ) : categorias.length === 0 ? (
        <Vacio mensaje="No hay categorías cargadas aún." />
      ) : (
        <CategoriaTable
          categorias={categorias}
          onEditar={isAdmin ? abrirModalEditar : undefined}
          onEliminar={isAdmin ? handleEliminar : undefined}
        />
      )}

      <CategoriaModal
        key={categoriaEditar ? `edit-${categoriaEditar.id}` : 'crear'}
        abierto={modalAbierto}
        categoriaEditar={categoriaEditar}
        onCerrar={cerrarModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        errorServidor={errorServidor}
      />
    </section>
  )
}
