// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../services/usersApi';
import type { 
  UserCreate, 
  UserUpdate, 
  UserPasswordUpdate,
  PaginationParams,
  UserRole,
  UsersResponse
} from '../types/userTypes';

// Claves para la caché
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...usersKeys.lists(), params] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: number) => [...usersKeys.details(), id] as const,
  byRole: (role: string, params: PaginationParams) => [...usersKeys.lists(), 'by_role', role, params] as const,
  byEmail: (email: string) => [...usersKeys.details(), 'by_email', email] as const,
  byUsername: (username: string) => [...usersKeys.details(), 'by_username', username] as const,
  search: (term: string, params: PaginationParams) => [...usersKeys.lists(), 'search', term, params] as const,
  businesses: () => ['userBusinesses'] as const,
  businessesBy: (id: number) => [...usersKeys.businesses(), id] as const,
};

// ----- Consultas (GET) -----
// Todos los usuarios con paginación
export const useUsers = (params?: PaginationParams) => {
  return useQuery<UsersResponse>({
    queryKey: usersKeys.list(params || {}),
    queryFn: () => usersApi.getUsers(params),
  });
};

// Usuario por ID
export const useUser = (id: number) => {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
  });
};

// Usuarios por rol
export const useUsersByRole = (role: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: usersKeys.byRole(role, params || {}),
    queryFn: () => usersApi.getUsersByRole(role, params),
    enabled: !!role,
  });
};

// Usuario por email
export const useUserByEmail = (email: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: usersKeys.byEmail(email),
    queryFn: () => usersApi.getUserByEmail(email, params),
    enabled: !!email,
  });
};

// Usuario por username
export const useUserByUsername = (username: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: usersKeys.byUsername(username),
    queryFn: () => usersApi.getUserByUsername(username, params),
    enabled: !!username,
  });
};

// Búsqueda por término
export const useUsersByTerm = (term: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: usersKeys.search(term, params || {}),
    queryFn: () => usersApi.getUsersByTerm(term, params),
    enabled: !!term,
  });
};

// Negocios del usuario actual
export const useUserMeBusinesses = () => {
  return useQuery({
    queryKey: usersKeys.businesses(),
    queryFn: () => usersApi.getUserMeBusinesses(),
  });
};

// Negocios del usuario actual
export const useUserBusinesses = (id: number) => {
  return useQuery({
    queryKey: usersKeys.businessesBy(id),
    queryFn: () => usersApi.getUserBusinesses(id),
  });
};

// ----- Mutaciones (POST, PUT, PATCH, DELETE) -----
// Crear usuario
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newUser: UserCreate) => usersApi.createUser(newUser),
    onSuccess: () => {
      // Invalidar listas de usuarios para que se refresquen
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

// Actualizar perfil propio
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userUpdate: UserUpdate) => usersApi.updateUser(userUpdate),
    onSuccess: (updatedUser) => {
      // Actualizar el detalle del usuario en caché
      queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);
      // También invalidar listas
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

// Cambiar contraseña propia
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: UserPasswordUpdate) => usersApi.updatePassword(data),
  });
};

// Admin: actualizar contraseña de otro usuario
export const useAdminUpdatePassword = () => {
  return useMutation({
    mutationFn: ({ userId, newPassword }: { userId: number; newPassword: string }) =>
      usersApi.adminUpdatePassword(userId, newPassword),
  });
};

// Admin: cambiar rol
export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: UserRole }) =>
      usersApi.updateRole(userId, role),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

// Desactivar usuario
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => usersApi.deactivateUser(userId),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

// Activar usuario
export const useActivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => usersApi.activateUser(userId),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

// Eliminar usuario (hard delete)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => usersApi.deleteUser(userId),
    onSuccess: (_, userId) => {
      // Eliminar de la caché el detalle
      queryClient.removeQueries({ queryKey: usersKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

// Actualizar último login
export const useUpdateLastLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => usersApi.updateLastLogin(),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);
    },
  });
};