// import Navbar from '@/components/public/Navbar';
import HeroSection from '@/components/public/HeroSection';
import Features from '@/components/public/Features';
import ProductGrid from '@/components/public/ProductGrid';
// import Footer from '@/components/public/Footer';
import Testimoni from '@/components/public/Testimoni';
import Payment from '@/components/public/Payment';
import Faq from '@/components/public/faq';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}
      <HeroSection />
      <Features />
      <ProductGrid />
      <Testimoni />
      <Payment />
      <Faq />
      {/* <Footer /> */}
    </div>
  );
}