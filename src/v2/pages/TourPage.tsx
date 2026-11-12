import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ContactForm from '../../components/contact/ContactForm';
import InstagramStrip from '../../components/contact/InstagramStrip';
import AboutClosing from '../../components/about/AboutClosing';

/**
 * Book a tour (Figma 1496:23667): the visit form beside its introduction, the Instagram
 * band, the closing fold and v2's footer — laid out as Join the waitlist is.
 */
export default function TourPage() {
  return (
    <>
      <Nav tone="cream" />
      <main>
        <ContactForm variant="tour" />
        <InstagramStrip />
        <AboutClosing />
      </main>
      <Footer />
    </>
  );
}
