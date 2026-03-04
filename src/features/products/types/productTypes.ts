// Posibles estados del producto 
export type ProductStatus = 'draft' | 'active' | 'archived' | 'out_of_stock' | 'discontinued';

// Imagen de producto
export interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  product_id: number;
  created_at: string; // ISO date string
}

// Variante de producto 
export interface ProductVariant {
  id: number;
  sku: string | null;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  price: number | null;                   // Precio específico de la variante
  compare_price: number | null;
  quantity: number;
  product_id: number;
  created_at: string;
  updated_at: string | null;
}

// Producto principal 
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  base_price: number;
  compare_price: number | null;
  cost_price: number | null;
  sku: string | null;
  barcode: string | null;
  track_quantity: boolean;
  quantity: number;
  low_stock_threshold: number;
  is_on_sale: boolean;
  sale_price: number | null;
  sale_start_date: string | null; // ISO date
  sale_end_date: string | null;   // ISO date
  category_id: number | null;
  business_id: number;
  status: ProductStatus;
  is_featured: boolean;
  is_digital: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string | null;

//   // Relaciones ???? (puede que mas adelante las ponga en un json)
   images?: ProductImage[];
   variants?: ProductVariant[];
}


// Para listas paginadas, normalmente no se envían todas las relaciones
// para optimizar la respuesta. Aquí definimos un tipo más liviano.
export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  base_price: number;
  compare_price: number | null;
  is_on_sale: boolean;
  sale_price: number | null;
  status: ProductStatus;
  is_featured: boolean;
  category_id: number | null;
  business_id: number;
  created_at: string;
  // Podemos incluir la imagen principal para mostrarla rápido
  images?: string;
  variant_count?: number;    // Número de variantes (útil para inventario)
}


// Crear un producto (todos los campos obligatorios según la tabla)
export interface ProductCreate {
  name: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  base_price: number;
  compare_price?: number | null;
  cost_price?: number | null;
  sku?: string | null;
  barcode?: string | null;
  track_quantity?: boolean;      // Por defecto false
  quantity?: number;             // Por defecto 0
  low_stock_threshold?: number;  // Por defecto 5
  is_on_sale?: boolean;          // Por defecto false
  sale_price?: number | null;
  sale_start_date?: string | null;
  sale_end_date?: string | null;
  category_id?: number | null;
  business_id: number;
  status?: ProductStatus;        // Por defecto 'draft'
  is_featured?: boolean;         // Por defecto false
  is_digital?: boolean;          // Por defecto false
  meta_title?: string | null;
  meta_description?: string | null;

  // Opcional: podemos permitir enviar variantes e imágenes en la misma creación
  variants?: Omit<ProductVariant, 'id' | 'product_id' | 'created_at' | 'updated_at'>[];
  images?: Omit<ProductImage, 'id' | 'product_id' | 'created_at'>[];
}

// Actualizar producto 
export interface ProductUpdate {
  name?: string;
  slug?: string;
  description?: string | null;
  short_description?: string | null;
  base_price?: number;
  compare_price?: number | null;
  cost_price?: number | null;
  sku?: string | null;
  barcode?: string | null;
  track_quantity?: boolean;
  quantity?: number;
  low_stock_threshold?: number;
  is_on_sale?: boolean;
  sale_price?: number | null;
  sale_start_date?: string | null;
  sale_end_date?: string | null;
  category_id?: number | null;
  // business_id?: number;          // Raramente se cambia, pero podría
  status?: ProductStatus;
  is_featured?: boolean;
  is_digital?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;

  // Para manejar relaciones en la misma llamada
  variants?: ProductVariant[];    // o un tipo especial para upsert
  images?: ProductImage[];
}


// Crear variante 
export interface ProductVariantCreate {
  sku?: string | null;
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
  price?: number | null;
  compare_price?: number | null;
  quantity?: number;
}

// Actualizar variante
export interface ProductVariantUpdate {
  sku?: string | null;
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
  price?: number | null;
  compare_price?: number | null;
  quantity?: number;
}

// Crear imagen
export interface ProductImageCreate {
  image_url: string;
  alt_text?: string | null;
  sort_order?: number;
  is_primary?: boolean;
}

// Actualizar imagen 
export interface ProductImageUpdate {
  alt_text?: string | null;
  sort_order?: number;
  is_primary?: boolean;
}


// Extiende PaginationParams 
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

// Filtros específicos para productos
export interface ProductFilters {
  business_id?: number;
  category_id?: number;
  status?: ProductStatus;
  is_featured?: boolean;
  is_on_sale?: boolean;
  is_digital?: boolean;
  search?: string;          // Búsqueda por nombre, descripción, etc.
  min_price?: number;
  max_price?: number;
}

// Parámetros combinados para el hook useProducts
export type ProductPaginationParams = PaginationParams & ProductFilters;


export interface ProductsResponse {
  items: Product[];
  total: number;
}

