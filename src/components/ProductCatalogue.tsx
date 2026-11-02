import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Search, Filter, Sparkles, X, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

export const ProductCatalogue: React.FC = () => {
  const { products, categories, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in_stock'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc'>('featured');

  // Filter products
  const filteredProducts = products.filter((item) => {
    // Category match with trimmed case-insensitivity
    const matchesCategory =
      selectedCategory === 'all' ||
      item.category?.trim().toLowerCase() === selectedCategory?.trim().toLowerCase();

    // Search query match (name, description, category)
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q);

    // Availability match
    const matchesAvailability =
      availabilityFilter === 'all' || item.availability === 'in_stock';

    return matchesCategory && matchesSearch && matchesAvailability;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
    // Featured first
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    // Newest first by creation date if available
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return (
    <section id="products" className="py-16 sm:py-24 bg-[#0d0507]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#c99846]">
            <Sparkles className="w-3.5 h-3.5 text-[#e8c86a]" />
            <span>Complete Catalogue</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-brand text-[#fdfaf4]">
            Our Traditional Sweets &amp; Bakery
          </h2>
          <p className="text-sm sm:text-base text-[#f8f1e3]/75">
            Every delicacy is prepared with fresh khoya, desi ghee, and pure ingredients in Shabqadar. Select weight variants for instant live PKR prices.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#17060a] border border-[#c99846]/25 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          {/* Top row: Categories pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#c99846] text-[#140508] shadow-md font-bold'
                  : 'bg-[#240810] text-[#f8f1e3]/80 hover:bg-[#380e18] hover:text-white'
              }`}
            >
              All Delicacies ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter(
                (p) => p.category?.trim().toLowerCase() === cat.name?.trim().toLowerCase()
              ).length;
              const isSelected = selectedCategory?.trim().toLowerCase() === cat.name?.trim().toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#c99846] text-[#140508] shadow-md font-bold'
                      : 'bg-[#240810] text-[#f8f1e3]/80 hover:bg-[#380e18] hover:text-white'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Bottom row: Search + Availability + Sorting */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#c99846]/15">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#c99846] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ingredients..."
                className="w-full bg-[#240810] border border-[#c99846]/30 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-[#f8f1e3] placeholder-[#f8f1e3]/50 focus:outline-none focus:border-[#c99846]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f8f1e3]/60 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right side options: In stock only & Sort */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <label className="flex items-center gap-2 text-xs text-[#f8f1e3]/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={availabilityFilter === 'in_stock'}
                  onChange={(e) => setAvailabilityFilter(e.target.checked ? 'in_stock' : 'all')}
                  className="rounded accent-[#c99846] w-3.5 h-3.5"
                />
                <span>In Stock only</span>
              </label>

              <div className="flex items-center gap-1.5 text-xs text-[#f8f1e3]/80">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#c99846]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#240810] border border-[#c99846]/30 rounded-lg px-2.5 py-1.5 text-xs text-[#f8f1e3] focus:outline-none focus:border-[#c99846] cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Grid - Animation 3: Staggered entrance effect */}
        {sortedProducts.length > 0 ? (
          <div
            className={
              sortedProducts.length === 1
                ? 'grid grid-cols-1 max-w-2xl mx-auto gap-3.5 sm:gap-4'
                : 'grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4'
            }
          >
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min((index % 6) * 0.08, 0.45),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#16060a] border border-[#c99846]/20 rounded-3xl p-8 space-y-4">
            <Filter className="w-10 h-10 text-[#c99846]/60 mx-auto" />
            <h3 className="text-xl font-bold font-serif-brand text-[#fdfaf4]">
              No products found
            </h3>
            <p className="text-sm text-[#f8f1e3]/70 max-w-md mx-auto">
              We couldn't find any sweets or bakery items matching your current search or category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setAvailabilityFilter('all');
              }}
              className="px-5 py-2 rounded-full bg-[#3b0e17] text-[#e8c86a] border border-[#c99846]/40 hover:bg-[#501320] text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
