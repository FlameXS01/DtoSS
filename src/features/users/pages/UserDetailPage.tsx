import { useParams } from 'react-router-dom';
import { useUser } from '../hooks/useUsers';

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0', 10);
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) return <div className="p-8 text-center">Cargando usuario...</div>;
  if (error || !user) return <div className="p-8 text-center text-red-600">Usuario no encontrado</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};