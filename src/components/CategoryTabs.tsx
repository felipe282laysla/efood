import React from 'react';
import { useApp } from '../context/AppContext';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, onCategoryChange }) => {
  const { categories, isDarkMode, businessConfig } = useApp();

  // Filtrar categorias ativas e remover duplicatas
  const activeCategories = categories
    .filter(cat => cat.isActive)
    .filter((category, index, self) => 
      index === self.findIndex(c => c.name.toLowerCase() === category.name.toLowerCase())
    );

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const tabBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
  const activeTabBg = businessConfig.colors?.primary || '#F97316';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-600';

  return (
    <div className={`sticky top-24 ${bgColor} shadow-sm z-40 px-4 py-3`} style={{ backgroundColor: isDarkMode ? '#1F2937' : (businessConfig.colors?.headerBackground || 'white') }}>
      <div className="max-w-7xl mx-auto">
        <div className={`${tabBg} rounded-lg p-1`}>
          {/* Container centralizado e responsivo */}
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-1 w-full max-w-full">
              {activeCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 min-w-0 ${
                    activeCategory === category.id
                      ? `text-white shadow-md`
                      : `${textColor} hover:text-gray-900 hover:bg-gray-200`
                  } ${
                    // Responsividade: ajustar tamanho baseado na quantidade de categorias
                    activeCategories.length <= 3 ? 'flex-1 max-w-xs' :
                    activeCategories.length <= 5 ? 'flex-1 max-w-48' :
                    activeCategories.length <= 7 ? 'flex-1 max-w-32' :
                    'flex-none'
                  }`}
                  style={activeCategory === category.id ? { backgroundColor: activeTabBg } : {}}
                >
                  <span className="text-lg flex-shrink-0">{category.icon}</span>
                  <span className="truncate">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;