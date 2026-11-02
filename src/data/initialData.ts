import { Product, Category, SpecialOffer, BusinessSettings } from '../types';
import shahSweetsLogo from '../assets/images/shah_sweets_logo_1792472729789.jpg';
import heroSweetsBanner from '../assets/images/hero_sweets_banner_1792472731048.jpg';
import categoryMithai from '../assets/images/category_mithai_1792472732632.jpg';
import categoryCakes from '../assets/images/category_cakes_1792472733255.jpg';
import categoryBakery from '../assets/images/category_bakery_1792472733007.jpg';

export const BRAND_ASSETS = {
  logo: shahSweetsLogo,
  heroBanner: heroSweetsBanner,
  categoryMithai: categoryMithai,
  categoryCakes: categoryCakes,
  categoryBakery: categoryBakery,
};

export const INITIAL_SETTINGS: BusinessSettings = {
  businessName: 'Shah Sweets and Bakers',
  tagline: 'Taste the Tradition, Love Every Bite',
  location: 'Peshawar Road Shabqadar, Shabqadar, 25000',
  address: 'Shah Sweets and Bakers, Peshawar Road Shabqadar, Shabqadar, 25000',
  postalCode: '25000',
  country: 'Pakistan',
  rating: 4.1,
  reviewsCount: 176,
  closingTime: '10:00 PM',
  openingHoursText: 'Daily: 6:00 AM – 10:00 PM',
  phoneConfigured: true,
  phoneNumber: '03059898409',
  whatsAppNumber: '03059898409',
  phoneDisplayNote: 'Owner Contact & WhatsApp: 03059898409',
  googleMapsQueryUrl: 'https://www.google.com/maps/dir/?api=1&destination=Shah+Sweets+and+Bakers+Peshawar+Road+Shabqadar+25000',
  googleMapsPlaceUrl: 'https://www.google.com/maps/search/?api=1&query=Shah+Sweets+and+Bakers+Peshawar+Road+Shabqadar+25000',
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-mithai',
    name: 'Traditional Mithai',
    slug: 'traditional-mithai',
    description: 'Authentic desi ghee sweets, fresh khoya delicacies, and traditional recipes crafted with precision.',
    image: BRAND_ASSETS.categoryMithai,
  },
  {
    id: 'cat-cakes',
    name: 'Cakes & Pastries',
    slug: 'cakes-pastries',
    description: 'Freshly baked celebration cakes, rich velvet gateaux, and customized occasion centerpieces.',
    image: BRAND_ASSETS.categoryCakes,
  },
  {
    id: 'cat-bakery',
    name: 'Fresh Bakery & Savories',
    slug: 'fresh-bakery-savories',
    description: 'Handcrafted Nan Khatai, flaky oven-fresh patties, tea rusks, and daily artisanal breads.',
    image: BRAND_ASSETS.categoryBakery,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-gulab-jamun',
    name: 'Royal Khoya Gulab Jamun',
    category: 'Traditional Mithai',
    image: BRAND_ASSETS.categoryMithai,
    description: 'Soft, golden-fried milk-solid dumplings soaked in aromatic cardamom-infused saffron sugar syrup, garnished with crushed pistachio and silver vark foil.',
    price: 360,
    availability: 'in_stock',
    hasVariants: true,
    variants: [
      { id: 'v-250', label: '250 g', price: 360, inStock: true },
      { id: 'v-500', label: '500 g', price: 700, inStock: true },
      { id: 'v-1000', label: '1 kg (Family Box)', price: 1350, inStock: true },
    ],
    isFeatured: true,
    badge: 'Customer Favorite',
  },
  {
    id: 'prod-pistachio-barfi',
    name: 'Saffron & Pistachio Barfi',
    category: 'Traditional Mithai',
    image: BRAND_ASSETS.categoryMithai,
    description: 'Dense, rich milk confectionery infused with genuine saffron threads, layered with roasted emerald pistachios and adorned with pure silver edible vark.',
    price: 420,
    availability: 'in_stock',
    hasVariants: true,
    variants: [
      { id: 'v-250', label: '250 g', price: 420, inStock: true },
      { id: 'v-500', label: '500 g', price: 820, inStock: true },
      { id: 'v-1000', label: '1 kg', price: 1600, inStock: true },
    ],
    isFeatured: true,
    badge: 'Artisanal Recipe',
  },
  {
    id: 'prod-cham-cham',
    name: 'Kashmiri Malai Cham Cham',
    category: 'Traditional Mithai',
    image: BRAND_ASSETS.categoryMithai,
    description: 'Traditional oval chenna sweets poached in delicate rose syrup, coated in fine desiccated coconut and topped with clotted fresh malai cream.',
    price: 380,
    availability: 'in_stock',
    hasVariants: true,
    variants: [
      { id: 'v-250', label: '250 g', price: 380, inStock: true },
      { id: 'v-500', label: '500 g', price: 740, inStock: true },
      { id: 'v-1000', label: '1 kg', price: 1450, inStock: true },
    ],
    isFeatured: false,
  },
  {
    id: 'prod-gold-celebration-cake',
    name: 'Artisanal Berry & Gold Celebration Cake',
    category: 'Cakes & Pastries',
    image: BRAND_ASSETS.categoryCakes,
    description: 'Luxurious two-tier bakery masterpiece layered with rich vanilla sponge, dark Belgian chocolate ganache drip, forest berries, and edible gold flakes.',
    price: 1800,
    availability: 'in_stock',
    hasVariants: true,
    variants: [
      { id: 'v-1lb', label: '1 lb (Serves 4–6)', price: 1800, inStock: true },
      { id: 'v-2lb', label: '2 lbs (Serves 8–12)', price: 3400, inStock: true },
      { id: 'v-3lb', label: '3 lbs (Celebration Size)', price: 4900, inStock: true },
    ],
    isFeatured: true,
    badge: 'Chef Signature',
  },
  {
    id: 'prod-chocolate-fudge-cake',
    name: 'Decadent Dark Chocolate Fudge Cake',
    category: 'Cakes & Pastries',
    image: BRAND_ASSETS.categoryCakes,
    description: 'Moist Dutch-cocoa sponge filled and frosted with silky dark chocolate fudge cream, finished with hand-piped chocolate rosettes.',
    price: 1650,
    availability: 'in_stock',
    hasVariants: true,
    variants: [
      { id: 'v-1lb', label: '1 lb', price: 1650, inStock: true },
      { id: 'v-2lb', label: '2 lbs', price: 3100, inStock: true },
    ],
    isFeatured: false,
  },
  {
    id: 'prod-nan-khatai',
    name: 'Shabqadar Special Cardamom Nan Khatai',
    category: 'Fresh Bakery & Savories',
    image: BRAND_ASSETS.categoryBakery,
    description: 'Traditional crumbly desi shortbread biscuits baked to golden perfection with roasted whole almonds, green cardamom, and pure ghee.',
    price: 250,
    availability: 'in_stock',
    hasVariants: true,
    variants: [
      { id: 'v-250', label: '250 g', price: 250, inStock: true },
      { id: 'v-500', label: '500 g', price: 480, inStock: true },
      { id: 'v-1000', label: '1 kg (Gift Box)', price: 920, inStock: true },
    ],
    isFeatured: true,
    badge: 'Fresh Daily',
  },
  {
    id: 'prod-puff-patties',
    name: 'Flaky Golden Bakery Patties',
    category: 'Fresh Bakery & Savories',
    image: BRAND_ASSETS.categoryBakery,
    description: 'Crispy thousand-layer butter puff pastry freshly baked with mildly spiced savory filling. A beloved afternoon teatime classic.',
    price: 120,
    availability: 'in_stock',
    hasVariants: true,
    variants: [
      { id: 'v-single', label: 'Single Piece', price: 120, inStock: true },
      { id: 'v-box6', label: 'Box of 6', price: 680, inStock: true },
      { id: 'v-box12', label: 'Box of 12 (Catering Pack)', price: 1300, inStock: true },
    ],
    isFeatured: false,
  },
  {
    id: 'prod-tea-rusks',
    name: 'Crispy Cardamom Tea Rusks',
    category: 'Fresh Bakery & Savories',
    image: BRAND_ASSETS.categoryBakery,
    description: 'Double-baked crunchy golden tea rusks infused with crushed fennel and green cardamom, specially crafted to pair with hot chai.',
    price: 220,
    availability: 'in_stock',
    hasVariants: true,
    variants: [
      { id: 'v-packet', label: 'Standard Pack (350 g)', price: 220, inStock: true },
      { id: 'v-family', label: 'Family Pack (750 g)', price: 440, inStock: true },
    ],
    isFeatured: false,
  },
];

export const INITIAL_OFFERS: SpecialOffer[] = [
  {
    id: 'offer-1',
    title: 'Festive & Celebration Family Mithai Box',
    discountBadge: 'Complimentary Luxury Box',
    description: 'Order any 1 kg or 2 kg Mithai selection and receive our custom gold-embossed Shah Sweets presentation gift box.',
    highlightText: 'Perfect for weddings, Eid celebrations, and guest visits in Shabqadar',
    active: true,
    categoryTag: 'Traditional Mithai',
  },
  {
    id: 'offer-2',
    title: 'Weekend Tea Time Bakery Assortment',
    discountBadge: 'Fresh Oven Batch',
    description: 'Combine 500g Nan Khatai with half a dozen fresh bakery puff patties for your family teatime gatherings.',
    highlightText: 'Freshly baked daily every morning and afternoon',
    active: true,
    categoryTag: 'Fresh Bakery',
  },
];
