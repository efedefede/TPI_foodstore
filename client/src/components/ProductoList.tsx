import type { Producto } from "@/features/products";
import ProductoCard from "./ProductoCard";

interface Props {
  productos: Producto[];
}

export default function ProductoList({ productos }: Props) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">📋</span>
        <h2 className="text-lg font-bold text-gray-800">
          Productos ({productos.length})
        </h2>
      </div>

      {productos.length === 0 ? (
        <p className="text-gray-500 italic">No hay productos cargados.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((p) => (
            <ProductoCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </section>
  );
}
