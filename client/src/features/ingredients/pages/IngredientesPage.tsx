import { useState } from 'react'
import { useAuth } from '@/features/auth'
import { useIngredients } from '@/features/ingredients'
import type { Ingrediente, IngredienteCreate } from '@/features/ingredients'
import IngredienteTable from '../components/IngredienteTable'
import IngredienteModal from '../components/IngredienteModal'
import { Cargando, ErrorMsg, Vacio } from '@/shared/components/Estados'

export default function IngredientesPage() {
  const { isAdmin } = useAuth()
  const { ingredientes, isLoading, isError, error, createIngrediente, updateIngrediente, deleteIngrediente } = useIngredients()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [ingredienteEditar, setIngredienteEditar] = useState<Ingrediente | null>(null)
  const [errorServidor, setErrorServidor] = useState<string | null>(null)

  function abrirModalCrear() { setErrorServidor(null); setIngredienteEditar(null); setModalAbierto(true) }
  function abrirModalEditar(ing: Ingrediente) { setErrorServidor(null); setIngredienteEditar(ing); setModalAbierto(true) }
  function cerrarModal() { setModalAbierto(false); setIngredienteEditar(null); setErrorServidor(null) }

  function handleSubmit(data: IngredienteCreate) {
    setErrorServidor(null)
    if (ingredienteEditar) {
      updateIngrediente.mutate({ id: ingredienteEditar.id, data }, { onSuccess: cerrarModal, onError: (e: Error) => setErrorServidor(e.message) })
    } else {
      createIngrediente.mutate(data, { onSuccess: cerrarModal, onError: (e: Error) => setErrorServidor(e.message) })
    }
  }

  function handleEliminar(id: number) {
    if (!confirm('¿Eliminar este ingrediente?')) return
    deleteIngrediente.mutate(id)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Ingredientes</h2>
        {isAdmin && (
          <button onClick={abrirModalCrear} className="bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition">
            + Nuevo Ingrediente
          </button>
        )}
      </div>

      {isLoading ? (
        <Cargando />
      ) : isError ? (
        <ErrorMsg mensaje={error instanceof Error ? error.message : 'Error'} />
      ) : ingredientes.length === 0 ? (
        <Vacio mensaje="No hay ingredientes cargados." />
      ) : (
        <IngredienteTable
          ingredientes={ingredientes}
          isAdmin={isAdmin}
          onEditar={abrirModalEditar}
          onEliminar={handleEliminar}
        />
      )}

      <IngredienteModal
        key={ingredienteEditar ? `edit-${ingredienteEditar.id}` : 'crear'}
        abierto={modalAbierto}
        ingredienteEditar={ingredienteEditar}
        onCerrar={cerrarModal}
        onSubmit={handleSubmit}
        isSubmitting={createIngrediente.isPending || updateIngrediente.isPending}
        errorServidor={errorServidor}
      />
    </section>
  )
}
