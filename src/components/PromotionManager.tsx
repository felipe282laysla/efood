import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tag, Gift, Package, Calendar, DollarSign, Users, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Promotion, Product } from '../types';
import ImageUpload from './ImageUpload';

const PromotionManager: React.FC = () => {
  const { promotions, products, addPromotion, updatePromotion, deletePromotion, isDarkMode } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'combo' | 'promotion' | 'giveaway'>('combo');
  const [formData, setFormData] = useState<Partial<Promotion>>({
    type: 'combo',
    title: '',
    description: '',
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    discount: 0,
    code: '',
    image: '',
    comboProducts: [],
    comboPrice: 0,
    giveawayRules: {
      minPurchaseAmount: 50,
      maxParticipants: 100,
      participantNumberStart: 1,
      prize: '',
      rules: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title?.trim() || !formData.description?.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const promotionData = {
        ...formData,
        type: activeTab,
        startDate: formData.startDate || new Date(),
        endDate: formData.endDate || new Date()
      } as Omit<Promotion, 'id'>;

      if (editingId) {
        await updatePromotion(editingId, promotionData);
        alert('Promoção atualizada com sucesso!');
        setEditingId(null);
      } else {
        await addPromotion(promotionData);
        alert('Promoção adicionada com sucesso!');
        setIsAdding(false);
      }
      
      resetForm();
    } catch (error) {
      alert('Erro ao salvar promoção');
      console.error(error);
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setFormData({
      type: promotion.type,
      title: promotion.title,
      description: promotion.description,
      isActive: promotion.isActive,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      discount: promotion.discount || 0,
      code: promotion.code || '',
      image: promotion.image || '',
      comboProducts: promotion.comboProducts || [],
      comboPrice: promotion.comboPrice || 0,
      giveawayRules: promotion.giveawayRules || {
        minPurchaseAmount: 50,
        maxParticipants: 100,
        participantNumberStart: 1,
        prize: '',
        rules: ''
      }
    });
    setActiveTab(promotion.type);
    setEditingId(promotion.id);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta promoção?')) {
      try {
        await deletePromotion(id);
        alert('Promoção excluída com sucesso!');
      } catch (error) {
        alert('Erro ao excluir promoção');
        console.error(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: activeTab,
      title: '',
      description: '',
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      discount: 0,
      code: '',
      image: '',
      comboProducts: [],
      comboPrice: 0,
      giveawayRules: {
        minPurchaseAmount: 50,
        maxParticipants: 100,
        participantNumberStart: 1,
        prize: '',
        rules: ''
      }
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  const handleTabChange = (tab: 'combo' | 'promotion' | 'giveaway') => {
    setActiveTab(tab);
    setFormData(prev => ({ ...prev, type: tab }));
  };

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const getPromotionsByType = (type: 'combo' | 'promotion' | 'giveaway') => {
    return promotions.filter(p => p.type === type);
  };

  const getTypeIcon = (type: 'combo' | 'promotion' | 'giveaway') => {
    switch (type) {
      case 'combo': return <Package size={16} />;
      case 'promotion': return <Tag size={16} />;
      case 'giveaway': return <Gift size={16} />;
    }
  };

  const getTypeColor = (type: 'combo' | 'promotion' | 'giveaway') => {
    switch (type) {
      case 'combo': return 'bg-blue-500';
      case 'promotion': return 'bg-orange-500';
      case 'giveaway': return 'bg-purple-500';
    }
  };

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-bold ${textColor} mb-2`}>Gerenciar Promoções</h2>
          <p className={`text-sm ${textSecondary}`}>
            Crie combos, promoções e sorteios para seus clientes
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Nova Promoção</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {(['combo', 'promotion', 'giveaway'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? `${getTypeColor(tab)} text-white`
                : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'} hover:bg-gray-300`
            }`}
          >
            {getTypeIcon(tab)}
            <span className="capitalize">
              {tab === 'combo' ? 'Combos' : tab === 'promotion' ? 'Promoções' : 'Sorteios'}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              activeTab === tab ? 'bg-white/20' : 'bg-gray-300'
            }`}>
              {getPromotionsByType(tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Form */}
      {(isAdding || editingId) && (
        <div className={`border ${borderColor} rounded-lg p-6 mb-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
            {editingId ? `Editar ${activeTab === 'combo' ? 'Combo' : activeTab === 'promotion' ? 'Promoção' : 'Sorteio'}` : `Novo ${activeTab === 'combo' ? 'Combo' : activeTab === 'promotion' ? 'Promoção' : 'Sorteio'}`}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder={`Nome do ${activeTab === 'combo' ? 'combo' : activeTab === 'promotion' ? 'promoção' : 'sorteio'}`}
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
                Descrição *
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                rows={3}
                placeholder="Descreva os detalhes da oferta"
                required
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Data de Início
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate ? new Date(formData.startDate.getTime() - formData.startDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Data de Fim
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate ? new Date(formData.endDate.getTime() - formData.endDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
              </div>
            </div>

            {/* Type-specific fields */}
            {activeTab === 'combo' && (
              <div className="space-y-4">
                <h4 className={`text-md font-semibold ${textColor}`}>Configurações do Combo</h4>
                
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>
                    Produtos do Combo
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {products.map((product) => (
                      <label key={product.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.comboProducts?.includes(product.id) || false}
                          onChange={(e) => {
                            const productIds = formData.comboProducts || [];
                            if (e.target.checked) {
                              setFormData(prev => ({ 
                                ...prev, 
                                comboProducts: [...productIds, product.id] 
                              }));
                            } else {
                              setFormData(prev => ({ 
                                ...prev, 
                                comboProducts: productIds.filter(id => id !== product.id) 
                              }));
                            }
                          }}
                          className="rounded text-orange-500 focus:ring-orange-500"
                        />
                        <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded" />
                        <span className={`text-sm ${textColor}`}>{product.name}</span>
                        <span className="text-sm text-orange-600">R$ {product.price.toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>
                    Preço do Combo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.comboPrice || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, comboPrice: parseFloat(e.target.value) || 0 }))}
                    className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}

            {activeTab === 'promotion' && (
              <div className="space-y-4">
                <h4 className={`text-md font-semibold ${textColor}`}>Configurações da Promoção</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Desconto (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Código Promocional
                    </label>
                    <input
                      type="text"
                      value={formData.code || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="DESCONTO10"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'giveaway' && (
              <div className="space-y-4">
                <h4 className={`text-md font-semibold ${textColor}`}>Configurações do Sorteio</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Valor Mínimo para Participar (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.giveawayRules?.minPurchaseAmount || 0}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        giveawayRules: { 
                          ...prev.giveawayRules!, 
                          minPurchaseAmount: parseFloat(e.target.value) || 0 
                        } 
                      }))}
                      className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="50.00"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Máximo de Participantes
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.giveawayRules?.maxParticipants || 100}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        giveawayRules: { 
                          ...prev.giveawayRules!, 
                          maxParticipants: parseInt(e.target.value) || 100 
                        } 
                      }))}
                      className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Número Inicial dos Participantes
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.giveawayRules?.participantNumberStart || 1}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        giveawayRules: { 
                          ...prev.giveawayRules!, 
                          participantNumberStart: parseInt(e.target.value) || 1 
                        } 
                      }))}
                      className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>
                    Prêmio
                  </label>
                  <input
                    type="text"
                    value={formData.giveawayRules?.prize || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      giveawayRules: { 
                        ...prev.giveawayRules!, 
                        prize: e.target.value 
                      } 
                    }))}
                    className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="Ex: iPhone 15, R$ 1000 em créditos, etc."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>
                    Regras do Sorteio
                  </label>
                  <textarea
                    value={formData.giveawayRules?.rules || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      giveawayRules: { 
                        ...prev.giveawayRules!, 
                        rules: e.target.value 
                      } 
                    }))}
                    className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    rows={4}
                    placeholder="Descreva as regras do sorteio, critérios de participação, data do sorteio, etc."
                  />
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className={`block text-sm font-medium ${textColor} mb-2`}>
                Imagem da Promoção
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

      {/* List */}
      <div className="space-y-4">
        {getPromotionsByType(activeTab).length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-4">
              {getTypeIcon(activeTab)}
            </div>
            <p className={`${textSecondary}`}>
              Nenhum {activeTab === 'combo' ? 'combo' : activeTab === 'promotion' ? 'promoção' : 'sorteio'} cadastrado
            </p>
            <p className={`text-sm ${textSecondary} mt-1`}>
              Clique em "Nova Promoção" para começar
            </p>
          </div>
        ) : (
          getPromotionsByType(activeTab).map((promotion) => (
            <div key={promotion.id} className={`border ${borderColor} rounded-lg p-4`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`font-semibold ${textColor}`}>{promotion.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      promotion.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {promotion.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(promotion.type)} text-white`}>
                      {promotion.type === 'combo' ? 'Combo' : promotion.type === 'promotion' ? 'Promoção' : 'Sorteio'}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${textSecondary} mb-2`}>{promotion.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>
                      <Calendar className="inline mr-1" size={12} />
                      {promotion.startDate.toLocaleDateString('pt-BR')} - {promotion.endDate.toLocaleDateString('pt-BR')}
                    </span>
                    
                    {promotion.type === 'combo' && promotion.comboPrice && (
                      <span>
                        <DollarSign className="inline mr-1" size={12} />
                        R$ {promotion.comboPrice.toFixed(2)}
                      </span>
                    )}
                    
                    {promotion.type === 'promotion' && promotion.discount && (
                      <span>
                        <Tag className="inline mr-1" size={12} />
                        {promotion.discount}% OFF
                      </span>
                    )}
                    
                    {promotion.type === 'giveaway' && promotion.giveawayRules && (
                      <span>
                        <Trophy className="inline mr-1" size={12} />
                        {promotion.giveawayRules.prize}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(promotion)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(promotion.id)}
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
    </div>
  );
};

export default PromotionManager;