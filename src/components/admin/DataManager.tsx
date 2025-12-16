import React, { useState } from 'react';
import { Database, Download, Upload, Trash2, RefreshCw, AlertTriangle, FileText, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import * as XLSX from 'xlsx';

const DataManager: React.FC = () => {
  const { 
    products, 
    orders, 
    users, 
    reviews, 
    categories,
    promotions,
    clearCache,
    isDarkMode 
  } = useApp();
  
  const [loading, setLoading] = useState(false);

  const handleExportData = (dataType: string) => {
    setLoading(true);
    try {
      let data: any[] = [];
      let filename = '';

      switch (dataType) {
        case 'products':
          data = products.map(product => ({
            ID: product.id,
            Nome: product.name,
            Descrição: product.description,
            Preço: product.price,
            Categoria: product.category,
            Desconto: product.discount || 0,
            Ativo: product.isActive ? 'Sim' : 'Não',
            'Adicionais Disponíveis': product.addOns?.length || 0
          }));
          filename = 'produtos';
          break;

        case 'orders':
          data = orders.map(order => ({
            ID: order.id,
            Cliente: order.customerName,
            Telefone: order.customerPhone || '',
            Endereço: order.customerLocation,
            Total: order.total,
            Status: order.status,
            Data: order.date.toLocaleDateString('pt-BR'),
            'Quantidade de Itens': order.items.reduce((sum, item) => sum + item.quantity, 0),
            'Participação em Sorteio': order.giveawayParticipations ? 'Sim' : 'Não'
          }));
          filename = 'pedidos';
          break;

        case 'users':
          data = users.map(user => ({
            ID: user.id,
            Nome: user.name,
            Email: user.email,
            Telefone: user.phone || '',
            Endereço: user.address || '',
            'Data de Cadastro': user.registrationDate.toLocaleDateString('pt-BR'),
            'Total de Pedidos': user.totalOrders,
            Ativo: user.isActive ? 'Sim' : 'Não'
          }));
          filename = 'usuarios';
          break;

        case 'reviews':
          data = reviews.map(review => ({
            ID: review.id,
            Cliente: review.customerName,
            Avaliação: review.rating,
            Comentário: review.comment,
            Data: review.date.toLocaleDateString('pt-BR')
          }));
          filename = 'avaliacoes';
          break;

        case 'categories':
          data = categories.map(category => ({
            ID: category.id,
            Nome: category.name,
            Ícone: category.icon,
            Ativo: category.isActive ? 'Sim' : 'Não'
          }));
          filename = 'categorias';
          break;

        case 'promotions':
          data = promotions.map(promotion => ({
            ID: promotion.id,
            Tipo: promotion.type,
            Título: promotion.title,
            Descrição: promotion.description,
            'Data de Início': promotion.startDate.toLocaleDateString('pt-BR'),
            'Data de Fim': promotion.endDate.toLocaleDateString('pt-BR'),
            Desconto: promotion.discount || 0,
            'Preço do Combo': promotion.comboPrice || 0,
            Ativo: promotion.isActive ? 'Sim' : 'Não'
          }));
          filename = 'promocoes';
          break;

        default:
          throw new Error('Tipo de dados inválido');
      }

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Dados');
      
      const timestamp = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);
      
      alert(`Dados de ${filename} exportados com sucesso!`);
    } catch (error) {
      alert('Erro ao exportar dados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = () => {
    setLoading(true);
    try {
      const wb = XLSX.utils.book_new();

      // Products
      const productsData = products.map(product => ({
        ID: product.id,
        Nome: product.name,
        Descrição: product.description,
        Preço: product.price,
        Categoria: product.category,
        Desconto: product.discount || 0,
        Ativo: product.isActive ? 'Sim' : 'Não'
      }));
      const wsProducts = XLSX.utils.json_to_sheet(productsData);
      XLSX.utils.book_append_sheet(wb, wsProducts, 'Produtos');

      // Orders
      const ordersData = orders.map(order => ({
        ID: order.id,
        Cliente: order.customerName,
        Total: order.total,
        Status: order.status,
        Data: order.date.toLocaleDateString('pt-BR')
      }));
      const wsOrders = XLSX.utils.json_to_sheet(ordersData);
      XLSX.utils.book_append_sheet(wb, wsOrders, 'Pedidos');

      // Users
      const usersData = users.map(user => ({
        ID: user.id,
        Nome: user.name,
        Email: user.email,
        'Data de Cadastro': user.registrationDate.toLocaleDateString('pt-BR'),
        Ativo: user.isActive ? 'Sim' : 'Não'
      }));
      const wsUsers = XLSX.utils.json_to_sheet(usersData);
      XLSX.utils.book_append_sheet(wb, wsUsers, 'Usuários');

      // Reviews
      const reviewsData = reviews.map(review => ({
        Cliente: review.customerName,
        Avaliação: review.rating,
        Comentário: review.comment,
        Data: review.date.toLocaleDateString('pt-BR')
      }));
      const wsReviews = XLSX.utils.json_to_sheet(reviewsData);
      XLSX.utils.book_append_sheet(wb, wsReviews, 'Avaliações');

      const timestamp = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `dados_completos_${timestamp}.xlsx`);
      
      alert('Todos os dados exportados com sucesso!');
    } catch (error) {
      alert('Erro ao exportar dados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    if (confirm('Tem certeza que deseja limpar o cache? Isso irá recarregar todos os dados.')) {
      setLoading(true);
      try {
        await clearCache();
        alert('Cache limpo com sucesso!');
        window.location.reload();
      } catch (error) {
        alert('Erro ao limpar cache');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getDataStats = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalReviews: reviews.length,
      totalCategories: categories.length,
      totalPromotions: promotions.length,
      totalRevenue,
      averageRating
    };
  };

  const stats = getDataStats();

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const exportOptions = [
    { key: 'products', label: 'Produtos', count: stats.totalProducts, icon: '📦' },
    { key: 'orders', label: 'Pedidos', count: stats.totalOrders, icon: '🛒' },
    { key: 'users', label: 'Usuários', count: stats.totalUsers, icon: '👥' },
    { key: 'reviews', label: 'Avaliações', count: stats.totalReviews, icon: '⭐' },
    { key: 'categories', label: 'Categorias', count: stats.totalCategories, icon: '🏷️' },
    { key: 'promotions', label: 'Promoções', count: stats.totalPromotions, icon: '🎁' }
  ];

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center space-x-3 mb-6">
        <Database className={`h-6 w-6 ${textColor}`} />
        <div>
          <h2 className={`text-xl font-bold ${textColor}`}>Gerenciamento de Dados</h2>
          <p className={`text-sm ${textSecondary}`}>
            Exporte, importe e gerencie os dados da sua loja
          </p>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 border ${borderColor} rounded-lg text-center`}>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.totalProducts}</p>
          <p className={`text-sm ${textSecondary}`}>Produtos</p>
        </div>
        <div className={`p-4 border ${borderColor} rounded-lg text-center`}>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.totalOrders}</p>
          <p className={`text-sm ${textSecondary}`}>Pedidos</p>
        </div>
        <div className={`p-4 border ${borderColor} rounded-lg text-center`}>
          <p className={`text-2xl font-bold ${textColor}`}>{stats.totalUsers}</p>
          <p className={`text-sm ${textSecondary}`}>Usuários</p>
        </div>
        <div className={`p-4 border ${borderColor} rounded-lg text-center`}>
          <p className={`text-2xl font-bold text-green-600`}>R$ {stats.totalRevenue.toFixed(2)}</p>
          <p className={`text-sm ${textSecondary}`}>Receita Total</p>
        </div>
      </div>

      {/* Export Data Section */}
      <div className={`border ${borderColor} rounded-lg p-6 mb-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Exportar Dados</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {exportOptions.map((option) => (
            <div key={option.key} className={`border ${borderColor} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <h4 className={`font-medium ${textColor}`}>{option.label}</h4>
                    <p className={`text-sm ${textSecondary}`}>{option.count} registros</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleExportData(option.key)}
                disabled={loading || option.count === 0}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                <span>Exportar</span>
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportAll}
            disabled={loading}
            className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <FileText size={16} />
            <span>Exportar Todos os Dados</span>
          </button>
        </div>
      </div>

      {/* System Management */}
      <div className={`border ${borderColor} rounded-lg p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Gerenciamento do Sistema</h3>
        
        <div className="space-y-4">
          <div className={`p-4 border ${borderColor} rounded-lg`}>
            <div className="flex items-start space-x-3">
              <RefreshCw className={`h-5 w-5 ${textColor} mt-0.5`} />
              <div className="flex-1">
                <h4 className={`font-medium ${textColor} mb-1`}>Limpar Cache</h4>
                <p className={`text-sm ${textSecondary} mb-3`}>
                  Remove dados temporários e recarrega todas as informações do banco de dados
                </p>
                <button
                  onClick={handleClearCache}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={16} />
                  <span>Limpar Cache</span>
                </button>
              </div>
            </div>
          </div>

          <div className={`p-4 border border-red-200 rounded-lg bg-red-50 ${isDarkMode ? 'bg-red-900/20 border-red-800' : ''}`}>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <h4 className={`font-medium text-red-800 ${isDarkMode ? 'text-red-400' : ''} mb-1`}>
                  Zona de Perigo
                </h4>
                <p className={`text-sm text-red-600 ${isDarkMode ? 'text-red-300' : ''} mb-3`}>
                  Ações irreversíveis que podem causar perda de dados
                </p>
                <div className="space-y-2">
                  <p className={`text-xs text-red-500 ${isDarkMode ? 'text-red-400' : ''}`}>
                    ⚠️ Use essas opções apenas se souber o que está fazendo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className={`mt-6 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg`}>
        <h4 className={`text-sm font-medium ${textColor} mb-2`}>Instruções:</h4>
        <ul className={`text-sm ${textSecondary} space-y-1`}>
          <li>• Os dados são exportados em formato Excel (.xlsx)</li>
          <li>• Cada tipo de dado é exportado em uma planilha separada</li>
          <li>• A opção "Exportar Todos" cria um arquivo com múltiplas abas</li>
          <li>• O cache é limpo automaticamente quando necessário</li>
          <li>• Todos os dados são salvos em tempo real no Firebase</li>
        </ul>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${bgColor} rounded-lg p-6 flex items-center space-x-3`}>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            <span className={textColor}>Processando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManager;