import { apiClient } from "../../../lib/apiClient";
import type { 
  Business, 
  BusinessCreate, 
  BusinessUpdate, 
  BusinessResponse, 
  BusinessStatus,
  PaginationParams 
} from "../types/businessTypes";

export const businessApi = {
  // Obtener lista de negocios con paginación
  getBusinesses: async (params?: PaginationParams): Promise<BusinessResponse> => {
    const response = await apiClient.get<BusinessResponse>('/business', { params });
    return response.data;
  },

  // Obtener un negocio por ID
  getBusinessById: async (id: number): Promise<Business> => {
    const response = await apiClient.get<Business>(`/business/${id}`);
    return response.data;
  },

  // Obtener negocio por nombre comercial (único)
  getBusinessByName: async (name: string): Promise<Business> => {
    const response = await apiClient.get<Business>(`/business/by_name/${name}`);
    return response.data;
  },

  // Obtener negocio por nombre legal (único)
  getBusinessByLegalName: async (legalName: string): Promise<Business> => {
    const response = await apiClient.get<Business>(`/business/by_legal_name/${legalName}`);
    return response.data;
  },

  // Obtener negocios por estado (ej: pending, active, etc.)
  getBusinessesByStatus: async (status: BusinessStatus, params?: PaginationParams): Promise<BusinessResponse> => {
    const response = await apiClient.get<BusinessResponse>(`/business/status/${status}`, { params });
    return response.data;
  },

  // Buscar negocios por término (en nombre, descripción, etc.)
  searchBusinesses: async (term: string, params?: PaginationParams): Promise<BusinessResponse> => {
    const response = await apiClient.get<BusinessResponse>('/business/search', { 
      params: { ...params, q: term } 
    });
    return response.data;
  },

  // Crear un nuevo negocio
  createBusiness: async (data: BusinessCreate): Promise<Business> => {
    const response = await apiClient.post<Business>('/business', data);
    return response.data;
  },

  // Actualizar un negocio existente
  updateBusiness: async (id: number, data: BusinessUpdate): Promise<Business> => {
    const response = await apiClient.put<Business>(`/business/${id}`, data);
    return response.data;
  },

  // Eliminar un negocio (hard delete)
  deleteBusiness: async (id: number): Promise<void> => {
    await apiClient.delete(`/business/${id}`);
  },

  // Verificar un negocio (cambia is_verified a true)
  verifyBusiness: async (id: number): Promise<Business> => {
    const response = await apiClient.patch<Business>(`/business/${id}/verify`);
    return response.data;
  },

  // Actualizar el estado de un negocio (pending, active, etc.)
  updateBusinessStatus: async (id: number, status: BusinessStatus): Promise<Business> => {
    const response = await apiClient.patch<Business>(`/business/${id}/status`, { status });
    return response.data;
  },

  // Subir logo del negocio (multipart/form-data)
  uploadLogo: async (id: number, file: File): Promise<Business> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<Business>(`/business/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Subir banner del negocio
  uploadBanner: async (id: number, file: File): Promise<Business> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<Business>(`/business/${id}/banner`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};