// ProductCard.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../stores/authStore';
import type { Product } from '../types/productTypes';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: number) => void;
  onToggleStatus?: (product: Product) => void;
}

export const ProductCard = ({ product, onEdit, onDelete, onToggleStatus }: ProductCardProps) => {
  const { user: currentUser } = useAuthStore();
  const canManage = currentUser?.role === 'admin'; //|| currentUser?.businessId === product.business_id;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(price);
  };

  const displayPrice = product.is_on_sale && product.sale_price ? product.sale_price : product.base_price;
  const originalPrice = product.is_on_sale && product.compare_price ? product.compare_price : null;

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    archived: 'bg-yellow-100 text-yellow-800',
    out_of_stock: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    discontinued: 'bg-red-100 text-red-800',
  };
  const statusText = {
    draft: 'Borrador',
    archived: 'Archivado',
    out_of_stock: 'Sin stock',
    active: 'Activo',
    discontinued: 'Descontinuado'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Imagen con carrusel */}
      <Link to={`/products/${product.id}`} className="block relative aspect-square bg-gray-100 group">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]?.image_url}
              alt={images[currentImageIndex]?.alt_text || product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400?text=Error';
              }}
            />
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`block w-1.5 h-1.5 rounded-full ${
                        idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-gray-500 text-4xl font-light">
              {product.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {product.is_featured && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
            Destacado
          </span>
        )}
        {product.is_on_sale && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Oferta
          </span>
        )}
      </Link>

      {/* Contenido */}
      <div className="p-3 sm:p-4">
        <Link to={`/products/${product.id}`} className="block group">
          <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          {product.short_description && (
            <p className="text-sm text-gray-500 truncate mt-0.5">{product.short_description}</p>
          )}
        </Link>

        {/* Precios */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(displayPrice)}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(originalPrice)}</span>
          )}
        </div>

        {/* Stock y estado */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {product.track_quantity ? (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                product.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {product.quantity > 0 ? `${product.quantity} en stock` : 'Agotado'}
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Stock no controlado
              </span>
            )}
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[product.status] || 'bg-gray-100 text-gray-800'}`}>
            {statusText[product.status] || product.status}
          </span>
        </div>

        {/* Acciones */}
        {(onEdit || onDelete || onToggleStatus) && canManage && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end gap-2">
            {onEdit && (
              <Button size="sm" variant="ghost" onClick={() => onEdit(product)}>
                Editar
              </Button>
            )}
            {onToggleStatus && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onToggleStatus(product)}
                className={product.status === 'active' ? 'text-yellow-600' : 'text-green-600'}
              >
                {product.status === 'active' ? 'Archivar' : 'Publicar'}
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                className="text-red-600 hover:bg-red-50"
                onClick={() => onDelete(product.id)}
              >
                Eliminar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};