import { apiClient } from '../../../lib/apiClient';
import type { Business, BusinessResponse } from '../../business/types/businessTypes';
import type { 
  UserCreate, 
  UserUpdate, 
  UserPasswordUpdate,
  UserResponse, 
  UsersResponse,
  PaginationParams, 
  UserRole
} from '../types/userTypes';

export const usersApi = {
  // Obtener todos los usuarios con paginación
  getUsers: async (params?: PaginationParams): Promise<UsersResponse> => {
    const response = await apiClient.get<UsersResponse>('/users', { params });
    return response.data;
  },

  // Obtener un usuario por ID
  getUserById: async (id: number): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>(`/users/${id}`);
    return response.data;
  },

  // Obtener usuarios por rol
  getUsersByRole: async (role: string, params?: PaginationParams): Promise<UsersResponse> => {
    const response = await apiClient.get<UsersResponse>('/users/by_role/', {
      params: { role, ...params },
    });
    return response.data;
  },

  // Obtener usuario por email
  getUserByEmail: async (email: string, params?: PaginationParams): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/users/by_email/', {
      params: { email, ...params },
    });
    return response.data;
  },

  // Obtener usuario por username
  getUserByUsername: async (username: string, params?: PaginationParams): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/users/by_username/', {
      params: { username, ...params },
    });
    return response.data;
  },

  // Búsqueda avanzada por término
  getUsersByTerm: async (term: string, params?: PaginationParams): Promise<UsersResponse> => {
    const response = await apiClient.get<UsersResponse>('/users/by_search_term/', {
      params: { search_term: term, ...params }, // Nota: en backend es search_term
    });
    return response.data;
  },

  // Crear un nuevo usuario
  createUser: async (user: UserCreate): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/users/', user);
    return response.data;
  },

  // Actualizar perfil del propio usuario
  updateUser: async (userUpdate: UserUpdate): Promise<UserResponse> => {
    const response = await apiClient.put<UserResponse>('/users/update', userUpdate);
    return response.data;
  },

  // Cambiar contraseña del propio usuario
  updatePassword: async (data: UserPasswordUpdate): Promise<boolean> => {
    const response = await apiClient.patch<boolean>('/users/me/update_password', data);
    return response.data;
  },

  // Admin: actualizar contraseña de otro usuario
  adminUpdatePassword: async (userId: number, newPassword: string): Promise<boolean> => {
    const response = await apiClient.post<boolean>(`/users/adm_update_password/${userId}`, null, {
      params: { new_password: newPassword }
    });
    return response.data;
  },

  // Admin: cambiar rol de un usuario
  updateRole: async (userId: number, role: UserRole): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>(`/users/update_rol/${userId}`, null, {
      params: { role }
    });
    return response.data;
  },

  // Desactivar usuario (soft delete)
  deactivateUser: async (userId: number): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>(`/users/deactivate/${userId}`);
    return response.data;
  },

  // Activar usuario
  activateUser: async (userId: number): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>(`/users/activate/${userId}`);
    return response.data;
  },

  // Eliminar usuario permanentemente (hard delete)
  deleteUser: async (userId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/users/delete/${userId}`);
    return response.data;
  },

  // Obtener negocios del usuario actual
  getUserBusinesses: async (): Promise<BusinessResponse> => {
    const response = await apiClient.get<BusinessResponse>('/users/me/businesses/');
    return response.data;
  },

  // Actualizar último login (quizás no necesario desde frontend, pero si se requiere)
  updateLastLogin: async (): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/users/update_login');
    return response.data;
  },
};