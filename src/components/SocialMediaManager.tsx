import React, { useState } from 'react';
import { Instagram, Facebook, Save, X, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SocialMediaManagerProps {
  isDarkMode?: boolean;
}

const SocialMediaManager: React.FC<SocialMediaManagerProps> = ({ isDarkMode = false }) => {
  const { businessConfig, updateBusinessConfig } = useApp();
  const [socialMedia, setSocialMedia] = useState(businessConfig.socialMedia || {
    instagram: '',
    facebook: '',
    isEnabled: false
  });

  const handleSave = async () => {
    try {
      await updateBusinessConfig({
        socialMedia: socialMedia
      });
      alert('Redes sociais atualizadas com sucesso!');
    } catch (error) {
      alert('Erro ao salvar redes sociais');
      console.error(error);
    }
  };

  const handleReset = () => {
    setSocialMedia({
      instagram: '',
      facebook: '',
      isEnabled: false
    });
  };

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center space-x-3 mb-6">
        <Globe className={`h-6 w-6 ${textColor}`} />
        <div>
          <h2 className={`text-xl font-bold ${textColor}`}>Redes Sociais</h2>
          <p className={`text-sm ${textSecondary}`}>
            Configure os links das suas redes sociais
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${textColor}`}>Exibir Redes Sociais</h3>
            <p className={`text-sm ${textSecondary}`}>
              Ative para mostrar os ícones das redes sociais no cabeçalho
            </p>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={socialMedia.isEnabled}
              onChange={(e) => setSocialMedia(prev => ({ ...prev, isEnabled: e.target.checked }))}
              className="sr-only"
            />
            <div className={`relative w-12 h-6 rounded-full transition-colors ${
              socialMedia.isEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                socialMedia.isEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </div>
          </label>
        </div>

        {/* Social Media Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instagram */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              <Instagram className="inline mr-2" size={16} />
              Instagram
            </label>
            <input
              type="url"
              value={socialMedia.instagram || ''}
              onChange={(e) => setSocialMedia(prev => ({ ...prev, instagram: e.target.value }))}
              className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="https://instagram.com/seu_perfil"
              disabled={!socialMedia.isEnabled}
            />
            <p className={`text-xs ${textSecondary} mt-1`}>
              Cole o link completo do seu perfil no Instagram
            </p>
          </div>

          {/* Facebook */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              <Facebook className="inline mr-2" size={16} />
              Facebook
            </label>
            <input
              type="url"
              value={socialMedia.facebook || ''}
              onChange={(e) => setSocialMedia(prev => ({ ...prev, facebook: e.target.value }))}
              className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="https://facebook.com/sua_pagina"
              disabled={!socialMedia.isEnabled}
            />
            <p className={`text-xs ${textSecondary} mt-1`}>
              Cole o link completo da sua página no Facebook
            </p>
          </div>
        </div>

        {/* Preview */}
        {socialMedia.isEnabled && (socialMedia.instagram || socialMedia.facebook) && (
          <div className={`p-4 border ${borderColor} rounded-lg`}>
            <h4 className={`text-sm font-medium ${textColor} mb-3`}>Preview:</h4>
            <div className="flex items-center space-x-3">
              <span className={`text-sm ${textSecondary}`}>Redes sociais no cabeçalho:</span>
              <div className="flex space-x-2">
                {socialMedia.instagram && (
                  <div className="p-2 rounded-full bg-pink-100">
                    <Instagram size={16} className="text-pink-500" />
                  </div>
                )}
                {socialMedia.facebook && (
                  <div className="p-2 rounded-full bg-blue-100">
                    <Facebook size={16} className="text-blue-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Save size={16} />
            <span>Salvar Configurações</span>
          </button>
          <button
            onClick={handleReset}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <X size={16} />
            <span>Limpar</span>
          </button>
        </div>

        {/* Instructions */}
        <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
          <h4 className={`text-sm font-medium ${textColor} mb-2`}>Como usar:</h4>
          <ul className={`text-sm ${textSecondary} space-y-1`}>
            <li>• Ative a opção "Exibir Redes Sociais"</li>
            <li>• Cole os links completos das suas redes sociais</li>
            <li>• Os ícones aparecerão no cabeçalho do site</li>
            <li>• Os clientes poderão clicar para visitar suas redes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaManager;