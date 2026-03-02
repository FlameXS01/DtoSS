// UsersPage.tsx
import { useUsers } from '../hooks/useUsers';
import { useDeactivateUser, useActivateUser, useDeleteUser } from '../hooks/useUsers';
import { UserCard } from '../components/UserCard';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { PaginationParams, UserResponse } from '../types/userTypes';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';

export const UsersPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationParams>({ skip: 0, limit: 10 });
  
  // Ahora data contiene { users, total }
  const { data, isLoading, error, refetch } = useUsers(pagination);
  const users = data?.items || [];
  const total = data?.total || 0;

  // Mutations
  const deactivateMutation = useDeactivateUser();
  const activateMutation = useActivateUser();
  const deleteMutation = useDeleteUser();

  const handleToggleActive = (user: UserResponse) => {
    const mutation = user.is_active ? deactivateMutation : activateMutation;
    mutation.mutate(user.id, {
      onSuccess: () => {
        toast.success(`Usuario ${user.is_active ? 'desactivado' : 'activado'} correctamente`);
        refetch();
      },
      onError: (error: any) => {
        toast.error(`Error al ${user.is_active ? 'desactivar' : 'activar'} usuario: ${error.message}`);
      },
    });
  };

  const handleDelete = (userId: number) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate(userId, {
        onSuccess: () => {
          toast.success('Usuario eliminado correctamente');
          refetch();
        },
        onError: (error: any) => {
          toast.error(`Error al eliminar: ${error.message}`);
        },
      });
    }
  };

  const handleEdit = (user: UserResponse) => {
    navigate(`/users/${user.id}`);
  };

  // Calcular página actual y total de páginas
  const currentPage = Math.floor((pagination.skip || 0) / (pagination.limit || 10)) + 1;
  const totalPages = Math.ceil(total / (pagination.limit || 10));

  const handlePageChange = (page: number) => {
    const newSkip = (page - 1) * (pagination.limit || 10);
    setPagination({ ...pagination, skip: newSkip });
  };

  if (isLoading) return <div className="p-8 text-center">Cargando usuarios...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error al cargar usuarios</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Button variant="primary" onClick={() => navigate('/users/new')}>
          + Nuevo Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={handleEdit}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Paginación numerada con totalPages */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-6"
      />
    </div>
  );
};