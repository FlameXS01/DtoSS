import { useParams } from 'react-router-dom';
import { useBusiness } from '../hooks/useBusiness';

export const BusinessDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const businessId = parseInt(id || '0', 10);
  const { data: business, isLoading, error } = useBusiness(businessId);

  if (isLoading) return <div className="p-8 text-center">Cargando usuario...</div>;
  if (error || !business) return <div className="p-8 text-center text-red-600">Usuario no encontrado</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {business.business_name || business.legal_name} {business.description || ''}
            </h1>
            <p className="text-gray-600">{business.slogan}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold text-gray-700">Email</h2>
            <p>{business.email}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700">Teléfono</h2>
            <p>{business.phone || 'No especificado'}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700">Estado</h2>
            <p>
              {business.is_verified ? (
                <span className="text-green-600">Verificado</span>
              ) : (
                <span className="text-red-600">No Verificado</span>
              )}
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700">Creado</h2>
            <p>{new Date(business.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700">Último acceso</h2>
          </div>
        </div>
      </div>
    </div>
  );
};