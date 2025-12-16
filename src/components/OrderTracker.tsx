import React, { useState } from 'react';
import { Search, Phone, AlertCircle } from 'lucide-react';
import { getCustomerNotificationsByOrderId } from '../services/firebaseService';
import { CustomerNotification } from '../types';

interface OrderTrackerProps {
  isDarkMode: boolean;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ isDarkMode }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    
    if (!phoneNumber.trim()) {
      setError('Por favor, informe seu número de telefone');
      return;
    }

    setIsSearching(true);
    // Aqui você implementaria a busca real no Firestore
    // Por enquanto, apenas simularemos
    setTimeout(() => {
      setIsSearching(false);
      // Chamaria a função para buscar notificações
    }, 1000);
  };

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const inputBg = isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900';

  return (
    <div className={`${bgColor} rounded-lg p-6 max-w-md mx-auto`}>
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold ${textColor} mb-2`}>Rastrear Pedido</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Informe seu telefone para acompanhar o status do seu pedido em tempo real
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            <Phone className="w-4 h-4 inline mr-1" />
            Número de Telefone
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="(11) 99999-9999"
            className={`w-full px-4 py-2 border rounded-lg ${inputBg} focus:outline-none focus:ring-2 focus:ring-orange-500`}
          />
        </div>

        {error && (
          <div className={`flex items-start gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-red-900/20 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
            <AlertCircle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
          </div>
        )}

        <button
          onClick={handleSearch}
          disabled={isSearching}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isSearching
              ? 'opacity-50 cursor-not-allowed bg-gray-500'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          {isSearching ? 'Buscando...' : 'Rastrear Pedido'}
        </button>
      </div>

      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-center mt-4`}>
        Você receberá notificações em tempo real sobre o status do seu pedido
      </p>
    </div>
  );
};

export default OrderTracker;
