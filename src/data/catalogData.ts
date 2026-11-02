export interface CatalogVariant {
  id: string;
  label: string;
  price: number;
  inStock: boolean;
}

export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  hasVariants?: boolean;
  variants?: CatalogVariant[];
  isFeatured?: boolean;
  badge?: string;
  categoryAssetKey: 'categoryMithai' | 'categoryCakes' | 'categoryBakery';
}

export const STORE_SETTINGS = {
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

export const RAW_CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: 'prod-gulab-jamun',
    name: 'Royal Khoya Gulab Jamun',
    category: 'Traditional Mithai',
    categoryAssetKey: 'categoryMithai',
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
    categoryAssetKey: 'categoryMithai',
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
    categoryAssetKey: 'categoryMithai',
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
    categoryAssetKey: 'categoryCakes',
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
    categoryAssetKey: 'categoryCakes',
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
    categoryAssetKey: 'categoryBakery',
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
    categoryAssetKey: 'categoryBakery',
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
    categoryAssetKey: 'categoryBakery',
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
