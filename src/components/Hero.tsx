import React from 'react';
import { useStore } from '../context/StoreContext';
import { BRAND_ASSETS } from '../data/initialData';
import { Sparkles, MapPin, Star, ArrowRight, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Hero: React.FC = () => {
  const { settings, createWhatsAppLink, setActiveNav } = useStore();
  const heroWhatsAppUrl = createWhatsAppLink(
    undefined,
    undefined,
    undefined,
    1,
    'Assalam-o-Alaikum Shah Sweets and Bakers, I would like to place an order from your shop in Shabqadar.'
  ).url;

  const scrollToProducts = () => {
    setActiveNav('products');
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-[#140508] via-[#1c070c] to-[#0e0406]">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#6d192c]/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-[#c99846]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Brand Story, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Main Headline - Animation 1: Smoothly slide upward and fade into view */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#fdfaf4] leading-[1.15]"
            >
              <span className="sr-only">Shah Sweets and Bakers - </span>
              <span className="block font-serif-brand italic font-normal text-[#e8c86a]">
                Taste the Tradition,
              </span>
              <span className="block text-white mt-1">
                Love Every Bite.
              </span>
            </motion.h1>

            {/* Authentic Introduction - Animation 1: Appears shortly afterward */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-[#f8f1e3]/80 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Welcome to <span className="text-[#e8c86a] font-semibold">Shah Sweets and Bakers</span>, Shabqadar’s premier destination for exquisite traditional Pakistani mithai, fresh daily bakery delicacies, and handcrafted celebration cakes. Made with pure ingredients and time-honored recipes.
            </motion.p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={scrollToProducts}
                className="flex items-center gap-2.5 bg-gradient-to-r from-[#c99846] via-[#d4af37] to-[#a8792c] hover:brightness-110 text-[#120508] font-bold text-sm uppercase tracking-wider px-7 py-3.5 rounded-full shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={heroWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#2a0a12] hover:bg-[#3d0e19] text-[#fdfaf4] border border-[#c99846]/50 hover:border-[#c99846] font-semibold text-sm px-6 py-3.5 rounded-full shadow-lg transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Order via WhatsApp</span>
              </a>

              <a
                href={settings.googleMapsQueryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#e8c86a] hover:text-[#fdfaf4] underline underline-offset-4 transition-colors py-2"
              >
                <MapPin className="w-3.5 h-3.5 text-[#c99846]" />
                <span>Get Directions (Google Maps)</span>
              </a>
            </div>

            {/* Quick highlights */}
            <div className="pt-6 border-t border-[#c99846]/20 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="bg-[#1f070e]/60 border border-[#c99846]/20 rounded-xl p-3">
                <div className="text-[#e8c86a] font-crest text-lg sm:text-xl font-bold">100% Pure</div>
                <div className="text-[11px] sm:text-xs text-[#f8f1e3]/70">Khoya &amp; Desi Ghee</div>
              </div>
              <div className="bg-[#1f070e]/60 border border-[#c99846]/20 rounded-xl p-3">
                <div className="text-[#e8c86a] font-crest text-lg sm:text-xl font-bold">Daily Fresh</div>
                <div className="text-[11px] sm:text-xs text-[#f8f1e3]/70">Morning &amp; Evening Batches</div>
              </div>
              <div className="bg-[#1f070e]/60 border border-[#c99846]/20 rounded-xl p-3">
                <div className="text-[#e8c86a] font-crest text-lg sm:text-xl font-bold">10:00 PM</div>
                <div className="text-[11px] sm:text-xs text-[#f8f1e3]/70">Open Daily in Shabqadar</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Artwork - Animation 1: Subtle scale-in effect */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Outer Golden Border & Shadow */}
              <div className="relative rounded-3xl p-2 bg-gradient-to-tr from-[#c99846]/70 via-[#4f1220] to-[#e8c86a]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                <div className="relative rounded-[22px] overflow-hidden aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={BRAND_ASSETS.heroBanner}
                    alt="Shah Sweets and Bakers - Traditional Pakistani Mithai, Cakes, and Bakery Delights in Shabqadar"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140508]/80 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Brand Stamp */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-[#16060b]/90 border border-[#c99846]/40 rounded-xl p-3 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c99846]">
                        <img
                          src={BRAND_ASSETS.logo}
                          alt="Brand Logo Stamp"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-crest font-bold text-[#fdfaf4]">
                          Shah Sweets &amp; Bakers
                        </div>
                        <div className="text-[10px] text-[#e8c86a]">
                          Shabqadar, 25000, Pakistan
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#e8c86a] bg-[#3b0e17] px-2 py-1 rounded-md border border-[#c99846]/30">
                        <Sparkles className="w-3 h-3 text-[#e8c86a]" />
                        <span>Fresh Today</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
