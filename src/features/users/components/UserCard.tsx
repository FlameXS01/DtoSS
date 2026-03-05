import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../stores/authStore';
import { Mail, User as UserIcon, Shield, Calendar, MoreVertical } from 'lucide-react';
import type { UserResponse } from '../types/userTypes';

interface UserCardProps {
  user: UserResponse;
  onEdit?: (user: UserResponse) => void;
  onToggleActive?: (user: UserResponse) => void;
  onDelete?: (userId: number) => void;
  showActions?: boolean; // para controlar si se muestran botones (por si se usa en perfiles públicos)
}

export const UserCard = ({ 
  user, 
  onEdit, 
  onToggleActive, 
  onDelete,
  showActions = true 
}: UserCardProps) => {
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'admin';
  const isSelf = currentUser?.id === user.id; // el usuario viendo su propio perfil
  const canManage = isAdmin || isSelf; // admin o el propio usuario puede editar/desactivar? (ajusta según tu lógica)

  const [imageError, setImageError] = useState(false);

  // Función para obtener iniciales (nombre o email)
  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user.first_name) return user.first_name[0].toUpperCase();
    if (user.username) return user.username[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return '?';
  };

  // Colores de rol (puedes personalizarlos)
  const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
    manager: 'bg-blue-100 text-blue-800 border-blue-200',
    editor: 'bg-green-100 text-green-800 border-green-200',
    viewer: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const roleClass = roleColors[user.role] || 'bg-gray-100 text-gray-800 border-gray-200';

  // Formatear fecha de registro
  const joinedDate = new Date(user.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Cabecera con gradiente superior (opcional) */}
      <div className="h-2 bg-gradient-to-r from-gray-500 to-purple-200" />

      <div className="p-5">
        {/* Avatar y nombre */}
        <div className="flex items-start space-x-4">
          {/* Avatar con efecto hover */}
          <div className="relative flex-shrink-0">
            {user.avatar_url && !imageError ? (
              <img
                src={user.avatar_url}
                alt={user.username || 'avatar'}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-white shadow-md group-hover:ring-blue-200 transition-all"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md ring-2 ring-white group-hover:ring-blue-200 transition-all">
                {getInitials()}
              </div>
            )}
            {/* Indicador de activo/inactivo (punto) */}
            <span
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                user.is_active ? 'bg-green-500' : 'bg-red-500'
              }`}
              title={user.is_active ? 'Activo' : 'Inactivo'}
            />
          </div>

          {/* Info básica */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : user.first_name || user.username || 'Usuario'}
            </h3>
            <p className="text-sm text-gray-500 truncate flex items-center mt-0.5">
              <UserIcon className="w-3.5 h-3.5 mr-1 text-gray-400" />
              @{user.username}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleClass}`}>
                <Shield className="w-3 h-3 mr-1" />
                {user.role === 'admin' ? 'Administrador' : 
                 user.role === 'customer' ? 'Cliente' :
                 user.role === 'vendor' ? 'Propietario' : 'Cliente'}
              </span>
              <span className="text-xs text-gray-400 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {joinedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Email con icono */}
        <div className="mt-4 flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          <a href={`mailto:${user.email}`} className="hover:text-blue-600 truncate">
            {user.email}
          </a>
        </div>

        {/* Acciones - solo si se requieren y el usuario tiene permisos */}
        {showActions && canManage && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-2">
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(user)}
                className="text-gray-700 hover:border-blue-300 hover:text-blue-600"
              >
                Editar
              </Button>
            )}
            {onToggleActive && (isAdmin || isSelf) && (
              <Button
                size="sm"
                variant={user.is_active ? 'ghost' : 'secondary'}
                onClick={() => onToggleActive(user)}
                className={user.is_active 
                  ? 'text-yellow-600 hover:bg-yellow-50' 
                  : 'text-green-600 hover:bg-green-50'
                }
              >
                {user.is_active ? 'Desactivar' : 'Activar'}
              </Button>
            )}
            {onDelete && isAdmin && (
              <Button
                size="sm"
                variant="ghost"
                className="text-red-600 hover:bg-red-50"
                onClick={() => onDelete(user.id)}
              >
                Eliminar
              </Button>
            )}
          </div>
        )}

        {/* Si no hay acciones, pero queremos mostrar algo (por ejemplo, ver perfil) */}
        {!showActions && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link
              to={`/users/${user.id}`}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver perfil completo →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};