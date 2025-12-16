import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ImageSizeManager: React.FC = () => {
  const { businessConfig, updateBusinessConfig, isDarkMode } = useApp();
  const [loading, setLoading] = useState(false);
  const [customSize, setCustomSize] = useState(businessConfig.customImageSize || 200);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Sincronizar o estado local com as configurações do negócio
  useEffect(() => {
    if (businessConfig.customImageSize) {
      setCustomSize(businessConfig.customImageSize);
    }
  }, [businessConfig.customImageSize]);

  const handleCustomSizeChange = async () => {
    if (customSize < 50 || customSize > 800) {
      alert('O tamanho deve estar entre 50 e 800 pixels');
      return;
    }

    setLoading(true);
    setSaveStatus('saving');
    
    try {
      const updateData = {
        imageSize: 'custom' as const,
        customImageSize: customSize
      };
      
      await updateBusinessConfig(updateData);
      
      setSaveStatus('success');
      console.log('Tamanho personalizado das imagens atualizado para:', customSize);
      
      // Mostrar feedback de sucesso
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
      
      // Forçar re-render dos componentes
      window.dispatchEvent(new Event('resize'));
      
    } catch (error) {
      console.error('Erro ao atualizar tamanho personalizado das imagens:', error);
      setSaveStatus('error');
      
      // Mostrar feedback de erro
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const currentCustomSize = businessConfig.customImageSize;

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';

  const getStatusMessage = () => {
    switch (saveStatus) {
      case 'saving':
        return { text: 'Aplicando alterações...', color: 'text-blue-600', icon: <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div> };
      case 'success':
        return { text: 'Tamanho aplicado com sucesso!', color: 'text-green-600', icon: <CheckCircle size={16} /> };
      case 'error':
        return { text: 'Erro ao aplicar. Tente novamente.', color: 'text-red-600', icon: <AlertCircle size={16} /> };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center space-x-3 mb-6">
        <Settings className={`h-6 w-6 ${textColor}`} />
        <div>
          <h3 className={`text-lg font-bold ${textColor}`}>Tamanho das Imagens dos Produtos</h3>
          <p className={`text-sm ${textSecondary}`}>
            Configure o tamanho personalizado das imagens exibidas no cardápio
          </p>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className={`mb-6 p-3 border rounded-lg ${
          saveStatus === 'success' ? 'border-green-200 bg-green-50' :
          saveStatus === 'error' ? 'border-red-200 bg-red-50' :
          'border-blue-200 bg-blue-50'
        }`}>
          <div className="flex items-center space-x-2">
            {statusMessage.icon}
            <span className={`text-sm font-medium ${statusMessage.color}`}>
              {statusMessage.text}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Custom Size Option */}
        <div className={`border-2 rounded-lg p-4 transition-all border-orange-500 bg-orange-50 dark:bg-orange-900/20`}>
          <div className="flex items-center space-x-3 mb-3">
            <Settings className={`h-6 w-6 text-orange-500`} />
            <h4 className={`font-semibold ${textColor}`}>Tamanho Personalizado</h4>
          </div>
          
          {/* Custom Size Input */}
          <div className="mb-3">
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Altura em pixels (50-800px)
            </label>
            <input
              type="number"
              min="50"
              max="800"
              value={customSize}
              onChange={(e) => setCustomSize(parseInt(e.target.value) || 200)}
              className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="200"
              disabled={loading}
            />
          </div>
          
          {/* Preview */}
          <div 
            className="bg-gray-200 dark:bg-gray-600 rounded-lg mb-3 mx-auto" 
            style={{ height: `${Math.min(customSize / 2, 120)}px`, width: '100px' }}
          >
            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <span className="text-xs">{customSize}px</span>
            </div>
          </div>
          
          <p className={`text-sm ${textSecondary} mb-3`}>
            Defina uma altura personalizada para as imagens dos produtos
          </p>

          <button
            onClick={handleCustomSizeChange}
            disabled={loading || customSize < 50 || customSize > 800}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Aplicando...' : 'Aplicar Tamanho'}
          </button>
          
          {currentCustomSize && (
            <div className="mt-3 flex items-center space-x-2 text-orange-500">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">Ativo ({currentCustomSize}px)</span>
            </div>
          )}
        </div>

        {/* Current Status */}
        <div className={`p-4 border ${borderColor} rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h4 className={`text-sm font-medium ${textColor} mb-2`}>Status Atual:</h4>
          <div className="flex items-center space-x-2">
            <Settings size={16} />
            <span className={`${textColor} font-medium`}>
              Tamanho Personalizado ({currentCustomSize || customSize}px)
            </span>
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
            )}
          </div>
          <p className={`text-xs ${textSecondary} mt-1`}>
            {loading ? 'Aplicando alterações...' : 'Configure o tamanho desejado e clique em "Aplicar Tamanho"'}
          </p>
        </div>

        {/* Instructions */}
        <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
          <h4 className={`text-sm font-medium ${textColor} mb-2`}>Como funciona:</h4>
          <ul className={`text-sm ${textSecondary} space-y-1`}>
            <li>• Defina uma altura específica em pixels (50-800px)</li>
            <li>• As mudanças são aplicadas automaticamente ao clicar em "Aplicar Tamanho"</li>
            <li>• Todas as imagens terão o mesmo tamanho para manter consistência visual</li>
            <li>• Recomendamos usar imagens de alta qualidade para melhor resultado</li>
            <li>• O tamanho personalizado funciona perfeitamente em todos os dispositivos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageSizeManager;