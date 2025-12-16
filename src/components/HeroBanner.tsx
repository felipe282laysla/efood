import React from 'react';
import { useApp } from '../context/AppContext';

const HeroBanner: React.FC = () => {
  const { businessConfig, isDarkMode } = useApp();

  // CORREÇÃO: Verificar se há bannerImage ou heroImage configurada
  const bannerImage = businessConfig.bannerImage || businessConfig.heroImage;
  
  // Only show if bannerImage is configured
  if (!bannerImage) {
    return null;
  }

  const textColor = isDarkMode ? 'text-white' : businessConfig.colors?.text || 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : businessConfig.colors?.textSecondary || 'text-gray-600';

  return (
    <div className="w-full relative overflow-hidden">
      {/* HERO BANNER TOTALMENTE RESPONSIVO - SEM CORTES */}
      <div className="relative w-full">
        {/* Container responsivo com aspect ratio adaptável */}
        <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[80vh]">
          <img 
            src={bannerImage}
            alt="Banner Principal"
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="lazy"
            onLoad={() => console.log('Imagem hero carregada com sucesso')}
            onError={(e) => {
              console.error('Erro ao carregar imagem hero:', e);
              // Fallback para imagem padrão se houver erro
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1200';
            }}
          />
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          
          {/* Text overlay - RESPONSIVO MELHORADO */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-2xl mb-3 sm:mb-4 md:mb-6 leading-tight">
                {businessConfig.name}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-lg mb-4 sm:mb-6 md:mb-8 leading-relaxed">
                {businessConfig.description}
              </p>
              <div className="flex items-center justify-center space-x-2 text-white/80">
                <span className="text-sm sm:text-base md:text-lg font-medium">{businessConfig.serviceRegion}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;