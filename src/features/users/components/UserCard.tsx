import type { User } from '../types/userTypes';
import { Link } from 'react-router-dom';

interface UserCardProps {
  user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link to={`/users/${user.id}`} className="block">
      <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center space-x-4">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={`${user.username}`}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-lg">
                {user.first_name?.[0] || user.username[0]}
              </span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold">
              {user.first_name || user.username} {user.last_name || ''}
            </h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="flex items-center mt-1 space-x-2">
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                user.role === 'vendor' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user.role}
              </span>
              {!user.is_active && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                  Inactivo
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};