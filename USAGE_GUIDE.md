# 🚀 Guia de Uso - Notificações, Pagamentos e Integrações

## 📋 Índice
1. [Configuração Inicial](#configuração-inicial)
2. [Evolution API (WhatsApp)](#evolution-api-whatsapp)
3. [Métodos de Pagamento](#métodos-de-pagamento)
4. [Rastreamento de Pedidos](#rastreamento-de-pedidos)
5. [Troubleshooting](#troubleshooting)

---

## ⚙️ Configuração Inicial

### 1. Acessar Painel Admin
- Login: `admin@deliciabom.com` (ou suas credenciais)
- Navegue para: **Integrações** ⚡

### 2. Configurar Evolution API

#### Dados Fornecidos:
```
Domain:      https://evo-api.rodrigomarques.click
API Key:     VzEhslqNmVs02O3DVzEhslqNmVs02O3D
Manager:     https://evo-api.rodrigomarques.click/manager
```

#### Passos:
1. No painel admin, vá para **Integrações**
2. Seção "Evolution API (WhatsApp)"
3. Habilite: ✅ **Habilitar Evolution API**
4. Cole o domínio: `https://evo-api.rodrigomarques.click`
5. Cole a API Key: `VzEhslqNmVs02O3DVzEhslqNmVs02O3D`
6. Habilite: ✅ **Enviar notificações de status via WhatsApp**
7. Clique em **Testar Conexão** para validar
8. Salve as configurações

#### Resultado Esperado:
```
✅ Conexão com Evolution API estabelecida com sucesso!
```

---

## 📱 Evolution API (WhatsApp)

### O que Faz Automaticamente?

#### Ao Criar Pedido:
- Cliente recebe mensagem de confirmação
- Inclui: Número do pedido, itens, total, tempo estimado

#### Ao Mudar Status no Kanban:
- Cliente recebe atualização em tempo real
- Mensagens:
  - 📋 "Novo pedido recebido!"
  - 👨‍🍳 "Seu pedido está em preparo"
  - ✅ "Seu pedido está pronto!"
  - 🚗 "Pedido entregue com sucesso!"

### Exemplo de Mensagem:
```
📦 Delicia de Bom Menu

Olá! Seu pedido foi atualizado:

🔔 Pedido: #ABC123
📊 Status: 👨‍🍳 Seu pedido está em preparo

Acompanhe seu pedido em tempo real no nosso app!

Obrigado! 🙏
```

---

## 💳 Métodos de Pagamento

### Configurar Disponibilidade

No painel admin, **Integrações**, seção "Métodos de Pagamento":

#### Opções:
- ✅ **💳 Cartão de Crédito** (Mercado Pago)
- ✅ **🔑 PIX** (Mercado Pago)
- ✅ **💰 Dinheiro** (Pagamento na Entrega)
- ✅ **💬 Negociação via WhatsApp**

### Fluxo Cliente

#### 1. Cliente Faz Pedido
```
Menu → Adiciona produtos → Carrinho → Checkout
```

#### 2. Seleciona Método
```
Seletor de Pagamento
└─ Cartão / PIX / Dinheiro / WhatsApp
```

#### 3. Efetua Pagamento
- **Cartão/PIX**: Redireciona para Mercado Pago
- **Dinheiro**: Apenas confirmação
- **WhatsApp**: Mensagem para negociar

---

## 🔍 Rastreamento de Pedidos

### Para o Cliente

#### Acesso:
1. Depois de fazer pedido, vê notificações em tempo real
2. Ícone de sino 🔔 no canto inferior direito
3. Clica para ver histórico de notificações

#### Informações Mostradas:
- Número do pedido
- Status atual
- Data/hora da atualização
- Mensagem personalizada

### Para o Admin (Kanban)

#### Acompanhar Pedidos:
1. Painel Admin → **Kanban** (Trello icon)
2. Ver 4 colunas:
   - 📋 Novos Pedidos
   - 👨‍🍳 Em Preparo
   - ✅ Pronto
   - 🚗 Entregue

#### Atualizar Status:
1. Arraste o card para outra coluna
2. Automaticamente:
   - Notificação salva
   - Cliente notificado via WhatsApp
   - Notificação aparece em tempo real pro cliente

---

## ⏱️ Fluxo Completo Exemplo

```
10:00 - Cliente faz pedido (Arroz com Frango - R$ 45,00)
        ├─ Seleciona: PIX
        ├─ Recebe no WhatsApp: ✅ Confirmação de pedido
        └─ Vê notificação na app: Pedido criado

10:01 - Admin recebe notificação de novo pedido

10:05 - Admin arrasta para "Em Preparo"
        ├─ Cliente recebe: 👨‍🍳 "Seu pedido está em preparo"
        └─ Admin vê confirmação: ✅ Notificação enviada

10:45 - Admin arrasta para "Pronto"
        ├─ Cliente recebe: ✅ "Seu pedido está pronto!"
        └─ Cliente vê no app com sino piscando

11:00 - Admin arrasta para "Entregue"
        ├─ Cliente recebe: 🚗 "Pedido entregue com sucesso!"
        └─ Cliente marca como lido
```

---

## 🧪 Testando o Sistema

### 1. Testar Evolution API
```
Admin Panel → Integrações → Evolution API
Clique em "Testar Conexão"
Esperado: ✅ Verde = Funcionando
```

### 2. Criar Pedido de Teste
```
1. Acesse a app como cliente
2. Adicione produto ao carrinho
3. Preencha dados:
   - Nome: Seu Nome
   - Telefone: (11) 99999-9999
   - Endereço: Sua Rua, 123
4. Selecione método de pagamento
5. Clique em "Enviar via WhatsApp"
6. Aparecerá no Admin em tempo real
```

### 3. Testar Notificações
```
1. No Admin, arraste pedido para coluna
2. Espere 2-3 segundos
3. Verifique:
   - Admin vê notificação verde
   - Cliente recebe mensagem WhatsApp
   - Cliente vê notificação na app
```

---

## 🐛 Troubleshooting

### ❌ "Evolution API não configurada"

**Solução:**
1. Admin Panel → Integrações
2. Habilite Evolution API
3. Cole domínio e API Key
4. Clique em "Testar Conexão"
5. Aguarde resposta: ✅

---

### ❌ "Falha ao enviar mensagem"

**Verificar:**
1. Domínio da API está correto?
2. API Key está válida?
3. Cliente tem número de telefone válido?
4. Número começa com 55 (Brasil)?

**Solução:**
- Format: `(11) 99999-9999` ou `11999999999`
- Sistema converte automaticamente para `5511999999999`

---

### ❌ Notificação não aparece no cliente

**Verificar:**
1. Cliente recebeu o pedido? (deve aparecer no Admin)
2. Cliente tem notificações ativadas?
3. Cliente está online na app?
4. Número de telefone correto?

**Solução:**
- Notificações via Firestore (real-time)
- Recarregue a página se necessário
- Verifique console do navegador (F12)

---

### ❌ "Erro de conexão" no teste

**Possíveis Causas:**
- Domínio digitado incorretamente
- API Key expirada
- Instância Evolution API offline
- Problema de rede

**Solução:**
1. Acesse: `https://evo-api.rodrigomarques.click/manager`
2. Verifique status da instância
3. Regenere API Key se necessário
4. Teste novamente

---

## 📞 Suporte

### Dúvidas Sobre Evolution API:
- Docs: https://doc.evolution-api.com/
- Manager: https://evo-api.rodrigomarques.click/manager

### Dúvidas Sobre Sistema:
- Verificar console (F12) para logs
- Procurar mensagens em verde ✅ (sucesso) ou vermelho ❌ (erro)

---

## ✨ Recursos Futuros

Em breve:
- ✅ Integração Mercado Pago (cartão/PIX automáticos)
- ✅ Rastreamento por código de pedido
- ✅ Webhooks de confirmação
- ✅ Relatórios de vendas
- ✅ Análise de métodos de pagamento

---

**Sistema Pronto para Produção** ✅

Todas as notificações são salvas em tempo real no Firebase Firestore.
Nenhum pedido é perdido mesmo com falha de conexão.

