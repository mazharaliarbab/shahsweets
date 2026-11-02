export interface WeightVariant {
  id: string;
  label: string; // e.g. "250 g", "500 g", "1 kg", "2 kg", "1 lb", "2 lbs"
  price: number; // specific price in PKR for this variant
  inStock?: boolean;
}

export type AvailabilityStatus = 'in_stock' | 'out_of_stock' | 'pre_order';

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  price: number; // Base or starting price in PKR
  availability: AvailabilityStatus;
  hasVariants: boolean;
  variants: WeightVariant[];
  isFeatured: boolean;
  badge?: string; // e.g. "Bestseller", "Traditional Recipe", "Chef Special"
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  discountBadge: string; // e.g. "Special Eid & Celebration Box" or "15% Off Family Pack"
  description: string;
  highlightText?: string;
  active: boolean;
  categoryTag?: string;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  location: string;
  postalCode: string;
  country: string;
  rating: number; // 4.1
  reviewsCount: number; // 176
  closingTime: string; // 10 PM
  openingHoursText: string; // Daily: 8:00 AM – 10:00 PM
  phoneConfigured: boolean;
  phoneNumber: string; // Direct phone number for calls (e.g. +92 305 9898409)
  whatsAppNumber: string; // WhatsApp ordering number
  phoneDisplayNote: string; // Notice explaining placeholder
  googleMapsQueryUrl: string;
  googleMapsPlaceUrl?: string;
  address?: string;
  adminPasswordHash?: string;
}
