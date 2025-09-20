import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import Features from '@/components/Features';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import Testimoni from '@/components/Testimoni';
import Payment from '@/components/Payment';
import Faq from '@/components/faq';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <Features />
      <ProductGrid />
      <Testimoni />
      <Payment />
      <Faq />
      <Footer />
    </div>
  );
}