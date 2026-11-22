import { useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import type { Ingrediente } from '@/features/ingredients'

interface Props {
  ingredientes: Ingrediente[]
  isAdmin: boolean
  onEditar: (ingrediente: Ingrediente) => void
  onEliminar: (id: number) => void
}

const columnHelper = createColumnHelper<Ingrediente>()

export default function IngredienteTable({ ingredientes, isAdmin, onEditar, onEliminar }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = [
    columnHelper.accessor('id', { header: 'ID', cell: (info) => info.getValue() }),
    columnHelper.accessor('nombre', {
      header: 'Nombre',
      cell: (info) => <span className="font-medium text-gray-900">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: (info) => (
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button
                onClick={() => onEditar(info.row.original)}
                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
              >
                Editar
              </button>
              <button
                onClick={() => onEliminar(info.row.original.id)}
                className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: ingredientes,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  })

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition select-none">
                  <div className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-100">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
        <span className="text-sm text-gray-600">Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}</span>
        <div className="flex gap-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100 transition">Anterior</button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100 transition">Siguiente</button>
        </div>
      </div>
    </div>
  )
}
