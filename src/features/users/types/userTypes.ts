export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string | null;
}

// Para filtros (la API no acepta filtros por query params todavia, 
// podemos filtrar localmente o usar el endpoint by_role)
export interface UserFilters {
  role?: string;
  is_active?: boolean;
  // otros posibles
}

// Para paginación (asumimos que la API acepta skip y limit)
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

// Respuesta de lista de usuarios (asumimos que devuelve un array directamente, sin metadatos)
export type UsersResponse = User[];