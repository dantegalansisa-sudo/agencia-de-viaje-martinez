import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import MobileCTA from './components/MobileCTA';
import HeroSection from './sections/HeroSection';
import OfferStripSection from './sections/OfferStripSection';
import TrustBarSection from './sections/TrustBarSection';
import DestinationsSection from './sections/DestinationsSection';
import FlightOffersSection from './sections/FlightOffersSection';
import ServicesSection from './sections/ServicesSection';
import PackagesSection from './sections/PackagesSection';
import WhyUsSection from './sections/WhyUsSection';
import TeamSection from './sections/TeamSection';
import PaymentSection from './sections/PaymentSection';
import GallerySection from './sections/GallerySection';
import TestimonialsSection from './sections/TestimonialsSection';
import FAQSection from './sections/FAQSection';
import ContactSection from './sections/ContactSection';
import FooterSection from './sections/FooterSection';

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <OfferStripSection />
      <TrustBarSection />
      <DestinationsSection />
      <FlightOffersSection />
      <ServicesSection />
      <PackagesSection />
      <WhyUsSection />
      <TeamSection />
      <PaymentSection />
      <GallerySection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <FooterSection />
      <WhatsAppButton />
      <MobileCTA />
    </>
  );
}

export default App;
