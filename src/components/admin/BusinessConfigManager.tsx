import React, { useState } from 'react';
import { Save, Upload, Settings, MapPin, Phone, Clock, DollarSign, MessageSquare, ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ImageUpload from '../ImageUpload';
import OrderNotificationManager from './OrderNotificationManager';
import ImageSizeManager from './ImageSizeManager';

const BusinessConfigManager: React.FC = () => {
  const { businessConfig, updateBusinessConfig, isDarkMode } = useApp();
  const [config, setConfig] = useState(businessConfig);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateBusinessConfig(config);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      alert('Erro ao salvar configurações');
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

  return (
    <div className="space-y-6">
      {/* Order Notification Settings */}
      <OrderNotificationManager />

      {/* Image Size Configuration */}
      <ImageSizeManager />

      <div className={`${bgColor} rounded-lg shadow-md p-6`}>
        <div className="flex items-center space-x-3 mb-6">
          <Settings className={`h-6 w-6 ${textColor}`} />
          <div>
            <h2 className={`text-xl font-bold ${textColor}`}>Configurações da Empresa</h2>
            <p className={`text-sm ${textSecondary}`}>
              Configure as informações básicas da sua loja
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${textColor} mb-2`}>
                Nome da Empresa *
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="Nome da sua empresa"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${textColor} mb-2`}>
                WhatsApp (apenas números) *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={config.whatsappNumber}
                  onChange={(e) => setConfig(prev => ({ ...prev, whatsappNumber: e.target.value.replace(/\D/g, '') }))}
                  className={`w-full pl-10 pr-4 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="5511999999999"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Descrição da Empresa
            </label>
            <textarea
              value={config.description}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
              rows={3}
              placeholder="Descreva sua empresa..."
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              <MapPin className="inline mr-1" size={16} />
              Região de Atendimento
            </label>
            <input
              type="text"
              value={config.serviceRegion}
              onChange={(e) => setConfig(prev => ({ ...prev, serviceRegion: e.target.value }))}
              className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="Ex: Entrega em toda São Paulo"
            />
          </div>

          {/* Dark Mode Configuration */}
          <div className={`p-4 border ${borderColor} rounded-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-semibold ${textColor}`}>Configuração do Modo Escuro</h3>
                <p className={`text-sm ${textSecondary}`}>
                  Configure se o modo escuro deve estar sempre ativo, sempre desativo ou opcional para o usuário
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="darkModeConfig"
                    value="optional"
                    checked={!config.darkModeConfig || config.darkModeConfig === 'optional'}
                    onChange={(e) => setConfig(prev => ({ ...prev, darkModeConfig: e.target.value as 'optional' | 'forced-dark' | 'forced-light' }))}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span className={`text-sm ${textColor}`}>Opcional (usuário escolhe)</span>
                </label>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="darkModeConfig"
                    value="forced-dark"
                    checked={config.darkModeConfig === 'forced-dark'}
                    onChange={(e) => setConfig(prev => ({ ...prev, darkModeConfig: e.target.value as 'optional' | 'forced-dark' | 'forced-light' }))}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span className={`text-sm ${textColor}`}>Sempre modo escuro</span>
                </label>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="darkModeConfig"
                    value="forced-light"
                    checked={config.darkModeConfig === 'forced-light'}
                    onChange={(e) => setConfig(prev => ({ ...prev, darkModeConfig: e.target.value as 'optional' | 'forced-dark' | 'forced-light' }))}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span className={`text-sm ${textColor}`}>Sempre modo claro</span>
                </label>
              </div>
            </div>
          </div>

          {/* User Discount Configuration */}
          <div className={`p-4 border ${borderColor} rounded-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-semibold ${textColor}`}>Desconto para Usuários Logados</h3>
                <p className={`text-sm ${textSecondary}`}>
                  Configure o valor do desconto para usuários cadastrados
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.userDiscount?.isEnabled !== false}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    userDiscount: { 
                      ...prev.userDiscount, 
                      isEnabled: e.target.checked,
                      amount: prev.userDiscount?.amount || 2
                    } 
                  }))}
                  className="sr-only"
                />
                <div className={`relative w-12 h-6 rounded-full transition-colors ${
                  config.userDiscount?.isEnabled !== false ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    config.userDiscount?.isEnabled !== false ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              </label>
            </div>

            {config.userDiscount?.isEnabled !== false && (
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  <DollarSign className="inline mr-1" size={16} />
                  Valor do Desconto (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={config.userDiscount?.amount || 2}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    userDiscount: { 
                      ...prev.userDiscount!, 
                      amount: parseFloat(e.target.value) || 0 
                    } 
                  }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="2.00"
                />
              </div>
            )}
          </div>

          {/* Cart Buttons Configuration */}
          <div className={`p-4 border ${borderColor} rounded-lg`}>
            <div className="flex items-center space-x-3 mb-4">
              <ShoppingCart className={`h-5 w-5 ${textColor}`} />
              <div>
                <h3 className={`text-lg font-semibold ${textColor}`}>Configuração dos Botões do Carrinho</h3>
                <p className={`text-sm ${textSecondary}`}>
                  Configure quais botões serão exibidos no carrinho de compras
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Botão WhatsApp */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-medium ${textColor}`}>Botão WhatsApp</h4>
                  <p className={`text-sm ${textSecondary}`}>Permite enviar pedidos via WhatsApp</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.cartButtons?.whatsapp !== false}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      cartButtons: { 
                        ...prev.cartButtons, 
                        whatsapp: e.target.checked
                      } 
                    }))}
                    className="sr-only"
                  />
                  <div className={`relative w-12 h-6 rounded-full transition-colors ${
                    config.cartButtons?.whatsapp !== false ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      config.cartButtons?.whatsapp !== false ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </div>
                </label>
              </div>

              {/* Botão Checkout */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-medium ${textColor}`}>Botão Checkout</h4>
                  <p className={`text-sm ${textSecondary}`}>Redireciona para link de checkout personalizado</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.cartButtons?.checkout || false}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      cartButtons: { 
                        ...prev.cartButtons, 
                        checkout: e.target.checked
                      } 
                    }))}
                    className="sr-only"
                  />
                  <div className={`relative w-12 h-6 rounded-full transition-colors ${
                    config.cartButtons?.checkout ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      config.cartButtons?.checkout ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </div>
                </label>
              </div>

              {/* Link do Checkout */}
              {config.cartButtons?.checkout && (
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>
                    Link do Checkout
                  </label>
                  <input
                    type="url"
                    value={config.cartButtons?.checkoutUrl || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      cartButtons: { 
                        ...prev.cartButtons!, 
                        checkoutUrl: e.target.value 
                      } 
                    }))}
                    className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="https://checkout.exemplo.com"
                  />
                  <p className={`text-xs ${textSecondary} mt-1`}>
                    URL para onde o usuário será redirecionado ao clicar no botão de checkout
                  </p>
                </div>
              )}

              {/* Texto do botão checkout */}
              {config.cartButtons?.checkout && (
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>
                    Texto do Botão Checkout
                  </label>
                  <input
                    type="text"
                    value={config.cartButtons?.checkoutText || 'Finalizar Pedido'}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      cartButtons: { 
                        ...prev.cartButtons!, 
                        checkoutText: e.target.value 
                      } 
                    }))}
                    className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="Finalizar Pedido"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Cart Message Configuration */}
          <div className={`p-4 border ${borderColor} rounded-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-semibold ${textColor}`}>Mensagem do Carrinho</h3>
                <p className={`text-sm ${textSecondary}`}>
                  Configure como as mensagens do carrinho serão enviadas
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.cartMessage?.isEnabled !== false}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    cartMessage: { 
                      ...prev.cartMessage, 
                      isEnabled: e.target.checked,
                      template: prev.cartMessage?.template || `*Pedido - {businessName}*\n\n*Cliente:* {customerName}\n*Endereço:* {customerAddress}\n\n*Itens do Pedido:*\n{items}\n*Total do Pedido: R$ {total}*`
                    } 
                  }))}
                  className="sr-only"
                />
                <div className={`relative w-12 h-6 rounded-full transition-colors ${
                  config.cartMessage?.isEnabled !== false ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    config.cartMessage?.isEnabled !== false ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              </label>
            </div>

            {config.cartMessage?.isEnabled !== false && (
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>
                  <MessageSquare className="inline mr-1" size={16} />
                  Template da Mensagem
                </label>
                <textarea
                  value={config.cartMessage?.template || `*Pedido - ${config.name}*\n\n*Cliente:* {customerName}\n*Endereço:* {customerAddress}\n\n*Itens do Pedido:*\n{items}\n*Total do Pedido: R$ {total}*`}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    cartMessage: { 
                      ...prev.cartMessage!, 
                      template: e.target.value 
                    } 
                  }))}
                  className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  rows={6}
                  placeholder="Template da mensagem..."
                />
                <p className={`text-xs ${textSecondary} mt-1`}>
                  Use: {'{customerName}'}, {'{customerAddress}'}, {'{items}'}, {'{total}'}
                </p>
              </div>
            )}
          </div>

          {/* Reviews Section Control */}
          <div className={`p-4 border ${borderColor} rounded-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${textColor}`}>Seção de Comentários</h3>
                <p className={`text-sm ${textSecondary}`}>
                  Controle se a seção de comentários e avaliações será exibida
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.reviewsSection?.isEnabled !== false}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    reviewsSection: { 
                      isEnabled: e.target.checked 
                    } 
                  }))}
                  className="sr-only"
                />
                <div className={`relative w-12 h-6 rounded-full transition-colors ${
                  config.reviewsSection?.isEnabled !== false ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    config.reviewsSection?.isEnabled !== false ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
                <span className={`ml-3 ${textColor}`}>
                  {config.reviewsSection?.isEnabled !== false ? 'Ativada' : 'Desativada'}
                </span>
              </label>
            </div>
          </div>

          {/* Store Status */}
          <div className={`p-4 border ${borderColor} rounded-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${textColor}`}>Status da Loja</h3>
                <p className={`text-sm ${textSecondary}`}>
                  Controle se a loja está aberta para pedidos
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.isOpen}
                  onChange={(e) => setConfig(prev => ({ ...prev, isOpen: e.target.checked }))}
                  className="sr-only"
                />
                <div className={`relative w-12 h-6 rounded-full transition-colors ${
                  config.isOpen ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    config.isOpen ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
                <span className={`ml-3 ${textColor}`}>
                  {config.isOpen ? 'Aberta' : 'Fechada'}
                </span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${textColor} mb-2`}>
                Logo da Empresa
              </label>
              <ImageUpload
                onImageUploaded={(url) => setConfig(prev => ({ ...prev, logo: url }))}
                currentImage={config.logo}
                isDarkMode={isDarkMode}
                allowDelete={true}
                onImageDeleted={() => setConfig(prev => ({ ...prev, logo: '' }))}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${textColor} mb-2`}>
                Imagem do Banner Principal
              </label>
              <ImageUpload
                onImageUploaded={(url) => setConfig(prev => ({ ...prev, bannerImage: url }))}
                currentImage={config.bannerImage}
                isDarkMode={isDarkMode}
                allowDelete={true}
                onImageDeleted={() => setConfig(prev => ({ ...prev, bannerImage: '' }))}
              />
            </div>
          </div>

          {/* Promotion Banner Settings */}
          <div className={`p-4 border ${borderColor} rounded-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-semibold ${textColor}`}>Banner Promocional</h3>
                <p className={`text-sm ${textSecondary}`}>
                  Configure o banner promocional do topo da página
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.promotionBanner?.isActive || false}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    promotionBanner: { 
                      ...prev.promotionBanner, 
                      isActive: e.target.checked,
                      text: prev.promotionBanner?.text || 'Promoção especial!',
                      image: prev.promotionBanner?.image || ''
                    } 
                  }))}
                  className="sr-only"
                />
                <div className={`relative w-12 h-6 rounded-full transition-colors ${
                  config.promotionBanner?.isActive ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    config.promotionBanner?.isActive ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              </label>
            </div>

            {config.promotionBanner?.isActive && (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>
                    Texto do Banner
                  </label>
                  <input
                    type="text"
                    value={config.promotionBanner?.text || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      promotionBanner: { 
                        ...prev.promotionBanner!, 
                        text: e.target.value 
                      } 
                    }))}
                    className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="Texto promocional"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>
                    Descrição (Opcional)
                  </label>
                  <input
                    type="text"
                    value={config.promotionBanner?.description || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      promotionBanner: { 
                        ...prev.promotionBanner!, 
                        description: e.target.value 
                      } 
                    }))}
                    className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="Descrição adicional"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Texto do Botão Principal
                    </label>
                    <input
                      type="text"
                      value={config.promotionBanner?.buttonText || 'Ver Ofertas'}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        promotionBanner: { 
                          ...prev.promotionBanner!, 
                          buttonText: e.target.value 
                        } 
                      }))}
                      className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="Ver Ofertas"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Link do Botão Principal (Opcional)
                    </label>
                    <input
                      type="url"
                      value={config.promotionBanner?.buttonLink || ''}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        promotionBanner: { 
                          ...prev.promotionBanner!, 
                          buttonLink: e.target.value 
                        } 
                      }))}
                      className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="https://exemplo.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Texto do Botão Secundário
                    </label>
                    <input
                      type="text"
                      value={config.promotionBanner?.secondaryButtonText || 'Peça Agora'}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        promotionBanner: { 
                          ...prev.promotionBanner!, 
                          secondaryButtonText: e.target.value 
                        } 
                      }))}
                      className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="Peça Agora"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Link do Botão Secundário (Opcional)
                    </label>
                    <input
                      type="url"
                      value={config.promotionBanner?.secondaryButtonLink || ''}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        promotionBanner: { 
                          ...prev.promotionBanner!, 
                          secondaryButtonLink: e.target.value 
                        } 
                      }))}
                      className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="https://exemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    Imagem do Banner Promocional
                  </label>
                  <ImageUpload
                    onImageUploaded={(url) => setConfig(prev => ({ 
                      ...prev, 
                      promotionBanner: { 
                        ...prev.promotionBanner!, 
                        image: url 
                      } 
                    }))}
                    currentImage={config.promotionBanner?.image}
                    isDarkMode={isDarkMode}
                    allowDelete={true}
                    onImageDeleted={() => setConfig(prev => ({ 
                      ...prev, 
                      promotionBanner: { 
                        ...prev.promotionBanner!, 
                        image: '' 
                      } 
                    }))}
                  />
                  <p className={`text-xs ${textSecondary} mt-1`}>
                    Esta imagem será exibida como fundo do banner promocional
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Promo Banner Settings */}
          <div className={`p-4 border ${borderColor} rounded-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-semibold ${textColor}`}>Banner Promocional do Rodapé</h3>
                <p className={`text-sm ${textSecondary}`}>
                  Configure o banner promocional do final da página
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.footerPromoBanner?.isActive || false}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    footerPromoBanner: { 
                      ...prev.footerPromoBanner, 
                      isActive: e.target.checked,
                      text: prev.footerPromoBanner?.text || 'Não perca nossas ofertas!',
                      buttonText: prev.footerPromoBanner?.buttonText || 'Ver Ofertas',
                      backgroundColor: prev.footerPromoBanner?.backgroundColor || '#F97316',
                      textColor: prev.footerPromoBanner?.textColor || '#FFFFFF'
                    } 
                  }))}
                  className="sr-only"
                />
                <div className={`relative w-12 h-6 rounded-full transition-colors ${
                  config.footerPromoBanner?.isActive ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    config.footerPromoBanner?.isActive ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              </label>
            </div>

            {config.footerPromoBanner?.isActive && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Texto Principal
                    </label>
                    <input
                      type="text"
                      value={config.footerPromoBanner?.text || ''}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        footerPromoBanner: { 
                          ...prev.footerPromoBanner!, 
                          text: e.target.value 
                        } 
                      }))}
                      className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="Texto do banner"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={config.footerPromoBanner?.buttonText || ''}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        footerPromoBanner: { 
                          ...prev.footerPromoBanner!, 
                          buttonText: e.target.value 
                        } 
                      }))}
                      className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="Texto do botão"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>
                    Link do Botão (Opcional)
                  </label>
                  <input
                    type="url"
                    value={config.footerPromoBanner?.buttonLink || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      footerPromoBanner: { 
                        ...prev.footerPromoBanner!, 
                        buttonLink: e.target.value 
                      } 
                    }))}
                    className={`w-full px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="https://exemplo.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Cor de Fundo
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={config.footerPromoBanner?.backgroundColor || '#F97316'}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          footerPromoBanner: { 
                            ...prev.footerPromoBanner!, 
                            backgroundColor: e.target.value 
                          } 
                        }))}
                        className="w-12 h-10 rounded border-2 border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.footerPromoBanner?.backgroundColor || '#F97316'}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          footerPromoBanner: { 
                            ...prev.footerPromoBanner!, 
                            backgroundColor: e.target.value 
                          } 
                        }))}
                        className={`flex-1 px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-1`}>
                      Cor do Texto
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={config.footerPromoBanner?.textColor || '#FFFFFF'}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          footerPromoBanner: { 
                            ...prev.footerPromoBanner!, 
                            textColor: e.target.value 
                          } 
                        }))}
                        className="w-12 h-10 rounded border-2 border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.footerPromoBanner?.textColor || '#FFFFFF'}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          footerPromoBanner: { 
                            ...prev.footerPromoBanner!, 
                            textColor: e.target.value 
                          } 
                        }))}
                        className={`flex-1 px-3 py-2 border ${inputBg} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              <span>{loading ? 'Salvando...' : 'Salvar Configurações'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessConfigManager;