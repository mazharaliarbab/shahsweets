import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, SpecialOffer, BusinessSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_OFFERS, INITIAL_SETTINGS, BRAND_ASSETS } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'shah_sweets_products_v1',
  CATEGORIES: 'shah_sweets_categories_v1',
  OFFERS: 'shah_sweets_offers_v1',
  SETTINGS: 'shah_sweets_settings_v1',
  AUTH: 'shah_sweets_admin_auth_v1',
};

interface StoreContextType {
  products: Product[];
  categories: Category[];
  offers: SpecialOffer[];
  settings: BusinessSettings;
  isAdmin: boolean;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProductModal: Product | null;
  setSelectedProductModal: (prod: Product | null) => void;
  isWhatsAppNoticeOpen: boolean;
  setIsWhatsAppNoticeOpen: (open: boolean) => void;
  pendingOrderSummary: { text: string; productTitle: string } | null;
  setPendingOrderSummary: (val: { text: string; productTitle: string } | null) => void;

  // Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addOffer: (offer: Omit<SpecialOffer, 'id'>) => void;
  updateOffer: (id: string, updates: Partial<SpecialOffer>) => void;
  deleteOffer: (id: string) => void;

  updateSettings: (updates: Partial<BusinessSettings>) => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  resetToDefaults: () => void;
  createWhatsAppLink: (
    product?: Product,
    variantLabel?: string,
    variantPrice?: number,
    quantity?: number,
    customMessage?: string
  ) => {
    isConfigured: boolean;
    cleanNumber: string;
    url: string;
    encodedMessage: string;
    rawMessage: string;
  };
  canGoBack: boolean;
  goBack: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: any) => ({
            ...p,
            price: Number(p.price) || 0,
            image: p.image || BRAND_ASSETS.categoryMithai,
            variants: Array.isArray(p.variants) ? p.variants : [],
            hasVariants: Boolean(p.hasVariants),
            availability: p.availability || 'in_stock',
          }));
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [offers, setOffers] = useState<SpecialOffer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OFFERS);
      return saved ? JSON.parse(saved) : INITIAL_OFFERS;
    } catch {
      return INITIAL_OFFERS;
    }
  });

  const [settings, setSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          location: parsed.location && parsed.location.includes('Peshawar Road') ? parsed.location : INITIAL_SETTINGS.location,
          address: parsed.address || INITIAL_SETTINGS.address,
          googleMapsQueryUrl: parsed.googleMapsQueryUrl && parsed.googleMapsQueryUrl.includes('destination=') ? parsed.googleMapsQueryUrl : INITIAL_SETTINGS.googleMapsQueryUrl,
          googleMapsPlaceUrl: parsed.googleMapsPlaceUrl || INITIAL_SETTINGS.googleMapsPlaceUrl,
          whatsAppNumber: (parsed.whatsAppNumber && parsed.whatsAppNumber.length >= 7) ? parsed.whatsAppNumber : INITIAL_SETTINGS.whatsAppNumber,
          phoneNumber: (parsed.phoneNumber && parsed.phoneNumber.length >= 7) ? parsed.phoneNumber : INITIAL_SETTINGS.phoneNumber,
          phoneConfigured: true,
        };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [activeNav, setActiveNavState] = useState<string>('home');
  const [selectedCategory, setSelectedCategoryState] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductModal, setSelectedProductModalState] = useState<Product | null>(null);
  const [isWhatsAppNoticeOpen, setIsWhatsAppNoticeOpen] = useState<boolean>(false);
  const [pendingOrderSummary, setPendingOrderSummary] = useState<{ text: string; productTitle: string } | null>(null);

  interface NavSnapshot {
    nav: string;
    category: string;
    search: string;
    scrollY: number;
  }
  const [navHistory, setNavHistory] = useState<NavSnapshot[]>([]);
  const isBackInProgressRef = React.useRef(false);

  const setActiveNav = (nav: string) => {
    if (!isBackInProgressRef.current && nav !== activeNav) {
      setNavHistory((prev) => [
        ...prev,
        {
          nav: activeNav,
          category: selectedCategory,
          search: searchQuery,
          scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
        },
      ]);
      try {
        window.history.pushState({ nav, category: selectedCategory }, '', nav === 'home' ? '/' : `#${nav}`);
      } catch (e) {
        // ignore
      }
    }
    setActiveNavState(nav);
  };

  const setSelectedCategory = (cat: string) => {
    if (!isBackInProgressRef.current && cat !== selectedCategory) {
      setNavHistory((prev) => [
        ...prev,
        {
          nav: activeNav,
          category: selectedCategory,
          search: searchQuery,
          scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
        },
      ]);
    }
    setSelectedCategoryState(cat);
  };

  const lastScrollYRef = React.useRef<number>(0);

  const setSelectedProductModal = (prod: Product | null) => {
    if (!isBackInProgressRef.current) {
      if (prod) {
        if (typeof window !== 'undefined') {
          lastScrollYRef.current = window.scrollY;
        }
        try {
          window.history.pushState({ productModal: prod.id }, '', `#view-${prod.id}`);
        } catch (e) {
          // ignore
        }
      }
    }
    setSelectedProductModalState(prod);
  };

  const canGoBack =
    Boolean(selectedProductModal) ||
    isWhatsAppNoticeOpen ||
    activeNav !== 'home' ||
    selectedCategory !== 'all' ||
    Boolean(searchQuery) ||
    navHistory.length > 0;

  const goBack = (isFromPopState = false) => {
    // 1. If product modal is open, close it and restore scroll position
    if (selectedProductModal) {
      const closedProductId = selectedProductModal.id;
      const targetScroll = lastScrollYRef.current;
      setSelectedProductModalState(null);
      if (!isFromPopState && window.location.hash.startsWith('#view-')) {
        try {
          window.history.back();
        } catch (e) {}
      }
      setTimeout(() => {
        const el = document.getElementById(`product-${closedProductId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        } else if (typeof window !== 'undefined') {
          window.scrollTo({ top: targetScroll, behavior: 'auto' });
        }
      }, 20);
      return;
    }

    // 2. If WhatsApp notice dialog is open, close it
    if (isWhatsAppNoticeOpen) {
      setIsWhatsAppNoticeOpen(false);
      return;
    }

    // 3. If in Admin, return to public store
    if (activeNav === 'admin') {
      setActiveNav('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 4. If search query is active, clear it
    if (searchQuery) {
      setSearchQuery('');
      return;
    }

    // 5. If category filter is active, reset to 'all'
    if (selectedCategory !== 'all') {
      setSelectedCategoryState('all');
      return;
    }

    // 6. If history stack has previous pages/views, restore previous
    if (navHistory.length > 0) {
      isBackInProgressRef.current = true;
      const prev = navHistory[navHistory.length - 1];
      setNavHistory((stack) => stack.slice(0, -1));
      setActiveNavState(prev.nav);
      setSelectedCategoryState(prev.category);
      setSearchQuery(prev.search);
      if (typeof window !== 'undefined' && prev.scrollY !== undefined) {
        window.scrollTo({ top: prev.scrollY, behavior: 'smooth' });
      }
      setTimeout(() => {
        isBackInProgressRef.current = false;
      }, 60);
      return;
    }

    // 7. Otherwise trigger standard browser history back
    if (!isFromPopState && window.history.length > 1) {
      window.history.back();
    } else {
      setActiveNavState('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync with browser native back button (popstate event)
  useEffect(() => {
    const handlePopState = () => {
      goBack(true);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  });

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
    } catch (e) {
      console.error('Failed to save offers', e);
    }
  }, [offers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [settings]);

  // Product actions
  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `prod-${Date.now()}`;
    const product: Product = {
      ...newProd,
      id,
      price: Number(newProd.price) || 0,
      image: newProd.image?.trim() || BRAND_ASSETS.categoryMithai,
      variants: Array.isArray(newProd.variants) ? newProd.variants : [],
      hasVariants: Boolean(newProd.hasVariants && newProd.variants && newProd.variants.length > 0),
      availability: newProd.availability || 'in_stock',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              price: updates.price !== undefined ? (Number(updates.price) || 0) : item.price,
              image: updates.image !== undefined ? (updates.image?.trim() || item.image) : item.image,
              variants: updates.variants !== undefined ? (Array.isArray(updates.variants) ? updates.variants : []) : item.variants,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  // Category actions
  const addCategory = (newCat: Omit<Category, 'id'>) => {
    const id = `cat-${Date.now()}`;
    setCategories((prev) => [...prev, { ...newCat, id }]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  // Offer actions
  const addOffer = (newOffer: Omit<SpecialOffer, 'id'>) => {
    const id = `offer-${Date.now()}`;
    setOffers((prev) => [...prev, { ...newOffer, id }]);
  };

  const updateOffer = (id: string, updates: Partial<SpecialOffer>) => {
    setOffers((prev) =>
      prev.map((off) => (off.id === id ? { ...off, ...updates } : off))
    );
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((off) => off.id !== id));
  };

  // Settings
  const updateSettings = (updates: Partial<BusinessSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  // Admin Auth
  const loginAdmin = (password: string): boolean => {
    // Default master pass key is 'shah1234' or saved password
    const validPassword = settings.adminPasswordHash || 'shah1234';
    if (password === validPassword) {
      setIsAdmin(true);
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      } catch (e) {
        console.error(e);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (e) {
      console.error(e);
    }
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOffers(INITIAL_OFFERS);
    setSettings(INITIAL_SETTINGS);
  };

  // WhatsApp order builder
  const createWhatsAppLink = (
    product?: Product,
    variantLabel?: string,
    variantPrice?: number,
    quantity: number = 1,
    customMessage?: string
  ) => {
    // Exact business WhatsApp number with country code, without +, spaces, brackets, or hyphens
    const rawNumber = settings.whatsAppNumber || '+92 305 9898409';
    let digits = rawNumber.replace(/[^0-9]/g, '');
    if (digits.startsWith('0092')) {
      digits = digits.slice(2);
    } else if (digits.startsWith('0') && digits.length === 11) {
      digits = '92' + digits.slice(1);
    }
    const cleanNumber = (digits && digits.length >= 10) ? digits : '923059898409';

    let rawMessage = customMessage || `Assalam-o-Alaikum Shah Sweets and Bakers,
I would like to inquire about your sweets and bakery products in Shabqadar.`;

    if (product) {
      const selectedVariantText = variantLabel ? `Variant: ${variantLabel}` : `Standard item`;
      const singlePrice = variantPrice !== undefined ? variantPrice : product.price;
      const totalCost = singlePrice * quantity;

      rawMessage = `Assalam-o-Alaikum Shah Sweets and Bakers,
I would like to place an order from your website:

• Item: ${product.name}
• ${selectedVariantText}
• Quantity: ${quantity}
• Unit Price: PKR ${singlePrice.toLocaleString()}
• Total Amount: PKR ${totalCost.toLocaleString()}

Please confirm availability and pickup/delivery details for Shabqadar.
Thank you!`;
    }

    const encodedMessage = encodeURIComponent(rawMessage.trim());
    const url = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    return {
      isConfigured: true,
      cleanNumber,
      url,
      encodedMessage,
      rawMessage,
    };
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        offers,
        settings,
        isAdmin,
        activeNav,
        setActiveNav,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProductModal,
        setSelectedProductModal,
        isWhatsAppNoticeOpen,
        setIsWhatsAppNoticeOpen,
        pendingOrderSummary,
        setPendingOrderSummary,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addOffer,
        updateOffer,
        deleteOffer,
        updateSettings,
        loginAdmin,
        logoutAdmin,
        resetToDefaults,
        createWhatsAppLink,
        canGoBack,
        goBack,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
