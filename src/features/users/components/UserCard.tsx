import { useState } from 'react';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../stores/authStore';
import type { UserResponse } from '../types/userTypes';

interface UserCardProps {
  user: UserResponse;
  onEdit?: (user: UserResponse) => void;
  onToggleActive?: (user: UserResponse) => void;
  onDelete?: (userId: number) => void;
}

export const UserCard = ({ user, onEdit, onToggleActive, onDelete }: UserCardProps) => {
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'admin';
  const [imageError, setImageError] = useState(false);

  const getInitial = () => {
    if (user.first_name) return user.first_name[0].toUpperCase();
    if (user.username) return user.username[0].toUpperCase();
    return '?';
  };

  const initial = getInitial();

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex items-center space-x-3 mb-3">
        {user.avatar_url && !imageError ? (
          <img
            src={user.avatar_url}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-lg font-medium">
              {initial}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">
            {user.first_name || user.username} {user.last_name || ''}
          </h3>
          <p className="text-sm text-gray-600 truncate">@{user.username}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
          user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {user.is_active ? 'Activo' : 'Inactivo'}
        </span>
      </div>
      <p className="text-sm text-gray-700 mb-2 truncate">{user.email}</p>
      <p className="text-sm text-gray-600 mb-3">Rol: <span className="capitalize">{user.role}</span></p>
      
      <div className="flex justify-end space-x-2 mt-2">
        {onEdit && (
          <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
            Editar
          </Button>
        )}
        {isAdmin && onToggleActive && (
          <Button 
            size="sm" 
            variant={user.is_active ? 'ghost' : 'secondary'}
            onClick={() => onToggleActive(user)}
          >
            {user.is_active ? 'Desactivar' : 'Activar'}
          </Button>
        )}
        {isAdmin && onDelete && (
          <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => onDelete(user.id)}>
            Eliminar
          </Button>
        )}
      </div>
    </div>
  );
};