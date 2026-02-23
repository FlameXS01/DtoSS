import { useUsers } from '../hooks/useUsers';
import { UserCard } from '../components/UserCard';
import { useState } from 'react';
import type { PaginationParams } from '../types/userTypes';

export const UsersPage = () => {
  const [pagination, setPagination] = useState<PaginationParams>({ skip: 0, limit: 10 });
  const { data: users, isLoading, error } = useUsers(pagination);

  const handleNextPage = () => {  // Siempre cambia el valor de skip y limit, aumenta skip en el valor de limit
    setPagination((prev) => ({ ...prev, skip: (prev.skip || 0) + (prev.limit || 10) }));
  };

  const handlePrevPage = () => {
    setPagination((prev) => ({ ...prev, skip: Math.max(0, (prev.skip || 0) - (prev.limit || 10)) }));
  };

  if (isLoading) return <div className="p-8 text-center">Cargando usuarios...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error al cargar usuarios</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Usuarios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      {/* Paginación simple */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={!pagination.skip || pagination.skip === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2">
          Mostrando {pagination.skip + 1} - {pagination.skip + (users?.length || 0)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={users?.length === 0 || (users?.length || 0) < (pagination.limit || 10)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};