/**
 * Mercado Pago Service
 * Integração com Mercado Pago para processamento de pagamentos
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs
 */

interface MercadoPagoConfig {
  accessToken: string;
  publicKey: string;
}

interface PaymentPreferenceData {
  items: Array<{
    title: string;
    quantity: number;
    currency_id: string;
    unit_price: number;
  }>;
  payer?: {
    name?: string;
    email?: string;
    phone?: {
      area_code?: string;
      number?: string;
    };
  };
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: string;
  notification_url?: string;
  external_reference?: string;
}

interface PaymentPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

let config: MercadoPagoConfig | null = null;

/**
 * Inicializar Mercado Pago com credenciais
 */
export const initializeMercadoPago = (accessToken: string, publicKey: string) => {
  config = {
    accessToken,
    publicKey
  };
  console.log('✅ Mercado Pago inicializado com sucesso');
};

/**
 * Criar preferência de pagamento
 */
export const createPaymentPreference = async (
  preferenceData: PaymentPreferenceData
): Promise<PaymentPreference | null> => {
  if (!config) {
    console.warn('⚠️ Mercado Pago não configurado. Preferência não será criada.');
    return null;
  }

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.accessToken}`
      },
      body: JSON.stringify(preferenceData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro ao criar preferência de pagamento:', errorData);
      return null;
    }

    const preference = await response.json();
    console.log('✅ Preferência de pagamento criada:', preference.id);
    return preference;
  } catch (error) {
    console.error('❌ Erro ao conectar com Mercado Pago:', error);
    return null;
  }
};

/**
 * Obter status de um pagamento
 */
export const getPaymentStatus = async (
  paymentId: string
): Promise<{ status: string; detail: string } | null> => {
  if (!config) {
    console.warn('⚠️ Mercado Pago não configurado. Status não pode ser obtido.');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`
        }
      }
    );

    if (!response.ok) {
      console.error('❌ Erro ao obter status do pagamento');
      return null;
    }

    const paymentData = await response.json();
    return {
      status: paymentData.status,
      detail: paymentData.status_detail
    };
  } catch (error) {
    console.error('❌ Erro ao conectar com Mercado Pago:', error);
    return null;
  }
};

/**
 * Testar conexão com Mercado Pago
 */
export const testMercadoPagoConnection = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  if (!config) {
    return {
      success: false,
      message: 'Mercado Pago não foi configurado'
    };
  }

  try {
    const response = await fetch('https://api.mercadopago.com/v1/account/balance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`
      }
    });

    if (response.ok) {
      return {
        success: true,
        message: '✅ Conexão com Mercado Pago estabelecida com sucesso!'
      };
    } else {
      return {
        success: false,
        message: '❌ Falha na autenticação com Mercado Pago. Verifique suas credenciais.'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `❌ Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
};

/**
 * Validar configuração
 */
export const isMercadoPagoConfigured = (): boolean => {
  return config !== null && config.accessToken !== '' && config.publicKey !== '';
};

/**
 * Processar webhook de pagamento
 */
export const processPaymentWebhook = (payload: any) => {
  try {
    if (payload.type === 'payment') {
      const paymentData = payload.data;
      console.log('💳 Pagamento recebido via webhook:', paymentData.id);
      
      // Aqui você pode:
      // 1. Atualizar o status do pedido no Firestore
      // 2. Enviar confirmação via WhatsApp
      // 3. Gerar nota fiscal
      
      return {
        success: true,
        paymentId: paymentData.id,
        status: paymentData.status
      };
    }
    
    return { success: false, message: 'Tipo de evento não reconhecido' };
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    return { success: false, message: 'Erro ao processar webhook' };
  }
};

export default {
  initializeMercadoPago,
  createPaymentPreference,
  getPaymentStatus,
  testMercadoPagoConnection,
  isMercadoPagoConfigured,
  processPaymentWebhook
};
