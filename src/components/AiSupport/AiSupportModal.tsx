import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { BRAND_ASSETS } from '../../data/initialData';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  MessageCircle,
  PhoneCall,
  MapPin,
  RefreshCw,
  Minus,
} from 'lucide-react';
import { ChatMessage } from './types';
import { sendChatMessage } from './aiSupportService';

// Formats message text with clickable telephone and markdown links
function renderFormattedMessage(text: string) {
  // Replace [03059898409](tel:03059898409) or bare 03059898409 with clickable tel links
  const parts = text.split(/(\[.*?\]\(tel:.*?\)|\b03059898409\b|\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('[') && part.includes('](tel:')) {
      const match = part.match(/\[(.*?)\]\((tel:.*?)\)/);
      if (match) {
        return (
          <a
            key={index}
            href={match[2]}
            className="text-[#e8c86a] hover:text-white underline font-bold"
          >
            {match[1]}
          </a>
        );
      }
    }

    if (part === '03059898409') {
      return (
        <a
          key={index}
          href="tel:03059898409"
          className="text-[#e8c86a] hover:text-white underline font-bold"
        >
          03059898409
        </a>
      );
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return <span key={index}>{part}</span>;
  });
}

export const AiSupportModal: React.FC = () => {
  const { products, settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Requirement: Static welcome message only
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-init',
      sender: 'ai',
      text: 'Welcome to Shah Sweets and Bakers! How can I help you today?',
      timestamp: 'Just now',
      source: 'grounded-knowledge',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(false);

  // Auto-scroll when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  // Focus input ONLY when user opens the chat modal
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      scrollToBottom();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
    }
  }, [isOpen]);

  // Handle customer message submission
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const text = inputText.trim();
    if (!text || isSubmittingRef.current || isTyping) return;

    isSubmittingRef.current = true;

    // Display customer's message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // AI responds ONLY after receiving a customer message
      const aiReply = await sendChatMessage(
        messages.concat(userMessage),
        text,
        products,
        settings
      );
      setMessages((prev) => [...prev, aiReply]);
      if (!isOpen) {
        setHasUnread(true);
      }
    } catch {
      // Graceful error handling
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'We are momentarily having trouble processing your request. Please contact our owner directly at [03059898409](tel:03059898409) for immediate assistance.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'error',
          quickActions: [
            { label: 'Call 03059898409', type: 'call', url: 'tel:03059898409' },
          ],
        },
      ]);
    } finally {
      setIsTyping(false);
      isSubmittingRef.current = false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: 'Welcome to Shah Sweets and Bakers! How can I help you today?',
        timestamp: 'Just now',
        source: 'grounded-knowledge',
      },
    ]);
    setInputText('');
  };

  return (
    <>
      {/* 1. Compact, Unobtrusive Floating AI Support Button */}
      {/* Positioned cleanly above the WhatsApp button at bottom-right corner */}
      <aside
        aria-label="AI Customer Support"
        className="fixed bottom-18 sm:bottom-22 right-4 sm:right-6 z-40 print:hidden"
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close Customer Support Chat' : 'Open Customer Support Chat'}
          className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#1b060d]/95 hover:bg-[#2c0b16] border border-[#c99846]/60 hover:border-[#e8c86a] text-[#fdfaf4] shadow-[0_6px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_24px_rgba(201,152,70,0.4)] transform hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-[#e8c86a] to-[#c99846] flex items-center justify-center text-[#140508] shrink-0">
            <Sparkles className="w-3.5 h-3.5 fill-[#140508]" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#16060a]" />
            )}
          </div>
          <span className="text-xs font-bold font-crest tracking-wide text-[#e8c86a] group-hover:text-white transition-colors">
            AI Support
          </span>
        </button>
      </aside>

      {/* 2. Modern, Compact Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto z-50 w-auto sm:w-[380px] max-w-[calc(100%-2rem)] sm:max-w-none h-[480px] max-h-[82vh] bg-[#150509]/98 backdrop-blur-xl border border-[#c99846]/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
          role="dialog"
          aria-labelledby="ai-chat-header"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-[#20070e] border-b border-[#c99846]/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#c99846]/50 p-0.5 bg-[#120407] shrink-0">
                <img
                  src={BRAND_ASSETS.logo}
                  alt="Shah Sweets Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 id="ai-chat-header" className="text-xs sm:text-sm font-bold font-crest text-[#fdfaf4] leading-tight">
                  Shah Sweets AI Support
                </h3>
                <p className="text-[10px] text-[#e8c86a] leading-none mt-0.5">
                  Working hours: 6:00 AM – 10:00 PM
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#f8f1e3]/70">
              <button
                type="button"
                onClick={handleResetChat}
                title="Restart chat"
                className="p-1 rounded-lg hover:text-[#e8c86a] hover:bg-[#340b15] transition-colors cursor-pointer"
                aria-label="Restart chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1 rounded-lg hover:text-white hover:bg-[#340b15] transition-colors cursor-pointer"
                aria-label="Minimize chat"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1 rounded-lg hover:text-white hover:bg-[#340b15] transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#130407]/95">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-[#340b15] border border-[#c99846]/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-[#e8c86a]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-gradient-to-r from-[#c99846] to-[#a8792c] text-[#120407] font-medium rounded-tr-xs'
                        : 'bg-[#220810] border border-[#c99846]/25 text-[#f8f1e3] rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">
                      {renderFormattedMessage(msg.text)}
                    </div>

                    {/* Quick action buttons if provided */}
                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-[#c99846]/20 flex flex-wrap gap-1.5">
                        {msg.quickActions.map((qa, i) => (
                          qa.url ? (
                            <a
                              key={i}
                              href={qa.url}
                              target={qa.type === 'directions' || qa.type === 'whatsapp' ? '_blank' : undefined}
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#380e18] hover:bg-[#521322] text-[#e8c86a] hover:text-white border border-[#c99846]/40 transition-colors"
                            >
                              {qa.type === 'whatsapp' && <MessageCircle className="w-3 h-3 text-[#25D366]" />}
                              {qa.type === 'call' && <PhoneCall className="w-3 h-3 text-[#e8c86a]" />}
                              {qa.type === 'directions' && <MapPin className="w-3 h-3 text-[#e8c86a]" />}
                              <span>{qa.label}</span>
                            </a>
                          ) : (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setIsOpen(false);
                                const el = document.getElementById('products');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#380e18] hover:bg-[#521322] text-[#e8c86a] border border-[#c99846]/40 transition-colors cursor-pointer"
                            >
                              <span>{qa.label} →</span>
                            </button>
                          )
                        ))}
                      </div>
                    )}

                    <div
                      className={`text-[9px] mt-1 text-right ${
                        isUser ? 'text-[#120407]/60' : 'text-[#f8f1e3]/45'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-full bg-[#c99846]/30 border border-[#c99846]/50 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3 h-3 text-[#e8c86a]" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator — only visible while AI is formulating response */}
            {isTyping && (
              <div className="flex gap-2 justify-start items-center">
                <div className="w-6 h-6 rounded-full bg-[#340b15] border border-[#c99846]/40 flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3 text-[#e8c86a]" />
                </div>
                <div className="bg-[#220810] border border-[#c99846]/25 rounded-2xl rounded-tl-xs px-3.5 py-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e8c86a] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c99846] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8c672b] animate-bounce" />
                  <span className="text-[11px] text-[#f8f1e3]/60 ml-1">Typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Send Form — Input is fully editable without interruptions */}
          <div className="p-2.5 bg-[#100306] border-t border-[#c99846]/25 shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="flex-1 bg-[#1f070e] border border-[#c99846]/35 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#fdfaf4] placeholder-[#f8f1e3]/40 focus:outline-none focus:border-[#e8c86a] transition-colors"
                aria-label="Customer message input"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-2 rounded-xl bg-gradient-to-r from-[#c99846] to-[#a8792c] hover:from-[#e8c86a] hover:to-[#c99846] text-[#120407] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow cursor-pointer shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#f8f1e3]/45 px-1">
              <span>Owner: <a href="tel:03059898409" className="text-[#e8c86a] underline">03059898409</a></span>
              <span>Daily: 6:00 AM – 10:00 PM</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
