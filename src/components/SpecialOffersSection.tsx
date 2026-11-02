import React from 'react';
import { useStore } from '../context/StoreContext';
import { Tag, Sparkles, MessageCircle } from 'lucide-react';

export const SpecialOffersSection: React.FC = () => {
  const { offers, createWhatsAppLink } = useStore();
  const activeOffers = offers.filter((o) => o.active);

  if (activeOffers.length === 0) return null;

  return (
    <section className="py-12 bg-[#19060b] relative overflow-hidden">
      {/* Decorative Golden Pattern line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c99846]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#e8c86a] mb-2">
              <Tag className="w-3.5 h-3.5 text-[#c99846]" />
              <span>Current Bakery Specials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-[#fdfaf4]">
              Exclusive Seasonal &amp; Family Offers
            </h2>
          </div>
          <div className="text-xs text-[#f8f1e3]/70">
            Updated regularly by Shah Sweets &amp; Bakers Shabqadar
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeOffers.map((offer) => (
            <div
              key={offer.id}
              className="relative rounded-2xl bg-gradient-to-br from-[#280911] to-[#170509] border border-[#c99846]/40 p-6 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1 bg-[#c99846] text-[#140508] text-xs font-bold uppercase px-3 py-1 rounded-full shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    <span>{offer.discountBadge}</span>
                  </span>
                  {offer.categoryTag && (
                    <span className="text-[11px] font-medium text-[#e8c86a] uppercase tracking-wider">
                      {offer.categoryTag}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[#fdfaf4] font-serif-brand pt-1">
                  {offer.title}
                </h3>

                <p className="text-sm text-[#f8f1e3]/80 leading-relaxed">
                  {offer.description}
                </p>

                {offer.highlightText && (
                  <p className="text-xs text-[#e8c86a] italic bg-[#140508]/60 p-2.5 rounded-lg border border-[#c99846]/20">
                    “{offer.highlightText}”
                  </p>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-[#c99846]/20 flex items-center justify-between">
                <span className="text-xs text-[#f8f1e3]/60">
                  Available in Shabqadar shop
                </span>
                <a
                  href={
                    createWhatsAppLink(
                      undefined,
                      undefined,
                      undefined,
                      1,
                      `Assalam-o-Alaikum Shah Sweets and Bakers,\nI would like to avail the special offer: "${offer.title}" (${offer.discountBadge}) in Shabqadar. Please let me know the availability.`
                    ).url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-4 py-2 rounded-full shadow transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Inquire / Claim on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
