import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const HomeBannerCarousel: React.FC = () => {
  const { businessConfig, homeBanners } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filtrar apenas banners ativos
  const activeBanners = homeBanners.filter(banner => banner.isActive);

  // Auto slide functionality
  useEffect(() => {
    if (!businessConfig.homeBanners?.autoSlide || activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      if (businessConfig.homeBanners?.direction === 'left') {
        setCurrentSlide(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
      } else {
        setCurrentSlide(prev => (prev + 1) % activeBanners.length);
      }
    }, (businessConfig.homeBanners.slideInterval || 5) * 1000);

    return () => clearInterval(interval);
  }, [activeBanners.length, businessConfig.homeBanners?.autoSlide, businessConfig.homeBanners?.slideInterval, businessConfig.homeBanners?.direction]);

  // Não mostrar se não estiver habilitado ou não houver banners
  if (!businessConfig.homeBanners?.isEnabled || activeBanners.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % activeBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleBannerClick = (banner: any) => {
    if (banner.link) {
      window.open(banner.link, '_blank');
    }
  };

  const containerClass = businessConfig.homeBanners?.fullWidth 
    ? "w-full overflow-hidden shadow-lg" 
    : "relative w-full overflow-hidden rounded-lg shadow-lg";

  return (
    <div className={containerClass}>
      {/* Container responsivo com altura adaptável */}
      <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[80vh]">
        {/* Banners - RESPONSIVIDADE CORRIGIDA */}
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {activeBanners.map((banner, index) => (
            <div
              key={banner.id}
              className="w-full h-full flex-shrink-0 relative cursor-pointer"
              onClick={() => handleBannerClick(banner)}
            >
              {/* IMAGEM TOTALMENTE RESPONSIVA - SEM CORTES */}
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="lazy"
                onLoad={() => console.log('Imagem banner carrossel carregada com sucesso')}
                onError={(e) => {
                  console.error('Erro ao carregar imagem banner carrossel:', e);
                }}
              />
              
              {/* Overlay com gradiente para melhor legibilidade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Conteúdo do banner - RESPONSIVO MELHORADO */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 drop-shadow-lg leading-tight">
                    {banner.title}
                  </h2>
                  {banner.description && (
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 drop-shadow-md leading-tight">
                      {banner.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controles de navegação - apenas se houver mais de 1 banner e se estiver habilitado */}
        {activeBanners.length > 1 && businessConfig.homeBanners?.showArrows !== false && (
          <>
            {/* Botões anterior/próximo - MELHORADOS PARA MOBILE */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full transition-all duration-200 z-10"
              aria-label="Banner anterior"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full transition-all duration-200 z-10"
              aria-label="Próximo banner"
            >
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Indicadores - apenas se houver mais de 1 banner e se estiver habilitado */}
        {activeBanners.length > 1 && businessConfig.homeBanners?.showDots !== false && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-white scale-110' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Ir para banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeBannerCarousel;