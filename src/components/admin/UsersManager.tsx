import React, { useState } from 'react';
import { Users, Search, Calendar, Mail, Phone, MapPin, Trash2, UserCheck, UserX, Plus, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';

const UsersManager: React.FC = () => {
  const { users, orders, addUser, updateUser, deleteUser, isDarkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'orders'>('date');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor, insira um email válido');
      return;
    }

    // Check if email already exists (only for new users)
    if (!editingId && users.some(user => user.email.toLowerCase() === formData.email.toLowerCase())) {
      alert('Este email já está cadastrado');
      return;
    }

    try {
      if (editingId) {
        await updateUser(editingId, formData);
        alert('Usuário atualizado com sucesso!');
        setEditingId(null);
      } else {
        await addUser({
          ...formData,
          registrationDate: new Date(),
          totalOrders: 0
        });
        alert('Usuário adicionado com sucesso!');
        setIsAdding(false);
      }
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        isActive: true
      });
    } catch (error) {
      alert('Erro ao salvar usuário');
      console.error(error);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      isActive: user.isActive
    });
    setEditingId(user.id);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await deleteUser(id);
        alert('Usuário excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir usuário');
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      isActive: true
    });
  };

  // Calculate user statistics
  const getUserOrderCount = (userId: string) => {
    return orders.filter(order => 
      users.find(user => user.id === userId && user.email === order.customerName)
    ).length;
  };

  const getUserTotalSpent = (userId: string) => {
    return orders
      .filter(order => 
        users.find(user => user.id === userId && user.email === order.customerName)
      )
      .reduce((sum, order) => sum + order.total, 0);
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && user.isActive) ||
                           (filterStatus === 'inactive' && !user.isActive);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
        case 'orders':
          return getUserOrderCount(b.id) - getUserOrderCount(a.id);
        default:
          return 0;
      }
    });

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive).length;
  const newUsersThisMonth = users.filter(user => {
    const userDate = new Date(user.registrationDate);
    const now = new Date();
    return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
  }).length;

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className={`h-6 w-6 ${textColor}`} />
          <div>
            <h2 className={`text-xl font-bold ${textColor}`}>Gerenciar Usuários</h2>
            <p className={`text-sm ${textSecondary}`}>
              Cadastre e gerencie usuários manualmente
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Novo Usuário</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 border ${borderColor} rounded-lg text-center`}>
          <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className={`text-2xl font-bold ${textColor}`}>{totalUsers}</p>
          <p className={`text-sm ${textSecondary}`}>Total de Usuários</p>
        </div>

        <div className={`p-4 border ${borderColor} rounded-lg text-center`}>
          <UserCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className={`text-2xl font-bold ${textColor}`}>{activeUsers}</p>
          <p className={`text-sm ${textSecondary}`}>Usuários Ativos</p>
        </div>

        <div className={`p-4 border ${borderColor} rounded-lg text-center`}>
          <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <p className={`text-2xl font-bold ${textColor}`}>{newUsersThisMonth}</p>
          <p className={`text-sm ${textSecondary}`}>Novos Este Mês</p>
        </div>

        <div className={`p-4 border ${borderColor} rounded-lg text-center`}>
          <UserX className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className={`text-2xl font-bold ${textColor}`}>{totalUsers - activeUsers}</p>
          <p className={`text-sm ${textSecondary}`}>Usuários Inativos</p>
        </div>
      </div>

      {/* Form */}
      {(isAdding || editingId) && (
        <div className={`border ${borderColor} rounded-lg p-6 mb-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
            {editingId ? 'Editar Usuário' : 'Novo Usuário'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Nome completo do usuário"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="(11) 99999-9999"
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
                Endereço
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                rows={2}
                placeholder="Endereço completo do usuário"
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

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou email..."
              className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className={`px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'orders')}
            className={`px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
          >
            <option value="date">Mais recentes</option>
            <option value="name">Nome A-Z</option>
            <option value="orders">Mais pedidos</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        <div className={`text-sm ${textSecondary} mb-4`}>
          Mostrando {filteredUsers.length} de {users.length} usuários
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className={`mx-auto h-12 w-12 ${textSecondary} mb-4`} />
            <p className={`${textSecondary}`}>
              {users.length === 0 
                ? 'Nenhum usuário cadastrado ainda' 
                : 'Nenhum usuário encontrado com os filtros aplicados'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredUsers.map((user) => {
              const orderCount = getUserOrderCount(user.id);
              const totalSpent = getUserTotalSpent(user.id);
              
              return (
                <div key={user.id} className={`border ${borderColor} rounded-lg p-4`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        user.isActive ? 'bg-green-500' : 'bg-gray-500'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${textColor}`}>{user.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail size={14} className={textSecondary} />
                      <span className={`text-sm ${textSecondary}`}>{user.email}</span>
                    </div>
                    
                    {user.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone size={14} className={textSecondary} />
                        <span className={`text-sm ${textSecondary}`}>{user.phone}</span>
                      </div>
                    )}
                    
                    {user.address && (
                      <div className="flex items-center space-x-2">
                        <MapPin size={14} className={textSecondary} />
                        <span className={`text-sm ${textSecondary}`}>
                          {user.address.length > 40 
                            ? `${user.address.substring(0, 40)}...` 
                            : user.address
                          }
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className={textSecondary} />
                      <span className={`text-sm ${textSecondary}`}>
                        Cadastrado em {user.registrationDate.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`mt-3 pt-3 border-t ${borderColor}`}>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className={`text-lg font-bold ${textColor}`}>{orderCount}</p>
                        <p className={`text-xs ${textSecondary}`}>Pedidos</p>
                      </div>
                      <div>
                        <p className={`text-lg font-bold text-green-600`}>
                          R$ {totalSpent.toFixed(2)}
                        </p>
                        <p className={`text-xs ${textSecondary}`}>Total Gasto</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* User Benefits Info */}
      <div className={`mt-6 p-4 border ${borderColor} rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-2`}>Benefícios dos Usuários Cadastrados</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">💰</div>
            <p className={`font-medium ${textColor}`}>Desconto Automático</p>
            <p className={`text-sm ${textSecondary}`}>R$ 2,00 OFF em todos os produtos</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎁</div>
            <p className={`font-medium ${textColor}`}>Participação em Sorteios</p>
            <p className={`text-sm ${textSecondary}`}>Elegível para promoções especiais</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📱</div>
            <p className={`font-medium ${textColor}`}>Experiência Personalizada</p>
            <p className={`text-sm ${textSecondary}`}>Dados salvos para facilitar pedidos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManager;