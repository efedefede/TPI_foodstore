export function Cargando() {
  return <div className="p-8 text-center text-gray-500 italic">Cargando datos...</div>
}

export function ErrorMsg({ mensaje }: { mensaje: string }) {
  return <div className="p-4 bg-red-100 text-red-800 rounded-lg text-sm">Error: {mensaje}</div>
}

export function Vacio({ mensaje = 'No hay registros para mostrar.' }: { mensaje?: string }) {
  return <div className="p-8 text-center text-gray-500">{mensaje}</div>
}
