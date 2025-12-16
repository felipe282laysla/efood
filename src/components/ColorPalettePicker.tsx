import React, { useState } from 'react';
import { Palette, Check, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ColorPalettePickerProps {
  isDarkMode?: boolean;
}

const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({ isDarkMode = false }) => {
  const { businessConfig, updateBusinessConfig } = useApp();
  const [customColors, setCustomColors] = useState(businessConfig.colors || {
    background: '#FFF7ED',
    primary: '#F97316',
    secondary: '#DC2626',
    accent: '#FCD34D',
    text: '#1F2937',
    textSecondary: '#6B7280',
    cardBackground: '#FFFFFF',
    headerBackground: '#FFFFFF'
  });

  const predefinedPalettes = [
    {
      name: 'Laranja Clássico',
      colors: {
        background: '#FFF7ED',
        primary: '#F97316',
        secondary: '#DC2626',
        accent: '#FCD34D',
        text: '#1F2937',
        textSecondary: '#6B7280',
        cardBackground: '#FFFFFF',
        headerBackground: '#FFFFFF'
      }
    },
    {
      name: 'Azul Profissional',
      colors: {
        background: '#F0F9FF',
        primary: '#0EA5E9',
        secondary: '#1E40AF',
        accent: '#60A5FA',
        text: '#1F2937',
        textSecondary: '#6B7280',
        cardBackground: '#FFFFFF',
        headerBackground: '#FFFFFF'
      }
    },
    {
      name: 'Verde Natural',
      colors: {
        background: '#F0FDF4',
        primary: '#22C55E',
        secondary: '#15803D',
        accent: '#86EFAC',
        text: '#1F2937',
        textSecondary: '#6B7280',
        cardBackground: '#FFFFFF',
        headerBackground: '#FFFFFF'
      }
    },
    {
      name: 'Roxo Moderno',
      colors: {
        background: '#FAF5FF',
        primary: '#A855F7',
        secondary: '#7C3AED',
        accent: '#C4B5FD',
        text: '#1F2937',
        textSecondary: '#6B7280',
        cardBackground: '#FFFFFF',
        headerBackground: '#FFFFFF'
      }
    },
    {
      name: 'Rosa Elegante',
      colors: {
        background: '#FDF2F8',
        primary: '#EC4899',
        secondary: '#BE185D',
        accent: '#F9A8D4',
        text: '#1F2937',
        textSecondary: '#6B7280',
        cardBackground: '#FFFFFF',
        headerBackground: '#FFFFFF'
      }
    },
    {
      name: 'Vermelho Vibrante',
      colors: {
        background: '#FEF2F2',
        primary: '#EF4444',
        secondary: '#DC2626',
        accent: '#FCA5A5',
        text: '#1F2937',
        textSecondary: '#6B7280',
        cardBackground: '#FFFFFF',
        headerBackground: '#FFFFFF'
      }
    }
  ];

  const handlePaletteSelect = async (palette: typeof predefinedPalettes[0]) => {
    setCustomColors(palette.colors);
    try {
      await updateBusinessConfig({
        colors: palette.colors,
        backgroundColor: palette.colors.background,
        primaryColor: palette.colors.primary,
        secondaryColor: palette.colors.secondary
      });
      alert('Paleta de cores aplicada com sucesso!');
    } catch (error) {
      alert('Erro ao aplicar paleta de cores');
      console.error(error);
    }
  };

  const handleCustomColorChange = (colorKey: string, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const handleSaveCustomColors = async () => {
    try {
      await updateBusinessConfig({
        colors: customColors,
        backgroundColor: customColors.background,
        primaryColor: customColors.primary,
        secondaryColor: customColors.secondary
      });
      alert('Cores personalizadas salvas com sucesso!');
    } catch (error) {
      alert('Erro ao salvar cores personalizadas');
      console.error(error);
    }
  };

  const handleResetColors = () => {
    const defaultColors = {
      background: '#FFF7ED',
      primary: '#F97316',
      secondary: '#DC2626',
      accent: '#FCD34D',
      text: '#1F2937',
      textSecondary: '#6B7280',
      cardBackground: '#FFFFFF',
      headerBackground: '#FFFFFF'
    };
    setCustomColors(defaultColors);
  };

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center space-x-3 mb-6">
        <Palette className={`h-6 w-6 ${textColor}`} />
        <div>
          <h2 className={`text-xl font-bold ${textColor}`}>Paleta de Cores</h2>
          <p className={`text-sm ${textSecondary}`}>
            Personalize as cores da sua loja
          </p>
        </div>
      </div>

      {/* Paletas Predefinidas */}
      <div className="mb-8">
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Paletas Predefinidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predefinedPalettes.map((palette, index) => (
            <div
              key={index}
              className={`border ${borderColor} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => handlePaletteSelect(palette)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${textColor}`}>{palette.name}</h4>
                {JSON.stringify(businessConfig.colors) === JSON.stringify(palette.colors) && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div className="flex space-x-2">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: palette.colors.primary }}
                  title="Cor Primária"
                />
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: palette.colors.secondary }}
                  title="Cor Secundária"
                />
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: palette.colors.accent }}
                  title="Cor de Destaque"
                />
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: palette.colors.background }}
                  title="Cor de Fundo"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cores Personalizadas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${textColor}`}>Cores Personalizadas</h3>
          <button
            onClick={handleResetColors}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Resetar para cores padrão"
          >
            <RotateCcw size={16} />
            <span className="text-sm">Resetar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {Object.entries(customColors).map(([key, value]) => (
            <div key={key}>
              <label className={`block text-sm font-medium ${textColor} mb-2 capitalize`}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleCustomColorChange(key, e.target.value)}
                  className="w-12 h-10 rounded border-2 border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleCustomColorChange(key, e.target.value)}
                  className={`flex-1 px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono`}
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleSaveCustomColors}
            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Check size={16} />
            <span>Aplicar Cores Personalizadas</span>
          </button>
        </div>
      </div>

      {/* Preview das Cores */}
      <div className="mt-8 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <h4 className={`text-sm font-medium ${textSecondary} mb-3`}>Preview das Cores:</h4>
        <div className="space-y-2">
          <div 
            className="p-3 rounded-lg"
            style={{ 
              backgroundColor: customColors.background,
              color: customColors.text,
              border: `1px solid ${customColors.primary}`
            }}
          >
            <div className="flex items-center justify-between">
              <span style={{ color: customColors.text }}>Texto Principal</span>
              <button 
                className="px-3 py-1 rounded text-white text-sm"
                style={{ backgroundColor: customColors.primary }}
              >
                Botão Primário
              </button>
            </div>
            <p className="text-sm mt-1" style={{ color: customColors.textSecondary }}>
              Texto secundário com cor de destaque
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPalettePicker;