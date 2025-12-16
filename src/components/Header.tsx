import React, { useState } from 'react';
import { ShoppingCart, MapPin, User, LogOut, Moon, Sun, Shield, ArrowLeft, Instagram, Facebook } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import AdminLoginModal from './AdminLoginModal';

interface HeaderProps {
  onCartClick: () => void;
  cartItemCount: number;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, cartItemCount }) => {
  const { 
    businessConfig, 
    currentUser, 
    currentUserData, 
    isAdmin,
    isDarkMode,
    logoutUser, 
    adminLogout,
    toggleDarkMode 
  } = useApp();
  
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    setShowUserMenu(false);
  };

  const handleAdminLogout = () => {
    adminLogout();
    setShowUserMenu(false);
  };

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  const bgColor = isDarkMode ? 'bg-gray-800' : businessConfig.colors?.headerBackground || 'bg-white';
  const textColor = isDarkMode ? 'text-white' : businessConfig.colors?.text || 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : businessConfig.colors?.textSecondary || 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const primaryColor = businessConfig.colors?.primary || '#F97316';

  // Verificar se o modo escuro está forçado
  const isDarkModeForced = businessConfig.darkModeConfig === 'forced-dark';
  const isLightModeForced = businessConfig.darkModeConfig === 'forced-light';
  const isDarkModeOptional = !businessConfig.darkModeConfig || businessConfig.darkModeConfig === 'optional';

  return (
    <header className={`${bgColor} shadow-lg sticky top-0 z-50 border-b ${borderColor}`} style={{ backgroundColor: isDarkMode ? '#1F2937' : (businessConfig.colors?.headerBackground || 'white') }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo e Título - RESPONSIVO MELHORADO */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <img 
              src={businessConfig.logo} 
              alt={businessConfig.name}
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h1 
                className={`text-sm sm:text-lg md:text-xl lg:text-2xl font-bold ${textColor} truncate`}
                style={{ color: businessConfig.colors?.primary || primaryColor }}
              >
                {businessConfig.name}
              </h1>
              <p className={`text-xs sm:text-sm ${textSecondary} hidden sm:block truncate`}>
                {businessConfig.description}
              </p>
            </div>
          </div>
          
          {/* Botões de Ação - RESPONSIVO MELHORADO */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
            {/* Social Media Links - Oculto em mobile */}
            {businessConfig.socialMedia?.isEnabled && (
              <div className="hidden md:flex items-center space-x-1">
                {businessConfig.socialMedia.instagram && (
                  <a
                    href={businessConfig.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                    title="Instagram"
                  >
                    <Instagram size={16} className="text-pink-500" />
                  </a>
                )}
                {businessConfig.socialMedia.facebook && (
                  <a
                    href={businessConfig.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                    title="Facebook"
                  >
                    <Facebook size={16} className="text-blue-500" />
                  </a>
                )}
              </div>
            )}

            {/* Back to Admin Panel - Only show if admin and on home page */}
            {isAdmin && window.location.pathname === '/' && (
              <button
                onClick={handleBackToAdmin}
                className="flex items-center space-x-1 p-1.5 sm:p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                title="Voltar ao Painel Administrativo"
              >
                <ArrowLeft size={16} />
                <span className="hidden lg:block text-sm font-medium">Painel</span>
              </button>
            )}

            {/* Dark Mode Toggle - Only show if optional */}
            {isDarkModeOptional && (
              <button
                onClick={toggleDarkMode}
                className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                {isDarkMode ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} />}
              </button>
            )}

            {/* Admin Panel Access */}
            {isAdmin ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  <Shield size={16} />
                  <span className="hidden lg:block text-sm font-medium">Admin</span>
                </button>
                
                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 w-48 ${bgColor} rounded-md shadow-lg border ${borderColor} z-50`} style={{ backgroundColor: isDarkMode ? '#1F2937' : (businessConfig.colors?.headerBackground || 'white') }}>
                    <div className="py-1">
                      <button
                        onClick={handleAdminLogout}
                        className={`block w-full text-left px-4 py-2 text-sm ${textColor} hover:bg-gray-100 transition-colors ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
                      >
                        <LogOut className="inline mr-2" size={16} />
                        Sair do Painel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAdminModal(true)}
                className="p-1.5 sm:p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors"
                title="Painel Administrativo"
              >
                <Shield size={16} />
              </button>
            )}

            {/* User Authentication - Only show if not admin */}
            {!isAdmin && (
              currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-1 p-1.5 sm:p-2 text-white rounded-full transition-colors"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <User size={16} />
                    {currentUserData && (
                      <span className="hidden lg:block text-sm font-medium max-w-20 truncate">
                        {currentUserData.name}
                      </span>
                    )}
                  </button>
                  
                  {showUserMenu && (
                    <div className={`absolute right-0 mt-2 w-48 ${bgColor} rounded-md shadow-lg border ${borderColor} z-50`} style={{ backgroundColor: isDarkMode ? '#1F2937' : (businessConfig.colors?.headerBackground || 'white') }}>
                      <div className="py-1">
                        {currentUserData && (
                          <div className={`px-4 py-2 text-sm ${textColor} border-b ${borderColor}`}>
                            <p className="font-medium truncate">{currentUserData.name}</p>
                            <p className="text-xs text-green-600">
                              Desconto de R$ 2,00 ativo!
                            </p>
                          </div>
                        )}
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm ${textColor} hover:bg-gray-100 transition-colors ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
                        >
                          <LogOut className="inline mr-2" size={16} />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-1 p-1.5 sm:p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                >
                  <User size={16} />
                  <span className="hidden lg:block text-sm font-medium">Entrar</span>
                </button>
              )
            )}

            {/* Cart Button - MELHORADO */}
            <button
              onClick={onCartClick}
              className="relative p-2 sm:p-3 text-white rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold animate-pulse">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Região de Atendimento - RESPONSIVO */}
        <div className="pb-2 sm:pb-4">
          <div className="flex items-center space-x-1 sm:space-x-2" style={{ color: primaryColor }}>
            <MapPin size={14} />
            <span className="text-xs sm:text-sm font-medium truncate">{businessConfig.serviceRegion}</span>
          </div>
        </div>
      </div>

      {/* Auth Modal - Only show if not admin */}
      {!isAdmin && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      )}

      {/* Admin Login Modal - Only show if not admin */}
      {!isAdmin && (
        <AdminLoginModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
        />
      )}
    </header>
  );
};

export default Header;