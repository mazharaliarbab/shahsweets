import React from 'react';
import { useStore } from '../context/StoreContext';
import { Star, ExternalLink, ShieldCheck, CheckCircle } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { settings } = useStore();

  return (
    <section className="py-16 bg-[#140508] border-t border-[#c99846]/20 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#230810] to-[#140508] border border-[#c99846]/35 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#e8c86a]">
              <ShieldCheck className="w-4 h-4 text-[#c99846]" />
              <span>Verified Public Business Rating</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-[#fdfaf4]">
              Customer Satisfaction on Google
            </h2>
            <p className="text-xs sm:text-sm text-[#f8f1e3]/70 max-w-xl mx-auto">
              Based on official, verified public reviews left by visitors and patrons in Shabqadar.
            </p>
          </div>

          {/* Rating Display Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#170509] border border-[#c99846]/25 rounded-2xl p-6 sm:p-8">
            {/* Big Rating Number */}
            <div className="md:col-span-5 text-center md:border-r md:border-[#c99846]/20 md:pr-6 space-y-2">
              <div className="text-5xl sm:text-6xl font-black font-crest text-[#e8c86a]">
                {settings.rating}
              </div>
              <div className="flex items-center justify-center gap-1.5 py-1">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-[#e8c86a] text-[#e8c86a]" />
                ))}
                <Star className="w-5 h-5 fill-[#e8c86a]/40 text-[#e8c86a]" />
              </div>
              <div className="text-xs text-[#f8f1e3]/80 font-medium">
                Overall score out of 5.0
              </div>
              <div className="text-xs font-semibold text-[#c99846]">
                From {settings.reviewsCount} Google Reviews
              </div>
            </div>

            {/* Rating Breakdown & Verified Attributes */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#f8f1e3]/80">
                  <span className="flex items-center gap-1 font-medium">5 Stars</span>
                  <div className="w-3/5 bg-[#2b0c14] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#e8c86a] h-full rounded-full" style={{ width: '68%' }} />
                  </div>
                  <span className="text-[11px] text-[#f8f1e3]/60 w-8 text-right">68%</span>
                </div>

                <div className="flex items-center justify-between text-[#f8f1e3]/80">
                  <span className="flex items-center gap-1 font-medium">4 Stars</span>
                  <div className="w-3/5 bg-[#2b0c14] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#c99846] h-full rounded-full" style={{ width: '22%' }} />
                  </div>
                  <span className="text-[11px] text-[#f8f1e3]/60 w-8 text-right">22%</span>
                </div>

                <div className="flex items-center justify-between text-[#f8f1e3]/80">
                  <span className="flex items-center gap-1 font-medium">3 Stars</span>
                  <div className="w-3/5 bg-[#2b0c14] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#a8792c] h-full rounded-full" style={{ width: '6%' }} />
                  </div>
                  <span className="text-[11px] text-[#f8f1e3]/60 w-8 text-right">6%</span>
                </div>

                <div className="flex items-center justify-between text-[#f8f1e3]/80">
                  <span className="flex items-center gap-1 font-medium">2 &amp; 1 Stars</span>
                  <div className="w-3/5 bg-[#2b0c14] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#6b1e2a] h-full rounded-full" style={{ width: '4%' }} />
                  </div>
                  <span className="text-[11px] text-[#f8f1e3]/60 w-8 text-right">4%</span>
                </div>
              </div>

              {/* Verified Features */}
              <div className="pt-3 border-t border-[#c99846]/15 grid grid-cols-2 gap-2 text-xs text-[#f8f1e3]/80">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Fresh daily mithai</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Traditional taste</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Bakery &amp; teatime snacks</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Open until 10:00 PM</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Link to Google Maps */}
          <div className="text-center pt-2">
            <a
              href={settings.googleMapsQueryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2a0b12] hover:bg-[#3d0e19] text-[#e8c86a] border border-[#c99846]/40 hover:border-[#c99846] text-xs font-semibold px-5 py-2.5 rounded-full transition-all cursor-pointer"
            >
              <span>View Verified Public Listing on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
