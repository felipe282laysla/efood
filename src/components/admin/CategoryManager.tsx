import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tag, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';

const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, isDarkMode } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    isActive: true
  });

  const commonIcons = [
    '🍔', '🍟', '🥤', '🍰', '🍕', '🌭', '🥪', '🍗', '🍖', '🥓',
    '🧀', '🥗', '🍜', '🍲', '🍱', '🍙', '🍘', '🍚', '🍛', '🍝',
    '🍤', '🍣', '🍱', '🥟', '🥠', '🍢', '🍡', '🧁', '🍪', '🎂'
  ];

  // Verificar se já existe uma categoria com o mesmo nome
  const categoryNameExists = (name: string, excludeId?: string) => {
    return categories.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && cat.id !== excludeId
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.icon.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Verificar se já existe uma categoria com o mesmo nome
    if (categoryNameExists(formData.name.trim(), editingId || undefined)) {
      alert('Já existe uma categoria com este nome. Por favor, escolha um nome diferente.');
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        alert('Categoria atualizada com sucesso!');
        setEditingId(null);
      } else {
        await addCategory(formData);
        alert('Categoria adicionada com sucesso!');
        setIsAdding(false);
      }
      
      setFormData({
        name: '',
        icon: '',
        isActive: true
      });
    } catch (error) {
      alert('Erro ao salvar categoria');
      console.error(error);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      icon: category.icon,
      isActive: category.isActive
    });
    setEditingId(category.id);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await deleteCategory(id);
        alert('Categoria excluída com sucesso!');
      } catch (error) {
        alert('Erro ao excluir categoria');
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: '',
      icon: '',
      isActive: true
    });
  };

  // Filter categories
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-bold ${textColor} mb-2`}>Gerenciar Categorias</h2>
          <p className={`text-sm ${textSecondary}`}>
            Organize seus produtos em categorias (nomes únicos)
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar categorias..."
            className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
          />
        </div>
      </div>

      {/* Form */}
      {(isAdding || editingId) && (
        <div className={`border ${borderColor} rounded-lg p-6 mb-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
            {editingId ? 'Editar Categoria' : 'Nova Categoria'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Ex: Hambúrgueres"
                  required
                />
                {formData.name && categoryNameExists(formData.name.trim(), editingId || undefined) && (
                  <p className="text-red-500 text-xs mt-1">
                    ⚠️ Já existe uma categoria com este nome
                  </p>
                )}
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
              <label className={`block text-sm font-medium ${textColor} mb-2`}>
                Ícone da Categoria *
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Digite um emoji ou escolha abaixo"
                  required
                />
                
                <div className="grid grid-cols-10 gap-2">
                  {commonIcons.map((icon, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      className={`p-2 text-2xl rounded-lg border-2 transition-colors ${
                        formData.icon === icon
                          ? 'border-orange-500 bg-orange-50'
                          : `border-gray-300 hover:border-orange-300 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={formData.name && categoryNameExists(formData.name.trim(), editingId || undefined)}
                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Categories List */}
      <div className="space-y-3">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8">
            <Tag className={`mx-auto h-12 w-12 ${textSecondary} mb-4`} />
            <p className={`${textSecondary}`}>
              {categories.length === 0 
                ? 'Nenhuma categoria cadastrada' 
                : 'Nenhuma categoria encontrada'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => (
              <div key={category.id} className={`border ${borderColor} rounded-lg p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className={`font-semibold ${textColor}`}>{category.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;