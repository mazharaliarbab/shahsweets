import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { BRAND_ASSETS } from '../../data/initialData';
import { ProductFormModal } from './ProductFormModal';
import { CategoryManager } from './CategoryManager';
import { OffersManager } from './OffersManager';
import { SettingsManager } from './SettingsManager';
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  Tag,
  Settings,
  LogOut,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Store,
  Menu,
  X,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';

type AdminTab = 'overview' | 'products' | 'categories' | 'offers' | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    offers,
    settings,
    logoutAdmin,
    setActiveNav,
    deleteProduct,
    goBack,
  } = useStore();

  const [currentTab, setCurrentTab] = useState<AdminTab>('products');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Product management state
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filtered products for admin table
  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesQ =
      !searchFilter ||
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesQ;
  });

  const inStockCount = products.filter((p) => p.availability === 'in_stock').length;
  const featuredCount = products.filter((p) => p.isFeatured).length;

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      showToast(`Product "${productToDelete.name}" deleted successfully.`);
      setProductToDelete(null);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Mithai', icon: UtensilsCrossed },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'offers', label: 'Special Offers', icon: Tag },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0d0406] text-[#f8f1e3] flex flex-col lg:flex-row">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#18060b] border-b border-[#c99846]/25 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={BRAND_ASSETS.logo}
            alt="Logo"
            className="w-10 h-10 rounded-full border border-[#c99846]"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="font-crest font-bold text-sm text-[#fdfaf4]">SHAH SWEETS</div>
            <div className="text-[10px] text-[#c99846]">Admin Portal</div>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-[#e8c86a] hover:bg-[#280911] rounded-lg cursor-pointer"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-full w-64 bg-[#140407] border-r border-[#c99846]/25 p-5 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-[#c99846]/20">
            <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#e8c86a] to-[#4f1220] shrink-0">
              <img
                src={BRAND_ASSETS.logo}
                alt="Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-crest font-bold text-sm text-[#fdfaf4]">SHAH SWEETS</div>
              <div className="text-[10px] uppercase tracking-wider text-[#c99846]">
                Shabqadar Admin
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id as AdminTab);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#3b0e17] text-[#e8c86a] border border-[#c99846]/40 shadow-sm'
                      : 'text-[#f8f1e3]/75 hover:bg-[#22070e] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#c99846]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: View Store & Logout */}
        <div className="space-y-2 pt-5 border-t border-[#c99846]/20">
          <button
            onClick={goBack}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#e8c86a] bg-[#1e070e] hover:bg-[#2e0b15] border border-[#c99846]/30 transition-all cursor-pointer shadow-sm"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 text-[#c99846]" />
              <span>Back to Store</span>
            </span>
            <ExternalLink className="w-3 h-3 text-[#f8f1e3]/60" />
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-950/50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {/* OVERVIEW TAB */}
        {currentTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-[#fdfaf4]">
                Bakery Overview
              </h2>
              <p className="text-xs text-[#c99846]">
                Real-time snapshot of products, categories, and business settings
              </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#1b070d] border border-[#c99846]/30 p-5 rounded-2xl space-y-1">
                <div className="text-xs text-[#f8f1e3]/70">Total Products</div>
                <div className="text-3xl font-bold font-crest text-[#e8c86a]">
                  {products.length}
                </div>
              </div>

              <div className="bg-[#1b070d] border border-[#c99846]/30 p-5 rounded-2xl space-y-1">
                <div className="text-xs text-[#f8f1e3]/70">Active In Stock</div>
                <div className="text-3xl font-bold font-crest text-emerald-400">
                  {inStockCount}
                </div>
              </div>

              <div className="bg-[#1b070d] border border-[#c99846]/30 p-5 rounded-2xl space-y-1">
                <div className="text-xs text-[#f8f1e3]/70">Categories</div>
                <div className="text-3xl font-bold font-crest text-[#e8c86a]">
                  {categories.length}
                </div>
              </div>

              <div className="bg-[#1b070d] border border-[#c99846]/30 p-5 rounded-2xl space-y-1">
                <div className="text-xs text-[#f8f1e3]/70">Special Offers</div>
                <div className="text-3xl font-bold font-crest text-[#e8c86a]">
                  {offers.filter((o) => o.active).length}
                </div>
              </div>
            </div>

            {/* Quick Actions & Store Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#18060b] border border-[#c99846]/30 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-[#fdfaf4] font-serif-brand">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setIsProductModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#280911] hover:bg-[#3b0e18] border border-[#c99846]/30 text-xs font-semibold text-[#e8c86a] transition-all cursor-pointer"
                  >
                    <span>Add New Sweet or Bakery Item</span>
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentTab('settings')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#280911] hover:bg-[#3b0e18] border border-[#c99846]/30 text-xs font-semibold text-[#f8f1e3] transition-all cursor-pointer"
                  >
                    <span>Update WhatsApp Contact &amp; Hours</span>
                    <Settings className="w-4 h-4 text-[#c99846]" />
                  </button>
                  <button
                    onClick={() => setCurrentTab('offers')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#280911] hover:bg-[#3b0e18] border border-[#c99846]/30 text-xs font-semibold text-[#f8f1e3] transition-all cursor-pointer"
                  >
                    <span>Manage Promotional Offers</span>
                    <Tag className="w-4 h-4 text-[#c99846]" />
                  </button>
                </div>
              </div>

              <div className="bg-[#18060b] border border-[#c99846]/30 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-[#fdfaf4] font-serif-brand">
                  Store Status &amp; Timings
                </h3>
                <div className="space-y-2.5 text-xs text-[#f8f1e3]/80">
                  <div className="flex items-center justify-between py-1 border-b border-[#c99846]/15">
                    <span>Business Name:</span>
                    <span className="font-semibold text-white">{settings.businessName}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#c99846]/15">
                    <span>Location:</span>
                    <span className="font-semibold text-white">{settings.location}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#c99846]/15">
                    <span>Closing Time:</span>
                    <span className="font-semibold text-[#e8c86a]">{settings.closingTime}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#c99846]/15">
                    <span>Phone &amp; WhatsApp:</span>
                    <span className="font-semibold text-[#e8c86a]">
                      {settings.whatsAppNumber || '+92 305 9898409'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Google Review Rating:</span>
                    <span className="font-semibold text-[#e8c86a]">
                      ★ {settings.rating} / 5.0 ({settings.reviewsCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS MANAGEMENT TAB */}
        {currentTab === 'products' && (
          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-[#fdfaf4]">
                  Product Catalogue Management
                </h2>
                <p className="text-xs text-[#c99846]">
                  Add, edit, delete, and configure weight-based pricing in Pakistani Rupees
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#c99846] to-[#a8792c] hover:brightness-110 text-[#140508] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-xl transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Search & Category Filter Toolbar */}
            <div className="bg-[#18060b] border border-[#c99846]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#c99846] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter products..."
                  className="w-full bg-[#240810] border border-[#c99846]/30 rounded-xl pl-9 pr-4 py-2 text-xs text-[#fdfaf4] focus:outline-none focus:border-[#e8c86a]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-[#f8f1e3]/60">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#240810] border border-[#c99846]/30 rounded-xl px-3 py-2 text-xs text-[#fdfaf4] focus:outline-none focus:border-[#e8c86a] cursor-pointer"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#18060b] border border-[#c99846]/30 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#240810] text-[#e8c86a] uppercase tracking-wider text-[11px] border-b border-[#c99846]/25">
                    <tr>
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Base Price</th>
                      <th className="py-3.5 px-4">Weight Variants</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c99846]/15">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#22070e] transition-colors">
                        {/* Name & Photo */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0 border border-[#c99846]/25">
                              <img
                                src={p.image || BRAND_ASSETS.categoryMithai}
                                alt={p.name}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = BRAND_ASSETS.categoryMithai;
                                }}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-[#fdfaf4]">{p.name}</div>
                              {p.isFeatured && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-[#e8c86a] bg-[#3b0e17] px-1.5 py-0.5 rounded">
                                  <Sparkles className="w-2.5 h-2.5" /> Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-[#f8f1e3]/80">{p.category}</td>

                        {/* Price */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#e8c86a]">
                            PKR {p.price.toLocaleString()}
                          </span>
                        </td>

                        {/* Variants */}
                        <td className="py-3 px-4">
                          {p.hasVariants && p.variants.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {p.variants.map((v) => (
                                <span
                                  key={v.id}
                                  className="text-[10px] bg-[#280911] text-[#f8f1e3] px-1.5 py-0.5 rounded border border-[#c99846]/20"
                                >
                                  {v.label}: PKR {v.price}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#f8f1e3]/50">Standard only</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          {p.availability === 'in_stock' && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full font-semibold">
                              <CheckCircle2 className="w-3 h-3" /> In Stock
                            </span>
                          )}
                          {p.availability === 'out_of_stock' && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-full font-semibold">
                              <XCircle className="w-3 h-3" /> Out of Stock
                            </span>
                          )}
                          {p.availability === 'pre_order' && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full font-semibold">
                              <Clock className="w-3 h-3" /> Pre-order
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setIsProductModalOpen(true);
                              }}
                              className="p-1.5 text-[#e8c86a] hover:bg-[#380e18] rounded-lg transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setProductToDelete(p)}
                              className="p-1.5 text-rose-400 hover:bg-rose-950 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {currentTab === 'categories' && <CategoryManager />}

        {/* OFFERS TAB */}
        {currentTab === 'offers' && <OffersManager />}

        {/* SETTINGS TAB */}
        {currentTab === 'settings' && <SettingsManager />}
      </main>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <ProductFormModal
          initialProduct={editingProduct}
          onClose={() => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSaved={() => {
            showToast(
              editingProduct
                ? 'Product updated successfully.'
                : 'New product added to public catalogue.'
            );
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1a060b] border border-[#c99846]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold font-serif-brand text-white">
                Delete Product?
              </h3>
              <p className="text-xs text-[#f8f1e3]/75">
                Are you sure you want to remove &ldquo;{productToDelete.name}&rdquo; from the catalogue? This will immediately remove it from the public website.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl bg-[#280911] text-[#f8f1e3]/80 text-xs font-semibold hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg cursor-pointer"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
