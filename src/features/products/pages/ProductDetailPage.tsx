import { useParams, useNavigate } from 'react-router-dom';
import { useProductById, useDeleteProduct } from '../hooks/useProducts';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Package,
  Edit,
  Trash2,
  AlertCircle,
  Layers,
  Image as ImageIcon,
  Archive,
  Star,
  Tag,
  Calendar,
  Hash,
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = parseInt(id || '0', 10);
  const { data: product, isLoading, error } = useProductById(productId);
  const deleteMutation = useDeleteProduct();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Error al cargar el producto</h2>
        <p className="text-gray-600 mt-2">El producto no existe o hubo un problema.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/products')}>
          Volver a productos
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('¿Eliminar permanentemente este producto? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate(productId, {
        onSuccess: () => {
          toast.success('Producto eliminado');
          navigate('/products');
        },
        onError: (error: any) => {
          toast.error(`Error al eliminar: ${error.message}`);
        },
      });
    }
  };

  const images = product.images || [];
  const mainImage = images.find((img) => img.is_primary) || images[0];
  const displayImage = selectedImage || mainImage?.image_url || null;

  const handleThumbnailClick = (url: string) => {
    setSelectedImage(url);
  };

  const statusMap = {
    active: { text: 'Activo', color: 'text-green-600 bg-green-50' },
    draft: { text: 'Borrador', color: 'text-yellow-600 bg-yellow-50' },
    discontinued: { text: 'Discontinuado', color: 'text-red-600 bg-red-50' },
    archived: { text: 'Discontinuado', color: 'text-red-600 bg-red-50' },
    out_of_stock: { text: 'Agotado', color: 'text-red-600 bg-red-50' },
  };
  const currentStatus = statusMap[product.status] || { text: product.status, color: 'text-gray-600 bg-gray-50' };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navegación superior */}
        <div className="mb-6 text-sm text-gray-500">
          <span className="cursor-pointer hover:text-gray-700" onClick={() => navigate('/products')}>
            Productos
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">{product.name}</span>
        </div>

        {/* Contenido principal: dos columnas sin bordes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Columna izquierda: Imagen a pantalla completa */}
          <div>
            {displayImage ? (
              <div className="w-full bg-gray-100 flex items-center justify-center" style={{ minHeight: '500px' }}>
                <img
                  src={displayImage}
                  alt={product.name}
                  className="w-full h-auto object-contain max-h-[70vh]"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800?text=Imagen+no+disponible';
                  }}
                />
              </div>
            ) : (
              <div className="w-full bg-gray-100 flex items-center justify-center" style={{ minHeight: '500px' }}>
                <ImageIcon className="w-20 h-20 text-gray-400" />
              </div>
            )}

            {/* Miniaturas (si hay más de una) */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => handleThumbnailClick(img.image_url)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      displayImage === img.image_url ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={img.alt_text || product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/80?text=Error';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna derecha: Información del producto sin tarjetas */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {product.short_description && (
                <p className="mt-2 text-lg text-gray-600">{product.short_description}</p>
              )}
            </div>

            {/* Badges de estado */}
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus.color}`}>
                <Package className="w-4 h-4 mr-1" />
                {currentStatus.text}
              </span>
              {product.is_featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-600">
                  <Star className="w-4 h-4 mr-1" /> Destacado
                </span>
              )}
              {product.is_digital && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
                  Digital
                </span>
              )}
            </div>

            {/* Precios */}
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">${product.base_price}</span>
                {product.compare_price && (
                  <span className="text-xl text-gray-400 line-through">${product.compare_price}</span>
                )}
              </div>
              {product.is_on_sale && product.sale_price && (
                <p className="mt-1 text-lg text-green-600">Oferta: ${product.sale_price}</p>
              )}
            </div>

            {/* Detalles en columnas */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Hash className="w-4 h-4 mr-1" /> SKU
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{product.sku || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Tag className="w-4 h-4 mr-1" /> Categoría
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{product.category_id ? `ID: ${product.category_id}` : 'Sin categoría'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Package className="w-4 h-4 mr-1" /> Stock
                </dt>
                <dd className={`mt-1 text-sm ${product.track_quantity ? (product.quantity <= (product.low_stock_threshold || 0) ? 'text-red-600 font-semibold' : 'text-gray-900') : 'text-gray-500'}`}>
                  {product.track_quantity ? product.quantity : 'Sin seguimiento'}
                  {product.track_quantity && product.quantity <= (product.low_stock_threshold || 0) && (
                    <span className="ml-1 text-xs text-red-500">(bajo)</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" /> Creado
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{new Date(product.created_at).toLocaleDateString()}</dd>
              </div>
              {product.updated_at && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Actualizado</dt>
                  <dd className="mt-1 text-sm text-gray-900">{new Date(product.updated_at).toLocaleDateString()}</dd>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => navigate(`/products/${product.id}/edit`)}
              >
                <Edit className="w-4 h-4 mr-2" /> Editar producto
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Eliminar
              </Button>
            </div>
          </div>
        </div>

        {/* Sección inferior sin tarjetas */}
        <div className="mt-12 space-y-10">
          {product.description && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Descripción</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.variants && product.variants.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Layers className="w-6 h-6 mr-2" /> Variantes
              </h2>
              <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opción 1</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opción 2</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opción 3</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {product.variants.map((variant) => (
                      <tr key={variant.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.sku || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.option1 || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.option2 || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.option3 || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                          {variant.price ? `$${variant.price}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{variant.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(product.meta_title || product.meta_description) && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">SEO</h2>
              <dl className="space-y-2">
                {product.meta_title && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Título SEO</dt>
                    <dd className="text-sm text-gray-900">{product.meta_title}</dd>
                  </div>
                )}
                {product.meta_description && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Descripción SEO</dt>
                    <dd className="text-sm text-gray-900">{product.meta_description}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};