import Nav from '../components/Nav';
import Footer from '../components/Footer';
import PageHero from '../../components/PageHero';
import AboutValues from '../components/about/AboutValues';
import AboutTogether from '../components/about/AboutTogether';
import AboutBuilt from '../components/about/AboutBuilt';
import AboutClosing from '../../components/about/AboutClosing';
import photoLeft from '../../assets/about/intro-left.jpg';
import photoRight from '../../assets/about/intro-right.jpg';
import '../components/about/AboutPage.css';

/**
 * About us, v2 (Figma 1470:21593): "Where your story finds its place" between two photos;
 * "Designed around what matters" with its carousel; "Where it all comes together" over the
 * building; "Built on experience" and "Write your story with EPIISOD"; then the closing fold
 * and the footer.
 */
export default function AboutPage() {
  return (
    <>
      <Nav tone="cream" />
      <main>
        <PageHero
          className="about-hero"
          eyebrow="This is EPIISOD"
          title={
            <>
              Where <em>your story</em>
              <br />
              finds its place
            </>
          }
          photos={{ left: photoLeft, right: photoRight }}
          tone="cream"
        />
        <AboutValues />
        <AboutTogether />
        <AboutBuilt />
        <AboutClosing />
      </main>
      <Footer />
    </>
  );
}
