export default function ProductoForm() {
  return (
    <section className="bg-white rounded-lg shadow p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">➕</span>
        <h2 className="text-lg font-bold text-gray-800">Nuevo Producto</h2>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            placeholder="Ej: Auriculares Bluetooth"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio ($)
          </label>
          <input
            type="number"
            placeholder="Ej: 99.00"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <input
            type="text"
            placeholder="Ej: Electrónica"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            className="bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition"
          >
            Guardar producto
          </button>
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300 transition"
          >
            Ejemplo onClick
          </button>
        </div>
      </form>
    </section>
  );
}
