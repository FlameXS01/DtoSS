import { useParams } from 'react-router-dom';
import { useBusiness } from '../hooks/useBusiness';
import { Building2, MapPin, Phone, Mail, Globe, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react'; 


export const BusinessDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const businessId = parseInt(id || '0', 10);
  const { data: business, isLoading, error } = useBusiness(businessId);

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Error al cargar el negocio</h2>
        <p className="text-gray-600 mt-2">El negocio no existe o hubo un problema.</p>
      </div>
    );
  }

  const bannerUrl = business.banner_url || 'https://via.placeholder.com/1200x400?text=No+Banner';
  const logoUrl = business.logo_url;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden bg-gray-300">
        <img
          src={bannerUrl}
          alt="Banner del negocio"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/1200x400?text=No+Banner';
          }}
        />
      </div>

      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Cabecera con logo y nombre */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex-shrink-0">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={business.business_name || business.legal_name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `<div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-md">${(business.business_name || business.legal_name || 'N')[0].toUpperCase()}</div>`;
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-md">
                    {(business.business_name || business.legal_name || 'N')[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {business.business_name || business.legal_name}
                </h1>
                {business.slogan && (
                  <p className="text-lg text-gray-600 italic mt-1">"{business.slogan}"</p>
                )}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  {business.is_verified ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" /> Verificado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <XCircle className="w-4 h-4 mr-1" /> No verificado
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Building2 className="w-4 h-4 mr-1" /> {business.status || 'Activo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            {business.description && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{business.description}</p>
              </div>
            )}

            {/* Información de contacto y dirección */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Contacto</h2>
                <div className="space-y-2">
                  {business.email && (
                    <div className="flex items-center text-gray-700">
                      <Mail className="w-5 h-5 mr-3 text-gray-500" />
                      <a href={`mailto:${business.email}`} className="hover:text-blue-600">{business.email}</a>
                    </div>
                  )}
                  {business.phone && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="w-5 h-5 mr-3 text-gray-500" />
                      <a href={`tel:${business.phone}`} className="hover:text-blue-600">{business.phone}</a>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-center text-gray-700">
                      <Globe className="w-5 h-5 mr-3 text-gray-500" />
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 truncate">{business.website}</a>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Dirección</h2>
                {(business.address_line1 || business.address_line2) ? (
                  <div className="flex items-start text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      {business.address_line1 && <p>{business.address_line1}</p>}
                      {business.address_line2 && <p>{business.address_line2}</p>}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No especificada</p>
                )}
              </div>

              <div className="space-y-4 md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Información adicional</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Moneda</p>
                    <p className="font-medium">{business.currency || 'USD'}</p>
                  </div>
                  {business.tax_rate !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">Tasa de impuesto</p>
                      <p className="font-medium">{business.tax_rate}%</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Fecha de creación</p>
                    <p className="font-medium">{new Date(business.created_at).toLocaleDateString()}</p>
                  </div>
                  {business.updated_at && (
                    <div>
                      <p className="text-sm text-gray-500">Última actualización</p>
                      <p className="font-medium">{new Date(business.updated_at).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sección de productos (placeholder) */}
          <div className="border-t border-gray-200 px-6 sm:px-8 py-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Productos</h2>
            <div className="text-center py-12">
              <p className="text-gray-500">Próximamente: Lista de productos de este negocio.</p>
              {/* Aquí irá el grid de productos cuando estén implementados */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};