import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, AddOn } from '../types';
import { useApp } from '../context/AppContext';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart, getDiscountedPrice, currentUserData, businessConfig, isDarkMode } = useApp();
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [observations, setObservations] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !product) return null;

  // Get all images (main image + additional images)
  const allImages = [product.image, ...(product.images || [])];

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
    
    // Apply product discount
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
    setCurrentImageIndex(0);
    onClose();
  };

  const handleClose = () => {
    setSelectedAddOns([]);
    setObservations('');
    setQuantity(1);
    setCurrentImageIndex(0);
    setImageError(false);
    onClose();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    setImageError(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // CORREÇÃO: Função para obter a imagem correta
  const getCurrentImageSrc = () => {
    if (imageError) {
      return 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    return allImages[currentImageIndex];
  };

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgColor} rounded-xl w-full max-w-md max-h-screen overflow-y-auto`}>
        <div className="relative">
          {/* GALERIA DE IMAGENS OTIMIZADA - SEM LOADING STATE PROBLEMÁTICO */}
          <div className="relative bg-gray-100 overflow-hidden h-64 sm:h-80 md:h-96">
            {/* CORREÇÃO: Imagem principal sem loading state */}
            <img
              src={getCurrentImageSrc()}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={handleImageError}
              loading="lazy"
              // CORREÇÃO: Removido onLoad para evitar re-renders
            />
            
            {/* Image Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                >
                  <ChevronRight size={20} />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setImageError(false);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Image Counter */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
          >
            <X size={20} />
          </button>
          
          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{product.discount}%
            </div>
          )}
          
          {/* User Discount Badge */}
          {currentUserData && businessConfig.userDiscount?.isEnabled && (
            <div className="absolute top-12 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -R$ {businessConfig.userDiscount.amount.toFixed(2)}
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h2 className={`text-2xl font-bold ${textColor} mb-2`}>{product.name}</h2>
            <p className={`${textSecondary} text-sm leading-relaxed`}>{product.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Show original price if there are discounts */}
            {hasAnyDiscount() && (
              <span className={`${textSecondary} line-through text-lg`}>
                R$ {getOriginalPrice().toFixed(2)}
              </span>
            )}
            
            {/* Final price */}
            <span className="text-orange-600 font-bold text-2xl">
              R$ {getTotalPrice().toFixed(2)}
            </span>
          </div>

          {/* User Discount Info */}
          {currentUserData && businessConfig.userDiscount?.isEnabled && (
            <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800 text-sm font-medium">
                🎉 Desconto de R$ {businessConfig.userDiscount.amount.toFixed(2)} aplicado automaticamente!
              </p>
            </div>
          )}

          {product.addOns && product.addOns.length > 0 && (
            <div>
              <h3 className={`font-semibold ${textColor} mb-3 text-base`}>Adicionais:</h3>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {product.addOns.map((addOn) => (
                  <label key={addOn.id} className={`flex items-center justify-between cursor-pointer p-3 border ${borderColor} rounded-lg hover:bg-gray-50 transition-colors ${isDarkMode ? 'hover:bg-gray-700' : ''}`}>
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedAddOns.some(item => item.id === addOn.id)}
                        onChange={() => handleAddOnToggle(addOn)}
                        className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4"
                      />
                      <div className="min-w-0 flex-1">
                        <span className={`${textColor} text-base block truncate`}>{addOn.name}</span>
                        {addOn.description && (
                          <p className={`text-xs ${textSecondary} truncate`}>{addOn.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-orange-600 font-medium text-base ml-2">
                      +R$ {addOn.price.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className={`block text-sm font-semibold ${textColor} mb-2`}>
              Observações:
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Alguma observação especial para seu pedido?"
              className={`w-full border ${borderColor} ${inputBg} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium ${textColor}`}>Quantidade:</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`p-2 rounded-full transition-colors ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <Minus size={16} />
                </button>
                <span className={`font-semibold text-lg w-8 text-center ${textColor}`}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={`p-2 rounded-full transition-colors ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="text-right">
              {hasAnyDiscount() && (
                <div className={`text-sm ${textSecondary} line-through`}>
                  R$ {getOriginalPrice().toFixed(2)}
                </div>
              )}
              <span className="text-2xl font-bold text-orange-600">
                R$ {getTotalPrice().toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ShoppingCart size={20} />
            <span>Adicionar ao Carrinho</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;