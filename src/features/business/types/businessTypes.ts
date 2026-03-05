// Posibles estados del negocio (ajusta según tu backend)
export type BusinessStatus = 'pending' | 'active' | 'inactive' | 'suspended';

// Tipo principal del negocio (coincide con la respuesta de la API)
export interface Business {
  id: number;
  business_name: string;
  legal_name: string | null;
  description: string | null;
  slogan: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address_line1: string | null;
  address_line2: string | null;
  logo_url: string | null;
  banner_url: string | null;
  currency: string;         // Ej: 'CUP', 'USD', etc.
  second_currency: string | null;
  tax_rate: number | null;
  status: BusinessStatus;
  is_verified: boolean;
  owner_id: number;
  verification_data: Record<string, any> | null; // Mejor que 'JSON'
  created_at: string;       // ISO date string
  updated_at: string | null;
}

// Para crear un nuevo negocio (campos obligatorios vs opcionales)
export interface BusinessCreate {
  business_name: string;                // Obligatorio
  legal_name?: string | null;
  description?: string | null;
  slogan?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  currency?: string;                    // Opcional con valor por defecto
  second_currency?: string | null;
  tax_rate?: number | null;
  status?: BusinessStatus;              // Opcional, normalmente 'pending'
  is_verified?: boolean;                // Opcional, normalmente false
  verification_data?: Record<string, any> | null;
}

// Para actualizar un negocio (todos opcionales)
export interface BusinessUpdate {
  business_name?: string;
  legal_name?: string | null;
  description?: string | null;
  slogan?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  currency?: string;
  second_currency?: string | null;
  tax_rate?: number | null;
  status?: BusinessStatus;
  is_verified?: boolean;
  verification_data?: Record<string, any> | null;
}

// Filtros para listados (pueden usarse en queries)
export interface BusinessFilters {
  status?: BusinessStatus;
  is_verified?: boolean;
  search?: string;          // Búsqueda por término en nombre, descripción, etc.
}

// Parámetros de paginación (común en toda la app)
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

// Respuesta paginada (lista de negocios + total de registros)
export interface BusinessResponse {
  items: Business[];
  total: number;
}