import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, auth, storage } from '../config/firebase';
import { Product, BusinessConfig, Category, Promotion, Review, User, AdminCredentials, Order, GlobalAddOn, GiveawayParticipant, HomeBanner, Sponsor, CustomerNotification } from '../types';

// Collections
const COLLECTIONS = {
  PRODUCTS: 'products',
  BUSINESS_CONFIG: 'businessConfig',
  CATEGORIES: 'categories',
  PROMOTIONS: 'promotions',
  REVIEWS: 'reviews',
  USERS: 'users',
  ORDERS: 'orders',
  ADMIN_CREDENTIALS: 'adminCredentials',
  GLOBAL_ADDONS: 'globalAddons',
  GIVEAWAY_PARTICIPANTS: 'giveawayParticipants',
  HOME_BANNERS: 'homeBanners',
  SPONSORS: 'sponsors',
  CUSTOMER_NOTIFICATIONS: 'customerNotifications'
};

// Image Upload with better error handling
export const uploadImage = async (file: File): Promise<string> => {
  try {
    console.log('Iniciando upload da imagem:', file.name, 'Tamanho:', file.size);
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('Arquivo deve ser uma imagem');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('Imagem muito grande. Máximo 10MB');
    }

    const timestamp = Date.now();
    const fileName = `images/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, fileName);
    
    console.log('Fazendo upload para:', fileName);
    
    // Upload with metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedAt: new Date().toISOString()
      }
    };
    
    const snapshot = await uploadBytes(storageRef, file, metadata);
    console.log('Upload concluído, obtendo URL...');
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('URL obtida com sucesso:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Erro detalhado no upload:', error);
    if (error instanceof Error) {
      throw new Error(`Erro no upload: ${error.message}`);
    }
    throw new Error('Erro desconhecido no upload da imagem');
  }
};

// Delete Image
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log('Imagem removida com sucesso');
  } catch (error) {
    console.error('Erro ao remover imagem:', error);
    // Don't throw error as image might not exist
  }
};

// Home Banners
export const getHomeBanners = (callback: (banners: HomeBanner[]) => void) => {
  const q = query(collection(db, COLLECTIONS.HOME_BANNERS), orderBy('order', 'asc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const banners = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      };
    }) as HomeBanner[];
    callback(banners);
  }, (error) => {
    console.error('Erro ao buscar banners da home:', error);
    callback([]);
  });
  return unsubscribe;
};

export const addHomeBanner = async (banner: Omit<HomeBanner, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.HOME_BANNERS), banner);
    console.log('Banner da home adicionado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar banner da home:', error);
    throw error;
  }
};

export const updateHomeBanner = async (id: string, updates: Partial<HomeBanner>) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.HOME_BANNERS, id), updates);
    console.log('Banner da home atualizado:', id);
  } catch (error) {
    console.error('Erro ao atualizar banner da home:', error);
    throw error;
  }
};

export const deleteHomeBanner = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.HOME_BANNERS, id));
    console.log('Banner da home removido:', id);
  } catch (error) {
    console.error('Erro ao remover banner da home:', error);
    throw error;
  }
};

// Sponsors
export const getSponsors = (callback: (sponsors: Sponsor[]) => void) => {
  const q = query(collection(db, COLLECTIONS.SPONSORS), orderBy('order', 'asc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const sponsors = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Sponsor[];
    callback(sponsors);
  }, (error) => {
    console.error('Erro ao buscar patrocinadores:', error);
    callback([]);
  });
  return unsubscribe;
};

export const addSponsor = async (sponsor: Omit<Sponsor, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.SPONSORS), sponsor);
    console.log('Patrocinador adicionado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar patrocinador:', error);
    throw error;
  }
};

export const updateSponsor = async (id: string, updates: Partial<Sponsor>) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.SPONSORS, id), updates);
    console.log('Patrocinador atualizado:', id);
  } catch (error) {
    console.error('Erro ao atualizar patrocinador:', error);
    throw error;
  }
};

export const deleteSponsor = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SPONSORS, id));
    console.log('Patrocinador removido:', id);
  } catch (error) {
    console.error('Erro ao remover patrocinador:', error);
    throw error;
  }
};

// Global AddOns
export const getGlobalAddOns = (callback: (addOns: GlobalAddOn[]) => void) => {
  const q = query(collection(db, COLLECTIONS.GLOBAL_ADDONS), orderBy('name', 'asc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const addOns = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as GlobalAddOn[];
    callback(addOns);
  }, (error) => {
    console.error('Erro ao buscar adicionais globais:', error);
    callback([]);
  });
  return unsubscribe;
};

export const addGlobalAddOn = async (addOn: Omit<GlobalAddOn, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.GLOBAL_ADDONS), {
      ...addOn,
      createdAt: Timestamp.fromDate(addOn.createdAt)
    });
    console.log('Adicional global adicionado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar adicional global:', error);
    throw error;
  }
};

export const updateGlobalAddOn = async (id: string, updates: Partial<GlobalAddOn>) => {
  try {
    const updateData = { ...updates };
    if (updates.createdAt) {
      updateData.createdAt = Timestamp.fromDate(updates.createdAt);
    }
    await updateDoc(doc(db, COLLECTIONS.GLOBAL_ADDONS, id), updateData);
    console.log('Adicional global atualizado:', id);
  } catch (error) {
    console.error('Erro ao atualizar adicional global:', error);
    throw error;
  }
};

export const deleteGlobalAddOn = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.GLOBAL_ADDONS, id));
    console.log('Adicional global removido:', id);
  } catch (error) {
    console.error('Erro ao remover adicional global:', error);
    throw error;
  }
};

// Giveaway Participants
export const getGiveawayParticipants = (callback: (participants: GiveawayParticipant[]) => void) => {
  const q = query(collection(db, COLLECTIONS.GIVEAWAY_PARTICIPANTS), orderBy('participationDate', 'desc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const participants = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      participationDate: doc.data().participationDate?.toDate() || new Date()
    })) as GiveawayParticipant[];
    callback(participants);
  }, (error) => {
    console.error('Erro ao buscar participantes do sorteio:', error);
    callback([]);
  });
  return unsubscribe;
};

export const addGiveawayParticipant = async (participant: Omit<GiveawayParticipant, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.GIVEAWAY_PARTICIPANTS), {
      ...participant,
      participationDate: Timestamp.fromDate(participant.participationDate)
    });
    console.log('Participante do sorteio adicionado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar participante do sorteio:', error);
    throw error;
  }
};

// Products
export const getProducts = (callback: (products: Product[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, COLLECTIONS.PRODUCTS), (snapshot) => {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    callback(products);
  }, (error) => {
    console.error('Erro ao buscar produtos:', error);
    callback([]);
  });
  return unsubscribe;
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), product);
    console.log('Produto adicionado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), updates);
    console.log('Produto atualizado:', id);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
    console.log('Produto removido:', id);
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    throw error;
  }
};

// Business Config
export const getBusinessConfig = (callback: (config: BusinessConfig) => void) => {
  const unsubscribe = onSnapshot(collection(db, COLLECTIONS.BUSINESS_CONFIG), (snapshot) => {
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const config = { id: snapshot.docs[0].id, ...data } as BusinessConfig;
      callback(config);
    } else {
      // Se não existe configuração, criar uma padrão
      const defaultConfig: BusinessConfig = {
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
        socialMedia: {
          instagram: '',
          facebook: '',
          isEnabled: false
        },
        promotionBanner: {
          isActive: false,
          text: 'Promoção especial configurada no painel!',
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
        }
      };
      callback(defaultConfig);
    }
  }, (error) => {
    console.error('Erro ao buscar configuração:', error);
  });
  return unsubscribe;
};

export const updateBusinessConfig = async (config: Partial<BusinessConfig>) => {
  try {
    console.log('Salvando configuração no Firebase:', config);
    const snapshot = await getDocs(collection(db, COLLECTIONS.BUSINESS_CONFIG));
    if (!snapshot.empty) {
      await updateDoc(doc(db, COLLECTIONS.BUSINESS_CONFIG, snapshot.docs[0].id), config);
      console.log('Configuração atualizada no Firebase');
    } else {
      const docRef = await addDoc(collection(db, COLLECTIONS.BUSINESS_CONFIG), config);
      console.log('Configuração criada com ID:', docRef.id);
    }
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    throw error;
  }
};

// Categories
export const getCategories = (callback: (categories: Category[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, COLLECTIONS.CATEGORIES), (snapshot) => {
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
    
    callback(categories);
  }, (error) => {
    console.error('Erro ao buscar categorias:', error);
    callback([]);
  });
  return unsubscribe;
};

export const addCategory = async (category: Omit<Category, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), category);
    console.log('Categoria adicionada com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, updates: Partial<Category>) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.CATEGORIES, id), updates);
    console.log('Categoria atualizada:', id);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
    console.log('Categoria removida:', id);
  } catch (error) {
    console.error('Erro ao remover categoria:', error);
    throw error;
  }
};

// Promotions
export const getPromotions = (callback: (promotions: Promotion[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, COLLECTIONS.PROMOTIONS), (snapshot) => {
    const promotions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate?.toDate() || new Date(),
      endDate: doc.data().endDate?.toDate() || new Date()
    })) as Promotion[];
    callback(promotions);
  }, (error) => {
    console.error('Erro ao buscar promoções:', error);
    callback([]);
  });
  return unsubscribe;
};

export const addPromotion = async (promotion: Omit<Promotion, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROMOTIONS), {
      ...promotion,
      startDate: Timestamp.fromDate(promotion.startDate),
      endDate: Timestamp.fromDate(promotion.endDate)
    });
    console.log('Promoção adicionada com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar promoção:', error);
    throw error;
  }
};

export const updatePromotion = async (id: string, updates: Partial<Promotion>) => {
  try {
    const updateData = { ...updates };
    if (updates.startDate) {
      updateData.startDate = Timestamp.fromDate(updates.startDate);
    }
    if (updates.endDate) {
      updateData.endDate = Timestamp.fromDate(updates.endDate);
    }
    await updateDoc(doc(db, COLLECTIONS.PROMOTIONS, id), updateData);
    console.log('Promoção atualizada:', id);
  } catch (error) {
    console.error('Erro ao atualizar promoção:', error);
    throw error;
  }
};

export const deletePromotion = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PROMOTIONS, id));
    console.log('Promoção removida:', id);
  } catch (error) {
    console.error('Erro ao remover promoção:', error);
    throw error;
  }
};

// Reviews
export const getReviews = (callback: (reviews: Review[]) => void) => {
  const q = query(collection(db, COLLECTIONS.REVIEWS), orderBy('date', 'desc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date()
    })) as Review[];
    callback(reviews);
  }, (error) => {
    console.error('Erro ao buscar avaliações:', error);
    callback([]);
  });
  return unsubscribe;
};

export const addReview = async (review: Omit<Review, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), {
      ...review,
      date: Timestamp.fromDate(review.date)
    });
    console.log('Avaliação adicionada com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar avaliação:', error);
    throw error;
  }
};

export const deleteReview = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.REVIEWS, id));
    console.log('Avaliação removida:', id);
  } catch (error) {
    console.error('Erro ao remover avaliação:', error);
    throw error;
  }
};

// Orders - FUNÇÃO CORRIGIDA PARA GARANTIR SALVAMENTO CORRETO
export const getOrders = (callback: (orders: Order[]) => void) => {
  const q = query(collection(db, COLLECTIONS.ORDERS), orderBy('date', 'desc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date()
    })) as Order[];
    callback(orders);
  }, (error) => {
    console.error('Erro ao buscar pedidos:', error);
    callback([]);
  });
  return unsubscribe;
};

export const addOrder = async (order: Omit<Order, 'id'>) => {
  try {
    console.log('🔥 SALVANDO PEDIDO NO FIREBASE:', order);
    
    // Garantir que todos os campos obrigatórios estão presentes
    const orderData = {
      customerName: order.customerName || '',
      customerLocation: order.customerLocation || '',
      items: order.items || [],
      total: order.total || 0,
      status: order.status || 'pending',
      date: Timestamp.fromDate(order.date || new Date()),
      // Campos opcionais
      ...(order.customerPhone && { customerPhone: order.customerPhone }),
      ...(order.userId && { userId: order.userId }),
      ...(order.isFromLoggedUser !== undefined && { isFromLoggedUser: order.isFromLoggedUser }),
      ...(order.notes && { notes: order.notes }),
      ...(order.rejectionReason && { rejectionReason: order.rejectionReason }),
      ...(order.giveawayParticipations && { giveawayParticipations: order.giveawayParticipations })
    };

    console.log('🔥 DADOS FORMATADOS PARA FIREBASE:', orderData);
    
    const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), orderData);
    console.log('✅ PEDIDO SALVO COM SUCESSO! ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ ERRO CRÍTICO AO SALVAR PEDIDO:', error);
    throw error;
  }
};

export const updateOrder = async (id: string, updates: Partial<Order>) => {
  try {
    const updateData = { ...updates };
    if (updates.date) {
      updateData.date = Timestamp.fromDate(updates.date);
    }
    await updateDoc(doc(db, COLLECTIONS.ORDERS, id), updateData);
    console.log('Pedido atualizado:', id);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    throw error;
  }
};

// Users - Manual Management Functions
export const getUsers = (callback: (users: User[]) => void) => {
  const q = query(collection(db, COLLECTIONS.USERS), orderBy('registrationDate', 'desc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      registrationDate: doc.data().registrationDate?.toDate() || new Date()
    })) as User[];
    callback(users);
  }, (error) => {
    console.error('Erro ao buscar usuários:', error);
    callback([]);
  });
  return unsubscribe;
};

export const addUser = async (user: Omit<User, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...user,
      registrationDate: Timestamp.fromDate(user.registrationDate)
    });
    console.log('Usuário adicionado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    throw error;
  }
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  try {
    const updateData = { ...updates };
    if (updates.registrationDate) {
      updateData.registrationDate = Timestamp.fromDate(updates.registrationDate);
    }
    await updateDoc(doc(db, COLLECTIONS.USERS, id), updateData);
    console.log('Usuário atualizado:', id);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, id));
    console.log('Usuário removido:', id);
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    throw error;
  }
};

// Auth functions (kept for compatibility)
export const registerUser = async (email: string, password: string, userData: Omit<User, 'id'>) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...userData,
      registrationDate: Timestamp.fromDate(userData.registrationDate)
    });
    console.log('Usuário registrado com ID:', docRef.id);
    return userCredential.user;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Usuário logado:', userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('Usuário deslogado');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const q = query(collection(db, COLLECTIONS.USERS), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        registrationDate: doc.data().registrationDate?.toDate() || new Date()
      } as User;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    return null;
  }
};

// Clear all users from database
export const clearAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    const batch = writeBatch(db);
    
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('Todos os usuários foram removidos do banco de dados');
  } catch (error) {
    console.error('Erro ao limpar usuários:', error);
    throw error;
  }
};

// Admin Authentication
export const getAdminCredentials = async (): Promise<AdminCredentials | null> => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.ADMIN_CREDENTIALS));
    if (!snapshot.empty) {
      const credentials = snapshot.docs[0].data() as AdminCredentials;
      console.log('Credenciais do admin carregadas');
      return credentials;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar credenciais do admin:', error);
    return null;
  }
};

export const updateAdminCredentials = async (credentials: AdminCredentials) => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.ADMIN_CREDENTIALS));
    if (!snapshot.empty) {
      await updateDoc(doc(db, COLLECTIONS.ADMIN_CREDENTIALS, snapshot.docs[0].id), credentials);
      console.log('Credenciais do admin atualizadas');
    } else {
      const docRef = await addDoc(collection(db, COLLECTIONS.ADMIN_CREDENTIALS), credentials);
      console.log('Credenciais do admin criadas com ID:', docRef.id);
    }
  } catch (error) {
    console.error('Erro ao atualizar credenciais do admin:', error);
    throw error;
  }
};

// Initialize default admin credentials
export const initializeAdminCredentials = async () => {
  try {
    const existing = await getAdminCredentials();
    if (!existing) {
      await addDoc(collection(db, COLLECTIONS.ADMIN_CREDENTIALS), {
        email: 'admin@deliciabom.com',
        password: 'admin123'
      });
      console.log('Credenciais padrão do admin criadas: admin@deliciabom.com / admin123');
    }
  } catch (error) {
    console.error('Erro ao inicializar credenciais do admin:', error);
  }
};

// Customer Notifications - Funções para enviar notificações aos clientes
export const saveCustomerNotification = async (notification: Omit<CustomerNotification, 'id'>) => {
  try {
    const notifData = { ...notification };
    if (notification.timestamp) {
      notifData.timestamp = Timestamp.fromDate(notification.timestamp);
    }
    const docRef = await addDoc(collection(db, COLLECTIONS.CUSTOMER_NOTIFICATIONS), notifData);
    console.log('Notificação de cliente salva:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar notificação de cliente:', error);
    throw error;
  }
};

export const getCustomerNotifications = (customerPhone: string, callback: (notifications: CustomerNotification[]) => void) => {
  const q = query(
    collection(db, COLLECTIONS.CUSTOMER_NOTIFICATIONS),
    where('customerPhone', '==', customerPhone),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })) as CustomerNotification[];
    callback(notifications);
  });
};

export const getCustomerNotificationsByOrderId = (orderId: string, callback: (notifications: CustomerNotification[]) => void) => {
  const q = query(
    collection(db, COLLECTIONS.CUSTOMER_NOTIFICATIONS),
    where('orderId', '==', orderId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })) as CustomerNotification[];
    callback(notifications);
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.CUSTOMER_NOTIFICATIONS, notificationId), {
      read: true
    });
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    throw error;
  }
};