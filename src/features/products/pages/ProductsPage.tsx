// features/products/pages/ProductsPage.tsx
import { useProducts } from '../hooks/useProducts';
import { useDeleteProduct } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { ProductPaginationParams, Product } from '../types/productTypes';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';

export const ProductsPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<ProductPaginationParams>({
    skip: 0,
    limit: 10,
    // Puedes añadir filtros iniciales si quieres: business_id, category_id, etc.
  });

  const { data, isLoading, error, refetch } = useProducts(pagination);
  const products = data?.items || [];
  const total = data?.total || 0;

  // Mutations
  const deleteMutation = useDeleteProduct();
//   const discontinuedMutation = useDiscontinuedProduct();

  const handleDelete = (productId: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate(productId, {
        onSuccess: () => {
          toast.success('Producto eliminado correctamente');
          refetch();
        },
        onError: (error: any) => {
          toast.error(`Error al eliminar: ${error.message}`);
        },
      });
    }
  };

  const handleDiscontinued = (product: Product) => {
    if (product.status === 'discontinued') return; // Ya está discontinuado
    if (window.confirm('¿Marcar este producto como discontinuado?')) {
      discontinuedMutation.mutate(product.id, {
        onSuccess: () => {
          toast.success('Producto marcado como discontinuado');
          refetch();
        },
        onError: (error: any) => {
          toast.error(`Error al discontinuar: ${error.message}`);
        },
      });
    }
  };

  const handleEdit = (product: Product) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleView = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  // Cálculo de páginas
  const currentPage = Math.floor((pagination.skip || 0) / (pagination.limit || 10)) + 1;
  const totalPages = Math.ceil(total / (pagination.limit || 10));

  const handlePageChange = (page: number) => {
    const newSkip = (page - 1) * (pagination.limit || 10);
    setPagination({ ...pagination, skip: newSkip });
  };

  if (isLoading) return <div className="p-8 text-center">Cargando productos...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error al cargar productos</div>;

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button variant="primary" onClick={() => navigate('/products/new')}>
          + Nuevo Producto
        </Button>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDiscontinued={handleDiscontinued}
            onClick={handleView}
          />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-8"
        />
      )}
    </div>
  );
};