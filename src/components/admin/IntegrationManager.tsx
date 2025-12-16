import React, { useState, useEffect } from 'react';
import { Key, Send, AlertCircle, CheckCircle, Eye, EyeOff, Loader } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { testEvolutionApiConnection } from '../../services/evolutionApiService';
import { testMercadoPagoConnection } from '../../services/mercadoPagoService';

interface IntegrationConfig {
  evolutionApiDomain: string;
  evolutionApiKey: string;
  mercadoPagoAccessToken: string;
  mercadoPagoPublicKey: string;
  evolutionApiEnabled: boolean;
  mercadoPagoEnabled: boolean;
  sendWhatsappNotifications: boolean;
}

const IntegrationManager: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { businessConfig, updateBusinessConfig } = useApp();
  const [config, setConfig] = useState<IntegrationConfig>({
    evolutionApiDomain: businessConfig.evolutionApi?.domain || '',
    evolutionApiKey: businessConfig.evolutionApi?.apiKey || '',
    mercadoPagoAccessToken: businessConfig.mercadoPago?.accessToken || '',
    mercadoPagoPublicKey: businessConfig.mercadoPago?.publicKey || '',
    evolutionApiEnabled: businessConfig.evolutionApi?.isEnabled || false,
    mercadoPagoEnabled: businessConfig.mercadoPago?.isEnabled || false,
    sendWhatsappNotifications: businessConfig.evolutionApi?.sendNotifications || false
  });

  const [paymentMethodsState, setPaymentMethodsState] = useState({
    card: businessConfig.paymentMethods?.card ?? true,
    pix: businessConfig.paymentMethods?.pix ?? true,
    cash: businessConfig.paymentMethods?.cash ?? true,
    whatsapp: businessConfig.paymentMethods?.whatsapp ?? true
  });

  const [showApiKeys, setShowApiKeys] = useState({
    evolution: false,
    mercadoPago: false
  });

  const [testingConnection, setTestingConnection] = useState(false);
  const [testingMercadoPago, setTestingMercadoPago] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [mercadoPagoResult, setMercadoPagoResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (field: keyof IntegrationConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      console.log('🧪 Testando conexão com Evolution API...');
      const result = await testEvolutionApiConnection();
      setConnectionResult(result);
      setTimeout(() => setConnectionResult(null), 5000);
    } catch (error) {
      console.error('❌ Erro ao testar conexão:', error);
      setConnectionResult({
        success: false,
        message: 'Erro ao testar conexão'
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleTestMercadoPagoConnection = async () => {
    setTestingMercadoPago(true);
    try {
      console.log('🧪 Testando conexão com Mercado Pago...');
      const result = await testMercadoPagoConnection();
      setMercadoPagoResult(result);
      setTimeout(() => setMercadoPagoResult(null), 5000);
    } catch (error) {
      console.error('❌ Erro ao testar conexão Mercado Pago:', error);
      setMercadoPagoResult({
        success: false,
        message: 'Erro ao testar conexão'
      });
    } finally {
      setTestingMercadoPago(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      console.log('💾 Salvando configurações de integração...');
      
      await updateBusinessConfig({
        evolutionApi: {
          isEnabled: config.evolutionApiEnabled,
          domain: config.evolutionApiDomain,
          apiKey: config.evolutionApiKey,
          sendNotifications: config.sendWhatsappNotifications
        },
        mercadoPago: {
          isEnabled: config.mercadoPagoEnabled,
          accessToken: config.mercadoPagoAccessToken,
          publicKey: config.mercadoPagoPublicKey
        },
        paymentMethods: {
          card: paymentMethodsState.card,
          pix: paymentMethodsState.pix,
          cash: paymentMethodsState.cash,
          whatsapp: paymentMethodsState.whatsapp
        }
      });

      console.log('✅ Configurações salvas com sucesso!');
      setSuccessMessage('✅ Configurações salvas com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error);
      setSuccessMessage('❌ Erro ao salvar configurações!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const labelColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900';
  const sectionBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';

  return (
    <div className={`${bgColor} rounded-lg p-6 space-y-6`}>
      <div>
        <h2 className={`text-2xl font-bold ${textColor} mb-2`}>Integrações</h2>
        <p className={labelColor}>Configure as integrações de API para notificações e pagamentos</p>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Evolution API Section */}
      <div className={`border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-orange-500" />
          <h3 className={`text-xl font-bold ${textColor}`}>Evolution API (WhatsApp)</h3>
        </div>

        <p className={`text-sm ${labelColor} mb-4`}>
          Integre notificações via WhatsApp com Evolution API. Saiba mais em{' '}
          <a
            href="https://doc.evolution-api.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            doc.evolution-api.com
          </a>
        </p>

        <div className="space-y-4">
          {/* Enable Toggle */}
          <div className="flex items-center gap-4">
            <label className={`flex items-center gap-2 cursor-pointer`}>
              <input
                type="checkbox"
                checked={config.evolutionApiEnabled}
                onChange={(e) => handleInputChange('evolutionApiEnabled', e.target.checked)}
                className="w-4 h-4"
              />
              <span className={textColor}>Habilitar Evolution API</span>
            </label>
          </div>

          {config.evolutionApiEnabled && (
            <>
              {/* Domain */}
              <div>
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Domínio da API
                </label>
                <input
                  type="url"
                  value={config.evolutionApiDomain}
                  onChange={(e) => handleInputChange('evolutionApiDomain', e.target.value)}
                  placeholder="https://evo-api.rodrigomarques.click"
                  className={`w-full px-4 py-2 border rounded-lg ${inputBg}`}
                />
                <p className={`text-xs ${labelColor} mt-1`}>
                  Ex: https://evo-api.rodrigomarques.click
                </p>
              </div>

              {/* API Key */}
              <div>
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKeys.evolution ? 'text' : 'password'}
                    value={config.evolutionApiKey}
                    onChange={(e) => handleInputChange('evolutionApiKey', e.target.value)}
                    placeholder="VzEhslqNmVs02O3DVzEhslqNmVs02O3D"
                    className={`w-full px-4 py-2 border rounded-lg ${inputBg} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKeys(prev => ({ ...prev, evolution: !prev.evolution }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showApiKeys.evolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Send Notifications Toggle */}
              <div className="flex items-center gap-4">
                <label className={`flex items-center gap-2 cursor-pointer`}>
                  <input
                    type="checkbox"
                    checked={config.sendWhatsappNotifications}
                    onChange={(e) => handleInputChange('sendWhatsappNotifications', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className={textColor}>Enviar notificações de status via WhatsApp</span>
                </label>
              </div>

              {/* Test Connection Button */}
              <button
                onClick={handleTestConnection}
                disabled={testingConnection || !config.evolutionApiDomain || !config.evolutionApiKey}
                className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  testingConnection || !config.evolutionApiDomain || !config.evolutionApiKey
                    ? 'opacity-50 cursor-not-allowed bg-gray-500'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {testingConnection ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Testar Conexão
                  </>
                )}
              </button>

              {connectionResult && (
                <div
                  className={`p-3 rounded-lg flex items-start gap-2 ${
                    connectionResult.success
                      ? 'bg-green-100 border border-green-400'
                      : 'bg-red-100 border border-red-400'
                  }`}
                >
                  {connectionResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={connectionResult.success ? 'text-green-700' : 'text-red-700'}>
                    {connectionResult.message}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mercado Pago Section */}
      <div className={`border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-blue-500" />
          <h3 className={`text-xl font-bold ${textColor}`}>Mercado Pago</h3>
        </div>

        <p className={`text-sm ${labelColor} mb-4`}>
          Integre pagamentos com Mercado Pago. Gere suas credenciais em{' '}
          <a
            href="https://www.mercadopago.com.br/developers/pt/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            developers.mercadopago.com
          </a>
        </p>

        <div className="space-y-4">
          {/* Enable Toggle */}
          <div className="flex items-center gap-4">
            <label className={`flex items-center gap-2 cursor-pointer`}>
              <input
                type="checkbox"
                checked={config.mercadoPagoEnabled}
                onChange={(e) => handleInputChange('mercadoPagoEnabled', e.target.checked)}
                className="w-4 h-4"
              />
              <span className={textColor}>Habilitar Mercado Pago</span>
            </label>
          </div>

          {config.mercadoPagoEnabled && (
            <>
              {/* Access Token */}
              <div>
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Access Token (Produção)
                </label>
                <div className="relative">
                  <input
                    type={showApiKeys.mercadoPago ? 'text' : 'password'}
                    value={config.mercadoPagoAccessToken}
                    onChange={(e) => handleInputChange('mercadoPagoAccessToken', e.target.value)}
                    placeholder="APP_USR-XXXXXXXXXXXX"
                    className={`w-full px-4 py-2 border rounded-lg ${inputBg} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKeys(prev => ({ ...prev, mercadoPago: !prev.mercadoPago }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showApiKeys.mercadoPago ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className={`text-xs ${labelColor} mt-1`}>
                  Token de acesso gerado em suas credenciais Mercado Pago
                </p>
              </div>

              {/* Public Key */}
              <div>
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Public Key
                </label>
                <input
                  type="text"
                  value={config.mercadoPagoPublicKey}
                  onChange={(e) => handleInputChange('mercadoPagoPublicKey', e.target.value)}
                  placeholder="APP_USR-XXXXXXXXXXXX"
                  className={`w-full px-4 py-2 border rounded-lg ${inputBg}`}
                />
                <p className={`text-xs ${labelColor} mt-1`}>
                  Chave pública para inicializar o Mercado Pago no navegador
                </p>
              </div>

              {/* Test Connection Button */}
              <button
                onClick={handleTestMercadoPagoConnection}
                disabled={testingMercadoPago || !config.mercadoPagoAccessToken}
                className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  testingMercadoPago || !config.mercadoPagoAccessToken
                    ? 'opacity-50 cursor-not-allowed bg-gray-500'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {testingMercadoPago ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Testar Conexão Mercado Pago
                  </>
                )}
              </button>

              {mercadoPagoResult && (
                <div
                  className={`p-3 rounded-lg flex items-start gap-2 ${
                    mercadoPagoResult.success
                      ? 'bg-green-100 border border-green-400'
                      : 'bg-red-100 border border-red-400'
                  }`}
                >
                  {mercadoPagoResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={mercadoPagoResult.success ? 'text-green-700' : 'text-red-700'}>
                    {mercadoPagoResult.message}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div className={`border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-6`}>
        <h3 className={`text-xl font-bold ${textColor} mb-4`}>Métodos de Pagamento</h3>

        <div className="space-y-3">
          <label className={`flex items-center gap-2 cursor-pointer`}>
            <input
              type="checkbox"
              checked={paymentMethodsState.card}
              onChange={(e) => setPaymentMethodsState(prev => ({ ...prev, card: e.target.checked }))}
              className="w-4 h-4"
            />
            <span className={textColor}>💳 Cartão de Crédito (Mercado Pago)</span>
          </label>

          <label className={`flex items-center gap-2 cursor-pointer`}>
            <input
              type="checkbox"
              checked={paymentMethodsState.pix}
              onChange={(e) => setPaymentMethodsState(prev => ({ ...prev, pix: e.target.checked }))}
              className="w-4 h-4"
            />
            <span className={textColor}>🔑 PIX (Mercado Pago)</span>
          </label>

          <label className={`flex items-center gap-2 cursor-pointer`}>
            <input
              type="checkbox"
              checked={paymentMethodsState.cash}
              onChange={(e) => setPaymentMethodsState(prev => ({ ...prev, cash: e.target.checked }))}
              className="w-4 h-4"
            />
            <span className={textColor}>💰 Dinheiro na Entrega</span>
          </label>

          <label className={`flex items-center gap-2 cursor-pointer`}>
            <input
              type="checkbox"
              checked={paymentMethodsState.whatsapp}
              onChange={(e) => setPaymentMethodsState(prev => ({ ...prev, whatsapp: e.target.checked }))}
              className="w-4 h-4"
            />
            <span className={textColor}>💬 Negociação via WhatsApp</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveConfig}
        className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        Salvar Configurações
      </button>

      {/* Info Box */}
      <div className={`border-l-4 border-blue-500 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} p-4 rounded`}>
        <p className={`text-sm ${labelColor}`}>
          <strong>ℹ️ Importante:</strong> As credenciais são armazenadas com segurança no Firebase. Nunca compartilhe suas chaves API com terceiros.
        </p>
      </div>
    </div>
  );
};

export default IntegrationManager;
