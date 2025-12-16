import React from 'react';
import { CreditCard, QrCode, Banknote, MessageCircle } from 'lucide-react';

interface PaymentSelectorProps {
  selectedMethod: 'card' | 'pix' | 'cash' | 'whatsapp';
  onSelect: (method: 'card' | 'pix' | 'cash' | 'whatsapp') => void;
  isDarkMode: boolean;
  availableMethods: {
    card: boolean;
    pix: boolean;
    cash: boolean;
    whatsapp: boolean;
  };
}

const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  selectedMethod,
  onSelect,
  isDarkMode,
  availableMethods
}) => {
  const methods = [
    {
      id: 'card',
      label: 'Cartão de Crédito',
      icon: CreditCard,
      description: 'Pagar com cartão de crédito',
      available: availableMethods.card
    },
    {
      id: 'pix',
      label: 'PIX',
      icon: QrCode,
      description: 'Pagar com PIX',
      available: availableMethods.pix
    },
    {
      id: 'cash',
      label: 'Dinheiro',
      icon: Banknote,
      description: 'Pagar na entrega',
      available: availableMethods.cash
    },
    {
      id: 'whatsapp',
      label: 'Negociar no WhatsApp',
      icon: MessageCircle,
      description: 'Combinar pagamento via WhatsApp',
      available: availableMethods.whatsapp
    }
  ] as const;

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

  return (
    <div>
      <h3 className={`text-lg font-bold ${textColor} mb-4`}>Método de Pagamento</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.id as any)}
              disabled={!method.available}
              className={`p-4 rounded-lg border-2 transition-all ${
                !method.available
                  ? 'opacity-50 cursor-not-allowed'
                  : isSelected
                  ? `border-orange-500 ${isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50'}`
                  : `border-${borderColor} ${bgColor} ${hoverBg} cursor-pointer`
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-2 ${
                isSelected ? 'text-orange-500' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`} />
              <p className={`text-sm font-medium ${textColor}`}>{method.label}</p>
              {!method.available && (
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                  Indisponível
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Info about selected method */}
      {selectedMethod === 'card' && (
        <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            💳 Você será redirecionado para o Mercado Pago para completar o pagamento de forma segura.
          </p>
        </div>
      )}

      {selectedMethod === 'pix' && (
        <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
            🔑 Você receberá um código PIX para copiar e colar no seu app bancário.
          </p>
        </div>
      )}

      {selectedMethod === 'cash' && (
        <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-yellow-900/20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
            💰 O pagamento será realizado na entrega do seu pedido.
          </p>
        </div>
      )}

      {selectedMethod === 'whatsapp' && (
        <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
            💬 Você conversará conosco no WhatsApp para confirmar os detalhes do pagamento.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentSelector;
