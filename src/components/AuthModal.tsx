import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const { loginUser, registerUser, isDarkMode, businessConfig } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        // Validações para registro
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
          setError('Por favor, preencha todos os campos obrigatórios');
          return;
        }

        if (formData.password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres');
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError('Por favor, insira um email válido');
          return;
        }

        await registerUser(formData.email, formData.password, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          registrationDate: new Date(),
          totalOrders: 0,
          isActive: true
        });

        const discountAmount = businessConfig.userDiscount?.amount || 2;
        alert(`Cadastro realizado com sucesso! Você ganhou R$ ${discountAmount.toFixed(2)} de desconto em todos os produtos!`);
        onClose();
        setFormData({ email: '', password: '', name: '', phone: '', address: '' });
      } else {
        await loginUser(formData.email, formData.password);
        onClose();
        setFormData({ email: '', password: '', name: '', phone: '', address: '' });
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado. Tente fazer login.');
      } else if (error.code === 'auth/user-not-found') {
        setError('Usuário não encontrado. Verifique seu email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Senha incorreta. Tente novamente.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Email inválido. Verifique o formato.');
      } else {
        setError(error.message || 'Erro ao processar solicitação');
      }
    } finally {
      setLoading(false);
    }
  };

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';

  const discountAmount = businessConfig.userDiscount?.amount || 2;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgColor} rounded-xl max-w-md w-full p-6 max-h-screen overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${textColor}`}>
            {mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {mode === 'register' && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-green-800 text-sm font-medium">
              🎉 Cadastre-se e ganhe R$ {discountAmount.toFixed(2)} de desconto em todos os produtos!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className={`block text-sm font-medium ${textColor} mb-1`}>
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Digite seu nome completo"
                />
              </div>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium ${textColor} mb-1`}>
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="Digite seu email"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textColor} mb-1`}>
              Senha *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : 'Digite sua senha'}
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  Endereço
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="Seu endereço completo"
                  />
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Processando...' : (mode === 'login' ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={`text-sm ${textColor}`}>
            {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button
              onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
              className="ml-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;