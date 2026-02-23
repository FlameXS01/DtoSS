import { apiClient } from '../../../lib/apiClient';
import type { User, PaginationParams } from '../types/userTypes';

export const usersApi = { // aqui se hace fetch dentro de apiclient que es una instancia de axios
  // Obtener todos los usuarios con paginación (skip, limit)
  getUsers: async (params?: PaginationParams): Promise<User[]> => { // ? es que es paramtro opcional, puede o no pasarse 
    const response = await apiClient.get<User[]>('/users', { params });
    return response.data;
  },

  // Obtener un usuario por ID
  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  // Obtener usuarios por rol (endpoint /users/by_role/)
  getUsersByRole: async (role: string, params?: PaginationParams): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users/by_role/', {
      params: { role, ...params },
    });
    return response.data;
  },
};