import Nav from '../components/Nav';
import AboutIntro from '../../components/about/AboutIntro';
import AboutStory from '../../components/about/AboutStory';
import AboutLocation from '../../components/about/AboutLocation';
import AboutSignup from '../../components/about/AboutSignup';
import AboutClosing from '../../components/about/AboutClosing';
import Footer from '../components/Footer';

/**
 * v2: v1's page as it is, under v2's navigation and above v2's footer.
 */
/**
 * About us (Figma 735:13844). The nav starts as a cream bar; each section hands over to
 * the next with parallax, and the closing fold flows into the footer undimmed.
 */
export default function AboutPage() {
  return (
    <>
      <Nav tone="cream" />
      <main>
        <AboutIntro />
        <AboutStory propertyHref="/v2/locations/macquarie-park" />
        <AboutLocation propertyHref="/v2/locations/macquarie-park" />
        <AboutSignup />
        <AboutClosing />
      </main>
      <Footer />
    </>
  );
}
