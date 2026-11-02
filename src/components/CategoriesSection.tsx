import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const CategoriesSection: React.FC = () => {
  const { categories, products, setSelectedCategory, setActiveNav } = useStore();

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveNav('products');
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Direction offsets for category cards: left, bottom, right
  const cardDirections = [
    { x: -35, y: 15 },
    { x: 0, y: 35 },
    { x: 35, y: 15 },
  ];

  return (
    <section className="py-16 bg-[#110507] border-y border-[#c99846]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#c99846]">
            <Sparkles className="w-3.5 h-3.5 text-[#e8c86a]" />
            <span>Artisanal Collections</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-brand text-[#fdfaf4]">
            Explore by Category
          </h2>
          <p className="text-sm sm:text-base text-[#f8f1e3]/75">
            From centuries-old traditional Pakistani mithai recipes to fresh oven-baked teatime specialties.
          </p>
        </div>

        {/* Categories Grid - Animation 2: Cards smoothly appear from slightly different directions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, index) => {
            const count = products.filter((p) => p.category === cat.name).length;
            const dir = cardDirections[index % cardDirections.length];

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: dir.x, y: dir.y }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.75,
                  delay: index * 0.14,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => handleCategorySelect(cat.name)}
                className="group relative rounded-3xl overflow-hidden bg-[#1f070e] border border-[#c99846]/30 hover:border-[#e8c86a] transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between"
              >
                {/* Category Image with Overlay */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140508] via-[#140508]/40 to-transparent" />

                  {/* Item Count Pill */}
                  <div className="absolute top-4 right-4 bg-[#140508]/90 border border-[#c99846]/40 px-3 py-1 rounded-full text-xs font-semibold text-[#e8c86a] backdrop-blur-sm">
                    {count} {count === 1 ? 'Delicacy' : 'Delicacies'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 relative z-10 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-xl font-bold font-serif-brand text-[#fdfaf4] group-hover:text-[#e8c86a] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#f8f1e3]/75 mt-2 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#c99846]/20 flex items-center justify-between text-xs font-bold text-[#e8c86a] group-hover:text-[#fdfaf4] transition-colors">
                    <span>View Collection</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
