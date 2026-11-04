import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { RAW_CATALOG_PRODUCTS as INITIAL_PRODUCTS, STORE_SETTINGS as INITIAL_SETTINGS } from './src/data/catalogData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));

// Helper: Format system instructions with current store context and full product list
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

// Helper: Format system instructions with current store context and dynamic live product list
function buildSystemInstruction(storeContext?: any): string {
  const businessName = 'Shah Sweets and Bakers';
  const ownerName = 'Saeed Abdullah Shah';
  const openingHours = '6:00 AM – 10:00 PM';
  const openingTime = '6:00 AM';
  const closingTime = '10:00 PM';
  const ownerContact = '03059898409';
  const location = storeContext?.location || INITIAL_SETTINGS.location;
  const address = storeContext?.address || INITIAL_SETTINGS.address;

  // Use dynamic products provided from client store or fallback to INITIAL_PRODUCTS
  const rawProducts =
    storeContext?.sampleProducts && Array.isArray(storeContext.sampleProducts) && storeContext.sampleProducts.length > 0
      ? storeContext.sampleProducts
      : INITIAL_PRODUCTS.map((p) => ({
          name: p.name,
          category: p.category,
          price: p.price,
          variants: p.hasVariants && p.variants ? p.variants.map((v) => `${v.label}: PKR ${v.price}`) : undefined,
          description: p.description,
          availability: p.availability,
        }));

  const productsList = rawProducts
    .map((p: any) => {
      const variants = p.variants ? ` (Portions: ${p.variants.join(', ')})` : '';
      return `• ${p.name} [${p.category}]: PKR ${p.price}${variants} — Status: ${p.availability}. Description: ${p.description || ''}`;
    })
    .join('\n');

  return `You are the official AI Customer Support Agent for "${businessName}", located on Peshawar Road Shabqadar, Pakistan.

EXACT VERIFIED BUSINESS FACTS:
- Business Name: ${businessName}
- Owner Name: ${ownerName}
- If a customer asks who the owner or founder is (in English, Urdu, or Roman Urdu, e.g. "Who is the owner?", "Who owns Shah Sweets and Bakers?", "مالک کون ہے؟", "اس بیکری کا مالک کون ہے؟", "Owner kaun hai?"), answer clearly:
  • English: "The owner of Shah Sweets and Bakers is Saeed Abdullah Shah."
  • Urdu: "شاہ سویٹس اینڈ بیکرز کے مالک سعید عبداللہ شاہ ہیں۔"
  • Roman Urdu: "Shah Sweets and Bakers ke owner Saeed Abdullah Shah hain."
  NEVER invent any additional personal info about the owner.
- Opening Time: ${openingTime}
- Closing Time: ${closingTime}
- Working Hours: ${openingHours} Daily
- Owner Contact Number: ${ownerContact} (Format as clickable link: [${ownerContact}](tel:${ownerContact}))
- Location & Address: ${location} (${address})
- Google Rating: 4.1/5.0 from 176 Google Reviews

NATURAL GREETINGS AND CONVERSATION:
Respond naturally in the same language as the customer:
- Customer: "Hi" -> "Hi! Welcome to Shah Sweets and Bakers. How can I help you today?"
- Customer: "Hello" -> "Hello! Welcome to Shah Sweets and Bakers. What would you like to know?"
- Customer: "Hey" -> "Hey! How can I assist you today?"
- Customer: "Assalamualaikum" or "Salam" -> "Wa Alaikum Assalam! Welcome to Shah Sweets and Bakers. How may I help you?"
- Customer: "السلام علیکم" -> "وعلیکم السلام! شاہ سویٹس اینڈ بیکرز میں خوش آمدید۔ میں آپ کی کیا مدد کر سکتا ہوں؟"
- Customer: "Thank you" / "Thanks" -> "You're welcome! Thank you for choosing Shah Sweets and Bakers."
- Customer: "شکریہ" -> "شکریہ! شاہ سویٹس اینڈ بیکرز منتخب کرنے کا شکریہ۔"
- Customer: "Goodbye" / "Bye" -> "Goodbye! Have a wonderful day."
- Customer: "اللہ حافظ" -> "اللہ حافظ! آپ کا دن اچھا گزرے۔"

LANGUAGE & PRICING RULES:
1. Always respond in the language the customer uses (English, Urdu, or Roman Urdu).
   Examples:
   • "Chocolate cake kitne ka hai?" -> "Chocolate Cake ki price Rs. 800 per pound hai."
   • "بادام بسکٹ کی قیمت؟" -> "بادام بسکٹ کی قیمت 1200 روپے فی کلو ہے۔"
   • "What pastries do you have?" -> "We have Dry Pastry (Rs. 50 each), Pineapple Pastry (Rs. 100 each), and Chocolate Pastry (Rs. 100 each)."
2. When asked about product categories (cakes, pastries, biscuits, sweets), list the exact matching items from the live catalog with their prices and units.
3. Retrieve all product information dynamically from the catalog below. Never invent or hallucinate prices.

DYNAMIC LIVE PRODUCT CATALOG:
${productsList}`;
}

// API Route: AI Customer Support Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, storeContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    const latestUserMsg = messages[messages.length - 1]?.content || '';
    const q = latestUserMsg.toLowerCase().trim();
    const lang = detectLanguage(latestUserMsg);
    const ownerNumber = '03059898409';
    const cleanPhone = '923059898409';
    const ownerName = 'Saeed Abdullah Shah';

    const products =
      storeContext?.sampleProducts && Array.isArray(storeContext.sampleProducts) && storeContext.sampleProducts.length > 0
        ? storeContext.sampleProducts
        : INITIAL_PRODUCTS;

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if real Gemini API Key is available
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 5) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const contents = messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: buildSystemInstruction(storeContext),
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 4500)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const replyText = response?.text;
        if (replyText) {
          res.json({
            reply: replyText,
            source: 'gemini',
          });
          return;
        }
      } catch (geminiError: any) {
        console.warn('Gemini API notice:', geminiError?.message || geminiError);
      }
    }

    // Grounded knowledge response when API key is not configured or on timeout
    let fallbackText = '';

    // 1. Owner queries (Who is the owner, who owns, founder, مالک کون ہے)
    if (
      q.includes('owner') ||
      q.includes('founder') ||
      q.includes('مالک') ||
      q.includes('malik') ||
      q.includes('who owns') ||
      q.includes('saeed abdullah')
    ) {
      if (lang === 'urdu') {
        fallbackText = `شاہ سویٹس اینڈ بیکرز کے مالک سعید عبداللہ شاہ ہیں۔\n\nرابطہ نمبر: [${ownerNumber}](tel:${ownerNumber})`;
      } else if (lang === 'roman') {
        fallbackText = `Shah Sweets and Bakers ke owner Saeed Abdullah Shah hain.\n\nContact number: [${ownerNumber}](tel:${ownerNumber})`;
      } else {
        fallbackText = `The owner of Shah Sweets and Bakers is Saeed Abdullah Shah.\n\nContact number: [${ownerNumber}](tel:${ownerNumber})`;
      }
    }
    // 2. Exact Natural Greetings
    else if (q === 'hi' || q === 'hi!' || q === 'hi.') {
      fallbackText = 'Hi! Welcome to Shah Sweets and Bakers. How can I help you today?';
    } else if (q === 'hello' || q === 'hello!' || q === 'hello.') {
      fallbackText = 'Hello! Welcome to Shah Sweets and Bakers. What would you like to know?';
    } else if (q === 'hey' || q === 'hey!' || q === 'hey.') {
      fallbackText = 'Hey! How can I assist you today?';
    } else if (
      q.includes('assalamualaikum') ||
      q.includes('asalam o alaikum') ||
      q.includes('assalam alaikum') ||
      q.includes('assalamu alaikum')
    ) {
      fallbackText = 'Wa Alaikum Assalam! Welcome to Shah Sweets and Bakers. How may I help you?';
    } else if (q.includes('السلام علیکم') || q.includes('اسلام علیکم')) {
      fallbackText = 'وعلیکم السلام! شاہ سویٹس اینڈ بیکرز میں خوش آمدید۔ میں آپ کی کیا مدد کر سکتا ہوں؟';
    } else if (q === 'salam' || q === 'salam!' || q === 'slam') {
      fallbackText = 'Wa Alaikum Assalam! How can I help you?';
    } else if (q.includes('thank you') || q.includes('thanks')) {
      fallbackText = "You're welcome! Thank you for choosing Shah Sweets and Bakers.";
    } else if (q.includes('شکریہ') || q.includes('shukriya')) {
      fallbackText = lang === 'urdu' ? 'شکریہ! شاہ سویٹس اینڈ بیکرز منتخب کرنے کا شکریہ۔' : "You're welcome! Thank you for choosing Shah Sweets and Bakers.";
    } else if (q.includes('goodbye') || q === 'bye' || q === 'bye!' || q === 'bye bye') {
      fallbackText = 'Goodbye! Have a wonderful day.';
    } else if (q.includes('اللہ حافظ') || q.includes('allah hafiz')) {
      fallbackText = lang === 'urdu' ? 'اللہ حافظ! آپ کا دن اچھا گزرے۔' : 'Allah Hafiz! Have a wonderful day.';
    }
    // 3. Opening hours / Timings
    else if (q.includes('hour') || q.includes('timing') || q.includes('open') || q.includes('close') || q.includes('waqt') || q.includes('time') || q.includes('kab')) {
      if (lang === 'urdu') {
        fallbackText = `شاہ سویٹس اینڈ بیکرز روزانہ **صبح 6:00 بجے سے رات 10:00 بجے** تک کھلا رہتا ہے۔\n\n• کھلنے کا وقت: صبح 6:00 بجے\n• بند ہونے کا وقت: رات 10:00 بجے\n\nرابطہ کے لیے کال کریں: [${ownerNumber}](tel:${ownerNumber})`;
      } else if (lang === 'roman') {
        fallbackText = `Shah Sweets and Bakers rozana **6:00 AM se 10:00 PM** tak open rehta hai.\n\n• Opening time: 6:00 AM\n• Closing time: 10:00 PM\n\nRabta karne ke liye call karein: [${ownerNumber}](tel:${ownerNumber})`;
      } else {
        fallbackText = `Shah Sweets and Bakers is open daily from **6:00 AM to 10:00 PM**.\n\n• **Opening time:** 6:00 AM\n• **Closing time:** 10:00 PM\n• **Working hours:** 6:00 AM – 10:00 PM\n\nFor any inquiries, feel free to call our owner at [${ownerNumber}](tel:${ownerNumber}).`;
      }
    }
    // 4. Contact / Phone
    else if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('call') || q.includes('whatsapp') || q.includes('rabta')) {
      if (lang === 'urdu') {
        fallbackText = `آپ شاہ سویٹس اینڈ بیکرز کے مالک سے رابطہ کر سکتے ہیں:\n\n• رابطہ نمبر: [${ownerNumber}](tel:${ownerNumber})\n• اوقات: صبح 6:00 بجے تا رات 10:00 بجے`;
      } else if (lang === 'roman') {
        fallbackText = `Aap Shah Sweets and Bakers ke owner se rabta kar sakte hain:\n\n• Contact Number: [${ownerNumber}](tel:${ownerNumber})\n• Timings: 6:00 AM – 10:00 PM Daily`;
      } else {
        fallbackText = `You can directly contact the owner of Shah Sweets and Bakers:\n\n• **Owner Contact Number:** [${ownerNumber}](tel:${ownerNumber})\n• **Working Hours:** 6:00 AM – 10:00 PM Daily`;
      }
    }
    // 5. Location / Directions
    else if (q.includes('where') || q.includes('location') || q.includes('address') || q.includes('kahan') || q.includes('direction')) {
      if (lang === 'urdu') {
        fallbackText = `ہم پشاور روڈ شبقدر، 25000، پاکستان میں واقع ہیں۔ روزانہ صبح 6:00 بجے سے رات 10:00 بجے تک کھلے ہیں۔ مالک سے رابطہ: [${ownerNumber}](tel:${ownerNumber})۔`;
      } else if (lang === 'roman') {
        fallbackText = `Hum Peshawar Road Shabqadar, 25000, Pakistan par waqia hain. Rozana 6:00 AM se 10:00 PM tak open rehte hain. Owner rabta: [${ownerNumber}](tel:${ownerNumber}).`;
      } else {
        fallbackText = `We are located at **Peshawar Road Shabqadar, 25000**, Pakistan. We are open from 6:00 AM to 10:00 PM daily. Contact owner at [${ownerNumber}](tel:${ownerNumber}).`;
      }
    }
    // 6. Category lists: Pastries inquiry ("What pastries do you have?", etc.)
    else if (q.includes('pastr') || q.includes('پیسٹری')) {
      const pastryItems = products.filter((p: any) => (p.name || '').toLowerCase().includes('pastry') || (p.name || '').includes('پیسٹری'));
      if (pastryItems.length > 0) {
        if (lang === 'urdu') {
          const listStr = pastryItems.map((p: any) => {
            const { urdu } = parseProductNames(p.name);
            const { ur, numPrice } = getProductUnit(p);
            return `${urdu} (${numPrice} روپے ${ur})`;
          }).join('، ');
          fallbackText = `ہمارے پاس ${listStr} دستیاب ہیں۔ آرڈر کے لیے مالک سے رابطہ کریں: [${ownerNumber}](tel:${ownerNumber})۔`;
        } else if (lang === 'roman') {
          const listStr = pastryItems.map((p: any) => {
            const { english } = parseProductNames(p.name);
            const { en, numPrice } = getProductUnit(p);
            return `${english} (Rs. ${numPrice} ${en})`;
          }).join(', ');
          fallbackText = `Hamare paas ${listStr} available hain. Order karne ke liye call karein: [${ownerNumber}](tel:${ownerNumber}).`;
        } else {
          const listStr = pastryItems.map((p: any) => {
            const { english } = parseProductNames(p.name);
            const { en, numPrice } = getProductUnit(p);
            return `${english} (Rs. ${numPrice} ${en})`;
          }).join(', ');
          fallbackText = `We have ${listStr}. To place an order, call our owner at [${ownerNumber}](tel:${ownerNumber}).`;
        }
      }
    }
    // 7. Category lists: Cakes inquiry
    else if ((q.includes('what') || q.includes('list') || q.includes('options') || q.includes('kaun') || q.includes('kon') || q.includes('کون')) && (q.includes('cake') || q.includes('کیک'))) {
      const cakeItems = products.filter((p: any) => (p.name || '').toLowerCase().includes('cake') || (p.name || '').includes('کیک'));
      if (cakeItems.length > 0) {
        const listStr = cakeItems.slice(0, 6).map((p: any) => {
          const { english } = parseProductNames(p.name);
          const { en, numPrice } = getProductUnit(p);
          return `• **${english}**: Rs. ${numPrice.toLocaleString()}${en ? ' ' + en : ''}`;
        }).join('\n');
        fallbackText = `Here are our fresh cakes available at Shah Sweets and Bakers:\n\n${listStr}\n\nCall owner at [${ownerNumber}](tel:${ownerNumber}) to order.`;
      }
    }
    // 8. Category lists: Biscuits inquiry
    else if ((q.includes('what') || q.includes('list') || q.includes('options') || q.includes('kaun') || q.includes('kon') || q.includes('کون')) && (q.includes('biscuit') || q.includes('بسکٹ'))) {
      const biscuitItems = products.filter((p: any) => (p.name || '').toLowerCase().includes('biscuit') || (p.name || '').includes('بسکٹ'));
      if (biscuitItems.length > 0) {
        const listStr = biscuitItems.slice(0, 7).map((p: any) => {
          const { english } = parseProductNames(p.name);
          const { en, numPrice } = getProductUnit(p);
          return `• **${english}**: Rs. ${numPrice.toLocaleString()}${en ? ' ' + en : ''}`;
        }).join('\n');
        fallbackText = `Here are our fresh bakery biscuits:\n\n${listStr}\n\nCall owner at [${ownerNumber}](tel:${ownerNumber}) to order.`;
      }
    }
    // 9. Specific Product Search across dynamic catalog with fuzzy relevance scoring
    if (!fallbackText) {
      const scoredProducts = products
        .map((p: any) => {
          const rawName = (p.name || '').toLowerCase();
          const { english, urdu } = parseProductNames(p.name);
          const enLower = english.toLowerCase();
          const urLower = urdu.toLowerCase();
          let score = 0;

          // Exact phrases or Urdu matches
          if (q.includes(enLower) || enLower.includes(q)) score += 20;
          if (q.includes(urLower) || urLower.includes(q)) score += 20;

          // Distinct words matches
          const words = enLower.split(/\s+/).filter((w: string) => w.length >= 3 && !['and', 'the', 'for'].includes(w));
          for (const w of words) {
            if (q.includes(w)) score += 4;
          }
          const urWords = urLower.split(/\s+/).filter((w: string) => w.length >= 2);
          for (const w of urWords) {
            if (q.includes(w)) score += 5;
          }

          return { product: p, score, english, urdu };
        })
        .filter((item: any) => item.score > 0)
        .sort((a: any, b: any) => b.score - a.score);

      const matchedItem = scoredProducts[0];

      if (matchedItem) {
        const p = matchedItem.product;
        const { english, urdu } = parseProductNames(p.name);
        const { en, ur, numPrice } = getProductUnit(p);

        if (lang === 'urdu') {
          fallbackText = `${urdu} کی قیمت ${numPrice.toLocaleString()} روپے ${ur} ہے۔\n\nآرڈر کے لیے مالک سے رابطہ کریں: [${ownerNumber}](tel:${ownerNumber})۔`;
        } else if (lang === 'roman') {
          fallbackText = `${english} ki price Rs. ${numPrice.toLocaleString()}${en ? ' ' + en : ''} hai.\n\nOrder karne ke liye call karein: [${ownerNumber}](tel:${ownerNumber}).`;
        } else {
          fallbackText = `${english} is Rs. ${numPrice.toLocaleString()}${en ? ' ' + en : ''}.\n\nTo place an order, call our owner at [${ownerNumber}](tel:${ownerNumber}).`;
        }
      } else if (q.includes('cake') || q.includes('sweet') || q.includes('product') || q.includes('mithai') || q.includes('menu')) {
        const list = products.slice(0, 5).map((p: any) => {
          const { english } = parseProductNames(p.name);
          return `• **${english}** (Rs. ${Number(p.price).toLocaleString()})`;
        }).join('\n');
        fallbackText = `Here are some of our fresh products:\n\n${list}\n\nCall owner at [${ownerNumber}](tel:${ownerNumber}) to order.`;
      } else {
        fallbackText = lang === 'urdu'
          ? `اس معلومات کی تصدیق کے لیے براہ کرم بیکری سے [${ownerNumber}](tel:${ownerNumber}) پر رابطہ کریں (صبح 6:00 تا رات 10:00)۔`
          : lang === 'roman'
          ? `Is item ki information abhi available nahi hai. Barah-e-karam confirmation ke liye bakery se [${ownerNumber}](tel:${ownerNumber}) par rabta karein.`
          : `Information for that item is not currently available at Shah Sweets and Bakers. Please contact the bakery at [${ownerNumber}](tel:${ownerNumber}) for confirmation.`;
      }
    }

    res.json({
      reply: fallbackText,
      source: 'grounded-fallback',
      quickActions: [
        { label: `Call ${ownerNumber}`, type: 'call', url: `tel:${ownerNumber}` },
        { label: 'Chat on WhatsApp', type: 'whatsapp', url: `https://wa.me/${cleanPhone}` },
      ],
    });
  } catch (err: any) {
    console.error('API Error in /api/ai/chat:', err);
    res.status(500).json({
      error: 'An internal server error occurred while processing your request.',
    });
  }
});

// Explicit SEO endpoints: sitemap.xml & robots.txt
app.get('/sitemap.xml', (_req, res) => {
  const sitemapFile = path.resolve(__dirname, 'public', 'sitemap.xml');
  res.type('application/xml; charset=UTF-8');
  res.sendFile(sitemapFile);
});

app.get('/robots.txt', (_req, res) => {
  const robotsFile = path.resolve(__dirname, 'public', 'robots.txt');
  res.type('text/plain; charset=UTF-8');
  res.sendFile(robotsFile);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Shah Sweets and Bakers Server' });
});

// Setup Vite dev server middlewares or static production files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'public')));
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Shah Sweets & Bakers Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
