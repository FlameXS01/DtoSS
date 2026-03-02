import { useQuery } from '@tanstack/react-query';
import { businessApi } from '../services/businessApi';
import type { Business, BusinessResponse, PaginationParams } from '../types/businessTypes';


// Validaciones a la clase de servicio
// Estas son las que realmente se usan desde el componente
export const useBusineses = (params?: PaginationParams) => {
    return useQuery<BusinessResponse>({
        queryKey: ['busineses', params],
        queryFn: () => businessApi.getBusiness(params),
    });
};


export const useBusiness = (id: number) => {
    return useQuery({
        queryKey: ['business', id],
        queryFn: () => businessApi.getBusinessById(id), 
    });
};


export const useBusinessName = (name: string) => {
    return useQuery({
        queryKey: ['businessName', name],
        queryFn: () => businessApi.getBusinessByName(name),
    });

}
export const useBusinessLegalName = (legalName: string) => {
    return useQuery({
        queryKey: ['businessLegalName', legalName],
        queryFn: () => businessApi.getBusinessByName(legalName),
    });
}