import React from 'react';
import { useApp } from '../context/AppContext';

const FooterPromoBanner: React.FC = () => {
  const { businessConfig } = useApp();

  if (!businessConfig.footerPromoBanner?.isActive) {
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
    if (businessConfig.footerPromoBanner?.buttonLink) {
      window.open(businessConfig.footerPromoBanner.buttonLink, '_blank');
    } else {
      scrollToSection('menu-section');
    }
  };

  const bannerStyle = {
    backgroundColor: businessConfig.footerPromoBanner.backgroundColor,
    color: businessConfig.footerPromoBanner.textColor
  };

  return (
    <div 
      className="w-full py-8 px-4 text-center relative overflow-hidden"
      style={bannerStyle}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {businessConfig.footerPromoBanner.text}
        </h2>
        
        <button
          onClick={handleButtonClick}
          className="inline-flex items-center space-x-2 bg-white text-gray-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl"
        >
          <span>{businessConfig.footerPromoBanner.buttonText}</span>
          <span className="text-xl">🛒</span>
        </button>
      </div>
    </div>
  );
};

export default FooterPromoBanner;