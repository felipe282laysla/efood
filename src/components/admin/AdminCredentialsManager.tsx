import React, { useState, useEffect } from 'react';
import { Shield, Save, Eye, EyeOff, Lock, Mail, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AdminCredentialsManager: React.FC = () => {
  const { isDarkMode, updateAdminCredentials } = useApp();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [currentCredentials, setCurrentCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCurrent, setLoadingCurrent] = useState(true);

  // Load current credentials
  useEffect(() => {
    const loadCurrentCredentials = async () => {
      try {
        const { getAdminCredentials } = await import('../../services/firebaseService');
        const current = await getAdminCredentials();
        if (current) {
          setCurrentCredentials(current);
          setCredentials({
            email: current.email,
            password: '',
            confirmPassword: ''
          });
        }
      } catch (error) {
        console.error('Erro ao carregar credenciais:', error);
      } finally {
        setLoadingCurrent(false);
      }
    };

    loadCurrentCredentials();
  }, []);

  const handleSave = async () => {
    if (!credentials.email.trim()) {
      alert('Por favor, insira um email válido');
      return;
    }

    if (!credentials.password.trim()) {
      alert('Por favor, insira uma senha');
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (credentials.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      alert('Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    try {
      await updateAdminCredentials({
        email: credentials.email,
        password: credentials.password
      });
      
      setCurrentCredentials({
        email: credentials.email,
        password: credentials.password
      });
      
      setCredentials(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      
      alert('Credenciais atualizadas com sucesso! Use as novas credenciais no próximo login.');
    } catch (error) {
      alert('Erro ao atualizar credenciais');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  if (loadingCurrent) {
    return (
      <div className={`${bgColor} rounded-lg shadow-md p-6`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className={`ml-3 ${textColor}`}>Carregando credenciais...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center space-x-3 mb-6">
        <Shield className={`h-6 w-6 ${textColor}`} />
        <div>
          <h2 className={`text-xl font-bold ${textColor}`}>Credenciais do Administrador</h2>
          <p className={`text-sm ${textSecondary}`}>
            Altere o email e senha de acesso ao painel administrativo
          </p>
        </div>
      </div>

      {/* Current Credentials Display */}
      <div className={`p-4 border ${borderColor} rounded-lg mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-3`}>Credenciais Atuais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className={`text-sm ${textSecondary} mb-1`}>Email atual:</p>
            <p className={`font-medium ${textColor}`}>{currentCredentials.email}</p>
          </div>
          <div>
            <p className={`text-sm ${textSecondary} mb-1`}>Senha:</p>
            <p className={`font-medium ${textColor}`}>••••••••</p>
          </div>
        </div>
      </div>

      {/* Update Form */}
      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>
            <Mail className="inline mr-2" size={16} />
            Novo Email
          </label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
            className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
            placeholder="admin@exemplo.com"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>
            <Lock className="inline mr-2" size={16} />
            Nova Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className={`w-full px-3 py-2 pr-10 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="Digite a nova senha"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className={`text-xs ${textSecondary} mt-1`}>
            Mínimo de 6 caracteres
          </p>
        </div>

        <div>
          <label className={`block text-sm font-medium ${textColor} mb-2`}>
            <Lock className="inline mr-2" size={16} />
            Confirmar Nova Senha
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={credentials.confirmPassword}
              onChange={(e) => setCredentials(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className={`w-full px-3 py-2 pr-10 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="Confirme a nova senha"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Password Match Indicator */}
        {credentials.password && credentials.confirmPassword && (
          <div className={`p-3 rounded-lg ${
            credentials.password === credentials.confirmPassword 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {credentials.password === credentials.confirmPassword ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Senhas coincidem</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Senhas não coincidem</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Warning */}
        <div className={`p-4 border border-yellow-200 rounded-lg bg-yellow-50 ${isDarkMode ? 'bg-yellow-900/20 border-yellow-800' : ''}`}>
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className={`font-medium text-yellow-800 ${isDarkMode ? 'text-yellow-400' : ''} mb-1`}>
                Importante
              </h4>
              <p className={`text-sm text-yellow-600 ${isDarkMode ? 'text-yellow-300' : ''}`}>
                Após alterar as credenciais, você precisará usar o novo email e senha para fazer login no painel administrativo. 
                Anote as novas credenciais em local seguro.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading || !credentials.email || !credentials.password || credentials.password !== credentials.confirmPassword}
            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            <span>{loading ? 'Salvando...' : 'Atualizar Credenciais'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCredentialsManager;