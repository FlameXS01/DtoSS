// pages/BusinessPage.tsx
import { useBusineses } from '../hooks/useBusiness';
import { BusinessCard } from '../components/BusinessCard';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PaginationParams } from '../types/businessTypes';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';

export const BusinessPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationParams>({ skip: 0, limit: 10 });
  
  const { data, isLoading, error } = useBusineses(pagination);
  const businesses = data?.items || [];
  const total = data?.total || 0;

  const currentPage = Math.floor((pagination.skip || 0) / (pagination.limit || 10)) + 1;
  const totalPages = Math.ceil(total / (pagination.limit || 10));

  const handlePageChange = (page: number) => {
    const newSkip = (page - 1) * (pagination.limit || 10);
    setPagination({ ...pagination, skip: newSkip });
  };

  if (isLoading) return <div className="p-8 text-center">Cargando negocios...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error al cargar negocios</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Negocios</h1>
        <Button variant="primary" onClick={() => navigate('/business/new')}>
          + Nuevo Negocio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      )}
    </div>
  );
};