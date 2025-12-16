# Delicia de Bom - Cardápio Digital

Sistema completo de cardápio digital com painel administrativo integrado ao Firebase.

## 🚀 Funcionalidades

### Para Clientes
- ✅ Visualização de produtos por categoria
- ✅ Carrinho de compras interativo
- ✅ Adicionais personalizáveis
- ✅ Envio de pedidos via WhatsApp
- ✅ Sistema de avaliações
- ✅ Desconto automático para usuários cadastrados (R$ 2,00)
- ✅ Participação automática em sorteios
- ✅ Modo escuro/claro
- ✅ Design responsivo

### Para Administradores
- ✅ Dashboard completo com estatísticas
- ✅ Gerenciamento de produtos
- ✅ Gerenciamento de categorias
- ✅ Sistema de adicionais globais
- ✅ Criação de promoções e combos
- ✅ Sistema de sorteios
- ✅ Gerenciamento de pedidos
- ✅ Gerenciamento de usuários
- ✅ Sistema de avaliações
- ✅ Configuração de horários de funcionamento
- ✅ Personalização de cores e temas
- ✅ Configuração de redes sociais
- ✅ Exportação de dados (Excel)
- ✅ Upload de imagens
- ✅ Banners promocionais

## 🔐 Acesso Administrativo

**Email:** admin@deliciabom.com  
**Senha:** admin123

## 🛠️ Tecnologias

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Firebase (Firestore + Storage + Auth)
- **Deploy:** Netlify
- **Ícones:** Lucide React
- **Exportação:** XLSX

## 📱 Recursos Especiais

### Sistema de Usuários
- Cadastro manual pelo administrador
- Desconto automático de R$ 2,00 para usuários cadastrados
- Histórico de pedidos

### Sistema de Sorteios
- Participação automática baseada no valor mínimo
- Números da sorte únicos
- Gerenciamento de participantes
- Configuração flexível de regras

### Personalização Completa
- Cores personalizáveis
- Banners promocionais
- Redes sociais
- Horários de funcionamento
- Informações da empresa

### Exportação de Dados
- Produtos, pedidos, usuários, avaliações
- Formato Excel (.xlsx)
- Dados completos para análise

## 🚀 Deploy

O projeto está configurado para deploy automático no Netlify com:
- Build otimizado
- Redirects para SPA
- Headers de segurança
- Cache otimizado para assets

## � Firebase (importante)

- As credenciais do Firebase não devem ficar no repositório; mova para variáveis de ambiente para mais segurança e facilidade de gerenciamento.
- Variáveis necessárias (use estes nomes exatos):
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
- Localmente: crie um arquivo `.env` na raiz com as chaves acima (use `.env.example` como referência). O arquivo `.env` já está listado em `.gitignore`.
- No Netlify: vá em Site → Settings → Build & deploy → Environment → adicione as mesmas variáveis com os valores do Firebase. Netlify disponibiliza essas variáveis durante o build.- Antes do build (local ou CI) um checador confirma que todas as variáveis existem — isso dá mensagens claras em caso de falta.

### 🚀 Deploy rápido (passo-a-passo para iniciantes)
1. Faça push do código para o GitHub (se ainda não estiver):
   - git checkout -b env-firebase
   - git add .
   - git commit -m "chore(env): prepare env vars and prebuild check"
   - git push -u origin env-firebase
2. Acesse Netlify → New site from Git → conecte seu repositório GitHub e selecione o branch.
   - Build command: `npm run build` (configurado no `netlify.toml`)
   - Publish directory: `dist`
3. Em Netlify → Site settings → Build & deploy → Environment → add the variables (names above).
4. Clique em Deploy site (Netlify fará o build; se faltar uma variável, o build falhará e mostrará o nome que está faltando graças ao `scripts/checkEnv.js`).
5. Depois do deploy, abra o site e teste: carregar produtos, login admin (admin@deliciabom.com / admin123), upload de imagem e criação de pedido.

### 🔁 Valores de exemplo (se quiser usar a mesma configuração que havia no projeto)
- apiKey: AIzaSyDHOGX44ux2GVe0w8MssAcCtcAwcOnAPUs
- authDomain: foodloja-9a919.firebaseapp.com
- projectId: foodloja-9a919
- storageBucket: foodloja-9a919.firebasestorage.app
- messagingSenderId: 431927065978
- appId: 1:431927065978:web:12651206d00d76f589aac3

> Observação: essas chaves de exemplo já estavam no projeto antigo; você pode reutilizá-las ou criar um novo projeto no Firebase Console.
- Verifique no Firebase Console se você tem:
  - Firestore (coleções mencionadas no README)
  - Storage
  - Auth (email/password habilitado)
- Crie/seed o usuário admin ou a coleção `adminCredentials` conforme o README.

## �📊 Firebase Collections

- `products` - Produtos do cardápio
- `categories` - Categorias dos produtos
- `globalAddons` - Adicionais reutilizáveis
- `promotions` - Promoções e sorteios
- `orders` - Pedidos dos clientes
- `users` - Usuários cadastrados
- `reviews` - Avaliações dos clientes
- `giveawayParticipants` - Participantes dos sorteios
- `businessConfig` - Configurações da empresa
- `adminCredentials` - Credenciais do administrador

## 🎯 Próximos Passos

1. Acesse o painel administrativo
2. Configure as informações da empresa
3. Adicione produtos e categorias
4. Configure horários de funcionamento
5. Personalize cores e banners
6. Comece a receber pedidos!

---

**Desenvolvido com ❤️ para o sucesso do seu negócio!**