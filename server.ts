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
function buildSystemInstruction(storeContext?: any): string {
  const businessName = 'Shah Sweets and Bakers';
  const openingHours = '6:00 AM – 10:00 PM';
  const openingTime = '6:00 AM';
  const closingTime = '10:00 PM';
  const ownerContact = '03059898409';
  const location = storeContext?.location || INITIAL_SETTINGS.location;
  const address = storeContext?.address || INITIAL_SETTINGS.address;

  // Use provided products from client or fallback to INITIAL_PRODUCTS
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
- Opening Time: ${openingTime}
- Closing Time: ${closingTime}
- Working Hours: ${openingHours} Daily
- Owner Contact Number: ${ownerContact} (Always format as clickable telephone link: [${ownerContact}](tel:${ownerContact}))
- Location & Address: ${location} (${address})
- Google Rating: 4.1/5.0 from 176 Google Reviews

COMPLETE AND EXHAUSTIVE PRODUCT CATALOG (SOURCE OF TRUTH):
${productsList}

BEHAVIOR AND RULES:
1. Act as a polite, welcoming, professional customer support representative for Shah Sweets and Bakers.
2. Multilingual: Understand and naturally reply in English, Urdu (اردو), or Roman Urdu (e.g. "Dukan kab khulti hai?", "Chocolate cake kitne ka hai?").
3. Give short, clear, useful, and friendly answers.
4. If a customer asks about opening hours, provide the exact timings: 6:00 AM to 10:00 PM daily.
5. If a customer wants to contact the owner or staff, provide the owner contact number ${ownerContact} with a clickable telephone link ([${ownerContact}](tel:${ownerContact})). NEVER invent any other phone number.
6. When asked about ANY product, retrieve its actual name, price in PKR, portion sizes, and description from the product catalog above. NEVER invent or hallucinate prices, ingredients, or items.
7. If a customer asks about a product that is not in the product catalog above, politely state that information for that product is not currently available at Shah Sweets and Bakers, and advise them to contact the owner directly at [${ownerContact}](tel:${ownerContact}).
8. Answer follow-up questions intelligently while maintaining conversational context.`;
}

// API Route: AI Customer Support Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, storeContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

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

        // Convert messages to GenAI contents format
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

        // 4.5s timeout race so user interface is never blocked or stalled
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

    // Grounded knowledge response when API key is not yet configured or on timeout
    const latestUserMsg = messages[messages.length - 1]?.content || '';
    const q = latestUserMsg.toLowerCase().trim();
    const ownerNumber = '03059898409';
    const cleanPhone = '923059898409';

    const products =
      storeContext?.sampleProducts && Array.isArray(storeContext.sampleProducts) && storeContext.sampleProducts.length > 0
        ? storeContext.sampleProducts
        : INITIAL_PRODUCTS;

    let fallbackText = `Welcome to Shah Sweets and Bakers! We are open daily from 6:00 AM to 10:00 PM on Peshawar Road Shabqadar. You can reach the owner directly at [${ownerNumber}](tel:${ownerNumber}).`;

    if (q.includes('hour') || q.includes('timing') || q.includes('open') || q.includes('close') || q.includes('waqt') || q.includes('time') || q.includes('kab')) {
      fallbackText = `Shah Sweets and Bakers is open daily from **6:00 AM to 10:00 PM**.\n\n• **Opening time:** 6:00 AM\n• **Closing time:** 10:00 PM\n• **Working hours:** 6:00 AM – 10:00 PM\n\nFor any inquiries, feel free to call our owner at [${ownerNumber}](tel:${ownerNumber}).`;
    } else if (q.includes('contact') || q.includes('owner') || q.includes('phone') || q.includes('number') || q.includes('call') || q.includes('whatsapp') || q.includes('rabta')) {
      fallbackText = `You can directly contact the owner of Shah Sweets and Bakers:\n\n• **Owner Contact Number:** [${ownerNumber}](tel:${ownerNumber})\n• **Working Hours:** 6:00 AM – 10:00 PM Daily`;
    } else if (q.includes('where') || q.includes('location') || q.includes('address') || q.includes('kahan') || q.includes('direction')) {
      fallbackText = `We are located at **Peshawar Road Shabqadar, 25000**, Pakistan. We are open from 6:00 AM to 10:00 PM daily. Contact owner at [${ownerNumber}](tel:${ownerNumber}).`;
    } else {
      // Product search across entire catalog
      const matched = products.find((p: any) => {
        const name = (p.name || '').toLowerCase();
        return q.includes(name) || name.split(/\s+/).some((word: string) => word.length >= 4 && q.includes(word));
      });

      if (matched) {
        const variants = matched.variants && matched.variants.length > 0
          ? `\n\n**Portion Sizes & Prices:**\n` + (Array.isArray(matched.variants) ? matched.variants.map((v: any) => typeof v === 'string' ? `• ${v}` : `• ${v.label}: PKR ${v.price}`).join('\n') : '')
          : `\n\n**Price:** PKR ${matched.price}`;

        fallbackText = `**${matched.name}** (${matched.category})\n\n${matched.description || ''}${variants}\n\nTo place an order, call our owner at [${ownerNumber}](tel:${ownerNumber}).`;
      } else if (q.includes('cake') || q.includes('sweet') || q.includes('product') || q.includes('mithai') || q.includes('menu')) {
        const list = products.slice(0, 5).map((p: any) => `• **${p.name}** (PKR ${p.price})`).join('\n');
        fallbackText = `Here are some of our fresh products:\n\n${list}\n\n...plus wedding cakes, Nan Khatai, and celebration boxes. Call owner at [${ownerNumber}](tel:${ownerNumber}) to order.`;
      } else if (q.includes('salam') || q.includes('hello') || q.includes('hi') || q.includes('kese') || q.includes('kaise')) {
        fallbackText = `Wa Alaikum Assalam! Welcome to Shah Sweets and Bakers. We are open daily from 6:00 AM to 10:00 PM. How can I help you with our cakes, sweets, or bakery products today?`;
      } else {
        fallbackText = `Information for that item is not currently available at Shah Sweets and Bakers. For custom requests or further details, please contact the owner directly at [${ownerNumber}](tel:${ownerNumber}) (6:00 AM – 10:00 PM).`;
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
