import Nav from './components/Nav';
import Hero from './components/Hero';
import Locations from './components/Locations';
import BrandVideo from './components/BrandVideo';
import LifeSection from './components/LifeSection';
import Partners from './components/Partners';
import TokenFold from './components/TokenFold';
import StayConnected from './components/StayConnected';
import Footer from './components/Footer';
import PropertyPage from './pages/PropertyPage';
import ComingSoonPage from './pages/ComingSoonPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import PromotionsPage from './pages/PromotionsPage';
import WhyPage from './pages/WhyPage';
import ExperiencePage from './pages/ExperiencePage';
import { PROPERTIES } from './components/locationData';
import { MACQUARIE_PARK, type PropertyContent } from './components/property/propertyContent';

/** Page content for each property that has its own page, keyed by property id. */
const PROPERTY_PAGES: Record<string, PropertyContent> = {
  'macquarie-park': MACQUARIE_PARK,
};

function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Locations />
        <BrandVideo />
        <LifeSection />
        <Partners />
        <StayConnected exitParallax fromWhite />
        <TokenFold />
      </main>
      <Footer />
    </>
  );
}

/**
 * Pages are picked by URL path: a property's full page when it has content, its
 * coming-soon page when it hasn't opened yet; anything unknown falls back to the homepage.
 */
export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/contact') return <ContactPage />;
  if (path === '/about') return <AboutPage />;
  if (path === '/promotions') return <PromotionsPage />;
  if (path === '/why-epiisod') return <WhyPage />;
  if (path === '/experience') return <ExperiencePage />;
  const property = PROPERTIES.find((p) => p.href === path);
  if (!property) return <HomePage />;
  const content = PROPERTY_PAGES[property.id];
  if (content) return <PropertyPage content={content} />;
  if (property.comingSoon) return <ComingSoonPage property={property} />;
  return <HomePage />;
}
