import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import CategoryTabs from '../components/CategoryTabs';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Cart from '../components/Cart';
import ReviewsSection from '../components/ReviewsSection';
import PromotionBanner from '../components/PromotionBanner';
import FooterPromoBanner from '../components/FooterPromoBanner';
import BusinessStatusBanner from '../components/BusinessStatusBanner';
import HeroBanner from '../components/HeroBanner';
import HomeBannerCarousel from '../components/HomeBannerCarousel';
import SponsorsSection from '../components/SponsorsSection';
import { Product } from '../types';

const Menu: React.FC = () => {
  const { products, cartItems, businessConfig, categories, isDarkMode } = useApp();
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Set default active category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      const firstActiveCategory = categories.find(cat => cat.isActive);
      if (firstActiveCategory) {
        setActiveCategory(firstActiveCategory.id);
      }
    }
  }, [categories, activeCategory]);

  // Aplicar configuração de modo escuro forçado
  useEffect(() => {
    const body = document.body;
    if (businessConfig.darkModeConfig === 'forced-dark') {
      body.classList.add('dark');
    } else if (businessConfig.darkModeConfig === 'forced-light') {
      body.classList.remove('dark');
    }
    // Se for 'optional', não força nada
  }, [businessConfig.darkModeConfig]);

  const filteredProducts = products.filter(
    product => product.category === activeCategory && product.isActive
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const bgColor = isDarkMode ? 'bg-gray-900' : businessConfig.colors?.background || businessConfig.backgroundColor;

  // Determinar o layout baseado no modo da loja
  const isStoreMode = businessConfig.storeMode === 'store';

  // Estilo do background fixo - corrigido para não afetar containers
  const backgroundStyle = businessConfig.fixedBackground?.isEnabled ? {
    backgroundImage: businessConfig.fixedBackground.image ? `url(${businessConfig.fixedBackground.image})` : undefined,
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {};

  // Definir classes de grid baseadas no modo da loja com tamanhos consistentes
  const getGridClasses = () => {
    if (isStoreMode) {
      // Modo loja - mais produtos por linha
      return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3";
    } else {
      // Modo cardápio - layout original
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: isDarkMode ? '#111827' : (businessConfig.colors?.background || businessConfig.backgroundColor),
        ...backgroundStyle
      }}
    >
      <PromotionBanner />
      <BusinessStatusBanner />
      <Header 
        onCartClick={() => setIsCartOpen(true)} 
        cartItemCount={cartItemCount}
      />
      
      {/* CORREÇÃO: Banner Principal - Priorizar HeroBanner se não houver carrossel */}
      {businessConfig.homeBanners?.isEnabled ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <HomeBannerCarousel />
        </div>
      ) : (
        <HeroBanner />
      )}
      
      {/* Só mostrar CategoryTabs se houver categorias */}
      {categories.length > 0 && (
        <CategoryTabs 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}
      
      <main className="py-8" id="menu-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Container com background próprio para proteger dos backgrounds fixos */}
          <div 
            className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm`}
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.95)' : (businessConfig.colors?.cardBackground || 'rgba(255, 255, 255, 0.95)')
            }}
          >
            {/* Mostrar mensagem se não houver categorias */}
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : businessConfig.colors?.textSecondary || 'text-gray-500'}`}>
                  Nenhuma categoria encontrada. Configure as categorias no painel administrativo.
                </p>
              </div>
            ) : (
              <>
                {/* Layout dinâmico baseado no modo da loja com tamanhos consistentes */}
                <div className={getGridClasses()}>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onProductClick={handleProductClick}
                    />
                  ))}
                </div>
                
                {filteredProducts.length === 0 && activeCategory && (
                  <div className="text-center py-12">
                    <p className={`text-lg ${isDarkMode ? 'text-gray-400' : businessConfig.colors?.textSecondary || 'text-gray-500'}`}>
                      Nenhum produto encontrado nesta categoria.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Seção de comentários - condicional */}
      {businessConfig.reviewsSection?.isEnabled !== false && (
        <div id="reviews-section">
          <ReviewsSection />
        </div>
      )}

      {/* Seção de patrocinadores */}
      <SponsorsSection />

      <FooterPromoBanner />

      {/* CHAT WIDGET REMOVIDO CONFORME SOLICITADO */}

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Menu;