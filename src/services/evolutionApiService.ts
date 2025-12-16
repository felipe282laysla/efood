/**
 * Evolution API Service
 * Integração com Evolution API para enviar mensagens WhatsApp
 * Documentação: https://doc.evolution-api.com/
 */

interface EvolutionApiConfig {
  domain: string;
  apiKey: string;
}

interface SendMessagePayload {
  number: string;
  text: string;
  media?: {
    mediatype: 'image' | 'video' | 'audio' | 'document';
    caption?: string;
    url?: string;
  };
}

interface EvolutionWebhookPayload {
  event: string;
  instance: string;
  data: any;
}

let config: EvolutionApiConfig | null = null;

/**
 * Inicializar Evolution API com credenciais
 */
export const initializeEvolutionApi = (domain: string, apiKey: string) => {
  if (!domain || !apiKey) {
    console.error('❌ Evolution API: Domain ou API Key vazios!');
    return;
  }

  config = {
    domain: domain.replace(/\/$/, ''), // Remove trailing slash
    apiKey
  };
  console.log('✅ Evolution API inicializada com sucesso');
  console.log('   Domain:', config.domain);
  console.log('   API Key: ***' + config.apiKey.slice(-4));
};

/**
 * Enviar mensagem de notificação via WhatsApp
 */
export const sendWhatsAppNotification = async (
  phoneNumber: string,
  message: string
): Promise<boolean> => {
  if (!config) {
    console.error('❌ Evolution API não configurada. Mensagem não será enviada.');
    console.error('   Número:', phoneNumber);
    console.error('   Mensagem:', message.substring(0, 50) + '...');
    return false;
  }

  if (!phoneNumber || !message) {
    console.error('❌ Telefone ou mensagem vazios');
    return false;
  }

  try {
    // Formatar número: remover caracteres especiais e adicionar código do país se necessário
    let formattedNumber = phoneNumber.replace(/\D/g, '');
    console.log('📱 Número original:', phoneNumber);
    console.log('📱 Número formatado (após remover caracteres):', formattedNumber);
    
    if (!formattedNumber.startsWith('55') && formattedNumber.length === 11) {
      formattedNumber = '55' + formattedNumber;
      console.log('📱 Número com código do país:', formattedNumber);
    }

    const payload: SendMessagePayload = {
      number: formattedNumber,
      text: message
    };

    console.log('📤 Enviando mensagem para Evolution API...');
    console.log('   URL:', `${config.domain}/message/sendText/default`);
    console.log('   Número:', formattedNumber);
    console.log('   Tamanho da mensagem:', message.length + ' caracteres');

    const response = await fetch(`${config.domain}/message/sendText/default`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.apiKey
      },
      body: JSON.stringify(payload)
    });

    console.log('📬 Status HTTP:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      console.error('❌ Erro ao enviar mensagem Evolution API:', errorData);
      return false;
    }

    const result = await response.json();
    console.log('✅ Mensagem enviada com sucesso!');
    console.log('   Response:', result);
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com Evolution API:', error);
    console.error('   Erro completo:', error instanceof Error ? error.message : error);
    return false;
  }
};

/**
 * Enviar notificação de mudança de status do pedido
 */
export const sendOrderStatusNotification = async (
  phoneNumber: string,
  orderId: string,
  status: string,
  statusMessage: string,
  businessName: string
): Promise<boolean> => {
  const message = `
📦 *${businessName}*

Olá! Seu pedido foi atualizado:

🔔 *Pedido:* #${orderId.slice(0, 6).toUpperCase()}
📊 *Status:* ${statusMessage}

Acompanhe seu pedido em tempo real no nosso app!

Obrigado! 🙏
  `.trim();

  return sendWhatsAppNotification(phoneNumber, message);
};

/**
 * Enviar link de pagamento via Evolution API
 */
export const sendPaymentLink = async (
  phoneNumber: string,
  paymentLink: string,
  orderId: string,
  total: number,
  businessName: string
): Promise<boolean> => {
  const message = `
🛒 *${businessName}*

Clique no link abaixo para finalizar o pagamento do seu pedido:

📦 *Pedido:* #${orderId.slice(0, 6).toUpperCase()}
💰 *Total:* R$ ${total.toFixed(2)}

🔗 Link de Pagamento:
${paymentLink}

⏰ O link expira em 24 horas

Obrigado! 🙏
  `.trim();

  return sendWhatsAppNotification(phoneNumber, message);
};

/**
 * Enviar confirmação de pedido
 */
export const sendOrderConfirmation = async (
  phoneNumber: string,
  orderData: {
    orderId: string;
    customerName: string;
    items: string;
    total: number;
    estimatedTime?: string;
  },
  businessName: string
): Promise<boolean> => {
  const message = `
📦 *${businessName}*

Olá ${orderData.customerName}! 👋

✅ *Pedido confirmado com sucesso!*

🔔 *Número do Pedido:* #${orderData.orderId.slice(0, 6).toUpperCase()}
📋 *Itens:*
${orderData.items}

💰 *Total:* R$ ${orderData.total.toFixed(2)}
${orderData.estimatedTime ? `⏱️ *Tempo estimado:* ${orderData.estimatedTime}` : ''}

Acompanhe seu pedido em tempo real no nosso app!

Obrigado! 🙏
  `.trim();

  return sendWhatsAppNotification(phoneNumber, message);
};

/**
 * Obter status da instância
 */
export const getInstanceStatus = async (): Promise<boolean> => {
  if (!config) {
    return false;
  }

  try {
    const response = await fetch(`${config.domain}/instance/fetchInstances`, {
      method: 'GET',
      headers: {
        'apikey': config.apiKey
      }
    });

    return response.ok;
  } catch (error) {
    console.error('❌ Erro ao verificar status da instância:', error);
    return false;
  }
};

/**
 * Testar conexão com Evolution API
 */
export const testEvolutionApiConnection = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  if (!config) {
    return {
      success: false,
      message: 'Evolution API não foi configurada'
    };
  }

  try {
    const response = await fetch(`${config.domain}/instance/fetchInstances`, {
      method: 'GET',
      headers: {
        'apikey': config.apiKey
      }
    });

    if (response.ok) {
      return {
        success: true,
        message: '✅ Conexão com Evolution API estabelecida com sucesso!'
      };
    } else {
      return {
        success: false,
        message: '❌ Falha na autenticação com Evolution API. Verifique suas credenciais.'
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
export const isEvolutionApiConfigured = (): boolean => {
  return config !== null && config.domain !== '' && config.apiKey !== '';
};

export default {
  initializeEvolutionApi,
  sendWhatsAppNotification,
  sendOrderStatusNotification,
  sendPaymentLink,
  sendOrderConfirmation,
  getInstanceStatus,
  testEvolutionApiConnection,
  isEvolutionApiConfigured
};
