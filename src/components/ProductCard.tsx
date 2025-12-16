import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Image as ImageIcon, Eye, ExternalLink } from 'lucide-react';
import { Product, AddOn } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { addToCart, getDiscountedPrice, currentUserData, isDarkMode, businessConfig } = useApp();
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [observations, setObservations] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddOnToggle = (addOn: AddOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(item => item.id === addOn.id);
      if (exists) {
        return prev.filter(item => item.id !== addOn.id);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const getTotalPrice = () => {
    const addOnsPrice = selectedAddOns.reduce((total, addOn) => total + addOn.price, 0);
    let basePrice = product.price;
    
    // Apply product discount first
    if (product.discount) {
      basePrice = basePrice * (1 - product.discount / 100);
    }
    
    // Apply user discount if logged in
    if (currentUserData && businessConfig.userDiscount?.isEnabled) {
      const discountAmount = businessConfig.userDiscount?.amount || 2;
      basePrice = Math.max(0, basePrice - discountAmount);
    }
    
    return (basePrice + addOnsPrice) * quantity;
  };

  const getOriginalPrice = () => {
    const addOnsPrice = selectedAddOns.reduce((total, addOn) => total + addOn.price, 0);
    return (product.price + addOnsPrice) * quantity;
  };

  const hasAnyDiscount = () => {
    return product.discount || (currentUserData && businessConfig.userDiscount?.isEnabled);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedAddOns, observations);
    }
    setSelectedAddOns([]);
    setObservations('');
    setQuantity(1);
    setShowDetails(false);
  };

  // NOVA FUNCIONALIDADE: Checkout direto
  const handleDirectCheckout = () => {
    if (!product.checkoutUrl) {
      alert('Link de checkout não configurado para este produto');
      return;
    }

    // Abrir link de checkout em nova aba
    window.open(product.checkoutUrl, '_blank');
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onProductClick(product);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const cardBg = isDarkMode ? 'bg-gray-800' : businessConfig.colors?.cardBackground || 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const primaryColor = businessConfig.colors?.primary || '#F97316';

  // Get image size configuration with proper implementation
  const getImageHeight = () => {
    const imageSize = businessConfig.imageSize || 'square';
    const customImageSize = businessConfig.customImageSize;
    
    if (imageSize === 'custom' && customImageSize && customImageSize > 0) {
      // Aplicar tamanho personalizado com responsividade
      const mobileSize = Math.max(120, customImageSize * 0.6);
      const tabletSize = Math.max(150, customImageSize * 0.8);
      const desktopSize = Math.max(180, customImageSize);
      
      return {
        height: `clamp(${mobileSize}px, ${customImageSize * 0.15}vw, ${desktopSize}px)`
      };
    } else if (imageSize === 'reels') {
      return { 
        height: 'clamp(160px, 22vw, 260px)'
      };
    } else {
      // Default square format
      return { 
        height: 'clamp(120px, 18vw, 220px)'
      };
    }
  };

  const getImageClasses = () => {
    return 'w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105';
  };

  const getImageContainerClasses = () => {
    return 'relative overflow-hidden rounded-t-xl bg-gray-100 w-full flex-shrink-0';
  };

  // Verificar se há imagens adicionais
  const hasAdditionalImages = product.images && product.images.length > 0;

  // Verificar se o checkout está habilitado para este produto
  const isCheckoutEnabled = product.checkoutEnabled && product.checkoutUrl;

  // CORREÇÃO: Imagem otimizada sem loading state problemático
  const getImageSrc = () => {
    if (imageError) {
      return 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=500';
    }
    return product.image;
  };

  return (
    <div className={`${cardBg} rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 w-full max-w-sm mx-auto flex flex-col`}>
      <div className={getImageContainerClasses()}>
        {/* CORREÇÃO: Imagem otimizada sem placeholder de loading */}
        <img
          src={getImageSrc()}
          alt={product.name}
          className={getImageClasses()}
          onClick={handleImageClick}
          style={{
            ...getImageHeight(),
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
          onError={handleImageError}
          loading="lazy"
          // CORREÇÃO: Removido onLoad para evitar re-renders desnecessários
        />
        
        {/* Badges responsivos */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          {product.discount && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{product.discount}%
            </div>
          )}
          {currentUserData && businessConfig.userDiscount?.isEnabled && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -R$ {businessConfig.userDiscount.amount.toFixed(2)}
            </div>
          )}
        </div>

        {/* Ícone de visualização - responsivo */}
        {hasAdditionalImages && (
          <div className="absolute top-2 left-2">
            <button
              onClick={handleImageClick}
              className="bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-full transition-colors"
              title="Ver todas as imagens"
            >
              <Eye size={14} />
            </button>
          </div>
        )}

        {/* Indicador de múltiplas imagens */}
        {hasAdditionalImages && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
            <ImageIcon size={10} />
            <span>{product.images.length + 1}</span>
          </div>
        )}
      </div>
      
      <div className="p-3 flex-grow flex flex-col">
        <h3 
          className={`text-sm font-semibold ${textColor} mb-2 cursor-pointer hover:text-orange-600 transition-colors line-clamp-2`}
          onClick={() => onProductClick(product)}
        >
          {product.name}
        </h3>
        <p className={`${textSecondary} text-xs mb-3 line-clamp-2`}>{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            {hasAnyDiscount() && (
              <span className="text-gray-400 line-through text-xs">
                R$ {getOriginalPrice().toFixed(2)}
              </span>
            )}
            <span className="text-orange-600 font-bold text-sm">
              R$ {getTotalPrice().toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-auto">
          {!showDetails ? (
            <div className="space-y-2">
              {/* Botão de checkout direto (se configurado) */}
              {isCheckoutEnabled && (
                <button
                  onClick={handleDirectCheckout}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
                >
                  <ExternalLink size={16} />
                  <span>{product.checkoutText || 'Comprar Agora'}</span>
                </button>
              )}
              
              {/* Botão do carrinho - só mostrar se checkout NÃO estiver habilitado */}
              {!isCheckoutEnabled && (
                <button
                  onClick={() => setShowDetails(true)}
                  className="w-full text-white py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  <ShoppingCart size={16} />
                  <span>Adicionar</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {product.addOns && product.addOns.length > 0 && (
                <div>
                  <h4 className={`font-medium ${textColor} mb-2 text-sm`}>Adicionais:</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {product.addOns.map((addOn) => (
                      <label key={addOn.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAddOns.some(item => item.id === addOn.id)}
                          onChange={() => handleAddOnToggle(addOn)}
                          className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4"
                        />
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm ${textColor} truncate block`}>{addOn.name}</span>
                          <span className="text-sm text-orange-600">
                            +R$ {addOn.price.toFixed(2)}
                          </span>
                          {addOn.description && (
                            <span className={`text-xs ${textSecondary} block truncate`}>
                              {addOn.description}
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Observações:
                </label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Alguma observação especial?"
                  className={`w-full border ${inputBg} rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500`}
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`p-1 rounded-full transition-colors ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <Minus size={12} />
                  </button>
                  <span className={`font-medium ${textColor} text-sm`}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`p-1 rounded-full transition-colors ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <div className="text-right">
                  {hasAnyDiscount() && (
                    <div className="text-xs text-gray-400 line-through">
                      R$ {getOriginalPrice().toFixed(2)}
                    </div>
                  )}
                  <span className="font-bold text-orange-600 text-sm">
                    R$ {getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setShowDetails(false)}
                  className={`flex-1 py-2 px-2 rounded-lg font-medium transition-colors duration-200 text-sm ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 text-white py-2 px-2 rounded-lg font-medium transition-colors duration-200 text-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  Adicionar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;