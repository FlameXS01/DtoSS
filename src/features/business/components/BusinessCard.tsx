import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import Button from '../../../components/ui/Button';
import { Building2, MapPin, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';
import type { Business } from '../types/businessTypes';

interface BusinessCardProps {
  business: Business;
  onEdit?: (business: Business) => void;
  onToggleStatus?: (business: Business) => void;
  onDelete?: (businessId: number) => void;
}

export const BusinessCard = ({ 
  business, 
  onEdit, 
  onToggleStatus, 
  onDelete 
}: BusinessCardProps) => {
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'admin';
  const isOwner = currentUser?.id === business.owner_id;
  const canManage = isAdmin || isOwner;

  const [imageError, setImageError] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  const getInitials = () => {
    const name = business.business_name || business.legal_name || 'N';
    const words = name.split(' ').slice(0, 2);
    return words.map(word => word[0]?.toUpperCase()).join('');
  };

  const initials = getInitials();
  const bannerUrl = business.banner_url;
  const logoUrl = business.logo_url;
  const businessName = business.business_name || business.legal_name || 'Negocio sin nombre';

  // Mapeo de estados para mostrar etiquetas
  const statusMap: Record<string, { text: string; className: string }> = {
    active: { text: 'Activo', className: 'bg-green-500/20 text-green-300 border border-green-500/30' },
    pending: { text: 'Pendiente', className: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' },
    inactive: { text: 'Inactivo', className: 'bg-red-500/20 text-red-300 border border-red-500/30' },
    suspended: { text: 'Suspendido', className: 'bg-gray-500/20 text-gray-300 border border-gray-500/30' },
  };

  const status = business.status ? statusMap[business.status] : null;

  // Prevenir la navegación al hacer clic en botones
  const handleActionClick = (e: React.MouseEvent, callback?: Function) => {
    e.preventDefault();
    e.stopPropagation();
    if (callback) callback();
  };

  return (
    <Link to={`/business/${business.id}`} className="block group h-full">
      <div className="relative h-full rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Banner de fondo */}
        {bannerUrl && !bannerError ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${bannerUrl})` }}
            onError={() => setBannerError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        
        {/* Overlay oscuro con degradado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />

        {/* Contenido */}
        <div className="relative z-10 h-full flex flex-col p-5 text-white">
          {/* Logo o iniciales */}
          <div className="flex justify-center mb-3">
            {logoUrl && !imageError ? (
              <img
                src={logoUrl}
                alt={businessName}
                className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-3xl border-2 border-white shadow-lg">
                {initials}
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-center line-clamp-2 min-h-[3.5rem]">
            {businessName}
          </h3>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              business.is_verified
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {business.is_verified ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <XCircle className="w-3 h-3 mr-1" />
              )}
              {business.is_verified ? 'Verificado' : 'No verificado'}
            </span>
            {status && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
                <Building2 className="w-3 h-3 mr-1" />
                {status.text}
              </span>
            )}
          </div>

          {/* Información de contacto (solo iconos si existe) */}
          {(business.email || business.phone || business.website || business.address_line1) && (
            <div className="mt-3 space-y-1.5 text-xs text-white/80">
              {business.email && (
                <div className="flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-2 text-white/60 flex-shrink-0" />
                  <span className="truncate">{business.email}</span>
                </div>
              )}
              {business.phone && (
                <div className="flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-2 text-white/60 flex-shrink-0" />
                  <span>{business.phone}</span>
                </div>
              )}
              {(business.address_line1 || business.address_line2) && (
                <div className="flex items-start">
                  <MapPin className="w-3.5 h-3.5 mr-2 text-white/60 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">
                    {business.address_line1 || business.address_line2}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Botones de acción (solo si puede gestionar) */}
          {canManage && (onEdit || onToggleStatus || onDelete) && (
            <div className="mt-4 flex justify-end gap-2 border-t border-white/20 pt-3">
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={(e) => handleActionClick(e, () => onEdit(business))}
                >
                  Editar
                </Button>
              )}
              {onToggleStatus && (
                <Button
                  size="sm"
                  variant="ghost"
                  className={business.status === 'active' 
                    ? 'text-yellow-300 hover:bg-yellow-500/20' 
                    : 'text-green-300 hover:bg-green-500/20'
                  }
                  onClick={(e) => handleActionClick(e, () => onToggleStatus(business))}
                >
                  {business.status === 'active' ? 'Desactivar' : 'Activar'}
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-300 hover:bg-red-500/20"
                  onClick={(e) => handleActionClick(e, () => onDelete(business.id))}
                >
                  Eliminar
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};