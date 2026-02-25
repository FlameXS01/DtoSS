import { apiClient } from "../../../lib/apiClient";
import type { Business, BusinessResponse, PaginationParams } from "../types/businessTypes";

export const businessApi = {
    // Funciones que haria desde la api
    getBusiness: async (params?: PaginationParams): Promise<BusinessResponse> => {
        const response = await apiClient.get<BusinessResponse>('/business', {params});
        return response.data
    },

    getBusinessById: async (id: number): Promise<Business> => {
        const response = await apiClient.get<Business>(`/business/${id}`);
        return response.data
    },

    getBusinessByName: async (name: string): Promise<Business> => {
        const response = await apiClient.get<Business>(`/business/by_name/${name}`);
        return response.data
    },

    getBusinessByLegalName: async (legalName: string): Promise<Business> => {
        const response = await apiClient.get<Business>(`/business/by_legal_name/${legalName}`);
        return response.data
    },
}