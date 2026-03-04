import { useParams } from 'react-router-dom';
import { useBusiness } from '../hooks/useBusiness';
import { useProductByBusiness } from '../../products/hooks/useProducts';
import { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
} from 'lucide-react';
import { ProductCard } from '../../products/components/ProductCard';
import Pagination from '../../../components/ui/Pagination/Pagination';

export const BusinessDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const businessId = parseInt(id || '0', 10);
  const { data: business, isLoading, error } = useBusiness(businessId);

  // Paginación para productos
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;
  const skip = (currentPage - 1) * limit;

  const { data: productsData, isLoading: productsLoading } = useProductByBusiness(
    businessId,
    { skip, limit }
  );
  const products = productsData?.items || [];
  const totalProducts = productsData?.total || 0;
  const totalPages = Math.ceil(totalProducts / limit);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 h-[600px] bg-gray-200 rounded-lg"></div>
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Error al cargar el negocio</h2>
          <p className="text-gray-600 mt-2">El negocio no existe o hubo un problema.</p>
        </div>
      </div>
    );
  }

  const bannerUrl = business.banner_url || 'https://via.placeholder.com/800x600?text=No+Banner';
  const logoUrl = business.logo_url;
  const businessName = business.business_name || business.legal_name || 'Sin nombre';

  const getInitials = () => {
    const name = businessName;
    const words = name.split(' ').slice(0, 2);
    return words.map(word => word[0]?.toUpperCase()).join('');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid de dos columnas: izquierda información, derecha productos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del negocio (ocupa toda la altura) */}
          <div className="md:col-span-1 relative">
            {/* Contenedor sticky que ocupa toda la altura disponible */}
            <div className="sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto rounded-xl shadow-lg">
              {/* Banner de fondo que cubre todo */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bannerUrl})` }}
              />
              {/* Overlay oscuro */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />

              {/* Contenido con scroll interno si es necesario */}
              <div className="relative z-10 h-full flex flex-col p-6 text-white overflow-y-auto">
                {/* Logo o iniciales */}
                <div className="flex justify-center mb-4 flex-shrink-0">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={businessName}
                      className="w-28 h-28 rounded-xl object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<div class="w-28 h-28 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-4xl border-4 border-white shadow-lg">${getInitials()}</div>`;
                      }}
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-4xl border-4 border-white shadow-lg">
                      {getInitials()}
                    </div>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-center">{businessName}</h1>
                {business.slogan && (
                  <p className="text-center text-white/80 italic mt-1">"{business.slogan}"</p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
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
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <Building2 className="w-3 h-3 mr-1" />
                    {business.status || 'Activo'}
                  </span>
                </div>

                {/* Descripción */}
                {business.description && (
                  <div className="mt-4 text-sm text-white/90 line-clamp-4">
                    {business.description}
                  </div>
                )}

                {/* Separador */}
                <hr className="my-4 border-white/20" />

                {/* Contacto y dirección */}
                <div className="space-y-3 text-sm flex-1">
                  {business.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-white/70 flex-shrink-0" />
                      <a href={`mailto:${business.email}`} className="hover:underline break-all">
                        {business.email}
                      </a>
                    </div>
                  )}
                  {business.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-white/70 flex-shrink-0" />
                      <a href={`tel:${business.phone}`} className="hover:underline">
                        {business.phone}
                      </a>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-3 text-white/70 flex-shrink-0" />
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline truncate"
                      >
                        {business.website}
                      </a>
                    </div>
                  )}
                  { (
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-3 text-white/70 flex-shrink-0 mt-0.5" />
                      <div>
                        {business.address_line1 && <p>{business.address_line1}</p>}
                        {business.address_line2 && <p>{business.address_line2}</p>}
                        
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadatos adicionales */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <dl className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <dt className="text-white/60">Moneda</dt>
                      <dd className="font-medium">{business.currency || 'USD'}</dd>
                    </div>
                    {business.tax_rate !== undefined && (
                      <div>
                        <dt className="text-white/60">Impuesto</dt>
                        <dd className="font-medium">{business.tax_rate}%</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-white/60">Creado</dt>
                      <dd className="font-medium">
                        {new Date(business.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                    {business.updated_at && (
                      <div>
                        <dt className="text-white/60">Actualizado</dt>
                        <dd className="font-medium">
                          {new Date(business.updated_at).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Productos */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Package className="w-5 h-5 mr-2 text-gray-600" />
                  Productos ({totalProducts})
                </h2>
              </div>

              {productsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-100 h-48 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="mt-6">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">Este negocio aún no tiene productos.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};