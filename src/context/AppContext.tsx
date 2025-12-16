import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { Product, CartItem, BusinessConfig, Category, Promotion, Review, User, Order, GlobalAddOn, BusinessHours, GiveawayParticipant, AdminCredentials, HomeBanner, Sponsor } from '../types';
import * as firebaseService from '../services/firebaseService';
import { auth } from '../config/firebase';

interface AppContextType {
  // Data
  products: Product[];
  cartItems: CartItem[];
  businessConfig: BusinessConfig;
  categories: Category[];
  promotions: Promotion[];
  reviews: Review[];
  users: User[];
  orders: Order[];
  globalAddOns: GlobalAddOn[];
  giveawayParticipants: GiveawayParticipant[];
  homeBanners: HomeBanner[];
  sponsors: Sponsor[];
  
  // Auth
  currentUser: FirebaseUser | null;
  currentUserData: User | null;
  isAdmin: boolean;
  isDarkMode: boolean;
  
  // Cart functions
  addToCart: (product: Product, addOns: any[], observations: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Business functions
  updateBusinessConfig: (config: Partial<BusinessConfig>) => void;
  
  // Product functions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Category functions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Global AddOn functions
  addGlobalAddOn: (addOn: Omit<GlobalAddOn, 'id'>) => void;
  updateGlobalAddOn: (id: string, addOn: Partial<GlobalAddOn>) => void;
  deleteGlobalAddOn: (id: string) => void;
  
  // Promotion functions
  addPromotion: (promotion: Omit<Promotion, 'id'>) => void;
  updatePromotion: (id: string, promotion: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  
  // Review functions
  addReview: (review: Omit<Review, 'id'>) => void;
  deleteReview: (id: string) => void;
  
  // Order functions
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  
  // User functions
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Giveaway functions
  addGiveawayParticipant: (participant: Omit<GiveawayParticipant, 'id'>) => void;
  
  // Home Banner functions
  addHomeBanner: (banner: Omit<HomeBanner, 'id'>) => Promise<void>;
  updateHomeBanner: (id: string, banner: Partial<HomeBanner>) => Promise<void>;
  deleteHomeBanner: (id: string) => Promise<void>;
  
  // Sponsor functions
  addSponsor: (sponsor: Omit<Sponsor, 'id'>) => Promise<void>;
  updateSponsor: (id: string, sponsor: Partial<Sponsor>) => Promise<void>;
  deleteSponsor: (id: string) => Promise<void>;
  
  // Auth functions
  registerUser: (email: string, password: string, userData: Omit<User, 'id'>) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  updateAdminCredentials: (credentials: AdminCredentials) => Promise<void>;
  
  // UI functions
  toggleDarkMode: () => void;
  clearCache: () => Promise<void>;
  
  // Utility functions
  getDiscountedPrice: (price: number) => number;
  isBusinessOpen: () => boolean;
  getCurrentBusinessStatus: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const defaultBusinessHours: BusinessHours[] = [
  { day: 'Segunda-feira', isOpen: true, openTime: '18:00', closeTime: '23:00' },
  { day: 'Terça-feira', isOpen: true, openTime: '18:00', closeTime: '23:00' },
  { day: 'Quarta-feira', isOpen: true, openTime: '18:00', closeTime: '23:00' },
  { day: 'Quinta-feira', isOpen: true, openTime: '18:00', closeTime: '23:00' },
  { day: 'Sexta-feira', isOpen: true, openTime: '18:00', closeTime: '23:30' },
  { day: 'Sábado', isOpen: true, openTime: '18:00', closeTime: '23:30' },
  { day: 'Domingo', isOpen: true, openTime: '18:00', closeTime: '23:00' }
];

const defaultBusinessConfig: BusinessConfig = {
  name: 'Delicia de bom',
  description: 'Trazendo momentos felizes e deliciosos',
  logo: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=300',
  bannerImage: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1200',
  heroImage: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1200',
  backgroundColor: '#FFF7ED',
  primaryColor: '#F97316',
  secondaryColor: '#DC2626',
  whatsappNumber: '74981149461',
  serviceRegion: 'Entrega rápida com a menor taxa de frete de Juazeiro e Petrolina',
  isOpen: true,
  businessHours: defaultBusinessHours,
  socialMedia: {
    instagram: '',
    facebook: '',
    isEnabled: false
  },
  promotionBanner: {
    isActive: false,
    text: 'Promoção especial configurada no painel!',
    description: 'Aproveite esta oferta especial por tempo limitado!',
    image: '',
    disableAnimations: false
  },
  footerPromoBanner: {
    isActive: false,
    text: 'Não perca nossas ofertas especiais!',
    buttonText: 'Ver Ofertas',
    backgroundColor: '#F97316',
    textColor: '#FFFFFF',
    disableAnimations: false
  },
  colors: {
    background: '#FFF7ED',
    primary: '#F97316',
    secondary: '#DC2626',
    accent: '#FCD34D',
    text: '#1F2937',
    textSecondary: '#6B7280',
    cardBackground: '#FFFFFF',
    headerBackground: '#FFFFFF'
  },
  storeMode: 'menu',
  homeBanners: {
    isEnabled: false,
    autoSlide: true,
    slideInterval: 5,
    showArrows: true,
    showDots: true,
    direction: 'right',
    fullWidth: false
  },
  sponsors: {
    isEnabled: false,
    title: 'Nossos Parceiros'
  },
  fixedBackground: {
    isEnabled: false,
    image: ''
  },
  userDiscount: {
    amount: 2,
    isEnabled: true
  },
  cartMessage: {
    template: `*Pedido - {businessName}*\n\n*Cliente:* {customerName}\n*Endereço:* {customerAddress}\n\n*Itens do Pedido:*\n{items}\n*Total do Pedido: R$ {total}*`,
    isEnabled: true
  },
  reviewsSection: {
    isEnabled: true
  },
  darkModeConfig: 'optional',
  cartButtons: {
    whatsapp: true,
    checkout: false,
    checkoutUrl: '',
    checkoutText: 'Finalizar Pedido'
  }
};

const defaultCategories: Category[] = [];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(defaultBusinessConfig);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [globalAddOns, setGlobalAddOns] = useState<GlobalAddOn[]>([]);
  const [giveawayParticipants, setGiveawayParticipants] = useState<GiveawayParticipant[]>([]);
  const [homeBanners, setHomeBanners] = useState<HomeBanner[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Firebase listeners and default data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize admin credentials ONLY
        await firebaseService.initializeAdminCredentials();

        // Auth state listener
        const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
          setCurrentUser(user);
          if (user) {
            const userData = await firebaseService.getUserByEmail(user.email!);
            setCurrentUserData(userData);
          } else {
            setCurrentUserData(null);
          }
        });

        // Data listeners with real-time updates
        const unsubscribeProducts = firebaseService.getProducts((products) => {
          setProducts(products);
          console.log('Produtos atualizados em tempo real:', products.length);
        });
        
        const unsubscribeConfig = firebaseService.getBusinessConfig((config) => {
          setBusinessConfig(config);
          console.log('Configuração atualizada em tempo real');
        });
        
        const unsubscribeCategories = firebaseService.getCategories((categories) => {
          setCategories(categories);
          console.log('Categorias atualizadas em tempo real:', categories.length);
        });
        
        const unsubscribeGlobalAddOns = firebaseService.getGlobalAddOns((addOns) => {
          setGlobalAddOns(addOns);
          console.log('Adicionais globais atualizados em tempo real:', addOns.length);
        });
        
        const unsubscribeHomeBanners = firebaseService.getHomeBanners((banners) => {
          setHomeBanners(banners);
          console.log('Banners da home atualizados em tempo real:', banners.length);
        });
        
        const unsubscribeSponsors = firebaseService.getSponsors((sponsors) => {
          setSponsors(sponsors);
          console.log('Patrocinadores atualizados em tempo real:', sponsors.length);
        });
        
        const unsubscribePromotions = firebaseService.getPromotions(setPromotions);
        const unsubscribeReviews = firebaseService.getReviews(setReviews);
        const unsubscribeUsers = firebaseService.getUsers(setUsers);
        const unsubscribeOrders = firebaseService.getOrders(setOrders);
        const unsubscribeGiveawayParticipants = firebaseService.getGiveawayParticipants(setGiveawayParticipants);

        setIsInitialized(true);

        return () => {
          unsubscribeAuth();
          unsubscribeProducts();
          unsubscribeConfig();
          unsubscribeCategories();
          unsubscribeGlobalAddOns();
          unsubscribeHomeBanners();
          unsubscribeSponsors();
          unsubscribePromotions();
          unsubscribeReviews();
          unsubscribeUsers();
          unsubscribeOrders();
          unsubscribeGiveawayParticipants();
        };
      } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // Check if user is admin on app load
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Configurar modo escuro baseado na configuração do negócio
  useEffect(() => {
    if (businessConfig.darkModeConfig === 'forced-dark') {
      setIsDarkMode(true);
    } else if (businessConfig.darkModeConfig === 'forced-light') {
      setIsDarkMode(false);
    }
    // Se for 'optional', mantém o estado atual do usuário
  }, [businessConfig.darkModeConfig]);

  // Cart functions
  const addToCart = (product: Product, addOns: any[], observations: string) => {
    const existingItem = cartItems.find(item => 
      item.product.id === product.id && 
      JSON.stringify(item.addOns) === JSON.stringify(addOns) &&
      item.observations === observations
    );

    if (existingItem) {
      updateCartQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCartItems(prev => [...prev, { 
        product, 
        quantity: 1, 
        addOns: addOns || [],
        observations 
      }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Business functions
  const updateBusinessConfig = async (config: Partial<BusinessConfig>) => {
    try {
      await firebaseService.updateBusinessConfig(config);
      console.log('Configuração salva no Firebase');
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      throw error;
    }
  };

  // Product functions
  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await firebaseService.addProduct(product);
      console.log('Produto adicionado ao Firebase');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await firebaseService.updateProduct(id, updates);
      console.log('Produto atualizado no Firebase');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await firebaseService.deleteProduct(id);
      console.log('Produto removido do Firebase');
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  };

  // Category functions
  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      await firebaseService.addCategory(category);
      console.log('Categoria adicionada ao Firebase');
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      await firebaseService.updateCategory(id, updates);
      console.log('Categoria atualizada no Firebase');
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await firebaseService.deleteCategory(id);
      console.log('Categoria removida do Firebase');
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      throw error;
    }
  };

  // Global AddOn functions
  const addGlobalAddOn = async (addOn: Omit<GlobalAddOn, 'id'>) => {
    try {
      await firebaseService.addGlobalAddOn(addOn);
      console.log('Adicional global adicionado ao Firebase');
    } catch (error) {
      console.error('Erro ao adicionar adicional global:', error);
      throw error;
    }
  };

  const updateGlobalAddOn = async (id: string, updates: Partial<GlobalAddOn>) => {
    try {
      await firebaseService.updateGlobalAddOn(id, updates);
      console.log('Adicional global atualizado no Firebase');
    } catch (error) {
      console.error('Erro ao atualizar adicional global:', error);
      throw error;
    }
  };

  const deleteGlobalAddOn = async (id: string) => {
    try {
      await firebaseService.deleteGlobalAddOn(id);
      console.log('Adicional global removido do Firebase');
    } catch (error) {
      console.error('Erro ao deletar adicional global:', error);
      throw error;
    }
  };

  // Home Banner functions
  const addHomeBanner = async (banner: Omit<HomeBanner, 'id'>) => {
    try {
      await firebaseService.addHomeBanner(banner);
      console.log('Banner da home adicionado ao Firebase');
    } catch (error) {
      console.error('Erro ao adicionar banner da home:', error);
      throw error;
    }
  };

  const updateHomeBanner = async (id: string, updates: Partial<HomeBanner>) => {
    try {
      await firebaseService.updateHomeBanner(id, updates);
      console.log('Banner da home atualizado no Firebase');
    } catch (error) {
      console.error('Erro ao atualizar banner da home:', error);
      throw error;
    }
  };

  const deleteHomeBanner = async (id: string) => {
    try {
      await firebaseService.deleteHomeBanner(id);
      console.log('Banner da home removido do Firebase');
    } catch (error) {
      console.error('Erro ao deletar banner da home:', error);
      throw error;
    }
  };

  // Sponsor functions
  const addSponsor = async (sponsor: Omit<Sponsor, 'id'>) => {
    try {
      await firebaseService.addSponsor(sponsor);
      console.log('Patrocinador adicionado ao Firebase');
    } catch (error) {
      console.error('Erro ao adicionar patrocinador:', error);
      throw error;
    }
  };

  const updateSponsor = async (id: string, updates: Partial<Sponsor>) => {
    try {
      await firebaseService.updateSponsor(id, updates);
      console.log('Patrocinador atualizado no Firebase');
    } catch (error) {
      console.error('Erro ao atualizar patrocinador:', error);
      throw error;
    }
  };

  const deleteSponsor = async (id: string) => {
    try {
      await firebaseService.deleteSponsor(id);
      console.log('Patrocinador removido do Firebase');
    } catch (error) {
      console.error('Erro ao deletar patrocinador:', error);
      throw error;
    }
  };

  // Promotion functions
  const addPromotion = async (promotion: Omit<Promotion, 'id'>) => {
    try {
      await firebaseService.addPromotion(promotion);
    } catch (error) {
      console.error('Erro ao adicionar promoção:', error);
      throw error;
    }
  };

  const updatePromotion = async (id: string, updates: Partial<Promotion>) => {
    try {
      await firebaseService.updatePromotion(id, updates);
    } catch (error) {
      console.error('Erro ao atualizar promoção:', error);
      throw error;
    }
  };

  const deletePromotion = async (id: string) => {
    try {
      await firebaseService.deletePromotion(id);
    } catch (error) {
      console.error('Erro ao deletar promoção:', error);
      throw error;
    }
  };

  // Review functions
  const addReview = async (review: Omit<Review, 'id'>) => {
    try {
      await firebaseService.addReview({ ...review, date: new Date() });
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      throw error;
    }
  };

  const deleteReview = async (id: string) => {
    try {
      await firebaseService.deleteReview(id);
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
      throw error;
    }
  };

  // Order functions with giveaway participation - FUNÇÃO CORRIGIDA
  const addOrder = async (order: Omit<Order, 'id'>) => {
    try {
      console.log('🚀 CONTEXT: Iniciando salvamento do pedido:', order);
      
      // Check for active giveaway promotions
      const activeGiveaways = promotions.filter(p => 
        p.type === 'giveaway' && 
        p.isActive && 
        p.giveawayRules &&
        order.total >= p.giveawayRules.minPurchaseAmount &&
        new Date() >= p.startDate &&
        new Date() <= p.endDate
      );

      const giveawayParticipations: { promotionId: string; participantNumber: number }[] = [];

      // Generate participant numbers for eligible giveaways
      for (const giveaway of activeGiveaways) {
        const existingParticipants = giveawayParticipants.filter(p => p.promotionId === giveaway.id);
        
        if (existingParticipants.length < (giveaway.giveawayRules?.maxParticipants || 100)) {
          const participantNumber = (giveaway.giveawayRules?.participantNumberStart || 1) + existingParticipants.length;
          
          giveawayParticipations.push({
            promotionId: giveaway.id,
            participantNumber
          });

          // Add to giveaway participants collection
          await firebaseService.addGiveawayParticipant({
            promotionId: giveaway.id,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            participantNumber,
            purchaseAmount: order.total,
            orderId: '', // Will be updated after order is created
            participationDate: new Date(),
            isWinner: false
          });
        }
      }

      const orderWithGiveaways = {
        ...order,
        giveawayParticipations: giveawayParticipations.length > 0 ? giveawayParticipations : undefined
      };

      console.log('🚀 CONTEXT: Chamando firebaseService.addOrder com:', orderWithGiveaways);
      
      const orderId = await firebaseService.addOrder(orderWithGiveaways);
      
      console.log('✅ CONTEXT: Pedido salvo com sucesso! ID:', orderId);
      
      return orderId;
    } catch (error) {
      console.error('❌ CONTEXT: Erro ao adicionar pedido:', error);
      throw error;
    }
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      await firebaseService.updateOrder(id, updates);
      console.log('Pedido atualizado no Firebase');
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      throw error;
    }
  };

  // User functions
  const addUser = async (user: Omit<User, 'id'>) => {
    try {
      await firebaseService.addUser(user);
      console.log('Usuário adicionado ao Firebase');
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      throw error;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      await firebaseService.updateUser(id, updates);
      console.log('Usuário atualizado no Firebase');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await firebaseService.deleteUser(id);
      console.log('Usuário removido do Firebase');
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  };

  // Giveaway functions
  const addGiveawayParticipant = async (participant: Omit<GiveawayParticipant, 'id'>) => {
    try {
      await firebaseService.addGiveawayParticipant(participant);
    } catch (error) {
      console.error('Erro ao adicionar participante do sorteio:', error);
      throw error;
    }
  };

  // Auth functions
  const registerUser = async (email: string, password: string, userData: Omit<User, 'id'>) => {
    try {
      await firebaseService.registerUser(email, password, userData);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      await firebaseService.loginUser(email, password);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await firebaseService.logoutUser();
      setIsAdmin(false);
      localStorage.removeItem('isAdmin');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const credentials = await firebaseService.getAdminCredentials();
      if (credentials && credentials.email === email && credentials.password === password) {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
        console.log('Admin logado com sucesso');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login do admin:', error);
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    console.log('Admin deslogado');
  };

  const updateAdminCredentials = async (credentials: AdminCredentials) => {
    try {
      await firebaseService.updateAdminCredentials(credentials);
      console.log('Credenciais do admin atualizadas');
    } catch (error) {
      console.error('Erro ao atualizar credenciais do admin:', error);
      throw error;
    }
  };

  // UI functions
  const toggleDarkMode = () => {
    // Só permitir toggle se o modo for opcional
    if (businessConfig.darkModeConfig === 'optional' || !businessConfig.darkModeConfig) {
      setIsDarkMode(prev => !prev);
    }
  };

  const clearCache = async () => {
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Reset state to initial values
      setProducts([]);
      setCartItems([]);
      setBusinessConfig(defaultBusinessConfig);
      setCategories(defaultCategories);
      setPromotions([]);
      setReviews([]);
      setUsers([]);
      setOrders([]);
      setGlobalAddOns([]);
      setGiveawayParticipants([]);
      setHomeBanners([]);
      setSponsors([]);
      setCurrentUser(null);
      setCurrentUserData(null);
      setIsAdmin(false);
      setIsDarkMode(false);
      
      console.log('Cache limpo com sucesso');
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      throw error;
    }
  };

  // Utility functions
  const getDiscountedPrice = (price: number): number => {
    if (currentUserData && businessConfig.userDiscount?.isEnabled) {
      const discountAmount = businessConfig.userDiscount.amount || 2;
      return Math.max(0, price - discountAmount);
    }
    return price;
  };

  // Business hours functions
  const isBusinessOpen = (): boolean => {
    if (!businessConfig.isOpen || !businessConfig.businessHours) return false;
    
    const now = new Date();
    const currentDay = now.toLocaleDateString('pt-BR', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5);
    
    const dayMapping: { [key: string]: string } = {
      'segunda-feira': 'Segunda-feira',
      'terça-feira': 'Terça-feira',
      'quarta-feira': 'Quarta-feira',
      'quinta-feira': 'Quinta-feira',
      'sexta-feira': 'Sexta-feira',
      'sábado': 'Sábado',
      'domingo': 'Domingo'
    };
    
    const todaySchedule = businessConfig.businessHours.find(
      schedule => schedule.day === dayMapping[currentDay.toLowerCase()]
    );
    
    if (!todaySchedule || !todaySchedule.isOpen) return false;
    
    return currentTime >= todaySchedule.openTime && currentTime <= todaySchedule.closeTime;
  };

  const getCurrentBusinessStatus = (): string => {
    if (!businessConfig.isOpen) return 'Fechado temporariamente';
    
    if (isBusinessOpen()) {
      return 'Aberto agora';
    } else {
      const now = new Date();
      const currentDay = now.toLocaleDateString('pt-BR', { weekday: 'long' });
      
      const dayMapping: { [key: string]: string } = {
        'segunda-feira': 'Segunda-feira',
        'terça-feira': 'Terça-feira',
        'quarta-feira': 'Quarta-feira',
        'quinta-feira': 'Quinta-feira',
        'sexta-feira': 'Sexta-feira',
        'sábado': 'Sábado',
        'domingo': 'Domingo'
      };
      
      const todaySchedule = businessConfig.businessHours?.find(
        schedule => schedule.day === dayMapping[currentDay.toLowerCase()]
      );
      
      if (todaySchedule && todaySchedule.isOpen) {
        return `Fechado - Abre às ${todaySchedule.openTime}`;
      }
      
      return 'Fechado hoje';
    }
  };

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando aplicação...</p>
        </div>
      </div>
    );
  }

  const value = {
    // Data
    products,
    cartItems,
    businessConfig,
    categories,
    promotions,
    reviews,
    users,
    orders,
    globalAddOns,
    giveawayParticipants,
    homeBanners,
    sponsors,
    
    // Auth
    currentUser,
    currentUserData,
    isAdmin,
    isDarkMode,
    
    // Cart functions
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    
    // Business functions
    updateBusinessConfig,
    
    // Product functions
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Category functions
    addCategory,
    updateCategory,
    deleteCategory,
    
    // Global AddOn functions
    addGlobalAddOn,
    updateGlobalAddOn,
    deleteGlobalAddOn,
    
    // Home Banner functions
    addHomeBanner,
    updateHomeBanner,
    deleteHomeBanner,
    
    // Sponsor functions
    addSponsor,
    updateSponsor,
    deleteSponsor,
    
    // Promotion functions
    addPromotion,
    updatePromotion,
    deletePromotion,
    
    // Review functions
    addReview,
    deleteReview,
    
    // Order functions
    addOrder,
    updateOrder,
    
    // User functions
    addUser,
    updateUser,
    deleteUser,
    
    // Giveaway functions
    addGiveawayParticipant,
    
    // Auth functions
    registerUser,
    loginUser,
    logoutUser,
    adminLogin,
    adminLogout,
    updateAdminCredentials,
    
    // UI functions
    toggleDarkMode,
    clearCache,
    
    // Utility functions
    getDiscountedPrice,
    isBusinessOpen,
    getCurrentBusinessStatus
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};