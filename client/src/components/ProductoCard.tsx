import type { Producto } from "@/features/products";

interface Props {
  producto: Producto;
}

export default function ProductoCard({ producto }: Props) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition p-4 border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800">
        {producto.nombre}
      </h3>
      <p className="text-sm text-gray-500 mt-1">{producto.descripcion}</p>
      <p className="text-lg font-bold text-blue-700 mt-3">
        ${Number(producto.precio_base).toFixed(2)}
      </p>
    </div>
  );
}
