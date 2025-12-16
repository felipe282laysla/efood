import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Package, 
  Tag, 
  Gift, 
  Users, 
  Star, 
  ShoppingBag, 
  Clock, 
  Palette, 
  Globe,
  UserPlus,
  BarChart3,
  Home,
  Moon,
  Sun,
  LogOut,
  Shield,
  Database,
  Key,
  Image,
  Award,
  Store,
  Menu,
  X,
  Trello
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useGlobalOrderNotification } from '../hooks/useGlobalOrderNotification';

// Import all admin components
import ProductManager from '../components/admin/ProductManager';
import CategoryManager from '../components/admin/CategoryManager';
import GlobalAddOnsManager from '../components/GlobalAddOnsManager';
import PromotionManager from '../components/PromotionManager';
import GiveawayManager from '../components/GiveawayManager';
import SocialMediaManager from '../components/SocialMediaManager';
import ColorPalettePicker from '../components/ColorPalettePicker';
import ReviewsManager from '../components/admin/ReviewsManager';
import OrdersManager from '../components/admin/OrdersManager';
import OrderKanban from '../components/admin/OrderKanban';
import UsersManager from '../components/admin/UsersManager';
import BusinessHoursManager from '../components/admin/BusinessHoursManager';
import BusinessConfigManager from '../components/admin/BusinessConfigManager';
import DashboardOverview from '../components/admin/DashboardOverview';
import DataManager from '../components/admin/DataManager';
import AdminCredentialsManager from '../components/admin/AdminCredentialsManager';
import HomeBannerManager from '../components/admin/HomeBannerManager';
import SponsorManager from '../components/admin/SponsorManager';
import StoreModeManager from '../components/admin/StoreModeManager';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, adminLogout, isDarkMode, toggleDarkMode } = useApp();
  
  // Recuperar a aba ativa do localStorage ou usar 'dashboard' como padrão
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminActiveTab') || 'dashboard';
  });

  // NOVA FUNCIONALIDADE: Estado do menu lateral recolhível
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('adminSidebarCollapsed') === 'true';
  });

  // Initialize global order notification
  const { isPlaying, stopNotification } = useGlobalOrderNotification();

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Salvar a aba ativa no localStorage sempre que ela mudar
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  // Salvar estado do sidebar no localStorage
  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', isSidebarCollapsed.toString());
  }, [isSidebarCollapsed]);

  if (!isAdmin) {
    return null;
  }

  const handleLogout = () => {
    // Limpar a aba ativa salva ao fazer logout
    localStorage.removeItem('adminActiveTab');
    localStorage.removeItem('adminSidebarCollapsed');
    adminLogout();
    navigate('/');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleViewStore = () => {
    // Salvar a aba atual antes de navegar para a loja
    localStorage.setItem('adminActiveTab', activeTab);
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-blue-500' },
    { id: 'config', label: 'Configurações', icon: Settings, color: 'text-gray-500' },
    { id: 'credentials', label: 'Login & Senha', icon: Key, color: 'text-red-500' },
    { id: 'storemode', label: 'Modo da Loja', icon: Store, color: 'text-indigo-500' },
    { id: 'products', label: 'Produtos', icon: Package, color: 'text-green-500' },
    { id: 'categories', label: 'Categorias', icon: Tag, color: 'text-purple-500' },
    { id: 'addons', label: 'Adicionais', icon: UserPlus, color: 'text-orange-500' },
    { id: 'promotions', label: 'Promoções', icon: Gift, color: 'text-red-500' },
    { id: 'giveaways', label: 'Sorteios', icon: Gift, color: 'text-yellow-500' },
    { id: 'banners', label: 'Banners Home', icon: Image, color: 'text-teal-500' },
    { id: 'sponsors', label: 'Patrocinadores', icon: Award, color: 'text-rose-500' },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag, color: 'text-indigo-500' },
    { id: 'kanban', label: 'Kanban', icon: Trello, color: 'text-cyan-500' },
    { id: 'users', label: 'Usuários', icon: Users, color: 'text-cyan-500' },
    { id: 'reviews', label: 'Avaliações', icon: Star, color: 'text-amber-500' },
    { id: 'hours', label: 'Horários', icon: Clock, color: 'text-emerald-500' },
    { id: 'colors', label: 'Cores', icon: Palette, color: 'text-pink-500' },
    { id: 'social', label: 'Redes Sociais', icon: Globe, color: 'text-blue-600' },
    { id: 'data', label: 'Dados', icon: Database, color: 'text-slate-500' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onTabChange={handleTabChange} />;
      case 'config':
        return <BusinessConfigManager />;
      case 'credentials':
        return <AdminCredentialsManager />;
      case 'storemode':
        return <StoreModeManager />;
      case 'products':
        return <ProductManager />;
      case 'categories':
        return <CategoryManager />;
      case 'addons':
        return <GlobalAddOnsManager />;
      case 'promotions':
        return <PromotionManager />;
      case 'giveaways':
        return <GiveawayManager />;
      case 'banners':
        return <HomeBannerManager />;
      case 'sponsors':
        return <SponsorManager />;
      case 'orders':
        return <OrdersManager />;
      case 'kanban':
        return <OrderKanban isDarkMode={isDarkMode} />;
      case 'users':
        return <UsersManager />;
      case 'reviews':
        return <ReviewsManager />;
      case 'hours':
        return <BusinessHoursManager />;
      case 'colors':
        return <ColorPalettePicker isDarkMode={isDarkMode} />;
      case 'social':
        return <SocialMediaManager isDarkMode={isDarkMode} />;
      case 'data':
        return <DataManager />;
      default:
        return <DashboardOverview onTabChange={handleTabChange} />;
    }
  };

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const sidebarBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgColor} flex flex-col`}>
      {/* Global Order Notification Alert */}
      {isPlaying && (
        <div className="fixed top-4 right-4 z-50 bg-orange-500 text-white p-4 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <div>
              <p className="font-bold">🔔 Novo Pedido!</p>
              <p className="text-sm">Um novo pedido foi recebido</p>
            </div>
            <button
              onClick={stopNotification}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Parar
            </button>
          </div>
        </div>
      )}

      {/* Fixed Header */}
      <header className={`${sidebarBg} shadow-sm border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0 z-40`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* NOVO: Botão para recolher/expandir sidebar */}
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title={isSidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
              >
                {isSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
              </button>
              
              <Shield className={`h-8 w-8 text-red-500`} />
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold ${textColor}`}>Painel Administrativo</h1>
                <p className={`text-xs sm:text-sm ${textSecondary}`}>Gerencie sua loja digital</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleViewStore}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                <Home size={16} />
                <span className="hidden sm:block">Ver Loja</span>
              </button>
              
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
              >
                <LogOut size={16} />
                <span className="hidden sm:block">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* SIDEBAR RECOLHÍVEL - Melhorado para mobile */}
        <aside 
          className={`${sidebarBg} shadow-sm border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} 
            ${isSidebarCollapsed ? 'w-16' : 'w-64'} 
            transition-all duration-300 ease-in-out
            fixed lg:sticky top-0 h-screen overflow-y-auto z-30
            ${isSidebarCollapsed ? 'lg:relative' : 'lg:relative'}
          `} 
          style={{ top: '88px', height: 'calc(100vh - 88px)' }}
        >
          {/* Overlay para mobile quando sidebar está aberto */}
          {!isSidebarCollapsed && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
              onClick={() => setIsSidebarCollapsed(true)}
            />
          )}
          
          <nav className="p-2 sm:p-4 relative z-30">
            <div className="space-y-1 sm:space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      // Fechar sidebar no mobile após selecionar
                      if (window.innerWidth < 1024) {
                        setIsSidebarCollapsed(true);
                      }
                    }}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-orange-500 text-white'
                        : `${textColor} hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-700' : ''}`
                    }`}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <Icon size={20} className={activeTab === item.id ? 'text-white' : item.color} />
                    {!isSidebarCollapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content - Ajustado para responsividade */}
        <main 
          className={`flex-1 p-3 sm:p-6 overflow-y-auto transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}
          `}
          style={{
            marginLeft: window.innerWidth >= 1024 ? '0' : '0'
          }}
        >
          <div className="max-w-full mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;