import { Product, BusinessSettings } from '../../types';
import { ChatMessage, AiChatPayload } from './types';

/**
 * Builds complete store context mapping EVERY single product in the catalog
 */
// Helper: Detect language (Urdu script, Roman Urdu, or English)
function detectLanguage(text: string): 'urdu' | 'roman' | 'english' {
  if (/[\u0600-\u06FF]/.test(text)) {
    return 'urdu';
  }
  const lower = text.toLowerCase();
  if (
    /\b(hai|hain|ka|ki|ke|kitne|kitna|kitni|kahan|kese|kaise|kon|kaun|batao|bataen|chahiye|wala|wali|wale|bhi|ye|yeh|kuch|dukan|shabqadar|paas|dastiyab)\b/.test(
      lower
    )
  ) {
    return 'roman';
  }
  return 'english';
}

// Helper: Extract clean English and Urdu names from formatted name "English Name (اردو نام)"
function parseProductNames(rawName: string): { english: string; urdu: string } {
  const match = rawName.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return {
      english: match[1].trim(),
      urdu: match[2].trim(),
    };
  }
  return {
    english: rawName.trim(),
    urdu: rawName.trim(),
  };
}

// Helper: Determine product price unit (per kg, per pound, each)
function getProductUnit(product: any): { en: string; ur: string; numPrice: number } {
  const pName = (product.name || '').toLowerCase();
  const pDesc = (product.description || '').toLowerCase();
  const variantLabels = (product.variants || [])
    .map((v: any) => (typeof v === 'string' ? v : v.label || '').toLowerCase())
    .join(' ');

  const numPrice = Number(product.price) || 0;

  if (pName.includes('pastry') || variantLabels.includes('each') || variantLabels.includes('piece')) {
    return { en: 'each', ur: 'فی پیس', numPrice };
  }
  if (
    pName.includes('pound') ||
    variantLabels.includes('lb') ||
    variantLabels.includes('pound') ||
    pDesc.includes('pound') ||
    pName.includes('pineapple cake') ||
    pName.includes('chocolate cake')
  ) {
    return { en: 'per pound', ur: 'فی پاؤنڈ', numPrice };
  }
  if (
    variantLabels.includes('kg') ||
    pDesc.includes('kg') ||
    pName.includes('biscuit') ||
    pName.includes('mathai') ||
    pName.includes('jalebi') ||
    pName.includes('rasgulla') ||
    pName.includes('fruit cake') ||
    pName.includes('dry cake') ||
    pName.includes('wajaat')
  ) {
    return { en: 'per kg', ur: 'فی کلو', numPrice };
  }
  return { en: '', ur: '', numPrice };
}

/**
 * Builds complete store context mapping EVERY single product in the catalog dynamically
 */
export function buildStoreContext(products: Product[], settings: BusinessSettings) {
  return {
    businessName: 'Shah Sweets and Bakers',
    ownerName: 'Saeed Abdullah Shah',
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
          ? p.variants.map((v) => `${v.label}: PKR ${Number(v.price).toLocaleString()}`)
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
  const q = userQuery.toLowerCase().trim();
  const lang = detectLanguage(userQuery);
  const ownerNumber = '03059898409';
  const cleanPhone = '923059898409';
  const whatsAppUrl = `https://wa.me/${cleanPhone}`;

  // 1. Owner queries (Who is the owner, founder, مالک کون ہے)
  if (
    q.includes('owner') ||
    q.includes('founder') ||
    q.includes('مالک') ||
    q.includes('malik') ||
    q.includes('who owns') ||
    q.includes('saeed abdullah')
  ) {
    const text =
      lang === 'urdu'
        ? `شاہ سویٹس اینڈ بیکرز کے مالک سعید عبداللہ شاہ ہیں۔\n\nرابطہ نمبر: [${ownerNumber}](tel:${ownerNumber})`
        : lang === 'roman'
        ? `Shah Sweets and Bakers ke owner Saeed Abdullah Shah hain.\n\nContact number: [${ownerNumber}](tel:${ownerNumber})`
        : `The owner of Shah Sweets and Bakers is Saeed Abdullah Shah.\n\nContact number: [${ownerNumber}](tel:${ownerNumber})`;

    return {
      text,
      quickActions: [
        { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
        { label: 'Chat on WhatsApp', type: 'whatsapp', url: whatsAppUrl },
      ],
    };
  }

  // 2. Exact Natural Greetings
  if (q === 'hi' || q === 'hi!' || q === 'hi.') {
    return { text: 'Hi! Welcome to Shah Sweets and Bakers. How can I help you today?' };
  }
  if (q === 'hello' || q === 'hello!' || q === 'hello.') {
    return { text: 'Hello! Welcome to Shah Sweets and Bakers. What would you like to know?' };
  }
  if (q === 'hey' || q === 'hey!' || q === 'hey.') {
    return { text: 'Hey! How can I assist you today?' };
  }
  if (
    q.includes('assalamualaikum') ||
    q.includes('asalam o alaikum') ||
    q.includes('assalam alaikum') ||
    q.includes('assalamu alaikum')
  ) {
    return { text: 'Wa Alaikum Assalam! Welcome to Shah Sweets and Bakers. How may I help you?' };
  }
  if (q.includes('السلام علیکم') || q.includes('اسلام علیکم')) {
    return { text: 'وعلیکم السلام! شاہ سویٹس اینڈ بیکرز میں خوش آمدید۔ میں آپ کی کیا مدد کر سکتا ہوں؟' };
  }
  if (q === 'salam' || q === 'salam!' || q === 'slam') {
    return { text: 'Wa Alaikum Assalam! How can I help you?' };
  }
  if (q.includes('thank you') || q.includes('thanks')) {
    return { text: "You're welcome! Thank you for choosing Shah Sweets and Bakers." };
  }
  if (q.includes('شکریہ') || q.includes('shukriya')) {
    return {
      text: lang === 'urdu' ? 'شکریہ! شاہ سویٹس اینڈ بیکرز منتخب کرنے کا شکریہ۔' : "You're welcome! Thank you for choosing Shah Sweets and Bakers.",
    };
  }
  if (q.includes('goodbye') || q === 'bye' || q === 'bye!' || q === 'bye bye') {
    return { text: 'Goodbye! Have a wonderful day.' };
  }
  if (q.includes('اللہ حافظ') || q.includes('allah hafiz')) {
    return {
      text: lang === 'urdu' ? 'اللہ حافظ! آپ کا دن اچھا گزرے۔' : 'Allah Hafiz! Have a wonderful day.',
    };
  }

  // 3. Timings & Opening Hours (Exact: 6:00 AM – 10:00 PM)
  if (
    q.includes('hour') ||
    q.includes('timing') ||
    q.includes('open') ||
    q.includes('close') ||
    q.includes('waqt') ||
    q.includes('time') ||
    q.includes('kab')
  ) {
    const text =
      lang === 'urdu'
        ? `شاہ سویٹس اینڈ بیکرز روزانہ **صبح 6:00 بجے سے رات 10:00 بجے** تک کھلا رہتا ہے۔\n\n• کھلنے کا وقت: صبح 6:00 بجے\n• بند ہونے کا وقت: رات 10:00 بجے\n\nرابطہ کے لیے کال کریں: [${ownerNumber}](tel:${ownerNumber})`
        : lang === 'roman'
        ? `Shah Sweets and Bakers rozana **6:00 AM se 10:00 PM** tak open rehta hai.\n\n• Opening time: 6:00 AM\n• Closing time: 10:00 PM\n\nRabta karne ke liye call karein: [${ownerNumber}](tel:${ownerNumber})`
        : `Shah Sweets and Bakers is open daily from **6:00 AM to 10:00 PM**.\n\n• **Opening time:** 6:00 AM\n• **Closing time:** 10:00 PM\n• **Working hours:** 6:00 AM – 10:00 PM\n\nFor any inquiries or morning orders, feel free to call our owner at **[${ownerNumber}](tel:${ownerNumber})**.`;

    return {
      text,
      quickActions: [
        { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
        { label: 'Chat on WhatsApp', type: 'whatsapp', url: whatsAppUrl },
      ],
    };
  }

  // 4. Contact & Phone
  if (
    q.includes('contact') ||
    q.includes('phone') ||
    q.includes('number') ||
    q.includes('call') ||
    q.includes('whatsapp') ||
    q.includes('rabta')
  ) {
    const text =
      lang === 'urdu'
        ? `آپ شاہ سویٹس اینڈ بیکرز کے مالک سے رابطہ کر سکتے ہیں:\n\n• رابطہ نمبر: [${ownerNumber}](tel:${ownerNumber})\n• اوقات: صبح 6:00 بجے تا رات 10:00 بجے`
        : lang === 'roman'
        ? `Aap Shah Sweets and Bakers ke owner se rabta kar sakte hain:\n\n• Contact Number: [${ownerNumber}](tel:${ownerNumber})\n• Timings: 6:00 AM – 10:00 PM Daily`
        : `You can directly reach the owner of Shah Sweets and Bakers:\n\n• **Owner Contact Number:** **[${ownerNumber}](tel:${ownerNumber})**\n• **Working Hours:** 6:00 AM – 10:00 PM Daily`;

    return {
      text,
      quickActions: [
        { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
        { label: 'WhatsApp Owner', type: 'whatsapp', url: whatsAppUrl },
      ],
    };
  }

  // 5. Location & Directions
  if (
    q.includes('where') ||
    q.includes('location') ||
    q.includes('address') ||
    q.includes('kahan') ||
    q.includes('direction') ||
    q.includes('branch') ||
    q.includes('map') ||
    q.includes('shabqadar') ||
    q.includes('peshawar road')
  ) {
    const text =
      lang === 'urdu'
        ? `ہم پشاور روڈ شبقدر، 25000، پاکستان میں واقع ہیں۔ روزانہ صبح 6:00 بجے سے رات 10:00 بجے تک کھلے ہیں۔ مالک سے رابطہ: [${ownerNumber}](tel:${ownerNumber})۔`
        : lang === 'roman'
        ? `Hum Peshawar Road Shabqadar, 25000, Pakistan par waqia hain. Rozana 6:00 AM se 10:00 PM tak open rehte hain. Owner rabta: [${ownerNumber}](tel:${ownerNumber}).`
        : `Shah Sweets and Bakers is located at **Peshawar Road Shabqadar, 25000**, Pakistan.\n\nOur doors are open daily from 6:00 AM to 10:00 PM. If you need help finding us, call owner contact **[${ownerNumber}](tel:${ownerNumber})**.`;

    return {
      text,
      quickActions: [
        {
          label: 'Google Maps Directions',
          type: 'directions',
          url:
            settings.googleMapsQueryUrl ||
            'https://www.google.com/maps/search/?api=1&query=Shah+Sweets+and+Bakers+Peshawar+Road+Shabqadar+25000',
        },
        { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
      ],
    };
  }

  // 6. Pastries Category Inquiry ("What pastries do you have?")
  if (q.includes('pastr') || q.includes('پیسٹری')) {
    const pastryItems = products.filter(
      (p) => (p.name || '').toLowerCase().includes('pastry') || (p.name || '').includes('پیسٹری')
    );
    if (pastryItems.length > 0) {
      if (lang === 'urdu') {
        const listStr = pastryItems
          .map((p) => {
            const { urdu } = parseProductNames(p.name);
            const { ur, numPrice } = getProductUnit(p);
            return `${urdu} (${numPrice} روپے ${ur})`;
          })
          .join('، ');
        return {
          text: `ہمارے پاس ${listStr} دستیاب ہیں۔ آرڈر کے لیے مالک سے رابطہ کریں: [${ownerNumber}](tel:${ownerNumber})۔`,
          quickActions: [
            { label: 'Order on WhatsApp', type: 'whatsapp', url: whatsAppUrl },
            { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
          ],
        };
      }
      if (lang === 'roman') {
        const listStr = pastryItems
          .map((p) => {
            const { english } = parseProductNames(p.name);
            const { en, numPrice } = getProductUnit(p);
            return `${english} (Rs. ${numPrice} ${en})`;
          })
          .join(', ');
        return {
          text: `Hamare paas ${listStr} available hain. Order karne ke liye call karein: [${ownerNumber}](tel:${ownerNumber}).`,
          quickActions: [
            { label: 'Order on WhatsApp', type: 'whatsapp', url: whatsAppUrl },
            { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
          ],
        };
      }
      const listStr = pastryItems
        .map((p) => {
          const { english } = parseProductNames(p.name);
          const { en, numPrice } = getProductUnit(p);
          return `${english} (Rs. ${numPrice} ${en})`;
        })
        .join(', ');
      return {
        text: `We have ${listStr}. To place an order, call our owner at [${ownerNumber}](tel:${ownerNumber}).`,
        quickActions: [
          { label: 'Order on WhatsApp', type: 'whatsapp', url: whatsAppUrl },
          { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
        ],
      };
    }
  }

  // 7. Specific Product Search across dynamic catalog with fuzzy relevance scoring
  const scoredProducts = products
    .map((p) => {
      const rawName = (p.name || '').toLowerCase();
      const { english, urdu } = parseProductNames(p.name);
      const enLower = english.toLowerCase();
      const urLower = urdu.toLowerCase();
      let score = 0;

      if (q.includes(enLower) || enLower.includes(q)) score += 20;
      if (q.includes(urLower) || urLower.includes(q)) score += 20;

      const words = enLower.split(/\s+/).filter((w) => w.length >= 3 && !['and', 'the', 'for'].includes(w));
      for (const w of words) {
        if (q.includes(w)) score += 4;
      }
      const urWords = urLower.split(/\s+/).filter((w) => w.length >= 2);
      for (const w of urWords) {
        if (q.includes(w)) score += 5;
      }

      return { product: p, score, english, urdu };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const matchedItem = scoredProducts[0];

  if (matchedItem) {
    const p = matchedItem.product;
    const { english, urdu } = parseProductNames(p.name);
    const { en, ur, numPrice } = getProductUnit(p);

    let text = '';
    if (lang === 'urdu') {
      text = `${urdu} کی قیمت ${numPrice.toLocaleString()} روپے ${ur} ہے۔\n\nآرڈر کے لیے مالک سے رابطہ کریں: [${ownerNumber}](tel:${ownerNumber})۔`;
    } else if (lang === 'roman') {
      text = `${english} ki price Rs. ${numPrice.toLocaleString()}${en ? ' ' + en : ''} hai.\n\nOrder karne ke liye call karein: [${ownerNumber}](tel:${ownerNumber}).`;
    } else {
      text = `${english} is Rs. ${numPrice.toLocaleString()}${en ? ' ' + en : ''}.\n\nTo place an order, call our owner at [${ownerNumber}](tel:${ownerNumber}).`;
    }

    return {
      text,
      quickActions: [
        {
          label: 'Order on WhatsApp',
          type: 'whatsapp',
          url: `${whatsAppUrl}?text=${encodeURIComponent(
            `Assalam-o-Alaikum Shah Sweets and Bakers, I would like to order ${english}.`
          )}`,
        },
        { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
      ],
    };
  }

  // 8. General Products / Categories List
  if (
    q.includes('product') ||
    q.includes('item') ||
    q.includes('menu') ||
    q.includes('cake') ||
    q.includes('sweet') ||
    q.includes('mithai') ||
    q.includes('bakery') ||
    q.includes('biscuit') ||
    q.includes('list')
  ) {
    const allProductNames = products
      .slice(0, 8)
      .map((p) => {
        const { english } = parseProductNames(p.name);
        const { en, numPrice } = getProductUnit(p);
        return `• **${english}**: Rs. ${numPrice.toLocaleString()}${en ? ' ' + en : ''}`;
      })
      .join('\n');

    return {
      text: `Here are our fresh delicacies available at Shah Sweets and Bakers:\n\n${allProductNames}\n\nCall our owner at **[${ownerNumber}](tel:${ownerNumber})** to place an order.`,
      quickActions: [
        { label: 'Call 03059898409', type: 'call', url: `tel:${ownerNumber}` },
        { label: 'Order on WhatsApp', type: 'whatsapp', url: whatsAppUrl },
      ],
    };
  }

  // 9. Polite fallback
  const fallbackText =
    lang === 'urdu'
      ? `اس معلومات کی تصدیق کے لیے براہ کرم بیکری سے [${ownerNumber}](tel:${ownerNumber}) پر رابطہ کریں (صبح 6:00 تا رات 10:00)۔`
      : lang === 'roman'
      ? `Is item ki information abhi available nahi hai. Barah-e-karam confirmation ke liye bakery se [${ownerNumber}](tel:${ownerNumber}) par rabta karein.`
      : `Information for that item is not currently available at Shah Sweets and Bakers. Please contact the bakery at [${ownerNumber}](tel:${ownerNumber}) for confirmation.`;

  return {
    text: fallbackText,
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
