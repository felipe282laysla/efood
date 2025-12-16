import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Image, ArrowUp, ArrowDown, Eye, EyeOff, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HomeBanner } from '../../types';
import ImageUpload from '../ImageUpload';

const HomeBannerManager: React.FC = () => {
  const { homeBanners, businessConfig, addHomeBanner, updateHomeBanner, deleteHomeBanner, updateBusinessConfig, isDarkMode } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    isActive: true,
    order: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.image.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Verificar limite de 3 banners
    if (!editingId && homeBanners.length >= 3) {
      alert('Máximo de 3 banners permitidos');
      return;
    }

    try {
      if (editingId) {
        await updateHomeBanner(editingId, formData);
        alert('Banner atualizado com sucesso!');
        setEditingId(null);
      } else {
        await addHomeBanner({
          ...formData,
          order: homeBanners.length + 1
        });
        alert('Banner adicionado com sucesso!');
        setIsAdding(false);
      }
      
      setFormData({
        title: '',
        description: '',
        image: '',
        link: '',
        isActive: true,
        order: 1
      });
    } catch (error) {
      alert('Erro ao salvar banner');
      console.error(error);
    }
  };

  const handleEdit = (banner: HomeBanner) => {
    setFormData({
      title: banner.title,
      description: banner.description || '',
      image: banner.image,
      link: banner.link || '',
      isActive: banner.isActive,
      order: banner.order
    });
    setEditingId(banner.id);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      try {
        await deleteHomeBanner(id);
        alert('Banner excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir banner');
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      isActive: true,
      order: 1
    });
  };

  const handleMoveUp = async (banner: HomeBanner) => {
    if (banner.order <= 1) return;
    
    const otherBanner = homeBanners.find(b => b.order === banner.order - 1);
    if (otherBanner) {
      await updateHomeBanner(banner.id, { order: banner.order - 1 });
      await updateHomeBanner(otherBanner.id, { order: otherBanner.order + 1 });
    }
  };

  const handleMoveDown = async (banner: HomeBanner) => {
    if (banner.order >= homeBanners.length) return;
    
    const otherBanner = homeBanners.find(b => b.order === banner.order + 1);
    if (otherBanner) {
      await updateHomeBanner(banner.id, { order: banner.order + 1 });
      await updateHomeBanner(otherBanner.id, { order: otherBanner.order - 1 });
    }
  };

  const handleToggleBanners = async () => {
    try {
      await updateBusinessConfig({
        homeBanners: {
          ...businessConfig.homeBanners,
          isEnabled: !businessConfig.homeBanners?.isEnabled
        }
      });
    } catch (error) {
      alert('Erro ao atualizar configuração');
    }
  };

  const handleUpdateSettings = async (settings: any) => {
    try {
      await updateBusinessConfig({
        homeBanners: {
          ...businessConfig.homeBanners,
          ...settings
        }
      });
    } catch (error) {
      alert('Erro ao atualizar configurações');
    }
  };

  const sortedBanners = [...homeBanners].sort((a, b) => a.order - b.order);

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-bold ${textColor} mb-2`}>Banners da Home</h2>
          <p className={`text-sm ${textSecondary}`}>
            Configure até 3 banners para o carrossel da página inicial
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Toggle para ativar/desativar banners */}
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={businessConfig.homeBanners?.isEnabled || false}
              onChange={handleToggleBanners}
              className="sr-only"
            />
            <div className={`relative w-12 h-6 rounded-full transition-colors ${
              businessConfig.homeBanners?.isEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                businessConfig.homeBanners?.isEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </div>
            <span className={`ml-3 ${textColor}`}>
              {businessConfig.homeBanners?.isEnabled ? 'Ativado' : 'Desativado'}
            </span>
          </label>

          <button
            onClick={() => setIsAdding(true)}
            disabled={homeBanners.length >= 3}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            <span>Novo Banner</span>
          </button>
        </div>
      </div>

      {/* Configurações do carrossel */}
      <div className={`border ${borderColor} rounded-lg p-4 mb-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Configurações do Carrossel</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessConfig.homeBanners?.autoSlide || false}
                onChange={(e) => handleUpdateSettings({ autoSlide: e.target.checked })}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span className={`ml-2 text-sm ${textColor}`}>Troca automática</span>
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessConfig.homeBanners?.showArrows !== false}
                onChange={(e) => handleUpdateSettings({ showArrows: e.target.checked })}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span className={`ml-2 text-sm ${textColor}`}>Mostrar setas</span>
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessConfig.homeBanners?.showDots !== false}
                onChange={(e) => handleUpdateSettings({ showDots: e.target.checked })}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span className={`ml-2 text-sm ${textColor}`}>Mostrar pontos</span>
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessConfig.homeBanners?.fullWidth || false}
                onChange={(e) => handleUpdateSettings({ fullWidth: e.target.checked })}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span className={`ml-2 text-sm ${textColor}`}>Tela cheia</span>
            </label>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textColor} mb-1`}>
              Direção do loop
            </label>
            <select
              value={businessConfig.homeBanners?.direction || 'right'}
              onChange={(e) => handleUpdateSettings({ direction: e.target.value })}
              className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
            >
              <option value="right">Direita</option>
              <option value="left">Esquerda</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textColor} mb-1`}>
              Intervalo (segundos)
            </label>
            <input
              type="number"
              min="3"
              max="10"
              value={businessConfig.homeBanners?.slideInterval || 5}
              onChange={(e) => handleUpdateSettings({ slideInterval: parseInt(e.target.value) || 5 })}
              className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
              disabled={!businessConfig.homeBanners?.autoSlide}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      {(isAdding || editingId) && (
        <div className={`border ${borderColor} rounded-lg p-6 mb-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
            {editingId ? 'Editar Banner' : 'Novo Banner'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Título do banner"
                  required
                />
              </div>

              <div className="flex items-center space-x-3">
                <label className={`block text-sm font-medium ${textColor}`}>
                  Status:
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span className={`text-sm ${textColor}`}>Ativo</span>
                </label>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${textColor} mb-1`}>
                Descrição
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="Descrição opcional"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${textColor} mb-1`}>
                Link (opcional)
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="https://exemplo.com"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${textColor} mb-2`}>
                Imagem do Banner *
              </label>
              <ImageUpload
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
                currentImage={formData.image}
                isDarkMode={isDarkMode}
                allowDelete={true}
                onImageDeleted={() => setFormData(prev => ({ ...prev, image: '' }))}
              />
              <p className={`text-xs ${textSecondary} mt-1`}>
                Recomendado: Use imagens em alta resolução (1920x1080px ou maior)
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Save size={16} />
                <span>{editingId ? 'Atualizar' : 'Salvar'}</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                <X size={16} />
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de banners */}
      <div className="space-y-4">
        {sortedBanners.length === 0 ? (
          <div className="text-center py-8">
            <Image className={`mx-auto h-12 w-12 ${textSecondary} mb-4`} />
            <p className={`${textSecondary}`}>Nenhum banner cadastrado</p>
            <p className={`text-sm ${textSecondary} mt-1`}>
              Clique em "Novo Banner" para começar
            </p>
          </div>
        ) : (
          sortedBanners.map((banner) => (
            <div key={banner.id} className={`border ${borderColor} rounded-lg p-4`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`font-semibold ${textColor}`}>{banner.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        banner.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {banner.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        Ordem: {banner.order}
                      </span>
                    </div>
                    
                    {banner.description && (
                      <p className={`text-sm ${textSecondary} mb-2`}>{banner.description}</p>
                    )}
                    
                    {banner.link && (
                      <p className={`text-sm ${textSecondary}`}>
                        <span className="font-medium">Link:</span> {banner.link}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Controles de ordem */}
                  <button
                    onClick={() => handleMoveUp(banner)}
                    disabled={banner.order <= 1}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Mover para cima"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => handleMoveDown(banner)}
                    disabled={banner.order >= homeBanners.length}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Mover para baixo"
                  >
                    <ArrowDown size={16} />
                  </button>
                  
                  <button
                    onClick={() => handleEdit(banner)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Informações */}
      <div className={`mt-6 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
        <h4 className={`text-sm font-medium ${textColor} mb-2`}>Informações:</h4>
        <ul className={`text-sm ${textSecondary} space-y-1`}>
          <li>• Máximo de 3 banners permitidos</li>
          <li>• Use imagens em alta resolução (recomendado: 1920x1080px)</li>
          <li>• As imagens se adaptam automaticamente ao mobile</li>
          <li>• A ordem dos banners pode ser alterada usando as setas</li>
          <li>• Banners inativos não aparecem no carrossel</li>
          <li>• O carrossel só aparece se estiver ativado e houver banners ativos</li>
          <li>• Configure as opções de exibição (setas, pontos, direção) conforme necessário</li>
        </ul>
      </div>
    </div>
  );
};

export default HomeBannerManager;