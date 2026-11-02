import { Product, BusinessSettings } from '../../types';
import { ChatMessage, AiChatPayload } from './types';

/**
 * Builds complete store context mapping EVERY single product in the catalog
 */
export function buildStoreContext(products: Product[], settings: BusinessSettings) {
  return {
    businessName: 'Shah Sweets and Bakers',
    openingHours: '6:00 AM – 10:00 PM',
    openingTime: '6:00 AM',
    closingTime: '10:00 PM',
    ownerContact: '03059898409',
    phoneNumber: settings.phoneNumber || '03059898409',
    whatsAppNumber: settings.whatsAppNumber || '03059898409',
    location: settings.location || 'Peshawar Road Shabqadar, 25000',
    address: settings.address || 'Peshawar Road Shabqadar, Shabqadar, 25000',
    rating: settings.rating || 4.1,
    reviewsCount: settings.reviewsCount || 176,
    productsCount: products.length,
    sampleProducts: products.map((p) => ({
      name: p.name,
      category: p.category,
      price: Number(p.price) || 0,
      variants:
        p.hasVariants && p.variants && p.variants.length > 0
          ? p.variants.map((v) => `${v.label}: PKR ${v.price.toLocaleString()}`)
          : undefined,
      description: p.description || '',
      availability: p.availability || 'in_stock',
    })),
  };
}

/**
 * Grounded fallback generator when server API is unreachable or during offline mode
 */
export function generateLocalGroundedReply(
  userQuery: string,
  products: Product[],
  settings: BusinessSettings
): { text: string; quickActions?: ChatMessage['quickActions'] } {
  const query = userQuery.toLowerCase().trim();
  const ownerNumber = '03059898409';
  const cleanPhone = '923059898409';
  const whatsAppUrl = `https://wa.me/${cleanPhone}`;

  // 1. Timings & Opening Hours (Exact: 6:00 AM – 10:00 PM)
  if (
    query.includes('hour') ||
    query.includes('timing') ||
    query.includes('open') ||
    query.includes('close') ||
    query.includes('waqt') ||
    query.includes('time') ||
    query.includes('kab') ||
    query.includes('hours')
  ) {
    return {
      text: `Shah Sweets and Bakers is open daily from **6:00 AM to 10:00 PM**.\n\n• **Opening time:** 6:00 AM\n• **Closing time:** 10:00 PM\n• **Working hours:** 6:00 AM – 10:00 PM\n\nFor any inquiries or morning orders, feel free to call our owner at **[03059898409](tel:03059898409)**.`,
      quickActions: [
        { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
        { label: 'Chat on WhatsApp', type: 'whatsapp', url: whatsAppUrl },
      ],
    };
  }

  // 2. Owner Contact & Phone Links
  if (
    query.includes('contact') ||
    query.includes('owner') ||
    query.includes('phone') ||
    query.includes('number') ||
    query.includes('call') ||
    query.includes('whatsapp') ||
    query.includes('rabta') ||
    query.includes('staff') ||
    query.includes('talk')
  ) {
    return {
      text: `You can directly reach the owner of Shah Sweets and Bakers:\n\n• **Owner Contact Number:** **[03059898409](tel:03059898409)**\n• **Working Hours:** 6:00 AM – 10:00 PM Daily\n\nClick the telephone link above or the button below to call directly.`,
      quickActions: [
        { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
        { label: 'WhatsApp Owner', type: 'whatsapp', url: whatsAppUrl },
      ],
    };
  }

  // 3. Location & Directions
  if (
    query.includes('where') ||
    query.includes('location') ||
    query.includes('address') ||
    query.includes('kahan') ||
    query.includes('direction') ||
    query.includes('branch') ||
    query.includes('map') ||
    query.includes('shabqadar') ||
    query.includes('peshawar road')
  ) {
    return {
      text: `Shah Sweets and Bakers is located at **Peshawar Road Shabqadar, 25000**, Pakistan.\n\nOur doors are open daily from 6:00 AM to 10:00 PM. If you need help finding us, call owner contact **[03059898409](tel:03059898409)**.`,
      quickActions: [
        {
          label: 'Google Maps Directions',
          type: 'directions',
          url: settings.googleMapsQueryUrl || 'https://www.google.com/maps/search/?api=1&query=Shah+Sweets+and+Bakers+Peshawar+Road+Shabqadar+25000',
        },
        { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
      ],
    };
  }

  // 4. Match against EVERY single product in the catalog
  const matchedProduct = products.find((p) => {
    const pName = p.name.toLowerCase();
    const pDesc = (p.description || '').toLowerCase();
    const pCat = p.category.toLowerCase();

    // Direct name match or words match
    if (query.includes(pName) || pName.includes(query)) return true;

    // Check specific distinct product words
    const queryWords = query.split(/\s+/).filter((w) => w.length >= 3);
    const hasNameWord = queryWords.some((w) => pName.includes(w));
    if (hasNameWord) return true;

    return false;
  });

  if (matchedProduct) {
    const variantText =
      matchedProduct.hasVariants && matchedProduct.variants && matchedProduct.variants.length > 0
        ? `\n\n**Portion Sizes & Prices:**\n` +
          matchedProduct.variants
            .map((v) => `• ${v.label}: **PKR ${Number(v.price).toLocaleString()}**`)
            .join('\n')
        : `\n\n**Price:** **PKR ${Number(matchedProduct.price).toLocaleString()}**`;

    const statusText =
      matchedProduct.availability === 'in_stock'
        ? '✅ In stock and freshly prepared daily.'
        : matchedProduct.availability === 'pre_order'
        ? '🕒 Made fresh upon pre-order.'
        : '⚠️ Currently out of stock today.';

    return {
      text: `**${matchedProduct.name}** (${matchedProduct.category})\n\n${matchedProduct.description || ''}${variantText}\n\n${statusText}\n\nTo place an order, call our owner at **[03059898409](tel:03059898409)** or message on WhatsApp.`,
      quickActions: [
        {
          label: `Order on WhatsApp`,
          type: 'whatsapp',
          url: `${whatsAppUrl}?text=${encodeURIComponent(
            `Assalam-o-Alaikum Shah Sweets and Bakers, I would like to order ${matchedProduct.name}.`
          )}`,
        },
        { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
      ],
    };
  }

  // 5. General Products / Categories List
  if (
    query.includes('product') ||
    query.includes('item') ||
    query.includes('menu') ||
    query.includes('cake') ||
    query.includes('sweet') ||
    query.includes('mithai') ||
    query.includes('bakery') ||
    query.includes('list')
  ) {
    const allProductNames = products
      .map((p) => `• **${p.name}** (${p.category}) — from PKR ${Number(p.price).toLocaleString()}`)
      .join('\n');

    return {
      text: `Here are the authentic delicacies currently available at Shah Sweets and Bakers:\n\n${allProductNames}\n\nAll items are prepared fresh. To order or ask for custom weights, call the owner at **[03059898409](tel:03059898409)**.`,
      quickActions: [
        { label: 'Browse Website Catalogue', type: 'browse' },
        { label: 'Order on WhatsApp', type: 'whatsapp', url: whatsAppUrl },
      ],
    };
  }

  // 6. Greetings in English, Urdu, Roman Urdu
  if (
    query.includes('salam') ||
    query.includes('hello') ||
    query.includes('hi') ||
    query.includes('hey') ||
    query.includes('kese') ||
    query.includes('kaise') ||
    query.includes('adaab')
  ) {
    return {
      text: `Wa Alaikum Assalam! Welcome to Shah Sweets and Bakers. We are open from 6:00 AM to 10:00 PM daily on Peshawar Road Shabqadar. How can I assist you with our fresh cakes, sweets, or bakery items today?`,
      quickActions: [
        { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
        { label: 'Chat on WhatsApp', type: 'whatsapp', url: whatsAppUrl },
      ],
    };
  }

  // 7. If customer asks about something that does not exist or general query
  return {
    text: `Information for that item is not currently available at Shah Sweets and Bakers. For custom requests or further details, please contact the owner directly at **[03059898409](tel:03059898409)** (available daily 6:00 AM – 10:00 PM).`,
    quickActions: [
      { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
      { label: 'Chat on WhatsApp', type: 'whatsapp', url: whatsAppUrl },
    ],
  };
}

/**
 * Sends chat messages to the server endpoint /api/ai/chat
 */
export async function sendChatMessage(
  history: ChatMessage[],
  newMessage: string,
  products: Product[],
  settings: BusinessSettings
): Promise<ChatMessage> {
  const storeContext = buildStoreContext(products, settings);

  const formattedMessages = history
    .filter((m) => m.sender === 'user' || m.sender === 'ai')
    .map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.text,
    }));

  formattedMessages.push({ role: 'user', content: newMessage });

  const payload: AiChatPayload = {
    messages: formattedMessages,
    storeContext,
  };

  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
          source: data.source || 'gemini',
          quickActions: data.quickActions,
        };
      }
    }
  } catch {
    // Network or server fetch error
  }

  // Grounded fallback response using actual store data
  const localReply = generateLocalGroundedReply(newMessage, products, settings);
  return {
    id: `ai-${Date.now()}`,
    sender: 'ai',
    text: localReply.text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'sent',
    source: 'grounded-knowledge',
    quickActions: localReply.quickActions,
  };
}
