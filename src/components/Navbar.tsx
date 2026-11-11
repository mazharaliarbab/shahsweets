import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { BRAND_ASSETS } from '../data/initialData';
import { Product } from '../types';
import {
  Menu,
  X,
  Search,
  PhoneCall,
  ChevronDown,
  Sparkles,
  SearchX,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface SubCategoryItem {
  id: string;
  label: string;
  category?: string;
  query?: string;
  targetSection?: string;
}

interface NavCategoryItem {
  id: string;
  label: string;
  targetSection?: string;
  category?: string;
  query?: string;
  subcategories?: SubCategoryItem[];
}

const NAVIGATION_ITEMS: NavCategoryItem[] = [
  { id: 'home', label: 'HOME', targetSection: 'home' },
  {
    id: 'cakes',
    label: 'CAKES',
    category: 'Cakes & Pastries',
    subcategories: [
      { id: 'birthday-cakes', label: 'Birthday Cakes', category: 'Cakes & Pastries', query: 'Cake' },
      { id: 'wedding-cakes', label: 'Wedding Cakes', category: 'Cakes & Pastries', query: 'Cake' },
      { id: 'custom-cakes', label: 'Custom Cakes', category: 'Cakes & Pastries', query: 'Cake' },
    ],
  },
  {
    id: 'chocolates',
    label: 'CHOCOLATES',
    category: 'all',
    query: 'Chocolate',
    subcategories: [
      { id: 'chocolate-boxes', label: 'Chocolate Boxes', category: 'all', query: 'Chocolate' },
      { id: 'chocolate-truffles', label: 'Chocolate Truffles', category: 'all', query: 'Chocolate' },
      { id: 'chocolate-gift-hampers', label: 'Chocolate Gift Hampers', category: 'all', query: 'Gift' },
    ],
  },
  {
    id: 'bakery',
    label: 'BAKERY',
    category: 'Fresh Bakery & Savories',
    subcategories: [
      { id: 'pastries', label: 'Pastries', category: 'Cakes & Pastries', query: 'Pastry' },
      { id: 'cupcakes', label: 'Cupcakes', category: 'Cakes & Pastries', query: 'Cupcake' },
      { id: 'cookies', label: 'Dry Fruit Biscuits', category: 'Fresh Bakery & Savories', query: 'Biscuit' },
      { id: 'biscuits', label: 'Biscuits', category: 'Fresh Bakery & Savories', query: 'Biscuit' },
    ],
  },
  {
    id: 'sweets',
    label: 'SWEETS',
    category: 'Traditional Mithai',
    subcategories: [
      { id: 'traditional-sweets', label: 'Traditional Sweets', category: 'Traditional Mithai', query: '' },
      { id: 'sweet-boxes', label: 'Sweet Boxes', category: 'Traditional Mithai', query: 'Box' },
    ],
  },
  { id: 'about', label: 'ABOUT US', targetSection: 'about' },
  { id: 'locations', label: 'LOCATIONS', targetSection: 'location' },
  { id: 'contact', label: 'CONTACT', targetSection: 'phone-numbers' },
];

export const Navbar: React.FC = () => {
  const {
    products,
    activeNav,
    setActiveNav,
    setSearchQuery,
    setSelectedCategory,
    setSelectedProductModal,
    settings,
    goBack,
    canGoBack,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<Record<string, boolean>>({});

  // Search Overlay State
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const whatsAppDigits =
    (settings.whatsAppNumber || '+92 305 9898409').replace(/[^0-9]/g, '') ||
    '923059898409';

  // Focus search input when search modal opens
  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [searchModalOpen]);

  // Handle ESC key to close search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen]);

  const toggleMobileExpand = (id: string) => {
    setExpandedMobile((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleItemSelect = (item: {
    id: string;
    targetSection?: string;
    category?: string;
    query?: string;
  }) => {
    setActiveNav(item.id);
    setMobileMenuOpen(false);
    setActiveDropdown(null);

    if (item.category !== undefined) {
      setSelectedCategory(item.category);
    }
    if (item.query !== undefined) {
      setSearchQuery(item.query);
    }

    if (item.targetSection === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetId = item.targetSection || 'products';
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter actual products based on search keyword
  const trimmedKeyword = searchKeyword.trim().toLowerCase();
  const matchingProducts = trimmedKeyword
    ? products.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(trimmedKeyword);
        const catMatch = p.category.toLowerCase().includes(trimmedKeyword);
        const descMatch = Boolean(p.description && p.description.toLowerCase().includes(trimmedKeyword));
        return nameMatch || catMatch || descMatch;
      })
    : [];

  // When a visitor clicks a product result, open its actual detail view
  const handleOpenProduct = (product: Product) => {
    setSearchModalOpen(false);
    setSearchKeyword('');
    setSelectedProductModal(product);
  };

  // Submit search form
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmedKeyword) return;

    if (matchingProducts.length === 1) {
      handleOpenProduct(matchingProducts[0]);
      return;
    }

    // Filter catalogue and scroll to products
    setSearchQuery(searchKeyword.trim());
    setSearchModalOpen(false);
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#16060a]/95 backdrop-blur-md border-b border-[#c99846]/25 shadow-xl transition-all w-full max-w-full overflow-x-clip">
        {/* Main Navigation Bar — First visible section (Top info bar removed per instruction) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-20 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* 1. Logo & Restored Brand Name Beside Logo */}
              <button
                onClick={() => handleItemSelect({ id: 'home', targetSection: 'home' })}
                className="flex items-center gap-2.5 sm:gap-3.5 text-left group cursor-pointer"
              >
                {/* Existing Circular Logo */}
                <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-[#e8c86a] via-[#c99846] to-[#4f1220] shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <img
                    src={BRAND_ASSETS.logo}
                    alt="Shah Sweets and Bakers Emblem Logo"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Restored Brand Name Beside Logo */}
                <div className="flex flex-col">
                  <span className="font-crest text-xs sm:text-sm md:text-base font-bold tracking-wider text-[#e8c86a] group-hover:text-white transition-colors uppercase leading-tight whitespace-nowrap">
                    SHAH SWEETS &amp; BAKERS
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.2em] uppercase text-[#f8f1e3]/70">
                    Shabqadar
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links with Category Dropdowns */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
              {NAVIGATION_ITEMS.map((item) => {
                const hasSubs = Boolean(item.subcategories && item.subcategories.length > 0);
                const isItemActive = activeNav === item.id;
                const isDropdownOpen = activeDropdown === item.id;

                return (
                  <div
                    key={item.id}
                    className="relative group"
                    onMouseEnter={() => hasSubs && setActiveDropdown(item.id)}
                    onMouseLeave={() => hasSubs && setActiveDropdown(null)}
                  >
                    <button
                      onClick={() => handleItemSelect(item)}
                      className={`flex items-center gap-1 px-2 xl:px-2.5 py-2 rounded-lg text-xs xl:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                        isItemActive || isDropdownOpen
                          ? 'text-[#e8c86a] bg-[#380d16]/80 border border-[#c99846]/40 shadow-sm'
                          : 'text-[#f8f1e3]/85 hover:text-[#e8c86a] hover:bg-[#280911]/50'
                      }`}
                      aria-expanded={hasSubs ? isDropdownOpen : undefined}
                    >
                      <span>{item.label}</span>
                      {hasSubs && (
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 text-[#c99846] ${
                            isDropdownOpen ? 'rotate-180 text-[#e8c86a]' : ''
                          }`}
                        />
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {hasSubs && (
                      <div
                        className={`absolute top-full left-0 mt-1 w-48 xl:w-56 bg-[#1a060c]/98 backdrop-blur-xl border border-[#c99846]/40 rounded-xl shadow-2xl py-2 z-50 transition-all duration-200 ${
                          isDropdownOpen
                            ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                            : 'opacity-0 -translate-y-2 pointer-events-none invisible'
                        }`}
                      >
                        <div className="px-3 py-1.5 border-b border-[#c99846]/20 mb-1">
                          <button
                            onClick={() => handleItemSelect(item)}
                            className="text-[11px] font-bold text-[#c99846] hover:text-[#e8c86a] uppercase tracking-wider flex items-center justify-between w-full cursor-pointer"
                          >
                            <span>All {item.label}</span>
                            <span className="text-[10px] text-[#f8f1e3]/50">View all →</span>
                          </button>
                        </div>

                        {item.subcategories?.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleItemSelect(sub)}
                            className="w-full text-left px-3.5 py-2 text-xs text-[#f8f1e3]/90 hover:text-white hover:bg-[#340b15] hover:pl-4 transition-all duration-150 flex items-center justify-between cursor-pointer group/sub"
                          >
                            <span>{sub.label}</span>
                            <span className="text-[#c99846]/0 group-hover/sub:text-[#c99846] transition-colors text-[10px]">
                              •
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Header Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* 4. Functional Search Icon Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 sm:p-2.5 rounded-full text-[#e8c86a] hover:text-white bg-[#260810] hover:bg-[#380d16] border border-[#c99846]/35 hover:border-[#c99846] transition-all cursor-pointer shadow-md"
                title="Search cakes, sweets, bakery items..."
                aria-label="Open Product Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Quick Order Contact Button */}
              <a
                href={`https://wa.me/${whatsAppDigits}?text=${encodeURIComponent(
                  'Assalam-o-Alaikum Shah Sweets and Bakers, I would like to order in Shabqadar.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#c99846] to-[#a8792c] hover:from-[#e8c86a] hover:to-[#c99846] text-[#140508] font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>+92 305 9898409</span>
              </a>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-[#f8f1e3] hover:text-[#e8c86a] hover:bg-[#380d16] transition-colors cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6 text-[#e8c86a]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu with Clean Expandable Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#18070c] border-b border-[#c99846]/30 px-4 pt-3 pb-6 space-y-1.5 animate-fade-in max-h-[85vh] overflow-y-auto">
            {/* Search Trigger in Mobile Drawer */}
            <div className="pb-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#260810] border border-[#c99846]/40 text-[#f8f1e3]/80 hover:text-white text-xs"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#c99846]" />
                  <span>Search cakes, sweets, bakery items...</span>
                </div>
                <span className="text-[10px] text-[#e8c86a] bg-[#380d16] px-2 py-0.5 rounded font-bold">
                  Search
                </span>
              </button>
            </div>

            {NAVIGATION_ITEMS.map((item) => {
              const hasSubs = Boolean(item.subcategories && item.subcategories.length > 0);
              const isExpanded = Boolean(expandedMobile[item.id]);
              const isItemActive = activeNav === item.id;

              if (!hasSubs) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                      isItemActive
                        ? 'bg-[#3b0e17] text-[#e8c86a] border border-[#c99846]/40'
                        : 'text-[#f8f1e3] hover:bg-[#280911]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              }

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#c99846]/20 bg-[#1e070e]/60 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3">
                    <button
                      onClick={() => handleItemSelect(item)}
                      className="flex-1 text-left text-sm font-semibold tracking-wide uppercase text-[#f8f1e3] hover:text-[#e8c86a] cursor-pointer"
                    >
                      {item.label}
                    </button>
                    <button
                      onClick={() => toggleMobileExpand(item.id)}
                      className="p-1.5 rounded-lg text-[#c99846] hover:bg-[#2e0b14] transition-colors cursor-pointer"
                      aria-label={`Toggle ${item.label} subcategories`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-[#e8c86a]' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-[#c99846]/15 bg-[#140408]/70 px-3 py-2 space-y-1">
                      <button
                        onClick={() => handleItemSelect(item)}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-[#c99846] hover:text-[#e8c86a] border-l-2 border-[#c99846] pl-3 cursor-pointer"
                      >
                        All {item.label} →
                      </button>
                      {item.subcategories?.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleItemSelect(sub)}
                          className="w-full text-left px-3 py-2 text-xs text-[#f8f1e3]/80 hover:text-white hover:bg-[#280911] rounded-lg transition-colors border-l border-[#c99846]/30 pl-3 cursor-pointer"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Direct Mobile Call / WhatsApp Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <a
                href={`tel:${settings.phoneNumber || '+923059898409'}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#280911] text-[#e8c86a] border border-[#c99846]/30 text-xs font-bold"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Phone</span>
              </a>
              <a
                href={`https://wa.me/${whatsAppDigits}?text=${encodeURIComponent(
                  'Assalam-o-Alaikum Shah Sweets and Bakers, I would like to order in Shabqadar.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow"
              >
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 border-t border-[#c99846]/20">
              <button
                onClick={() => {
                  setActiveNav('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-[#e8c86a] bg-[#280911] border border-[#c99846]/30 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#c99846]" />
                  <span>Admin Management Dashboard</span>
                </span>
                <span className="text-xs bg-[#c99846] text-[#140508] px-2 py-0.5 rounded font-bold">
                  Manage
                </span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 4. Full-Featured Product Search Modal & Suggestions Overlay */}
      {searchModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#170509] border border-[#c99846]/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="p-4 sm:p-5 border-b border-[#c99846]/25 bg-[#130407]">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-[#c99846] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search cakes, sweets, bakery items..."
                  className="w-full bg-transparent text-sm sm:text-base text-[#fdfaf4] placeholder-[#f8f1e3]/45 focus:outline-none"
                  aria-label="Search cakes, sweets, bakery items"
                />
                {searchKeyword && (
                  <button
                    type="button"
                    onClick={() => setSearchKeyword('')}
                    className="p-1 rounded-full text-[#f8f1e3]/60 hover:text-white hover:bg-[#280911] transition-colors cursor-pointer"
                    aria-label="Clear search input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-[#c99846] hover:bg-[#e8c86a] text-[#140508] font-bold text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-1.5 rounded-full text-[#f8f1e3]/70 hover:text-white bg-[#260810] hover:bg-[#3d0e19] border border-[#c99846]/30 transition-colors cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex items-center gap-1.5 flex-wrap pt-3 text-[11px] text-[#f8f1e3]/70">
                <span className="text-[#c99846] font-semibold">Popular:</span>
                {['Cake', 'Biscuit', 'Mix Mathai', 'Almond Biscuit', 'Pastry', 'Chocolate'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchKeyword(term)}
                    className="px-2 py-0.5 rounded-full bg-[#260810] hover:bg-[#3d0e19] border border-[#c99846]/25 text-[#f8f1e3]/80 hover:text-[#e8c86a] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>

            {/* Results & Suggestions List */}
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#c99846]/15 p-2 sm:p-3">
              {trimmedKeyword === '' ? (
                <div className="py-10 px-4 text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-[#c99846] mx-auto opacity-70" />
                  <p className="text-sm font-semibold text-[#fdfaf4]">
                    Type a delicacy name to discover fresh sweets, cakes &amp; bakery
                  </p>
                  <p className="text-xs text-[#f8f1e3]/60 max-w-md mx-auto">
                    Live real-time search across Shah Sweets &amp; Bakers handcrafted menu in Shabqadar.
                  </p>
                </div>
              ) : matchingProducts.length > 0 ? (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#c99846] px-3 py-1 flex items-center justify-between">
                    <span>Matching Products ({matchingProducts.length})</span>
                    <span className="text-[10px] text-[#f8f1e3]/50">Click to view details</span>
                  </div>

                  {matchingProducts.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleOpenProduct(prod)}
                      className="w-full p-2.5 sm:p-3 rounded-2xl bg-[#1d060d] hover:bg-[#2b0c15] border border-[#c99846]/20 hover:border-[#c99846]/70 transition-all flex items-center gap-3.5 text-left group cursor-pointer shadow-sm"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-[#120407] border border-[#c99846]/30 shrink-0 flex items-center justify-center">
                        <img
                          src={prod.image || BRAND_ASSETS.categoryMithai}
                          alt={prod.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = BRAND_ASSETS.categoryMithai;
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-serif-brand font-bold text-sm sm:text-base text-white group-hover:text-[#e8c86a] transition-colors truncate">
                            {prod.name}
                          </h4>
                          {prod.isFeatured && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#c99846]/20 text-[#e8c86a] border border-[#c99846]/40">
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] sm:text-xs text-[#f8f1e3]/65 truncate">
                          {prod.description || `${prod.category} prepared fresh daily.`}
                        </p>

                        <div className="flex items-center gap-3 pt-0.5">
                          <span className="text-xs font-bold text-[#c99846]">
                            PKR {(Number(prod.price) || 0).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#f8f1e3]/50">
                            • {prod.category}
                          </span>
                        </div>
                      </div>

                      {/* View Action Pill */}
                      <div className="shrink-0 hidden xs:flex items-center gap-1 text-xs font-semibold text-[#e8c86a] group-hover:text-white transition-colors bg-[#260810] px-3 py-1.5 rounded-full border border-[#c99846]/30">
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 px-4 text-center space-y-3">
                  <SearchX className="w-10 h-10 text-[#c99846]/60 mx-auto" />
                  <h4 className="text-base font-bold font-serif-brand text-[#fdfaf4]">
                    No delicacies found for &ldquo;{searchKeyword}&rdquo;
                  </h4>
                  <p className="text-xs sm:text-sm text-[#f8f1e3]/65 max-w-sm mx-auto">
                    We couldn&rsquo;t find any cakes, sweets, or bakery items matching your search. Please try another keyword or browse our full catalogue.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchModalOpen(false);
                      setSearchKeyword('');
                      setSelectedCategory('all');
                      setSearchQuery('');
                      const el = document.getElementById('products');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-2 px-4 py-2 rounded-full bg-[#3b0e17] hover:bg-[#501320] text-[#e8c86a] border border-[#c99846]/40 text-xs font-bold transition-all cursor-pointer"
                  >
                    Browse All Delicacies
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
