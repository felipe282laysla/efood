import React from 'react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Clock,
  Award,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DashboardOverviewProps {
  onTabChange?: (tab: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onTabChange }) => {
  const { 
    products, 
    orders, 
    users, 
    reviews, 
    promotions,
    isDarkMode,
    businessConfig 
  } = useApp();

  // Calculate statistics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalUsers = users.length;
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  const activePromotions = promotions.filter(p => p.isActive).length;

  // Recent orders (last 7 days)
  const recentOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return orderDate >= weekAgo;
  });

  const recentRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0);

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const stats = [
    {
      title: 'Total de Produtos',
      value: totalProducts,
      subtitle: `${activeProducts} ativos`,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      darkBgColor: 'bg-blue-900/20'
    },
    {
      title: 'Pedidos Totais',
      value: totalOrders,
      subtitle: `${recentOrders.length} esta semana`,
      icon: ShoppingBag,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      darkBgColor: 'bg-green-900/20'
    },
    {
      title: 'Receita Total',
      value: `R$ ${totalRevenue.toFixed(2)}`,
      subtitle: `R$ ${recentRevenue.toFixed(2)} esta semana`,
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      darkBgColor: 'bg-emerald-900/20'
    },
    {
      title: 'Usuários Cadastrados',
      value: totalUsers,
      subtitle: 'Clientes registrados',
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      darkBgColor: 'bg-purple-900/20'
    },
    {
      title: 'Avaliação Média',
      value: averageRating.toFixed(1),
      subtitle: `${reviews.length} avaliações`,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      darkBgColor: 'bg-yellow-900/20'
    },
    {
      title: 'Promoções Ativas',
      value: activePromotions,
      subtitle: `${promotions.length} total`,
      icon: Award,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      darkBgColor: 'bg-red-900/20'
    }
  ];

  // Quick actions with functionality
  const quickActions = [
    {
      title: 'Novo Produto',
      description: 'Adicionar produto ao catálogo',
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      darkBgColor: 'bg-blue-900/20',
      hoverColor: 'hover:bg-blue-100',
      darkHoverColor: 'dark:hover:bg-blue-900/30',
      action: () => onTabChange?.('products')
    },
    {
      title: 'Nova Promoção',
      description: 'Criar oferta especial',
      icon: Award,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      darkBgColor: 'bg-green-900/20',
      hoverColor: 'hover:bg-green-100',
      darkHoverColor: 'dark:hover:bg-green-900/30',
      action: () => onTabChange?.('promotions')
    },
    {
      title: 'Ver Usuários',
      description: 'Gerenciar clientes',
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      darkBgColor: 'bg-purple-900/20',
      hoverColor: 'hover:bg-purple-100',
      darkHoverColor: 'dark:hover:bg-purple-900/30',
      action: () => onTabChange?.('users')
    },
    {
      title: 'Relatórios',
      description: 'Visualizar dados',
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      darkBgColor: 'bg-orange-900/20',
      hoverColor: 'hover:bg-orange-100',
      darkHoverColor: 'dark:hover:bg-orange-900/30',
      action: () => onTabChange?.('data')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${textColor} mb-2`}>Dashboard</h1>
        <p className={`${textSecondary}`}>
          Visão geral do seu negócio - {businessConfig.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${bgColor} rounded-lg shadow-md p-6 border ${borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${textSecondary}`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${textColor} mt-1`}>
                    {stat.value}
                  </p>
                  <p className={`text-xs ${textSecondary} mt-1`}>
                    {stat.subtitle}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${isDarkMode ? stat.darkBgColor : stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className={`${bgColor} rounded-lg shadow-md p-6 border ${borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${textColor}`}>Pedidos Recentes</h3>
            <ShoppingBag className={`h-5 w-5 ${textSecondary}`} />
          </div>
          
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div>
                  <p className={`font-medium ${textColor}`}>{order.customerName}</p>
                  <p className={`text-sm ${textSecondary}`}>
                    {order.date.toLocaleDateString('pt-BR')} - {order.items.length} itens
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-green-600`}>
                    R$ {order.total.toFixed(2)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status === 'delivered' ? 'Entregue' : 
                     order.status === 'pending' ? 'Pendente' : 'Em andamento'}
                  </span>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-8">
                <ShoppingBag className={`mx-auto h-12 w-12 ${textSecondary} mb-4`} />
                <p className={`${textSecondary}`}>Nenhum pedido ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className={`${bgColor} rounded-lg shadow-md p-6 border ${borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${textColor}`}>Avaliações Recentes</h3>
            <Star className={`h-5 w-5 ${textSecondary}`} />
          </div>
          
          <div className="space-y-3">
            {reviews.slice(0, 5).map((review) => (
              <div key={review.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-medium ${textColor}`}>{review.customerName}</p>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <p className={`text-sm ${textSecondary} line-clamp-2`}>
                  {review.comment}
                </p>
                <p className={`text-xs ${textSecondary} mt-1`}>
                  {review.date.toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
            
            {reviews.length === 0 && (
              <div className="text-center py-8">
                <Star className={`mx-auto h-12 w-12 ${textSecondary} mb-4`} />
                <p className={`${textSecondary}`}>Nenhuma avaliação ainda</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${bgColor} rounded-lg shadow-md p-6 border ${borderColor}`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Ações Rápidas</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? `${action.darkBgColor} ${action.darkHoverColor}` 
                    : `${action.bgColor} ${action.hoverColor}`
                } transform hover:scale-105 hover:shadow-md`}
              >
                <Icon className={`h-8 w-8 ${action.color} mb-2`} />
                <span className={`text-sm font-medium ${textColor} text-center`}>
                  {action.title}
                </span>
                <span className={`text-xs ${textSecondary} text-center mt-1`}>
                  {action.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Business Status */}
      <div className={`${bgColor} rounded-lg shadow-md p-6 border ${borderColor}`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Status do Negócio</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              businessConfig.isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <Clock className="w-4 h-4 mr-1" />
              {businessConfig.isOpen ? 'Aberto' : 'Fechado'}
            </div>
            <p className={`text-xs ${textSecondary} mt-1`}>Status da loja</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Target className="w-4 h-4 mr-1" />
              {activeProducts} Produtos
            </div>
            <p className={`text-xs ${textSecondary} mt-1`}>Produtos ativos</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              <Award className="w-4 h-4 mr-1" />
              {activePromotions} Promoções
            </div>
            <p className={`text-xs ${textSecondary} mt-1`}>Promoções ativas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;