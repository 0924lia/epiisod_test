import Nav from './components/Nav';
import Hero from './components/Hero';
import Locations from './components/Locations';
import BrandVideo from './components/BrandVideo';
import LifeSection from './components/LifeSection';
import Partners from './components/Partners';
import TokenFold from './components/TokenFold';
import StayConnected from './components/StayConnected';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Locations />
        <BrandVideo />
        <LifeSection />
        <Partners />
        <TokenFold />
        <StayConnected />
      </main>
      <Footer />
    </>
  );
}
