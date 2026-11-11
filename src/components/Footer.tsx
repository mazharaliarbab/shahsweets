import React from 'react';
import { useStore } from '../context/StoreContext';
import { BRAND_ASSETS } from '../data/initialData';
import { MapPin, Clock, Star, ShieldCheck, PhoneCall, Heart, Navigation } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setActiveNav } = useStore();
  const whatsAppDigits = (settings.whatsAppNumber || '+92 305 9898409').replace(/[^0-9]/g, '') || '923059898409';

  const handleNav = (id: string) => {
    setActiveNav(id);
    if (id === 'admin') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-[#0b0305] border-t border-[#c99846]/25 text-[#f8f1e3] pt-16 pb-12 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#c99846]/15">
          {/* Brand Info & Real Logo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#e8c86a] via-[#c99846] to-[#4f1220] shrink-0">
                <img
                  src={BRAND_ASSETS.logo}
                  alt="Shah Sweets and Bakers"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="font-crest text-xl font-bold tracking-wider text-[#fdfaf4]">
                  SHAH SWEETS
                </div>
                <div className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#c99846]">
                  &amp; Bakers • Shabqadar
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#f8f1e3]/75 leading-relaxed max-w-sm">
              Authentic traditional Pakistani mithai, fresh daily bakery delights, and custom celebration cakes in Shabqadar, Pakistan. Taste the tradition, love every bite.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-[#e8c86a]">
              <Star className="w-4 h-4 fill-[#e8c86a]" />
              <span className="font-bold">{settings.rating} / 5.0 Rating</span>
              <span className="text-[#f8f1e3]/60">({settings.reviewsCount} Google Reviews)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-[#c99846]">
              Quick Navigation
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-[#f8f1e3]/80">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-[#e8c86a] transition-colors cursor-pointer"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('products')}
                  className="hover:text-[#e8c86a] transition-colors cursor-pointer"
                >
                  All Sweets &amp; Bakery Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#e8c86a] transition-colors cursor-pointer"
                >
                  About Our Kitchen
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('location')}
                  className="hover:text-[#e8c86a] transition-colors cursor-pointer"
                >
                  Location &amp; Timings
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="hover:text-[#e8c86a] transition-colors flex items-center gap-1.5 text-[#e8c86a]/90 pt-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c99846]" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Store Location, Phone & Hours */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-[#c99846]">
              Store Location &amp; Contact
            </div>
            <div className="space-y-2.5 text-xs sm:text-sm text-[#f8f1e3]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c99846] shrink-0 mt-0.5" />
                <span>{settings.location} (Postal Code: {settings.postalCode})</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#c99846] shrink-0 mt-0.5" />
                <span>Daily: {settings.openingHoursText} (Closes {settings.closingTime})</span>
              </div>
              <div className="flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-[#c99846] shrink-0 mt-0.5" />
                <div>
                  <a
                    href={`tel:${settings.phoneNumber || '+923059898409'}`}
                    className="text-white hover:text-[#e8c86a] font-semibold transition-colors block"
                  >
                    {settings.phoneNumber || '+92 305 9898409'}
                  </a>
                  <span className="text-[11px] text-[#f8f1e3]/60">Call for Orders &amp; Inquiries</span>
                </div>
              </div>
              <div className="pt-1 flex items-center flex-wrap gap-2">
                <a
                  href={settings.googleMapsQueryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow"
                >
                  <Navigation className="w-3.5 h-3.5 fill-white transform -rotate-45" />
                  <span>Get Directions</span>
                </a>
                <a
                  href={`https://wa.me/${whatsAppDigits}?text=${encodeURIComponent('Assalam-o-Alaikum Shah Sweets and Bakers, I would like to place an order in Shabqadar.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.69-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.56.13-.17.25-.65.81-.79.98-.15.17-.3.19-.55.06-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.43 1.03 2.6.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.19-.07-.1-.23-.17-.48-.29z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#f8f1e3]/60 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Shah Sweets and Bakers, Shabqadar. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#f8f1e3]/50">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-[#c99846] fill-[#c99846]" />
            <span>for Shabqadar, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
