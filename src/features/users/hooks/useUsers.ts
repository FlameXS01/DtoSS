import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../services/usersApi';
import type { PaginationParams } from '../types/userTypes';

// Todos los usuarios
export const useUsers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['users', params], // La clave incluye los parámetros para que se recargue al cambiar 
    // queryKey array que identifica de forma única esta consulta en la caché
    queryFn: () => usersApi.getUsers(params),  // queryFn  Es la función que realiza la petición
  });
};

// Un usuario
export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id, //convierte la validez del id en true o false, solo se ejecuta si hay id,
  });
};

export const useUsersByRole = (role: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: ['users', 'by_role', role, params],
    queryFn: () => usersApi.getUsersByRole(role, params),
    enabled: !!role, //convierte la validez del rol en true o false, solo se ejecuta si hay id,
  });
};