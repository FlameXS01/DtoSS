import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Business } from '../types/businessTypes';

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard = ({ business }: BusinessCardProps) => {
  const [imageError, setImageError] = useState(false);

  const getInitial = () => {
    if (business.business_name) return business.business_name[0].toUpperCase();
    if (business.legal_name) return business.legal_name[0].toUpperCase();
    return '?';
  };

  const initial = getInitial();

  return (
    <Link to={`/business/${business.id}`} className="block group">
      <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
        <div className="flex items-center space-x-3">
          {business.logo_url && !imageError ? (
            <img
              src={business.logo_url}
              alt={business.business_name || business.legal_name || 'Business'}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {initial}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {business.business_name || business.legal_name || 'Negocio sin nombre'}
            </h3>
            <p className="text-sm text-gray-600 truncate">{business.email}</p>
            <div className="flex items-center mt-1 space-x-2">
              {!business.is_verified && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 font-medium">
                  No verificado
                </span>
              )}
              {business.status && business.status !== 'active' && (
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  business.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {business.status === 'pending' ? 'Pendiente' : business.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};