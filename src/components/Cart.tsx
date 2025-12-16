import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MapPin, User, MessageSquare, ShoppingBag, Phone, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PaymentSelector from './PaymentSelector';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: (customerPhone: string) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, onOrderCreated }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    businessConfig, 
    addOrder, 
    isDarkMode,
    currentUser,
    currentUserData,
    getDiscountedPrice
  } = useApp();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'cash' | 'whatsapp'>('whatsapp');

  if (!isOpen) return null;

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const addOnsPrice = item.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
      let basePrice = item.product.price;
      
      // Aplicar desconto do produto se houver
      if (item.product.discount) {
        basePrice = basePrice * (1 - item.product.discount / 100);
      }
      
      // Aplicar desconto do usuário se estiver logado
      if (currentUserData && businessConfig.userDiscount?.isEnabled) {
        const discountAmount = businessConfig.userDiscount?.amount || 2;
        basePrice = Math.max(0, basePrice - discountAmount);
      }
      
      return total + ((basePrice + addOnsPrice) * item.quantity);
    }, 0);
  };

  const getLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Create Google Maps link
          const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          setCustomerAddress(`📍 Localização atual: ${googleMapsLink}`);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setIsGettingLocation(false);
          alert('Não foi possível obter sua localização. Digite seu endereço manualmente.');
        }
      );
    } else {
      setIsGettingLocation(false);
      alert('Geolocalização não é suportada pelo seu navegador.');
    }
  };

  // FUNÇÃO COMPLETAMENTE CORRIGIDA DO ZERO
  const sendToWhatsApp = async () => {
    console.log('🚀 Iniciando processo de envio para WhatsApp...');
    
    // 1. VALIDAÇÕES BÁSICAS
    if (!customerName.trim()) {
      alert('Por favor, insira seu nome');
      return;
    }

    if (!customerAddress.trim()) {
      alert('Por favor, forneça seu endereço');
      return;
    }

    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio');
      return;
    }

    setOrderProcessing(true);

    try {
      // 2. VERIFICAR NÚMERO DO WHATSAPP
      const whatsappNumber = businessConfig.whatsappNumber;
      
      if (!whatsappNumber || whatsappNumber.trim() === '') {
        throw new Error('❌ Número do WhatsApp não configurado no sistema. Entre em contato com o administrador.');
      }

      console.log('✅ Número do WhatsApp encontrado:', whatsappNumber);

      // 3. PREPARAR DADOS DO PEDIDO
      const orderData: any = {
        customerName: customerName.trim(),
        customerLocation: customerAddress.trim(),
        items: cartItems,
        total: getTotalPrice(),
        status: 'pending' as const,
        date: new Date(),
        isFromLoggedUser: false,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'card' || paymentMethod === 'pix' ? 'pending' : 'pending'
      };

      // Adicionar telefone se fornecido
      if (customerPhone.trim()) {
        orderData.customerPhone = customerPhone.trim();
      }

      // Adicionar ID do usuário se logado
      if (currentUser?.uid) {
        orderData.userId = currentUser.uid;
        orderData.isFromLoggedUser = true;
      }

      console.log('💾 Salvando pedido no banco de dados...');
      
      // 4. SALVAR PEDIDO NO BANCO DE DADOS
      await addOrder(orderData);
      console.log('✅ Pedido salvo com sucesso no Firebase!');

      // Notificar ao Menu que um pedido foi criado para que mostre notificações
      if (customerPhone.trim() && onOrderCreated) {
        onOrderCreated(customerPhone.trim());
      }

      // 5. PREPARAR MENSAGEM DO WHATSAPP
      const businessName = businessConfig.name || 'Loja';
      
      // Construir lista de itens detalhada
      let itemsList = '';
      cartItems.forEach((item, index) => {
        itemsList += `${index + 1}. *${item.product.name}* (${item.quantity}x)\n`;
        
        // Calcular preço do item com descontos
        let itemPrice = item.product.price;
        if (item.product.discount) {
          itemPrice = itemPrice * (1 - item.product.discount / 100);
        }
        if (currentUserData && businessConfig.userDiscount?.isEnabled) {
          const discountAmount = businessConfig.userDiscount?.amount || 2;
          itemPrice = Math.max(0, itemPrice - discountAmount);
        }
        
        itemsList += `   💰 Preço unitário: R$ ${itemPrice.toFixed(2)}\n`;
        
        // Adicionar adicionais se houver
        if (item.addOns.length > 0) {
          itemsList += `   🍟 *Adicionais:* ${item.addOns.map(addOn => `${addOn.name} (+R$ ${addOn.price.toFixed(2)})`).join(', ')}\n`;
        }
        
        // Adicionar observações se houver
        if (item.observations) {
          itemsList += `   📝 *Observações:* ${item.observations}\n`;
        }
        
        // Calcular subtotal do item
        const itemTotal = (itemPrice + item.addOns.reduce((sum, addOn) => sum + addOn.price, 0)) * item.quantity;
        itemsList += `   💵 *Subtotal:* R$ ${itemTotal.toFixed(2)}\n\n`;
      });

      // Usar template personalizado ou padrão
      let message = businessConfig.cartMessage?.template || 
        `*🛒 Novo Pedido - ${businessName}*\n\n*👤 Cliente:* {customerName}\n*📞 Telefone:* {customerPhone}\n*📍 Endereço:* {customerAddress}\n\n*🍔 Itens do Pedido:*\n{items}\n*💰 Total do Pedido: R$ {total}*`;

      // Substituir variáveis no template
      message = message.replace('{businessName}', businessName);
      message = message.replace('{customerName}', customerName.trim());
      message = message.replace('{customerPhone}', customerPhone.trim() || 'Não informado');
      message = message.replace('{customerAddress}', customerAddress.trim());
      message = message.replace('{total}', getTotalPrice().toFixed(2));
      message = message.replace('{items}', itemsList);

      console.log('📝 Mensagem preparada para WhatsApp');
      
      // 6. FORMATAR NÚMERO DO WHATSAPP
      let formattedNumber = whatsappNumber.replace(/\D/g, ''); // Remove tudo que não é número
      
      // Adicionar código do país se necessário
      if (!formattedNumber.startsWith('55') && formattedNumber.length === 11) {
        formattedNumber = '55' + formattedNumber;
      }
      
      console.log('📱 Número formatado para WhatsApp:', formattedNumber);
      
      // 7. CRIAR URL DO WHATSAPP
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
      
      console.log('🔗 URL do WhatsApp gerada com sucesso');
      
      // 8. ABRIR WHATSAPP
      try {
        // Tentar abrir em nova janela primeiro
        const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        
        // Verificar se a janela foi bloqueada
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          console.log('⚠️ Popup bloqueado, redirecionando na mesma janela...');
          window.location.href = whatsappUrl;
        } else {
          console.log('✅ WhatsApp aberto em nova janela');
        }
      } catch (error) {
        console.error('❌ Erro ao abrir WhatsApp:', error);
        // Fallback final
        window.location.href = whatsappUrl;
      }
      
      // 9. LIMPAR CARRINHO E FORMULÁRIO
      clearCart();
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      onClose();
      
      alert('✅ Pedido enviado com sucesso via WhatsApp!');
      
    } catch (error) {
      console.error('❌ Erro completo ao processar pedido:', error);
      
      let errorMessage = 'Erro ao processar pedido.';
      
      if (error instanceof Error) {
        if (error.message.includes('WhatsApp') || error.message.includes('configurado')) {
          errorMessage = error.message;
        } else {
          errorMessage = 'Erro ao processar pedido. Verifique sua conexão e tente novamente.';
        }
      }
      
      alert(errorMessage);
    } finally {
      setOrderProcessing(false);
    }
  };

  const handleCheckout = () => {
    if (!businessConfig.cartButtons?.checkoutUrl) {
      alert('Link de checkout não configurado');
      return;
    }

    // Abrir link de checkout em nova aba
    window.open(businessConfig.cartButtons.checkoutUrl, '_blank');
  };

  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  // Configurações dos botões do carrinho
  const showWhatsAppButton = businessConfig.cartButtons?.whatsapp !== false;
  const showCheckoutButton = businessConfig.cartButtons?.checkout || false;
  const checkoutText = businessConfig.cartButtons?.checkoutText || 'Finalizar Pedido';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${bgColor} rounded-xl max-w-md w-full max-h-screen m-4 flex flex-col`}>
        <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
          <h2 className={`text-xl font-bold ${textColor}`}>Seu Carrinho</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={orderProcessing}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => {
                let itemPrice = item.product.price;
                if (item.product.discount) {
                  itemPrice = itemPrice * (1 - item.product.discount / 100);
                }
                if (currentUserData && businessConfig.userDiscount?.isEnabled) {
                  const discountAmount = businessConfig.userDiscount?.amount || 2;
                  itemPrice = Math.max(0, itemPrice - discountAmount);
                }
                
                return (
                  <div key={index} className={`border ${borderColor} rounded-lg p-4`}>
                    <div className="flex items-start space-x-3 mb-2">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className={`font-semibold ${textColor}`}>{item.product.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            disabled={orderProcessing}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        {item.addOns.length > 0 && (
                          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                            <span className="font-medium">Adicionais: </span>
                            {item.addOns.map(addOn => addOn.name).join(', ')}
                          </div>
                        )}
                        
                        {item.observations && (
                          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                            <span className="font-medium">Obs: </span>
                            {item.observations}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className={`p-1 rounded transition-colors ${
                                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                              }`}
                              disabled={orderProcessing}
                            >
                              <Minus size={14} />
                            </button>
                            <span className={`font-medium ${textColor}`}>{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className={`p-1 rounded transition-colors ${
                                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                              }`}
                              disabled={orderProcessing}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="text-right">
                            {currentUserData && businessConfig.userDiscount?.isEnabled && (
                              <div className="text-xs text-gray-400 line-through">
                                R$ {((item.product.price + item.addOns.reduce((sum, addOn) => sum + addOn.price, 0)) * item.quantity).toFixed(2)}
                              </div>
                            )}
                            <span className="font-bold text-orange-600">
                              R$ {((itemPrice + item.addOns.reduce((sum, addOn) => sum + addOn.price, 0)) * item.quantity).toFixed(2)}
                            </span>
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

        {cartItems.length > 0 && (
          <div className={`p-6 border-t ${borderColor} ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="space-y-4">
              <div className={`flex items-center justify-between text-lg font-bold ${textColor}`}>
                <span>Total:</span>
                <span className="text-orange-600">R$ {getTotalPrice().toFixed(2)}</span>
              </div>

              {currentUserData && businessConfig.userDiscount?.isEnabled && (
                <div className="text-center p-2 bg-green-100 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">
                    🎉 Desconto de R$ {businessConfig.userDiscount?.amount || 2},00 aplicado!
                  </p>
                </div>
              )}

              {/* Seletor de Método de Pagamento */}
              <div className="mb-4">
                <PaymentSelector
                  selectedMethod={paymentMethod}
                  onSelect={setPaymentMethod}
                  isDarkMode={isDarkMode}
                  availableMethods={businessConfig.paymentMethods || {
                    card: true,
                    pix: true,
                    cash: true,
                    whatsapp: true
                  }}
                />
              </div>

              {/* Formulário para dados do cliente - apenas se WhatsApp estiver ativo */}
              {showWhatsAppButton && (
                <div className="space-y-3">
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Seu Nome: *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Digite seu nome completo"
                        className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                        disabled={orderProcessing}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Seu Telefone:
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                        disabled={orderProcessing}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Seu Endereço: *
                    </label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="Digite seu endereço completo"
                          className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          disabled={orderProcessing}
                          required
                        />
                      </div>
                      <button
                        onClick={getLocation}
                        disabled={isGettingLocation || orderProcessing}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
                        title="Usar localização atual"
                      >
                        {isGettingLocation ? '...' : 'GPS'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de ação */}
              <div className="space-y-3">
                {/* Botão Checkout */}
                {showCheckoutButton && (
                  <button
                    onClick={handleCheckout}
                    disabled={orderProcessing}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <ExternalLink size={18} />
                    <span>{checkoutText}</span>
                  </button>
                )}

                {/* Botão WhatsApp */}
                {showWhatsAppButton && (
                  <button
                    onClick={sendToWhatsApp}
                    disabled={orderProcessing || !customerName.trim() || !customerAddress.trim()}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <MessageSquare size={18} />
                    <span>{orderProcessing ? 'Enviando...' : 'Enviar via WhatsApp'}</span>
                  </button>
                )}
              </div>

              {/* Indicador de processamento */}
              {orderProcessing && (
                <div className="text-center p-3 bg-blue-100 rounded-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-blue-800 text-sm font-medium">
                      Processando pedido...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;