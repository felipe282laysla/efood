import React from 'react';
import { Store, Menu, Save, Image } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ImageUpload from '../ImageUpload';

const StoreModeManager: React.FC = () => {
  const { businessConfig, updateBusinessConfig, isDarkMode } = useApp();

  const handleModeChange = async (mode: 'menu' | 'store') => {
    try {
      await updateBusinessConfig({ storeMode: mode });
      alert(`Modo alterado para ${mode === 'menu' ? 'Cardápio' : 'Loja'} com sucesso!`);
    } catch (error) {
      alert('Erro ao alterar modo da loja');
      console.error(error);
    }
  };

  const handleFixedBackgroundToggle = async () => {
    try {
      await updateBusinessConfig({
        fixedBackground: {
          ...businessConfig.fixedBackground,
          isEnabled: !businessConfig.fixedBackground?.isEnabled
        }
      });
    } catch (error) {
      alert('Erro ao alterar configuração de background');
      console.error(error);
    }
  };

  const handleBackgroundImageChange = async (imageUrl: string) => {
    try {
      await updateBusinessConfig({
        fixedBackground: {
          ...businessConfig.fixedBackground,
          image: imageUrl
        }
      });
    } catch (error) {
      alert('Erro ao alterar imagem de background');
      console.error(error);
    }
  };

  const currentMode = businessConfig.storeMode || 'menu';

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-6">
      {/* Modo da Loja */}
      <div className={`${bgColor} rounded-lg shadow-md p-6`}>
        <div className="flex items-center space-x-3 mb-6">
          <Store className={`h-6 w-6 ${textColor}`} />
          <div>
            <h3 className={`text-lg font-bold ${textColor}`}>Modo da Loja</h3>
            <p className={`text-sm ${textSecondary}`}>
              Escolha entre o layout de cardápio ou loja
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Modo atual */}
          <div className={`p-4 border ${borderColor} rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className={`text-sm font-medium ${textColor} mb-2`}>Modo Atual:</h4>
            <div className="flex items-center space-x-2">
              {currentMode === 'menu' ? <Menu size={20} /> : <Store size={20} />}
              <span className={`${textColor} font-medium text-lg`}>
                {currentMode === 'menu' ? 'Modo Cardápio' : 'Modo Loja'}
              </span>
            </div>
            <p className={`text-sm ${textSecondary} mt-1`}>
              {currentMode === 'menu' 
                ? 'Layout atual focado em cardápio de restaurante' 
                : 'Layout atual focado em loja online'
              }
            </p>
          </div>

          {/* Opções de modo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Modo Cardápio */}
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                currentMode === 'menu' 
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                  : `border-gray-300 hover:border-orange-300 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`
              }`}
              onClick={() => currentMode !== 'menu' && handleModeChange('menu')}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Menu className={`h-6 w-6 ${currentMode === 'menu' ? 'text-orange-500' : textSecondary}`} />
                <h4 className={`font-semibold ${textColor}`}>Modo Cardápio</h4>
              </div>
              
              <p className={`text-sm ${textSecondary} mb-3`}>
                Layout tradicional de cardápio, ideal para restaurantes e lanchonetes
              </p>
              
              <div className={`text-xs ${textSecondary} space-y-1`}>
                <div>✓ Foco em categorias de comida</div>
                <div>✓ Layout de cards otimizado para pratos</div>
                <div>✓ Experiência de cardápio digital</div>
                <div>✓ Grid: 1-2-3-4 produtos por linha</div>
              </div>
              
              {currentMode === 'menu' && (
                <div className="mt-3 flex items-center space-x-2 text-orange-500">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Modo Atual</span>
                </div>
              )}
            </div>

            {/* Modo Loja */}
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                currentMode === 'store' 
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                  : `border-gray-300 hover:border-orange-300 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`
              }`}
              onClick={() => currentMode !== 'store' && handleModeChange('store')}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Store className={`h-6 w-6 ${currentMode === 'store' ? 'text-orange-500' : textSecondary}`} />
                <h4 className={`font-semibold ${textColor}`}>Modo Loja</h4>
              </div>
              
              <p className={`text-sm ${textSecondary} mb-3`}>
                Layout de e-commerce, ideal para lojas online e varejo
              </p>
              
              <div className={`text-xs ${textSecondary} space-y-1`}>
                <div>✓ Foco em produtos e vendas</div>
                <div>✓ Layout de grid otimizado para produtos</div>
                <div>✓ Experiência de loja virtual</div>
                <div>✓ Grid: 2-3-4-5 produtos por linha</div>
              </div>
              
              {currentMode === 'store' && (
                <div className="mt-3 flex items-center space-x-2 text-orange-500">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Modo Atual</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Background Fixo */}
      <div className={`${bgColor} rounded-lg shadow-md p-6`}>
        <div className="flex items-center space-x-3 mb-6">
          <Image className={`h-6 w-6 ${textColor}`} />
          <div>
            <h3 className={`text-lg font-bold ${textColor}`}>Background Fixo</h3>
            <p className={`text-sm ${textSecondary}`}>
              Configure um fundo fixo para o site (opcional)
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Toggle para ativar/desativar background fixo */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`text-md font-semibold ${textColor}`}>Ativar Background Fixo</h4>
              <p className={`text-sm ${textSecondary}`}>
                Quando ativado, uma imagem de fundo ficará fixa durante a rolagem
              </p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessConfig.fixedBackground?.isEnabled || false}
                onChange={handleFixedBackgroundToggle}
                className="sr-only"
              />
              <div className={`relative w-12 h-6 rounded-full transition-colors ${
                businessConfig.fixedBackground?.isEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  businessConfig.fixedBackground?.isEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </div>
            </label>
          </div>

          {/* Upload de imagem de background */}
          {businessConfig.fixedBackground?.isEnabled && (
            <div>
              <label className={`block text-sm font-medium ${textColor} mb-2`}>
                Imagem de Background
              </label>
              <ImageUpload
                onImageUploaded={handleBackgroundImageChange}
                currentImage={businessConfig.fixedBackground?.image}
                isDarkMode={isDarkMode}
              />
              <p className={`text-xs ${textSecondary} mt-2`}>
                Recomendado: Use imagens em alta resolução (1920x1080px ou maior) para melhor qualidade
              </p>
            </div>
          )}

          {/* Preview do background */}
          {businessConfig.fixedBackground?.isEnabled && businessConfig.fixedBackground?.image && (
            <div className={`p-4 border ${borderColor} rounded-lg`}>
              <h4 className={`text-sm font-medium ${textColor} mb-3`}>Preview do Background:</h4>
              <div 
                className="w-full h-32 rounded-lg bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${businessConfig.fixedBackground.image})` }}
              >
                <div className="w-full h-full bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">Background Fixo Ativo</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Informações importantes */}
      <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
        <h4 className={`text-sm font-medium ${textColor} mb-2`}>Como funciona:</h4>
        <ul className={`text-sm ${textSecondary} space-y-1`}>
          <li>• <strong>Modo Cardápio:</strong> Mantém o layout atual focado em comidas e bebidas</li>
          <li>• <strong>Modo Loja:</strong> Altera o layout para um estilo mais comercial com mais produtos por linha</li>
          <li>• <strong>Background Fixo:</strong> Adiciona uma imagem de fundo que permanece fixa durante a rolagem</li>
          <li>• A mudança é aplicada automaticamente ao clicar na opção</li>
          <li>• Todos os produtos e configurações são mantidos</li>
          <li>• Você pode alternar entre os modos a qualquer momento</li>
        </ul>
      </div>
    </div>
  );
};

export default StoreModeManager;