import React from 'react';
import { useApp } from '../context/AppContext';

const PromotionBanner: React.FC = () => {
  const { businessConfig } = useApp();

  if (!businessConfig.promotionBanner?.isActive) {
    return null;
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleButtonClick = () => {
    if (businessConfig.promotionBanner?.buttonLink) {
      window.open(businessConfig.promotionBanner.buttonLink, '_blank');
    } else {
      scrollToSection('menu-section');
    }
  };

  const handleSecondaryButtonClick = () => {
    if (businessConfig.promotionBanner?.secondaryButtonLink) {
      window.open(businessConfig.promotionBanner.secondaryButtonLink, '_blank');
    } else {
      scrollToSection('reviews-section');
    }
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* BANNER TOTALMENTE RESPONSIVO - SEM CORTES */}
      <div className="relative w-full">
        {/* Container responsivo com altura adaptável */}
        <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[80vh]">
          {businessConfig.promotionBanner.image ? (
            <img 
              src={businessConfig.promotionBanner.image}
              alt="Banner Promocional"
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="lazy"
              onLoad={() => console.log('Imagem banner promocional carregada com sucesso')}
              onError={(e) => {
                console.error('Erro ao carregar imagem banner promocional:', e);
              }}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"></div>
          )}
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        {/* Text overlay positioned at the bottom - RESPONSIVO MELHORADO */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-2xl mb-3 sm:mb-4 md:mb-6 leading-tight">
              {businessConfig.promotionBanner.text}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-lg mb-4 sm:mb-6 md:mb-8 leading-relaxed">
              {businessConfig.promotionBanner.description || 'Aproveite esta oferta especial por tempo limitado!'}
            </p>
            
            {/* Call to action buttons - RESPONSIVOS MELHORADOS */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
              <button 
                onClick={handleButtonClick}
                className="bg-white text-orange-600 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg hover:bg-orange-50 transition-all duration-200 shadow-xl flex-1 sm:flex-none"
              >
                {businessConfig.promotionBanner.buttonText || 'Ver Ofertas'}
              </button>
              <button 
                onClick={handleSecondaryButtonClick}
                className="bg-green-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg hover:bg-green-600 transition-all duration-200 shadow-xl flex-1 sm:flex-none"
              >
                {businessConfig.promotionBanner.secondaryButtonText || 'Peça Agora'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionBanner;