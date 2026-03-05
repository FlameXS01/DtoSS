// hooks/useBusiness.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessApi } from '../services/businessApi';
import type { 
  BusinessCreate, 
  BusinessUpdate,
  BusinessResponse, 
  PaginationParams,
  BusinessStatus
} from '../types/businessTypes';

// Claves para la caché
export const businessKeys = {
  all: ['businesses'] as const,
  lists: () => [...businessKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...businessKeys.lists(), params] as const,
  details: () => [...businessKeys.all, 'detail'] as const,
  detail: (id: number) => [...businessKeys.details(), id] as const,
  byName: (name: string) => [...businessKeys.details(), 'byName', name] as const,
  byLegalName: (legalName: string) => [...businessKeys.details(), 'byLegalName', legalName] as const,
  byStatus: (status: BusinessStatus, params: PaginationParams) => [...businessKeys.lists(), 'byStatus', status, params] as const,
  search: (term: string, params: PaginationParams) => [...businessKeys.lists(), 'search', term, params] as const,
};

// ----- Consultas (GET) -----
export const useBusineses = (params?: PaginationParams) => {
  return useQuery<BusinessResponse>({
    queryKey: businessKeys.list(params || {}),
    queryFn: () => businessApi.getBusinesses(params),
  });
};

export const useBusiness = (id: number) => {
  return useQuery({
    queryKey: businessKeys.detail(id),
    queryFn: () => businessApi.getBusinessById(id),
    enabled: !!id,
  });
};

export const useBusinessByName = (name: string) => {
  return useQuery({
    queryKey: businessKeys.byName(name),
    queryFn: () => businessApi.getBusinessByName(name),
    enabled: !!name,
  });
};

export const useBusinessByLegalName = (legalName: string) => {
  return useQuery({
    queryKey: businessKeys.byLegalName(legalName),
    queryFn: () => businessApi.getBusinessByLegalName(legalName),
    enabled: !!legalName,
  });
};

export const useBusinessesByStatus = (status: BusinessStatus, params?: PaginationParams) => {
  return useQuery({
    queryKey: businessKeys.byStatus(status, params || {}),
    queryFn: () => businessApi.getBusinessesByStatus(status, params),
    enabled: !!status,
  });
};

export const useBusinessesByTerm = (term: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: businessKeys.search(term, params || {}),
    queryFn: () => businessApi.searchBusinesses(term, params),
    enabled: !!term,
  });
};

// ----- Mutaciones -----
export const useCreateBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newBusiness: BusinessCreate) => businessApi.createBusiness(newBusiness),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
};

export const useUpdateBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BusinessUpdate }) =>
      businessApi.updateBusiness(id, data),
    onSuccess: (updatedBusiness) => {
      queryClient.setQueryData(businessKeys.detail(updatedBusiness.id), updatedBusiness);
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
};

export const useDeleteBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => businessApi.deleteBusiness(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: businessKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
};

export const useVerifyBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => businessApi.verifyBusiness(id),
    onSuccess: (updatedBusiness) => {
      queryClient.setQueryData(businessKeys.detail(updatedBusiness.id), updatedBusiness);
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
};
// tengo que hacer esta, hace lo mismo que verificar
export const useUnverifyBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => businessApi.verifyBusiness(id),
    onSuccess: (updatedBusiness) => {
      queryClient.setQueryData(businessKeys.detail(updatedBusiness.id), updatedBusiness);
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
};

export const useUpdateBusinessStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: BusinessStatus }) =>
      businessApi.updateBusinessStatus(id, status),
    onSuccess: (updatedBusiness) => {
      queryClient.setQueryData(businessKeys.detail(updatedBusiness.id), updatedBusiness);
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
};

// Para subir logo o banner (asumiendo endpoints separados)
export const useUploadBusinessLogo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      businessApi.uploadLogo(id, file),
    onSuccess: (updatedBusiness) => {
      queryClient.setQueryData(businessKeys.detail(updatedBusiness.id), updatedBusiness);
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
};

export const useUploadBusinessBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      businessApi.uploadBanner(id, file),
    onSuccess: (updatedBusiness) => {
      queryClient.setQueryData(businessKeys.detail(updatedBusiness.id), updatedBusiness);
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
};