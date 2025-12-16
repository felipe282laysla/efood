import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GlobalAddOn } from '../types';

const GlobalAddOnsManager: React.FC = () => {
  const { globalAddOns, addGlobalAddOn, updateGlobalAddOn, deleteGlobalAddOn, isDarkMode } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    category: '',
    isActive: true
  });

  const categories = ['Carnes', 'Queijos', 'Molhos', 'Acompanhamentos', 'Bebidas', 'Outros'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || formData.price <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (editingId) {
        await updateGlobalAddOn(editingId, formData);
        alert('Adicional atualizado com sucesso!');
        setEditingId(null);
      } else {
        await addGlobalAddOn({
          ...formData,
          createdAt: new Date()
        });
        alert('Adicional adicionado com sucesso!');
        setIsAdding(false);
      }
      
      setFormData({
        name: '',
        price: 0,
        description: '',
        category: '',
        isActive: true
      });
    } catch (error) {
      alert('Erro ao salvar adicional');
      console.error(error);
    }
  };

  const handleEdit = (addOn: GlobalAddOn) => {
    setFormData({
      name: addOn.name,
      price: addOn.price,
      description: addOn.description || '',
      category: addOn.category || '',
      isActive: addOn.isActive
    });
    setEditingId(addOn.id);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este adicional?')) {
      try {
        await deleteGlobalAddOn(id);
        alert('Adicional excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir adicional');
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: '',
      price: 0,
      description: '',
      category: '',
      isActive: true
    });
  };

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-bold ${textColor} mb-2`}>Gerenciar Adicionais</h2>
          <p className={`text-sm ${textSecondary}`}>
            Crie adicionais que podem ser reutilizados em vários produtos
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Novo Adicional</span>
        </button>
      </div>

      {/* Form */}
      {(isAdding || editingId) && (
        <div className={`border ${borderColor} rounded-lg p-4 mb-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
            {editingId ? 'Editar Adicional' : 'Novo Adicional'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Nome do Adicional *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Ex: Bacon Extra"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
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
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                rows={2}
                placeholder="Descrição opcional do adicional"
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
      <div className="space-y-3">
        {globalAddOns.length === 0 ? (
          <div className="text-center py-8">
            <Tag className={`mx-auto h-12 w-12 ${textSecondary} mb-4`} />
            <p className={`${textSecondary}`}>Nenhum adicional cadastrado</p>
            <p className={`text-sm ${textSecondary} mt-1`}>
              Clique em "Novo Adicional" para começar
            </p>
          </div>
        ) : (
          globalAddOns.map((addOn) => (
            <div key={addOn.id} className={`border ${borderColor} rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`font-semibold ${textColor}`}>{addOn.name}</h3>
                    <span className="text-orange-600 font-bold">
                      R$ {addOn.price.toFixed(2)}
                    </span>
                    {addOn.category && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {addOn.category}
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      addOn.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {addOn.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  {addOn.description && (
                    <p className={`text-sm ${textSecondary}`}>{addOn.description}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(addOn)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(addOn.id)}
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

export default GlobalAddOnsManager;