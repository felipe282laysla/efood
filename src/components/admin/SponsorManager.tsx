import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Users, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Sponsor } from '../../types';
import ImageUpload from '../ImageUpload';

const SponsorManager: React.FC = () => {
  const { sponsors, businessConfig, addSponsor, updateSponsor, deleteSponsor, updateBusinessConfig, isDarkMode } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    link: '',
    isActive: true,
    order: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.image.trim() || !formData.link.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Verificar limite de 5 patrocinadores
    if (!editingId && sponsors.length >= 5) {
      alert('Máximo de 5 patrocinadores permitidos');
      return;
    }

    try {
      if (editingId) {
        await updateSponsor(editingId, formData);
        alert('Patrocinador atualizado com sucesso!');
        setEditingId(null);
      } else {
        await addSponsor({
          ...formData,
          order: sponsors.length + 1
        });
        alert('Patrocinador adicionado com sucesso!');
        setIsAdding(false);
      }
      
      setFormData({
        name: '',
        image: '',
        link: '',
        isActive: true,
        order: 1
      });
    } catch (error) {
      alert('Erro ao salvar patrocinador');
      console.error(error);
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    setFormData({
      name: sponsor.name,
      image: sponsor.image,
      link: sponsor.link,
      isActive: sponsor.isActive,
      order: sponsor.order
    });
    setEditingId(sponsor.id);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este patrocinador?')) {
      try {
        await deleteSponsor(id);
        alert('Patrocinador excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir patrocinador');
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: '',
      image: '',
      link: '',
      isActive: true,
      order: 1
    });
  };

  const handleMoveUp = async (sponsor: Sponsor) => {
    if (sponsor.order <= 1) return;
    
    const otherSponsor = sponsors.find(s => s.order === sponsor.order - 1);
    if (otherSponsor) {
      await updateSponsor(sponsor.id, { order: sponsor.order - 1 });
      await updateSponsor(otherSponsor.id, { order: otherSponsor.order + 1 });
    }
  };

  const handleMoveDown = async (sponsor: Sponsor) => {
    if (sponsor.order >= sponsors.length) return;
    
    const otherSponsor = sponsors.find(s => s.order === sponsor.order + 1);
    if (otherSponsor) {
      await updateSponsor(sponsor.id, { order: sponsor.order + 1 });
      await updateSponsor(otherSponsor.id, { order: otherSponsor.order - 1 });
    }
  };

  const handleToggleSponsors = async () => {
    try {
      await updateBusinessConfig({
        sponsors: {
          ...businessConfig.sponsors,
          isEnabled: !businessConfig.sponsors?.isEnabled
        }
      });
    } catch (error) {
      alert('Erro ao atualizar configuração');
    }
  };

  const handleUpdateTitle = async (title: string) => {
    try {
      await updateBusinessConfig({
        sponsors: {
          ...businessConfig.sponsors,
          title: title
        }
      });
    } catch (error) {
      alert('Erro ao atualizar título');
    }
  };

  const sortedSponsors = [...sponsors].sort((a, b) => a.order - b.order);

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-bold ${textColor} mb-2`}>Patrocinadores</h2>
          <p className={`text-sm ${textSecondary}`}>
            Configure até 5 patrocinadores para exibir na página inicial
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Toggle para ativar/desativar patrocinadores */}
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={businessConfig.sponsors?.isEnabled || false}
              onChange={handleToggleSponsors}
              className="sr-only"
            />
            <div className={`relative w-12 h-6 rounded-full transition-colors ${
              businessConfig.sponsors?.isEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                businessConfig.sponsors?.isEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </div>
            <span className={`ml-3 ${textColor}`}>
              {businessConfig.sponsors?.isEnabled ? 'Ativado' : 'Desativado'}
            </span>
          </label>

          <button
            onClick={() => setIsAdding(true)}
            disabled={sponsors.length >= 5}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            <span>Novo Patrocinador</span>
          </button>
        </div>
      </div>

      {/* Configurações da seção */}
      <div className={`border ${borderColor} rounded-lg p-4 mb-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Configurações da Seção</h3>
        
        <div>
          <label className={`block text-sm font-medium ${textColor} mb-1`}>
            Título da Seção
          </label>
          <input
            type="text"
            value={businessConfig.sponsors?.title || 'Nossos Parceiros'}
            onChange={(e) => handleUpdateTitle(e.target.value)}
            className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
            placeholder="Nossos Parceiros"
          />
        </div>
      </div>

      {/* Form */}
      {(isAdding || editingId) && (
        <div className={`border ${borderColor} rounded-lg p-6 mb-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
            {editingId ? 'Editar Patrocinador' : 'Novo Patrocinador'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Nome do Patrocinador *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Nome da empresa"
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
                Link do Site *
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="https://exemplo.com"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${textColor} mb-2`}>
                Logo do Patrocinador *
              </label>
              <ImageUpload
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
                currentImage={formData.image}
                isDarkMode={isDarkMode}
              />
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

      {/* Lista de patrocinadores */}
      <div className="space-y-4">
        {sortedSponsors.length === 0 ? (
          <div className="text-center py-8">
            <Users className={`mx-auto h-12 w-12 ${textSecondary} mb-4`} />
            <p className={`${textSecondary}`}>Nenhum patrocinador cadastrado</p>
            <p className={`text-sm ${textSecondary} mt-1`}>
              Clique em "Novo Patrocinador" para começar
            </p>
          </div>
        ) : (
          sortedSponsors.map((sponsor) => (
            <div key={sponsor.id} className={`border ${borderColor} rounded-lg p-4`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <img
                    src={sponsor.image}
                    alt={sponsor.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`font-semibold ${textColor}`}>{sponsor.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sponsor.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sponsor.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        Ordem: {sponsor.order}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <ExternalLink size={14} className={textSecondary} />
                      <a 
                        href={sponsor.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-sm ${textSecondary} hover:text-orange-500 transition-colors`}
                      >
                        {sponsor.link}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Controles de ordem */}
                  <button
                    onClick={() => handleMoveUp(sponsor)}
                    disabled={sponsor.order <= 1}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Mover para cima"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => handleMoveDown(sponsor)}
                    disabled={sponsor.order >= sponsors.length}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Mover para baixo"
                  >
                    <ArrowDown size={16} />
                  </button>
                  
                  <button
                    onClick={() => handleEdit(sponsor)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(sponsor.id)}
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
          <li>• Máximo de 5 patrocinadores permitidos</li>
          <li>• Use logos em alta qualidade (recomendado: formato quadrado)</li>
          <li>• A ordem dos patrocinadores pode ser alterada usando as setas</li>
          <li>• Patrocinadores inativos não aparecem na página</li>
          <li>• A seção só aparece se estiver ativada e houver patrocinadores ativos</li>
        </ul>
      </div>
    </div>
  );
};

export default SponsorManager;