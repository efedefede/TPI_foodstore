import type { Categoria } from "@/features/categories";

interface Props {
  categoria: Categoria;
  onEditar: (categoria: Categoria) => void;
  onEliminar: (id: number) => void;
}

export default function CategoriaCard({
  categoria,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-100 flex flex-col gap-3">
      <div>
        <h3 className="text-base font-bold text-gray-800">
          {categoria.nombre}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{categoria.descripcion}</p>
        <span
          className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
            categoria.disponible
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {categoria.disponible ? "Disponible" : "No disponible"}
        </span>
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => onEditar(categoria)}
          className="flex-1 text-sm bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded hover:bg-yellow-200 transition"
        >
          Editar
        </button>
        <button
          onClick={() => onEliminar(categoria.id)}
          className="flex-1 text-sm bg-red-100 text-red-800 px-3 py-1.5 rounded hover:bg-red-200 transition"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
