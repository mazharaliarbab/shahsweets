import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, X, ShieldCheck, Copy, Check, ExternalLink, Settings } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const {
    settings,
    createWhatsAppLink,
    isWhatsAppNoticeOpen,
    setIsWhatsAppNoticeOpen,
    pendingOrderSummary,
    setActiveNav,
  } = useStore();

  const [copied, setCopied] = React.useState(false);
  const linkData = createWhatsAppLink();

  const handleCopyMessage = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      {/* Strict size: 48x48px on mobile, max 52x52px on larger screens */}
      <aside
        aria-label="Contact options"
        className="fixed bottom-6 right-6 z-40 print:hidden"
      >
        <a
          href={linkData.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Shah Sweets and Bakers on WhatsApp"
          className="relative flex items-center justify-center w-12 h-12 md:w-[52px] md:h-[52px] rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_10px_28px_rgba(37,211,102,0.6)] transform hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[#0d0507]"
        >
          {/* Official WhatsApp-style SVG Icon (sized ~26-28px) */}
          <svg
            className="w-7 h-7 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.69-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.56.13-.17.25-.65.81-.79.98-.15.17-.3.19-.55.06-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.43 1.03 2.6.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.19-.07-.1-.23-.17-.48-.29z" />
          </svg>
        </a>
      </aside>

      {/* WhatsApp Setup / Notice Modal when phone is pending or custom inquiry is made */}
      {isWhatsAppNoticeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsWhatsAppNoticeOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#18060b] border border-[#c99846]/45 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-brand text-[#fdfaf4]">
                    WhatsApp Contact &amp; Ordering
                  </h3>
                  <p className="text-[11px] text-[#e8c86a]">
                    Shah Sweets and Bakers • Shabqadar
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWhatsAppNoticeOpen(false)}
                className="text-[#f8f1e3]/60 hover:text-white p-1 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status explanation */}
            {!linkData.isConfigured ? (
              <div className="space-y-3">
                <div className="bg-[#240810] border border-[#c99846]/30 p-4 rounded-2xl text-xs text-[#f8f1e3]/85 space-y-2">
                  <div className="font-semibold text-[#e8c86a] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#c99846]" />
                    <span>Configurable Business Number Notice</span>
                  </div>
                  <p className="leading-relaxed">
                    As requested, the contact number is maintained as a configurable placeholder until you provide the final phone number in the Admin Settings.
                  </p>
                  <p className="text-[11px] text-[#f8f1e3]/60">
                    The pre-configured message with your item selection, weight variant, and total PKR is ready below.
                  </p>
                </div>

                {/* Prepared Order Message Preview */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#e8c86a]">
                    <span>Prepared Order Message:</span>
                    <button
                      onClick={() =>
                        handleCopyMessage(
                          pendingOrderSummary?.text || linkData.rawMessage
                        )
                      }
                      className="inline-flex items-center gap-1 text-[#e8c86a] hover:text-white transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-[#25D366]" />
                          <span className="text-[#25D366]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-[#100306] border border-[#c99846]/20 p-3 rounded-xl text-[11px] text-[#f8f1e3]/90 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {pendingOrderSummary?.text || linkData.rawMessage}
                  </pre>
                </div>

                {/* Link to Admin Settings */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsWhatsAppNoticeOpen(false);
                      setActiveNav('admin');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#3b0e17] hover:bg-[#501320] text-[#e8c86a] border border-[#c99846]/40 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Configure Number in Admin Dashboard</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#240810] border border-[#c99846]/30 p-4 rounded-2xl text-xs text-[#f8f1e3]/85 space-y-2">
                  <div className="font-semibold text-[#e8c86a]">
                    Connected Number: {settings.whatsAppNumber}
                  </div>
                  <p>
                    Your order message will open directly in WhatsApp to chat with the store counter in Shabqadar.
                  </p>
                </div>

                <a
                  href={linkData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open WhatsApp Conversation Now</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
