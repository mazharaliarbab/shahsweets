import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { WeightVariant } from '../types';
import { ArrowLeft, MessageCircle, Sparkles, CheckCircle2, XCircle, Clock, Plus, Minus, MapPin } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductModal,
    setSelectedProductModal,
    createWhatsAppLink,
    setIsWhatsAppNoticeOpen,
    setPendingOrderSummary,
    goBack,
  } = useStore();

  const product = selectedProductModal;
  const [selectedVariant, setSelectedVariant] = useState<WeightVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Sync selected variant when product changes
  useEffect(() => {
    if (product && product.hasVariants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setQuantity(1);
  }, [product]);

  // Handle return back to product catalogue preserving scroll position and filters
  const handleBack = () => {
    if (!product) return;
    const currentProductId = product.id;
    goBack();
    setTimeout(() => {
      const el = document.getElementById(`product-${currentProductId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 40);
  };

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product?.id]);

  if (!product) return null;

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const totalPrice = currentPrice * quantity;

  const linkData = createWhatsAppLink(
    product,
    selectedVariant ? selectedVariant.label : undefined,
    currentPrice,
    quantity
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={handleBack}
    >
      <div
        className="relative w-full max-w-2xl bg-[#170509] border border-[#c99846]/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Only One Clean Back Option on Product */}
        <div className="sticky top-0 z-30 flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-[#130407]/95 backdrop-blur-md border-b border-[#c99846]/25">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#260810] hover:bg-[#3d0e19] text-[#e8c86a] hover:text-white border border-[#c99846]/45 transition-all cursor-pointer text-xs sm:text-sm font-bold shadow-md hover:scale-[1.02] active:scale-[0.98]"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-[#e8c86a]" />
            <span>Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-video sm:aspect-square md:aspect-auto md:h-full bg-[#120407] min-h-[260px] sm:min-h-[320px] overflow-hidden flex items-center justify-center">
            <img
              src={product.image || '/src/assets/images/category_mithai_1792472732632.jpg'}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/src/assets/images/category_mithai_1792472732632.jpg';
              }}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#170509] via-transparent to-transparent md:hidden" />
          </div>

          {/* Details & Interactive Controls */}
          <div className="p-5 sm:p-7 md:p-8 flex flex-col justify-between space-y-5 sm:space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#c99846]">
                  {product.category}
                </span>
                {product.isFeatured && (
                  <span className="inline-flex items-center gap-1 bg-[#c99846]/20 border border-[#c99846] text-[#e8c86a] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold font-serif-brand text-[#fdfaf4]">
                {product.name}
              </h2>

              <p className="text-xs sm:text-sm text-[#f8f1e3]/80 leading-relaxed">
                {product.description ||
                  `Authentic ${product.name} prepared fresh daily using pure ingredients and traditional recipes at Shah Sweets and Bakers in Shabqadar.`}
              </p>

              {/* Status Badge */}
              <div className="pt-1 flex items-center gap-2">
                {product.availability === 'in_stock' && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock in Shabqadar</span>
                  </span>
                )}
                {product.availability === 'out_of_stock' && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/80 border border-rose-500/40 px-2.5 py-1 rounded-full font-medium">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Currently Out of Stock</span>
                  </span>
                )}
                {product.availability === 'pre_order' && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded-full font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pre-order Required</span>
                  </span>
                )}
              </div>
            </div>

            {/* Weight / Portion Variants */}
            {product.hasVariants && product.variants && product.variants.length > 0 ? (
              <div className="space-y-2 pt-2 border-t border-[#c99846]/20">
                <label className="text-xs font-semibold text-[#e8c86a] uppercase tracking-wider block">
                  Select Weight / Portion
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#c99846] border-[#c99846] text-[#140508] font-bold shadow'
                            : 'bg-[#260810] border-[#c99846]/30 text-[#f8f1e3] hover:border-[#c99846]'
                        }`}
                      >
                        <div className="text-xs font-bold">{v.label}</div>
                        <div className={`text-[11px] ${isSelected ? 'text-[#140508]' : 'text-[#c99846]'}`}>
                          PKR {(Number(v.price) || 0).toLocaleString()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 pt-2 border-t border-[#c99846]/20">
                <span className="text-xs font-semibold text-[#e8c86a] uppercase tracking-wider block">
                  Portion Size
                </span>
                <div className="p-2.5 rounded-xl bg-[#260810] border border-[#c99846]/30 text-xs text-[#f8f1e3] flex items-center justify-between">
                  <span>Standard Fresh Batch Portion</span>
                  <span className="text-[#c99846] font-bold">
                    PKR {(Number(product.price) || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Quantity Selector & Price Breakdown */}
            <div className="pt-2 border-t border-[#c99846]/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#f8f1e3]/80">Quantity</span>
                <div className="flex items-center gap-3 bg-[#260810] border border-[#c99846]/30 px-3 py-1.5 rounded-xl">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-[#e8c86a] hover:text-white p-0.5 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold w-6 text-center text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-[#e8c86a] hover:text-white p-0.5 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Total Calculation in PKR */}
              <div className="flex items-center justify-between bg-[#260810]/70 p-3 rounded-xl border border-[#c99846]/20">
                <span className="text-xs text-[#f8f1e3]/70">Total Amount:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-[#c99846]">PKR</span>
                  <span className="text-2xl font-black font-crest text-[#fdfaf4]">
                    {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* WhatsApp Action Button */}
              {product.availability === 'out_of_stock' ? (
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-2xl bg-gray-700 opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Out of Stock</span>
                </button>
              ) : (
                <a
                  href={linkData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Order on WhatsApp (Shabqadar)</span>
                </a>
              )}

              <div className="text-[11px] text-center text-[#f8f1e3]/60 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3 text-[#c99846]" />
                <span>Direct inquiry with Shah Sweets and Bakers, Shabqadar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
