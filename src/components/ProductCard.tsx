import React, { useState } from 'react';
import { Product, WeightVariant } from '../types';
import { useStore } from '../context/StoreContext';
import { BRAND_ASSETS } from '../data/initialData';
import { MessageCircle, Sparkles, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProductModal, createWhatsAppLink, setIsWhatsAppNoticeOpen, setPendingOrderSummary } = useStore();

  // If variants exist, initialize selected variant to first variant
  const [selectedVariant, setSelectedVariant] = useState<WeightVariant | null>(
    product.hasVariants && product.variants.length > 0 ? product.variants[0] : null
  );

  // Dynamic price based on variant
  const currentPrice = selectedVariant ? (Number(selectedVariant.price) || 0) : (Number(product.price) || 0);

  const linkData = createWhatsAppLink(
    product,
    selectedVariant ? selectedVariant.label : undefined,
    currentPrice,
    1
  );

  const getAvailabilityBadge = () => {
    switch (product.availability) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>In Stock</span>
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-950/80 border border-rose-500/30 px-1.5 py-0.5 rounded-md">
            <XCircle className="w-2.5 h-2.5" />
            <span>Out of Stock</span>
          </span>
        );
      case 'pre_order':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-950/80 border border-amber-500/30 px-1.5 py-0.5 rounded-md">
            <Clock className="w-2.5 h-2.5" />
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
      className="group relative rounded-xl bg-[#18060b] hover:bg-[#22080f] border border-[#c99846]/25 hover:border-[#c99846]/80 transition-all duration-200 shadow-sm hover:shadow-md p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3.5 cursor-pointer"
    >
      {/* Small Product Thumbnail on Left */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-[#120407] border border-[#c99846]/30 shadow-inner flex items-center justify-center">
        <img
          src={product.image || BRAND_ASSETS.categoryMithai}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = BRAND_ASSETS.categoryMithai;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        {product.isFeatured && (
          <span
            className="absolute top-0.5 left-0.5 bg-gradient-to-r from-[#c99846] to-[#a8792c] text-[#140508] p-0.5 rounded shadow"
            title="Featured Delicacy"
          >
            <Sparkles className="w-2.5 h-2.5" />
          </span>
        )}
      </div>

      {/* Product Content on Right in Same Row */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 sm:gap-1.5">
        {/* Top: Name, Category Tag & Status Badge */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
            <h3 className="text-xs sm:text-sm font-bold font-serif-brand text-[#fdfaf4] group-hover:text-[#e8c86a] transition-colors truncate">
              {product.name}
            </h3>
            <span className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider text-[#c99846]/80 hidden xs:inline">
              • {product.category}
            </span>
          </div>
          <div className="shrink-0">
            {getAvailabilityBadge()}
          </div>
        </div>

        {/* Bottom: Price, Weight Options & Quick WhatsApp Button together */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-[#c99846]/15">
          {/* Price */}
          <div className="flex items-baseline gap-0.5 shrink-0">
            <span className="text-[9px] sm:text-[10px] text-[#c99846] font-bold">PKR</span>
            <span className="text-sm sm:text-base font-black font-crest text-[#fdfaf4]">
              {currentPrice.toLocaleString()}
            </span>
          </div>

          {/* Weight / Portion Variants Options */}
          {product.hasVariants && product.variants && product.variants.length > 0 ? (
            <div
              className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              {product.variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#c99846] text-[#140508] font-bold shadow-sm'
                        : 'bg-[#260810] text-[#f8f1e3]/80 hover:bg-[#380e18] border border-[#c99846]/20'
                    }`}
                    title={`Select ${v.label} - PKR ${v.price.toLocaleString()}`}
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <span className="text-[10px] text-[#f8f1e3]/60 italic px-1">
              Standard Pack
            </span>
          )}

          {/* Quick WhatsApp Action Button */}
          {product.availability === 'out_of_stock' ? (
            <button
              disabled
              className="ml-auto shrink-0 flex items-center gap-1 bg-gray-700 opacity-50 text-white font-bold text-[10px] sm:text-[11px] px-2 py-1 rounded-md shadow"
              title="Out of stock"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Order</span>
            </button>
          ) : (
            <a
              href={linkData.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="ml-auto shrink-0 flex items-center gap-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-[10px] sm:text-[11px] px-2 py-1 rounded-md shadow transition-all cursor-pointer"
              title="Order on WhatsApp"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Order</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
