import React, { useState } from 'react';
import { Product, WeightVariant } from '../types';
import { useStore } from '../context/StoreContext';
import { BRAND_ASSETS } from '../data/initialData';
import { MessageCircle, Sparkles, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

// Helper: Split name into English and Urdu parts if available "English Name (اردو نام)"
const parseProductTitle = (fullName: string): { english: string; urdu: string } => {
  const match = fullName.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return {
      english: match[1].trim(),
      urdu: match[2].trim(),
    };
  }
  return {
    english: fullName.trim(),
    urdu: '',
  };
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProductModal, createWhatsAppLink } = useStore();

  // If variants exist, initialize selected variant to first variant
  const [selectedVariant, setSelectedVariant] = useState<WeightVariant | null>(
    product.hasVariants && product.variants.length > 0 ? product.variants[0] : null
  );

  // Dynamic price based on selected variant or base price
  const currentPrice = selectedVariant ? (Number(selectedVariant.price) || 0) : (Number(product.price) || 0);

  // WhatsApp order link
  const linkData = createWhatsAppLink(
    product,
    selectedVariant ? selectedVariant.label : undefined,
    currentPrice,
    1
  );

  const { english, urdu } = parseProductTitle(product.name);

  // Default fallback image depending on category
  const getCategoryFallback = () => {
    const cat = (product.category || '').toLowerCase();
    if (cat.includes('cake') || cat.includes('pastr')) return BRAND_ASSETS.categoryCakes;
    if (cat.includes('biscuit') || cat.includes('baker') || cat.includes('savor')) return BRAND_ASSETS.categoryBakery;
    return BRAND_ASSETS.categoryMithai;
  };

  const getAvailabilityBadge = () => {
    switch (product.availability) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-300 bg-emerald-950/85 border border-emerald-500/40 px-2 py-0.5 rounded-full backdrop-blur-md shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>In Stock</span>
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-rose-300 bg-rose-950/85 border border-rose-500/40 px-2 py-0.5 rounded-full backdrop-blur-md shadow-sm">
            <XCircle className="w-3 h-3 text-rose-400" />
            <span>Out of Stock</span>
          </span>
        );
      case 'pre_order':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-amber-200 bg-amber-950/85 border border-amber-500/40 px-2 py-0.5 rounded-full backdrop-blur-md shadow-sm">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>Pre-order</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id={`product-${product.id}`}
      onClick={() => setSelectedProductModal(product)}
      className="group relative flex flex-col h-full rounded-2xl bg-[#17060a] hover:bg-[#1e080f] border border-[#c99846]/25 hover:border-[#c99846]/75 shadow-lg hover:shadow-2xl hover:shadow-[#c99846]/15 transition-all duration-300 ease-out transform hover:-translate-y-1.5 active:scale-[0.99] overflow-hidden cursor-pointer select-none"
    >
      {/* Product Image Section */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#120407] border-b border-[#c99846]/20">
        <img
          src={product.image || getCategoryFallback()}
          alt={english}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getCategoryFallback();
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Subtle Bottom Media Scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#17060a] via-transparent to-black/25 pointer-events-none" />

        {/* Top Badges: Stock status & Featured tag */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          <div>{getAvailabilityBadge()}</div>

          {product.isFeatured && (
            <span
              className="inline-flex items-center gap-1 bg-gradient-to-r from-[#c99846] to-[#a8792c] text-[#140508] font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md backdrop-blur-sm"
              title="Featured Delicacy"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Special</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        {/* Title, Category & Urdu Name */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#c99846]">
              {product.category}
            </span>
            {urdu && (
              <span
                className="text-xs font-serif text-[#e8c86a]/90 font-medium tracking-wide"
                dir="rtl"
                title={urdu}
              >
                {urdu}
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold font-serif-brand text-[#fdfaf4] group-hover:text-[#e8c86a] transition-colors leading-snug">
            {english}
          </h3>

          {product.description && (
            <p className="text-xs text-[#f8f1e3]/70 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Weight / Portion Variants */}
        <div className="space-y-2 pt-1 border-t border-[#c99846]/15">
          {product.hasVariants && product.variants && product.variants.length > 0 ? (
            <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-[#c99846]/80">
                <span>Select Weight / Portion:</span>
                {selectedVariant && (
                  <span className="text-[#f8f1e3]/60 font-medium lowercase">
                    {selectedVariant.label}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#c99846] text-[#140508] font-bold shadow-md ring-1 ring-[#e8c86a]'
                          : 'bg-[#22070e] text-[#f8f1e3]/80 hover:bg-[#320a15] hover:text-white border border-[#c99846]/25'
                      }`}
                      title={`Select ${v.label} - PKR ${v.price.toLocaleString()}`}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-[#f8f1e3]/55 italic py-0.5">
              Standard Bakery Pack
            </div>
          )}

          {/* Price & Total Display */}
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-[10px] uppercase font-bold text-[#c99846]/80 tracking-wider">
              Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-[#c99846] font-bold">PKR</span>
              <span className="text-xl sm:text-2xl font-black font-crest text-[#fdfaf4]">
                {currentPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* WhatsApp Order Button */}
          <div className="pt-1.5">
            {product.availability === 'out_of_stock' ? (
              <button
                type="button"
                disabled
                className="w-full py-2.5 px-3 rounded-xl bg-gray-800/80 text-gray-400 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed border border-gray-700/60"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Currently Out of Stock</span>
              </button>
            ) : (
              <a
                href={linkData.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/35 transition-all duration-200 cursor-pointer"
                title={`Order ${english} on WhatsApp`}
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>Order on WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
