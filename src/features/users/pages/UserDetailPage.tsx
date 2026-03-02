// UserDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, useDeactivateUser, useActivateUser, useDeleteUser, useUpdateRole, useUserBusinesses } from '../hooks/useUsers';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../stores/authStore';
import type { UserRole } from '../types/userTypes';

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = parseInt(id || '0', 10);
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'admin';
  const isOwnProfile = currentUser?.id === userId;

  const { data: user, isLoading, error, refetch } = useUser(userId);
  const { data: businesses } = useUserBusinesses(); // O usar un hook específico para negocios de este usuario si existe

  const deactivateMutation = useDeactivateUser();
  const activateMutation = useActivateUser();
  const deleteMutation = useDeleteUser();
  const updateRoleMutation = useUpdateRole();

  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(user?.role);

  if (isLoading) return <div className="p-8 text-center">Cargando usuario...</div>;
  if (error || !user) return <div className="p-8 text-center text-red-600">Usuario no encontrado</div>;

  const handleToggleActive = () => {
    const mutation = user.is_active ? deactivateMutation : activateMutation;
    mutation.mutate(user.id, {
      onSuccess: () => {
        toast.success(`Usuario ${user.is_active ? 'desactivado' : 'activado'} correctamente`);
        refetch();
      },
      onError: (error: any) => {
        toast.error(`Error: ${error.message}`);
      },
    });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate(user.id, {
        onSuccess: () => {
          toast.success('Usuario eliminado');
          navigate('/users');
        },
        onError: (error: any) => {
          toast.error(`Error al eliminar: ${error.message}`);
        },
      });
    }
  };

  const handleRoleChange = () => {
    if (!selectedRole || selectedRole === user.role) return;
    updateRoleMutation.mutate({ userId: user.id, role: selectedRole }, {
      onSuccess: (updatedUser) => {
        toast.success('Rol actualizado');
        refetch();
      },
      onError: (error: any) => {
        toast.error(`Error al cambiar rol: ${error.message}`);
      },
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        {/* Cabecera con avatar y nombre */}
        <div className="flex items-center space-x-4 mb-6">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.username} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-2xl">
                {user.first_name?.[0] || user.username[0]}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {user.first_name || user.username} {user.last_name || ''}
            </h1>
            <p className="text-gray-600">@{user.username}</p>
          </div>
        </div>

        {/* Información detallada */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="font-semibold text-gray-700">Email</h2>
            <p>{user.email}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700">Teléfono</h2>
            <p>{user.phone || 'No especificado'}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700">Rol</h2>
            <p className="capitalize">{user.role}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700">Estado</h2>
            <p>
              {user.is_active ? (
                <span className="text-green-600">Activo</span>
              ) : (
                <span className="text-red-600">Inactivo</span>
              )}
              {user.is_verified && ' (Verificado)'}
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700">Creado</h2>
            <p>{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700">Último acceso</h2>
            <p>{user.last_login ? new Date(user.last_login).toLocaleString() : 'Nunca'}</p>
          </div>
        </div>

        {/* Negocios asociados (si existen) */}
        {businesses && businesses.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-gray-700 mb-2">Negocios asociados</h2>
            <ul className="list-disc list-inside">
              {businesses.map((biz) => (
                <li key={biz.id}>{biz.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Acciones (solo para admin o propio perfil) */}
        {(isAdmin || isOwnProfile) && (
          <div className="border-t pt-4 mt-4">
            <h2 className="font-semibold text-gray-700 mb-3">Acciones</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => navigate(`/users/${user.id}/edit`)}>
                Editar perfil
              </Button>

              {isAdmin && (
                <>
                  <Button
                    variant={user.is_active ? 'secondary' : 'primary'}
                    onClick={handleToggleActive}
                  >
                    {user.is_active ? 'Desactivar' : 'Activar'}
                  </Button>

                  <Button variant="ghost" className="text-red-600" onClick={handleDelete}>
                    Eliminar
                  </Button>

                  {/* Cambiar rol */}
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button onClick={handleRoleChange} disabled={selectedRole === user.role}>
                      Actualizar rol
                    </Button>
                  </div>
                </>
              )}

              {(isAdmin || isOwnProfile) && (
                <Button variant="outline" onClick={() => navigate(`/users/${user.id}/change-password`)}>
                  Cambiar contraseña
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};