import { apiClient } from "../../../lib/apiClient";
import type { PaginationParams, Product, ProductCreate, ProductsResponse, ProductUpdate } from "../types/productTypes";

export const productApi = {
    // Obten todos los productos con todo, paginacion incluida
    getProducts: async(params?: PaginationParams): Promise<ProductsResponse> => {
        const response = await apiClient.get<ProductsResponse>('/orchest/products', {params});
        return response.data;
    }, 

    // Obtiene el producto completo dado un id especifico
    getProductById: async(id: number): Promise<Product> => {
        const response = await apiClient.get<Product>(`/orchest/product/${id}`);
        return response.data
    },

    // Obtiene el producto completo dado un id especifico
    getProductByBusiness: async(id: number, params?: PaginationParams): Promise<ProductsResponse> => {
        const response = await apiClient.get<ProductsResponse>(`/orchest/product_by_business/${id}`, {params});
        return response.data
    },

    // Crear un producto 
    createProduct: async(product: ProductCreate): Promise<Product> => {
        const response = await apiClient.post<Product>('/orchest/product/', product);
        return response.data; 
    },

    // Modifica un producto
    updateProduct: async(id: number ,product: ProductUpdate): Promise<Product> => {
        const response = await apiClient.put<Product>(`/products/${id}`, product);
        return response.data;
    },

    // Elimina un producto 
    deleteProduct: async(id: number): Promise<boolean> => {
        const response = await apiClient.delete<boolean>(`/orchest/product/${id}`);
        return response.data; 
    },
}