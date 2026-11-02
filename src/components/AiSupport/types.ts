export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  source?: 'gemini' | 'grounded-knowledge';
  quickActions?: {
    label: string;
    type: 'whatsapp' | 'call' | 'directions' | 'browse';
    url?: string;
  }[];
}

export interface SuggestedQuestion {
  id: string;
  label: string;
  query: string;
}

export interface AiChatPayload {
  messages: {
    role: 'user' | 'assistant';
    content: string;
  }[];
  storeContext?: {
    businessName: string;
    openingHours: string;
    closingTime: string;
    phoneNumber: string;
    whatsAppNumber: string;
    location: string;
    address: string;
    rating: number;
    reviewsCount: number;
    productsCount: number;
    sampleProducts: {
      name: string;
      category: string;
      price: number;
      variants?: string[];
      description?: string;
      availability: string;
    }[];
  };
}
