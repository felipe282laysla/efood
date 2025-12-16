import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SponsorsSection: React.FC = () => {
  const { businessConfig, sponsors, isDarkMode } = useApp();

  // Filtrar apenas patrocinadores ativos
  const activeSponsors = sponsors.filter(sponsor => sponsor.isActive);

  // Não mostrar se não estiver habilitado ou não houver patrocinadores
  if (!businessConfig.sponsors?.isEnabled || activeSponsors.length === 0) {
    return null;
  }

  const handleSponsorClick = (link: string) => {
    window.open(link, '_blank');
  };

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="w-full py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${bgColor} rounded-lg shadow-md p-6 sm:p-8`}>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold ${textColor} mb-2`}>
              {businessConfig.sponsors?.title || 'Nossos Parceiros'}
            </h2>
            <p className={`${textSecondary} text-sm sm:text-base`}>
              Conheça as empresas que apoiam nosso trabalho
            </p>
          </div>

          {/* GRID RESPONSIVO PARA PATROCINADORES */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {activeSponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className={`group relative border ${borderColor} rounded-lg p-3 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`}
                onClick={() => handleSponsorClick(sponsor.link)}
              >
                {/* IMAGEM DO PATROCINADOR RESPONSIVA */}
                <div className="aspect-square mb-2 sm:mb-4 overflow-hidden rounded-lg">
                  <img
                    src={sponsor.image}
                    alt={sponsor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Nome do patrocinador */}
                <h3 className={`text-center font-semibold ${textColor} mb-2 sm:mb-3 text-xs sm:text-sm`}>
                  {sponsor.name}
                </h3>

                {/* Botão Visite */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSponsorClick(sponsor.link);
                  }}
                  className="w-full flex items-center justify-center space-x-1 sm:space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-medium transition-colors duration-200 text-xs sm:text-sm"
                >
                  <ExternalLink size={12} className="sm:w-4 sm:h-4" />
                  <span>Visite</span>
                </button>

                {/* Efeito hover overlay */}
                <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorsSection;