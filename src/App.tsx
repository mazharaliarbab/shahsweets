import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { ProductCatalogue } from './components/ProductCatalogue';
import { SpecialOffersSection } from './components/SpecialOffersSection';
import { AboutSection } from './components/AboutSection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { AiSupportModal } from './components/AiSupport/AiSupportModal';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminDashboard } from './components/Admin/AdminDashboard';

const MainLayout: React.FC = () => {
  const { activeNav, isAdmin } = useStore();

  // If viewing admin route
  if (activeNav === 'admin') {
    if (!isAdmin) {
      return <AdminLogin />;
    }
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-[#0d0507] text-[#fdfaf4] flex flex-col selection:bg-[#c99846] selection:text-[#180a0d]">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Product Categories */}
        <CategoriesSection />

        {/* 4. Complete Product Catalogue with Weight Variants & Real PKR Prices */}
        <ProductCatalogue />

        {/* 5. Special Offers (Admin Managed) */}
        <SpecialOffersSection />

        {/* 6. Authentic About Section */}
        <AboutSection />

        {/* 7. Verified Google Reviews Rating (4.1 / 5 from 176 Reviews) */}
        <ReviewsSection />

        {/* 8. Location & Timings (Shabqadar, Closes 10 PM, Get Directions) */}
        <LocationSection />
      </main>

      {/* 9. Brand Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal />

      {/* Floating AI Customer Support Agent */}
      <AiSupportModal />

      {/* Floating WhatsApp Button (~48-52px) */}
      <WhatsAppFloatingButton />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
