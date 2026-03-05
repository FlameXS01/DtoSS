// pages/BusinessPage.tsx
import { useBusineses, useDeleteBusiness, useVerifyBusiness, useUnverifyBusiness } from '../hooks/useBusiness';
import { BusinessCard } from '../components/BusinessCard';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Business, PaginationParams } from '../types/businessTypes';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';
import toast from 'react-hot-toast';
import { Building2 } from 'lucide-react';

export const BusinessPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationParams>({ skip: 0, limit: 10 });
  
  const { data, isLoading, error, refetch } = useBusineses(pagination);
  const businesses = data?.items || [];
  const total = data?.total || 0;

  const currentPage = Math.floor((pagination.skip || 0) / (pagination.limit || 10)) + 1;
  const totalPages = Math.ceil(total / (pagination.limit || 10));

  const handlePageChange = (page: number) => {
    const newSkip = (page - 1) * (pagination.limit || 10);
    setPagination({ ...pagination, skip: newSkip });
  };


  const deleteMutation = useDeleteBusiness();
  const verifiedMutation = useVerifyBusiness();
  const unverifyMutation = useUnverifyBusiness()
  

  const handleToggleVerified = (business: Business) => {
    const mutation = business.is_verified ? verifiedMutation : unverifyMutation;
    mutation.mutate(business.id, {
      onSuccess: () => {
        toast.success(`Usuario ${business.is_verified ? 'desactivado' : 'activado'} correctamente`);
        refetch();
      },
      onError: (error: any) => {
        toast.error(`Error al ${business.is_verified ? 'desactivar' : 'activar'} negocio: ${error.message}`);
      },
    });
  };

  const handleDelete = (businessId: number) => {
    if (window.confirm('¿Estás seguro de eliminar este negocio? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate(businessId, {
        onSuccess: () => {
          toast.success('Negocio eliminado correctamente');
          refetch();
        },
        onError: (error: any) => {
          toast.error(`Error al eliminar: ${error.message}`);
        },
      });
    }
  };

  const handleEdit = (business: Business) => {
    navigate(`/business/${business.id}`);
  };

  if (isLoading) return <div className="p-8 text-center">Cargando negocios...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error al cargar negocios</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Negocios</h1>
          <Button variant="primary" onClick={() => navigate('/business/new')}>
            + Nuevo Negocio
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl h-64 shadow-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error al cargar negocios</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay negocios</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo negocio.</p>
            <div className="mt-6">
              <Button variant="primary" onClick={() => navigate('/business/new')}>
                Crear negocio
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleVerified}
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
          </>
        )}
      </div>
    </div>
  );
};