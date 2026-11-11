import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Navigation, Clock, Star, ExternalLink, PhoneCall, Compass } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const { settings } = useStore();

  const exactAddress = settings.address || 'Shah Sweets and Bakers, Peshawar Road Shabqadar, Shabqadar, 25000';
  const directionsUrl = settings.googleMapsQueryUrl || 'https://www.google.com/maps/dir/?api=1&destination=Shah+Sweets+and+Bakers+Peshawar+Road+Shabqadar+25000';
  const mapEmbedUrl = 'https://maps.google.com/maps?q=Shah+Sweets+and+Bakers+Peshawar+Road+Shabqadar+25000&t=&z=16&ie=UTF8&iwloc=&output=embed';
  const whatsAppDigits = (settings.whatsAppNumber || '+92 305 9898409').replace(/[^0-9]/g, '') || '923059898409';

  return (
    <section id="location" className="py-20 bg-[#0d0406] relative w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Location Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c99846]">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Visit &amp; Contact Us</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif-brand text-[#fdfaf4]">
              Location &amp; Live Directions
            </h2>

            <p className="text-sm sm:text-base text-[#f8f1e3]/80 leading-relaxed">
              We look forward to welcoming you at Shah Sweets and Bakers on Peshawar Road, Shabqadar. Click &ldquo;Get Directions&rdquo; to be directly routed straight to our shop with live GPS turn-by-turn navigation and red destination pin.
            </p>

            <div className="space-y-4 pt-2">
              {/* Address Card with Red Pin */}
              <div className="bg-[#1b070d] border border-[#c99846]/35 p-4 sm:p-5 rounded-2xl flex items-start gap-4 shadow-lg hover:border-[#c99846]/60 transition-all">
                <div className="p-3 rounded-xl bg-[#2b0c15] text-red-500 border border-red-500/30 shrink-0 shadow-inner">
                  <MapPin className="w-6 h-6 fill-red-500/20 text-red-500 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-[#c99846] tracking-wider">
                      Verified Shop Address
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-950/80 border border-red-500/30 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                      Exact Pin
                    </span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-[#fdfaf4]">
                    Shah Sweets and Bakers
                  </div>
                  <div className="text-sm font-semibold text-[#e8c86a]">
                    Peshawar Road Shabqadar, Shabqadar, 25000
                  </div>
                  <div className="text-xs text-[#f8f1e3]/65">
                    Khyber Pakhtunkhwa, Pakistan (Postal Code: 25000)
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-[#1b070d] border border-[#c99846]/30 p-4 sm:p-5 rounded-2xl flex items-start gap-4 shadow-lg">
                <div className="p-3 rounded-xl bg-[#2b0c15] text-[#e8c86a] border border-[#c99846]/30 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-[#c99846] tracking-wider">
                    Store Hours
                  </div>
                  <div className="text-base font-bold text-[#fdfaf4] mt-0.5">
                    Daily Schedule
                  </div>
                  <div className="text-sm text-[#e8c86a] font-semibold">
                    Open Daily • Closes at {settings.closingTime}
                  </div>
                  <div className="text-xs text-[#f8f1e3]/70 mt-1">
                    Standard Daily Hours: 8:00 AM – 10:00 PM
                  </div>
                </div>
              </div>

              {/* Phone & WhatsApp Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Direct Phone Call Card */}
                <a
                  href={`tel:${settings.phoneNumber || '+923059898409'}`}
                  className="bg-[#1b070d] border border-[#c99846]/35 hover:border-[#e8c86a] p-4 rounded-2xl flex items-center gap-3.5 shadow-lg group transition-all"
                >
                  <div className="p-3 rounded-xl bg-[#2b0c15] text-[#e8c86a] group-hover:bg-[#c99846] group-hover:text-[#140508] border border-[#c99846]/30 transition-colors shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#c99846] tracking-wider">
                      Direct Phone
                    </div>
                    <div className="text-sm font-bold text-white group-hover:text-[#e8c86a] transition-colors mt-0.5">
                      {settings.phoneNumber || '+92 305 9898409'}
                    </div>
                    <div className="text-[11px] text-[#f8f1e3]/60">
                      Tap to call shop
                    </div>
                  </div>
                </a>

                {/* WhatsApp Chat Card */}
                <a
                  href={`https://wa.me/${whatsAppDigits}?text=${encodeURIComponent('Assalam-o-Alaikum Shah Sweets and Bakers, I would like to inquire about sweets at your Peshawar Road Shabqadar shop.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1b070d] border border-[#25D366]/40 hover:border-[#25D366] p-4 rounded-2xl flex items-center gap-3.5 shadow-lg group transition-all"
                >
                  <div className="p-3 rounded-xl bg-[#14281a] text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white border border-[#25D366]/30 transition-colors shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.69-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.56.13-.17.25-.65.81-.79.98-.15.17-.3.19-.55.06-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.43 1.03 2.6.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.19-.07-.1-.23-.17-.48-.29z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#25D366] tracking-wider">
                      Official WhatsApp
                    </div>
                    <div className="text-sm font-bold text-white group-hover:text-[#25D366] transition-colors mt-0.5">
                      {settings.whatsAppNumber || '+92 305 9898409'}
                    </div>
                    <div className="text-[11px] text-[#f8f1e3]/60">
                      Orders &amp; Directions
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Action Buttons: Get Directions with Red Arrow */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-[#c99846] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider px-6 py-4 rounded-full shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer border border-red-400/40"
              >
                {/* Red Direction Arrow */}
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Navigation className="w-3.5 h-3.5 text-white fill-white transform -rotate-45 group-hover:rotate-0 transition-transform" />
                </div>
                <span>Get Directions (Route to Shop)</span>
              </a>

              <a
                href={`tel:${settings.phoneNumber || '+923059898409'}`}
                className="flex items-center gap-2 bg-[#260810] hover:bg-[#380e18] text-[#f8f1e3] border border-[#c99846]/40 text-xs font-semibold px-4 py-3.5 rounded-full transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-[#c99846]" />
                <span>Call Shop</span>
              </a>

              <a
                href={`https://wa.me/${whatsAppDigits}?text=${encodeURIComponent('Assalam-o-Alaikum, please share your live location for Shah Sweets and Bakers on Peshawar Road Shabqadar.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-4 py-3.5 rounded-full shadow transition-all cursor-pointer"
              >
                <span>WhatsApp Location</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Google Map with Red Navigation Arrow */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-[#c99846]/40 bg-[#16060a] shadow-2xl p-4 sm:p-6 space-y-4">
              {/* Header over map */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-bold text-[#fdfaf4]">
                    Live Google Maps Location
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#140508]/90 border border-[#c99846]/30 px-3 py-1 rounded-full text-xs text-[#e8c86a]">
                  <Star className="w-3.5 h-3.5 fill-[#e8c86a]" />
                  <span className="font-bold">{settings.rating} / 5.0</span>
                  <span className="text-[#f8f1e3]/70">({settings.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Embedded Google Map Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-[#c99846]/30 bg-[#240810] h-80 sm:h-96 shadow-inner">
                <iframe
                  title="Shah Sweets and Bakers Google Map Location"
                  src={mapEmbedUrl}
                  className="w-full h-full border-0 filter brightness-95 contrast-105"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />

                {/* Red Direction Arrow & Location Floating Badge */}
                <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 bg-[#16060a]/90 backdrop-blur-md border border-[#c99846]/40 rounded-xl p-2.5 sm:p-3 shadow-2xl flex items-center gap-3">
                  {/* Glowing Red Arrow Icon */}
                  <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shrink-0 shadow-lg ring-2 ring-red-400/50">
                    <Navigation className="w-5 h-5 fill-white text-white transform -rotate-45" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      Shah Sweets and Bakers
                    </div>
                    <div className="text-[11px] text-[#e8c86a] font-medium truncate">
                      Peshawar Road Shabqadar, 25000
                    </div>
                  </div>
                </div>

                {/* Direct Get Directions Overlay Button */}
                <div className="absolute bottom-3 right-3 z-10">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xl transition-all border border-red-400/50 backdrop-blur-sm cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 fill-white" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>

              {/* Directions Explanatory Badge */}
              <div className="text-xs text-[#f8f1e3]/75 bg-[#120407] p-3.5 rounded-xl border border-[#c99846]/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-950 border border-red-500/40 flex items-center justify-center shrink-0 text-red-400">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white">Fixed Shop Destination: </span>
                  <span className="text-[#e8c86a]">Peshawar Road Shabqadar, 25000. </span>
                  <span>Clicking &ldquo;Get Directions&rdquo; opens turn-by-turn navigation directly to Shah Sweets and Bakers with the red marker in Google Maps.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
