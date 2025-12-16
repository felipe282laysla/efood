import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Package, Search, Filter, Eye, EyeOff, Image, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, AddOn } from '../../types';
import ImageUpload from '../ImageUpload';

const ProductManager: React.FC = () => {
  const { 
    products, 
    categories, 
    globalAddOns,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    isDarkMode 
  } = useApp();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    images: [], // Nova funcionalidade: múltiplas imagens
    category: '',
    discount: 0,
    isActive: true,
    addOns: [],
    // NOVA FUNCIONALIDADE: Checkout direto
    checkoutEnabled: false,
    checkoutUrl: '',
    checkoutText: 'Comprar Agora'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim() || !formData.description?.trim() || !formData.category || formData.price! <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Validar checkout se estiver habilitado
    if (formData.checkoutEnabled && !formData.checkoutUrl?.trim()) {
      alert('Por favor, configure o link de checkout ou desative a opção');
      return;
    }

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
        alert('Produto atualizado com sucesso!');
        setEditingId(null);
      } else {
        await addProduct(formData as Omit<Product, 'id'>);
        alert('Produto adicionado com sucesso!');
        setIsAdding(false);
      }
      
      setFormData({
        name: '',
        description: '',
        price: 0,
        image: '',
        images: [],
        category: '',
        discount: 0,
        isActive: true,
        addOns: [],
        checkoutEnabled: false,
        checkoutUrl: '',
        checkoutText: 'Comprar Agora'
      });
    } catch (error) {
      alert('Erro ao salvar produto');
      console.error(error);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      ...product,
      checkoutEnabled: product.checkoutEnabled || false,
      checkoutUrl: product.checkoutUrl || '',
      checkoutText: product.checkoutText || 'Comprar Agora'
    });
    setEditingId(product.id);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(id);
        alert('Produto excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir produto');
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      images: [],
      category: '',
      discount: 0,
      isActive: true,
      addOns: [],
      checkoutEnabled: false,
      checkoutUrl: '',
      checkoutText: 'Comprar Agora'
    });
  };

  const handleAddOnToggle = (addOn: AddOn) => {
    const currentAddOns = formData.addOns || [];
    const exists = currentAddOns.find(item => item.id === addOn.id);
    
    if (exists) {
      setFormData(prev => ({
        ...prev,
        addOns: currentAddOns.filter(item => item.id !== addOn.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        addOns: [...currentAddOns, addOn]
      }));
    }
  };

  // Nova funcionalidade: Gerenciar múltiplas imagens
  const handleAddImage = (url: string) => {
    const currentImages = formData.images || [];
    if (currentImages.length < 5) { // Limite de 5 imagens
      setFormData(prev => ({
        ...prev,
        images: [...currentImages, url]
      }));
    } else {
      alert('Máximo de 5 imagens por produto');
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = formData.images || [];
    setFormData(prev => ({
      ...prev,
      images: currentImages.filter((_, i) => i !== index)
    }));
  };

  const handleSetMainImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && product.isActive) ||
                         (filterStatus === 'inactive' && !product.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-bold ${textColor} mb-2`}>Gerenciar Produtos</h2>
          <p className={`text-sm ${textSecondary}`}>
            Adicione, edite e gerencie os produtos da sua loja
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produtos..."
              className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className={`px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
      </div>

      {/* Form */}
      {(isAdding || editingId) && (
        <div className={`border ${borderColor} rounded-lg p-6 mb-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
            {editingId ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Nome do produto"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Categoria *
                </label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.filter(cat => cat.isActive).map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
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
                placeholder="Descrição do produto"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="0.00"
                  required
                />
              </div>

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

            {/* NOVA FUNCIONALIDADE: Configuração de checkout direto */}
            <div className={`p-4 border ${borderColor} rounded-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className={`text-md font-semibold ${textColor}`}>Checkout Direto</h4>
                  <p className={`text-sm ${textSecondary}`}>
                    Permite que o cliente vá direto para um link de checkout personalizado
                  </p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.checkoutEnabled || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, checkoutEnabled: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.checkoutEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.checkoutEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </div>
                </label>
              </div>

              {formData.checkoutEnabled && (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      <ExternalLink className="inline mr-1" size={16} />
                      Link de Checkout *
                    </label>
                    <input
                      type="url"
                      value={formData.checkoutUrl || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, checkoutUrl: e.target.value }))}
                      className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="https://checkout.exemplo.com/produto"
                      required={formData.checkoutEnabled}
                    />
                    <p className={`text-xs ${textSecondary} mt-1`}>
                      URL para onde o cliente será redirecionado ao clicar no botão de checkout
                    </p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={formData.checkoutText || 'Comprar Agora'}
                      onChange={(e) => setFormData(prev => ({ ...prev, checkoutText: e.target.value }))}
                      className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="Comprar Agora"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Imagem Principal */}
            <div>
              <label className={`block text-sm font-medium ${textColor} mb-2`}>
                Imagem Principal do Produto *
              </label>
              <ImageUpload
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
                currentImage={formData.image}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Nova funcionalidade: Galeria de Imagens */}
            <div>
              <label className={`block text-sm font-medium ${textColor} mb-2`}>
                Galeria de Imagens (até 5 imagens)
              </label>
              
              {/* Upload de nova imagem */}
              <div className="mb-4">
                <ImageUpload
                  onImageUploaded={handleAddImage}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Lista de imagens */}
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className={`relative border ${borderColor} rounded-lg p-2`}>
                      <img
                        src={imageUrl}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      
                      <div className="absolute top-1 right-1 flex space-x-1">
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(imageUrl)}
                          className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                          title="Definir como principal"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                          title="Remover"
                        >
                          <X size={12} />
                        </button>
                      </div>
                      
                      {formData.image === imageUrl && (
                        <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                          Principal
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add-ons Selection */}
            {globalAddOns.length > 0 && (
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Adicionais Disponíveis
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
                  {globalAddOns.filter(addOn => addOn.isActive).map((addOn) => (
                    <label key={addOn.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.addOns?.some(item => item.id === addOn.id) || false}
                        onChange={() => handleAddOnToggle({
                          id: addOn.id,
                          name: addOn.name,
                          price: addOn.price,
                          description: addOn.description,
                          isGlobal: true
                        })}
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <div className="flex-1">
                        <span className={`text-sm ${textColor}`}>{addOn.name}</span>
                        <span className="text-sm text-orange-600 ml-2">
                          +R$ {addOn.price.toFixed(2)}
                        </span>
                        {addOn.category && (
                          <span className={`text-xs ${textSecondary} block`}>
                            {addOn.category}
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

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

      {/* Products List */}
      <div className="space-y-4">
        <div className={`text-sm ${textSecondary} mb-4`}>
          Mostrando {filteredProducts.length} de {products.length} produtos
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package className={`mx-auto h-12 w-12 ${textSecondary} mb-4`} />
            <p className={`${textSecondary}`}>
              {products.length === 0 
                ? 'Nenhum produto cadastrado' 
                : 'Nenhum produto encontrado com os filtros aplicados'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const category = categories.find(cat => cat.id === product.category);
              return (
                <div key={product.id} className={`border ${borderColor} rounded-lg p-4`}>
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      {/* Indicador de múltiplas imagens */}
                      {product.images && product.images.length > 0 && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          <Image size={10} />
                        </div>
                      )}
                      {/* Indicador de checkout direto */}
                      {product.checkoutEnabled && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          <ExternalLink size={10} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`font-semibold ${textColor}`}>{product.name}</h3>
                          <p className={`text-sm ${textSecondary} line-clamp-2`}>
                            {product.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            {product.discount && product.discount > 0 ? (
                              <>
                                <span className="text-gray-400 line-through text-sm">
                                  R$ {product.price.toFixed(2)}
                                </span>
                                <span className="text-orange-600 font-bold">
                                  R$ {(product.price * (1 - product.discount / 100)).toFixed(2)}
                                </span>
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                  -{product.discount}%
                                </span>
                              </>
                            ) : (
                              <span className="text-orange-600 font-bold">
                                R$ {product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-1">
                            {category && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {category.icon} {category.name}
                              </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              product.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.isActive ? 'Ativo' : 'Inativo'}
                            </span>
                            {product.checkoutEnabled && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                Checkout
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-1">
                            {product.addOns && product.addOns.length > 0 && (
                              <p className={`text-xs ${textSecondary}`}>
                                {product.addOns.length} adicionais
                              </p>
                            )}
                            {product.images && product.images.length > 0 && (
                              <p className={`text-xs ${textSecondary}`}>
                                {product.images.length + 1} imagens
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManager;