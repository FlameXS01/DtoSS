import { useBusineses } from '../hooks/useBusiness';
import { BusinessCard } from '../components/BusinessCard';
import { useState } from 'react';
import type { PaginationParams } from '../types/businessTypes';
import Button from '../../../components/ui/Button';

export const BusinessPage = () => {
  const [pagination, setPagination] = useState<PaginationParams>({ skip: 0, limit: 10 });
  const { data: business, isLoading, error } = useBusineses(pagination);

  const handleNextPage = () => {  // Siempre cambia el valor de skip y limit, aumenta skip en el valor de limit
    setPagination((prev) => ({ ...prev, skip: (prev.skip || 0) + (prev.limit || 10) }));
  };

  const handlePrevPage = () => {
    setPagination((prev) => ({ ...prev, skip: Math.max(0, (prev.skip || 0) - (prev.limit || 10)) }));
  };

  if (isLoading) return <div className="p-8 text-center">Cargando negocios...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error al cargar negocios</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Negocios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {business?.map((buss) => (
          <BusinessCard key={buss.id} business={buss} />   // la prop se llama business
        ))}
      </div>
      {/* Paginación simple */}
      <div className="flex justify-center mt-6 space-x-4">
        <Button
          onClick={handlePrevPage}
          disabled={!pagination.skip || pagination.skip === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </Button>
        <span className="px-4 py-2">
          Mostrando {pagination.skip + 1} - {pagination.skip + (business?.length || 0)}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={business?.length === 0 || (business?.length || 0) < (pagination.limit || 10)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};