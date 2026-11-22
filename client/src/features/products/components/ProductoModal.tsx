import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import apiInstance from '@/shared/api/axiosInstance'
import type { Categoria } from '@/features/categories'
import type { Producto, ProductoCreate } from '@/features/products'

interface Props {
  abierto: boolean
  productoEditar: Producto | null
  onCerrar: () => void
  onSubmit: (data: ProductoCreate) => void
  isSubmitting: boolean
  errorServidor: string | null
}

export default function ProductoModal({ abierto, productoEditar, onCerrar, onSubmit, isSubmitting, errorServidor }: Props) {
  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias-select'],
    queryFn: async () => {
      const { data } = await apiInstance.get<Categoria[]>('/categorias/?limit=50')
      return data.filter((c) => c.activo)
    },
    enabled: abierto,
  })

  const form = useForm({
    defaultValues: {
      categoria_id: productoEditar?.categoria_id ?? 0,
      nombre: productoEditar?.nombre ?? '',
      descripcion: productoEditar?.descripcion ?? '',
      precio_base: productoEditar?.precio_base ?? 0,
      imagen_url: productoEditar?.imagen_url ?? '',
      disponible: productoEditar?.disponible ?? true,
      stock: productoEditar?.stock ?? 0,
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        ...value,
        descripcion: value.descripcion || undefined,
        imagen_url: value.imagen_url || undefined,
      })
    },
  })

  if (!abierto) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 my-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {productoEditar ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>

        {errorServidor && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">{errorServidor}</div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="md:col-span-2">
              <form.Field name="categoria_id" validators={{ onChange: ({ value }) => value === 0 ? 'Seleccioná una categoría' : undefined }}>
                {(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>— Seleccionar —</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                    {field.state.meta.errors.length > 0 && <p className="text-red-500 text-xs mt-1">{field.state.meta.errors[0]}</p>}
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="nombre" validators={{ onChange: ({ value }) => !value.trim() ? 'Requerido' : undefined }}>
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                  {field.state.meta.errors.length > 0 && <p className="text-red-500 text-xs mt-1">{field.state.meta.errors[0]}</p>}
                </div>
              )}
            </form.Field>

            <form.Field name="precio_base" validators={{ onChange: ({ value }) => value < 0 ? 'Debe ser ≥ 0' : undefined }}>
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Base ($)</label>
                  <input type="number" min="0" step="0.01" value={field.state.value} onChange={(e) => field.handleChange(Number(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                  {field.state.meta.errors.length > 0 && <p className="text-red-500 text-xs mt-1">{field.state.meta.errors[0]}</p>}
                </div>
              )}
            </form.Field>

            <div className="md:col-span-2">
              <form.Field name="descripcion">
                {(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <input type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                )}
              </form.Field>
            </div>

            <div className="md:col-span-2">
              <form.Field name="imagen_url">
                {(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
                    <input type="url" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="stock">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" min="0" value={field.state.value} onChange={(e) => field.handleChange(Number(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
            </form.Field>

            <form.Field name="disponible">
              {(field) => (
                <div className="flex items-center gap-2 mt-6">
                  <input type="checkbox" id="disponible-prod" checked={field.state.value} onChange={(e) => field.handleChange(e.target.checked)} className="h-4 w-4" />
                  <label htmlFor="disponible-prod" className="text-sm text-gray-700">Disponible para la venta</label>
                </div>
              )}
            </form.Field>
          </div>

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
