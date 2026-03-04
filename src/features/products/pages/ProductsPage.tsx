// ProductsPage.tsx
import { useProducts } from '../hooks/useProducts';
import { useDeleteProduct } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Product } from '../types/productTypes';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';

export const ProductsPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ skip: 0, limit: 10 });

  const { data, isLoading, error, refetch } = useProducts(pagination);
  const products = data?.items || [];
  const total = data?.total || 0;

  const deleteMutation = useDeleteProduct();
  // discontinuedMutation (si existe)

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
    if (product.status === 'discontinued') return;
    if (window.confirm('¿Marcar este producto como discontinuado?')) {
      // discontinuedMutation.mutate(product.id, { ... })
    }
  };

  const handleEdit = (product: Product) => {
    navigate(`/products/${product.id}/edit`);
  };

  // const handleView = (product: Product) => {
  //   navigate(`/products/${product.id}`);
  // };

  const currentPage = Math.floor((pagination.skip || 0) / pagination.limit) + 1;
  const totalPages = Math.ceil(total / pagination.limit);

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, skip: (page - 1) * pagination.limit });
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleDiscontinued}
          />
        ))}
      </div>

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