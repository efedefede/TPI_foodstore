import { useForm } from '@tanstack/react-form'
import type { Ingrediente, IngredienteCreate } from '@/features/ingredients'

interface Props {
  abierto: boolean
  ingredienteEditar: Ingrediente | null
  onCerrar: () => void
  onSubmit: (data: IngredienteCreate) => void
  isSubmitting: boolean
  errorServidor: string | null
}

export default function IngredienteModal({ abierto, ingredienteEditar, onCerrar, onSubmit, isSubmitting, errorServidor }: Props) {
  const form = useForm({
    defaultValues: { nombre: ingredienteEditar?.nombre ?? '' },
    onSubmit: async ({ value }) => { onSubmit(value) },
  })

  if (!abierto) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {ingredienteEditar ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
        </h2>

        {errorServidor && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">{errorServidor}</div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }} className="space-y-4">
          <form.Field
            name="nombre"
            validators={{ onChange: ({ value }) => !value.trim() ? 'El nombre es obligatorio' : undefined }}
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                {field.state.meta.errors.length > 0 && <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(', ')}</p>}
              </div>
            )}
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCerrar} disabled={isSubmitting} className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300 transition disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition disabled:opacity-50">
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
