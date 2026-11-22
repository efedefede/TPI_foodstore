export interface Producto {
  id: number
  categoria_id: number
  nombre: string
  descripcion: string | null
  precio_base: number
  imagen_url: string | null
  stock: number
  disponible: boolean
  activo: boolean
}

export interface ProductoCreate {
  categoria_id: number
  nombre: string
  descripcion?: string
  precio_base: number
  imagen_url?: string
  stock: number
  disponible: boolean
}

export interface ProductoUpdate {
  categoria_id?: number
  nombre?: string
  descripcion?: string
  precio_base?: number
  imagen_url?: string
  stock?: number
  disponible?: boolean
}
