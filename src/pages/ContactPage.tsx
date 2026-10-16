import Nav from '../components/Nav';
import ContactForm from '../components/contact/ContactForm';
import InstagramStrip from '../components/contact/InstagramStrip';
import StayConnected from '../components/StayConnected';
import Footer from '../components/Footer';

/**
 * Contact us (Figma 539:23764). The nav starts as the cream bar used on About us, then
 * behaves as on the homepage once scrolled; each section hands over to the next with parallax,
 * the sign-up flowing into the footer undimmed.
 */
export default function ContactPage() {
  return (
    <>
      <Nav tone="cream" />
      <main>
        <ContactForm />
        <InstagramStrip />
        <StayConnected exitParallax />
      </main>
      <Footer />
    </>
  );
}
