export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[]; // Nova funcionalidade: múltiplas imagens
  category: string;
  addOns?: AddOn[];
  discount?: number;
  isActive: boolean;
  // NOVA FUNCIONALIDADE: Checkout direto
  checkoutEnabled?: boolean;
  checkoutUrl?: string;
  checkoutText?: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description?: string;
  isGlobal?: boolean;
}

export interface GlobalAddOn {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addOns: AddOn[];
  observations: string;
}

export interface BusinessHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  isEnabled: boolean;
}

export interface OrderNotification {
  isEnabled: boolean;
  volume: number;
  duration: number; // in milliseconds
  soundType: string;
}

// Nova funcionalidade: Banner do carrossel
export interface HomeBanner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  isActive: boolean;
  order: number;
}

// Nova funcionalidade: Patrocinadores
export interface Sponsor {
  id: string;
  name: string;
  image: string;
  link: string;
  isActive: boolean;
  order: number;
}

export interface BusinessConfig {
  name: string;
  description: string;
  logo: string;
  bannerImage: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  whatsappNumber: string;
  serviceRegion: string;
  socialMedia?: SocialMedia;
  promotionBanner?: {
    isActive: boolean;
    text: string;
    image: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
  };
  businessHours?: BusinessHours[];
  isOpen?: boolean;
  footerPromoBanner?: {
    isActive: boolean;
    text: string;
    buttonText: string;
    buttonLink?: string;
    backgroundColor: string;
    textColor: string;
  };
  colors?: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    cardBackground: string;
    headerBackground: string;
  };
  orderNotification?: OrderNotification;
  customImageSize?: number; // Nova funcionalidade: tamanho personalizado em pixels
  // Configurações do modo da loja
  storeMode?: 'menu' | 'store';
  // Configurações dos banners
  homeBanners?: {
    isEnabled: boolean;
    autoSlide: boolean;
    slideInterval: number;
    showArrows?: boolean; // Nova opção
    showDots?: boolean; // Nova opção
    direction?: 'left' | 'right'; // Nova opção
    fullWidth?: boolean; // Nova opção
  };
  // Configurações dos patrocinadores
  sponsors?: {
    isEnabled: boolean;
    title: string;
  };
  // Nova funcionalidade: Background fixo
  fixedBackground?: {
    isEnabled: boolean;
    image?: string;
  };
  // Nova funcionalidade: Desconto para usuários
  userDiscount?: {
    amount: number;
    isEnabled: boolean;
  };
  // Nova funcionalidade: Configuração de mensagens do carrinho
  cartMessage?: {
    template: string;
    isEnabled: boolean;
  };
  // Nova funcionalidade: Controle de comentários
  reviewsSection?: {
    isEnabled: boolean;
  };
  // Nova funcionalidade: Configuração do modo escuro
  darkModeConfig?: 'optional' | 'forced-dark' | 'forced-light';
  // Nova funcionalidade: Configuração dos botões do carrinho
  cartButtons?: {
    whatsapp?: boolean;
    checkout?: boolean;
    checkoutUrl?: string;
    checkoutText?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

export interface Promotion {
  id: string;
  type: 'combo' | 'promotion' | 'giveaway';
  title: string;
  description: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  discount?: number;
  code?: string;
  image?: string;
  // Combo specific
  comboProducts?: string[]; // Product IDs
  comboPrice?: number;
  // Giveaway specific
  giveawayRules?: {
    minPurchaseAmount: number;
    maxParticipants: number;
    participantNumberStart: number;
    prize: string;
    rules: string;
  };
}

export interface GiveawayParticipant {
  id: string;
  promotionId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  participantNumber: number;
  purchaseAmount: number;
  orderId: string;
  participationDate: Date;
  isWinner?: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  registrationDate: Date;
  totalOrders: number;
  isActive: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerLocation: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'accepted' | 'out_for_delivery' | 'rejected';
  date: Date;
  notes?: string;
  rejectionReason?: string; // Nova funcionalidade
  isFromLoggedUser?: boolean; // Nova funcionalidade
  userId?: string; // Nova funcionalidade
  giveawayParticipations?: {
    promotionId: string;
    participantNumber: number;
  }[];
}

export interface AdminCredentials {
  email: string;
  password: string;
}