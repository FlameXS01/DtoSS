import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../services/productApi";
import type { PaginationParams, Product, ProductCreate, ProductsResponse, ProductUpdate } from "../types/productTypes";
import { usersKeys } from "../../users/hooks/useUsers";


// Claves para la f* cache
export const productsKeys = {
    all: ['products'] as const,
    lists: () => [...productsKeys.all, 'list'] as const,
    list: (params: PaginationParams) => [...productsKeys.lists(), params] as const,
    list_business: (id: number, params: PaginationParams ) => [...productsKeys.lists(), params, id] as const,
    details: () => [...productsKeys.all, 'detail'] as const,
    detail: (id: number) => [...productsKeys.details(), id] as const,
};

// ------ Consultas Get ----- 
// Todos los productos con paginacion 
export const useProducts = (params?: PaginationParams) => {
    return useQuery<ProductsResponse>({
        queryKey: productsKeys.list(params || {}),
        queryFn: () => productApi.getProducts(params),
    });
};

// Producto especifico
export const useProductById = (id: number) => {
    return useQuery<Product>({
        queryKey: productsKeys.detail(id),
        queryFn: () => productApi.getProductById(id),
        enabled: !!id, 
    });
};

// Productos especificos por negocio
export const useProductByBusiness = (id: number, params?: PaginationParams) => {
    return useQuery<ProductsResponse>({
        queryKey: productsKeys.list_business(id, params || {}),
        queryFn: () => productApi.getProductByBusiness(id),
        enabled: !!id, 
    });
};

// ----- Mutaciones (POST, PUT, PATCH, DELETE) -----
// Crear un producto
export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: ProductCreate) => productApi.createProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: usersKeys.lists()});
        },
    });
};

// Modificar el producto
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, prod}:{id: number, prod: ProductUpdate}) => productApi.updateProduct(id, prod),
        onSuccess: (updatedProd) => {
            queryClient.setQueryData(productsKeys.detail(updatedProd.id), updatedProd);
            queryClient.invalidateQueries({ queryKey: productsKeys.lists()});
        },
    });
};

// Elimina el producto
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => productApi.deleteProduct(id),
        onSuccess: (_, id) => {
            queryClient.removeQueries({ queryKey: productsKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
        },
    });
}

