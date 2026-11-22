import type { Categoria } from "@/features/categories";
import CategoriaCard from "./CategoriaCard";

interface Props {
  categorias: Categoria[];
  onEditar: (categoria: Categoria) => void;
  onEliminar: (id: number) => void;
}

export default function CategoriaList({
  categorias,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">📋</span>
        <h2 className="text-lg font-bold text-gray-800">
          Categorías ({categorias.length})
        </h2>
      </div>

      {categorias.length === 0 ? (
        <p className="text-gray-500 italic">No hay categorías cargadas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias.map((c) => (
            <CategoriaCard
              key={c.id}
              categoria={c}
              onEditar={onEditar}
              onEliminar={onEliminar}
            />
          ))}
        </div>
      )}
    </section>
  );
}
