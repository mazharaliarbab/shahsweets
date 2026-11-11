import React from 'react';
import { BRAND_ASSETS } from '../data/initialData';
import { useStore } from '../context/StoreContext';
import { MapPin, Clock, Sparkles, HeartHandshake, Instagram, Facebook, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V11.4a6.37 6.37 0 0 0-.86-.06A6.34 6.34 0 0 0 3.1 17.68a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.5V9.03a8.28 8.28 0 0 0 5.17 1.8V7.39a4.84 4.84 0 0 1-1.36-.7z" />
  </svg>
);

export const AboutSection: React.FC = () => {
  const { settings } = useStore();

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-[#0d0507] via-[#16060a] to-[#120508] relative overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Emblem & Visuals - Animation 4: Smooth vertical fade */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col items-center justify-center text-center"
          >
            <div className="relative group">
              {/* Outer decorative ring */}
              <div className="w-56 h-56 sm:w-68 sm:h-68 rounded-full p-2 bg-gradient-to-tr from-[#c99846] via-[#4f1220] to-[#e8c86a] shadow-[0_10px_40px_rgba(201,152,70,0.25)]">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#140508]">
                  <img
                    src={BRAND_ASSETS.logo}
                    alt="Shah Sweets and Bakers Official Seal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Floating verified badge */}
              <div className="mt-6 inline-flex items-center gap-2 bg-[#260810] border border-[#c99846]/40 px-4 py-1.5 rounded-full text-xs font-semibold text-[#e8c86a] shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Shah Sweets &amp; Bakers Shabqadar</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Authentic Story, Values & Social Promotion - Animation 4: Smooth vertical fade */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#c99846]">
              <HeartHandshake className="w-3.5 h-3.5 text-[#e8c86a]" />
              <span>Taste the Tradition</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-brand text-[#fdfaf4] leading-tight">
              A Legacy of Freshness &amp; Sweet Traditions
            </h2>

            <p className="text-base text-[#f8f1e3]/85 leading-relaxed">
              Situated on <span className="text-[#e8c86a] font-semibold">Peshawar Road in Shabqadar, Pakistan</span>, Shah Sweets and Bakers prepares daily batches of traditional mithai, handcrafted celebration cakes, and fresh teatime bakery favorites.
            </p>

            <p className="text-sm text-[#f8f1e3]/75 leading-relaxed">
              We focus on time-honored preparation methods, pure milk solids (khoya), aromatic green cardamom, and premium nuts to deliver consistent taste in every single bite. Whether it is an intimate family evening or a festive community celebration, our counter is stocked daily until <span className="text-[#e8c86a] font-medium">{settings.closingTime}</span> with fresh treats.
            </p>

            {/* Quick Fact Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 bg-[#1e070d] border border-[#c99846]/25 p-4 rounded-2xl">
                <MapPin className="w-5 h-5 text-[#c99846] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#fdfaf4] uppercase tracking-wider">
                    Community Location
                  </div>
                  <div className="text-xs text-[#f8f1e3]/70 mt-0.5">
                    {settings.location}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#1e070d] border border-[#c99846]/25 p-4 rounded-2xl">
                <Clock className="w-5 h-5 text-[#c99846] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#fdfaf4] uppercase tracking-wider">
                    Daily Timings
                  </div>
                  <div className="text-xs text-[#f8f1e3]/70 mt-0.5">
                    {settings.openingHoursText}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media & Advertisement Section */}
            <div className="pt-4 border-t border-[#c99846]/25 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#e8c86a]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#e8c86a]">
                    Official Social Media &amp; Promotion
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#260810] border border-[#c99846]/40 text-[#c99846]">
                  Shabqadar • Peshawar Road
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/explore/search/keyword/?q=shah%20sweets%20and%20bakers%20shabqadar%20peshawar%20road"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#1b060b] hover:bg-[#280812] border border-[#c99846]/30 hover:border-[#e1306c] transition-all group shadow-md"
                  aria-label="Instagram - Shah Sweets and Bakers Peshawar Road Shabqadar"
                  title="Follow Shah Sweets and Bakers on Instagram"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB] flex items-center justify-center text-white shrink-0 shadow">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#fdfaf4] group-hover:text-[#e8c86a] transition-colors truncate">
                      Instagram
                    </div>
                    <div className="text-[10px] text-[#f8f1e3]/65 truncate">
                      @shahsweets.shabqadar
                    </div>
                  </div>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/search/top?q=shah%20sweets%20and%20bakers%20shabqadar%20peshawar%20road"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#1b060b] hover:bg-[#280812] border border-[#c99846]/30 hover:border-[#1877f2] transition-all group shadow-md"
                  aria-label="Facebook - Shah Sweets and Bakers Peshawar Road Shabqadar"
                  title="Visit Shah Sweets and Bakers on Facebook"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1877f2] flex items-center justify-center text-white shrink-0 shadow">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#fdfaf4] group-hover:text-[#e8c86a] transition-colors truncate">
                      Facebook
                    </div>
                    <div className="text-[10px] text-[#f8f1e3]/65 truncate">
                      Shah Sweets Shabqadar
                    </div>
                  </div>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/search?q=shah%20sweets%20and%20bakers%20shabqadar%20peshawar%20road"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#1b060b] hover:bg-[#280812] border border-[#c99846]/30 hover:border-[#fe2c55] transition-all group shadow-md"
                  aria-label="TikTok - Shah Sweets and Bakers Peshawar Road Shabqadar"
                  title="Watch Shah Sweets and Bakers on TikTok"
                >
                  <div className="w-10 h-10 rounded-xl bg-black border border-[#fe2c55]/40 flex items-center justify-center text-white shrink-0 shadow">
                    <TikTokIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#fdfaf4] group-hover:text-[#e8c86a] transition-colors truncate">
                      TikTok
                    </div>
                    <div className="text-[10px] text-[#f8f1e3]/65 truncate">
                      Daily Fresh Sweets
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
