import { useRef } from 'react';
import VLine from '../VLine';
import { gsap, useGSAP } from '../../../lib/smoothScroll';
import { useExitParallax } from '../../lib/useExitParallax';
import line from '../../../assets/cta-line.svg';
import wide from '../../../assets/about/wide-macquarie.jpg';
import './AboutValues.css';
import './AboutBuilt.css';

const PHONE = '(max-width: 700px)';
/** Side of the starting square: Figma 1470:22231 (208), smaller on phones. */
const SQUARE = { desktop: 208, phone: 140 };
/** Where on screen (from the top) the photo's centre is when it has fully opened. */
const OPEN_AT = '35%';
const size = () => (window.matchMedia(PHONE).matches ? 'phone' : 'desktop');

/**
 * "Built on experience" (Figma 1470:22221): the gold line, the heading and two short
 * paragraphs; then the photo of the building, opening as on v1's About us (AboutStory) —
 * a square close-up that, once fully on screen, widens with the scroll to the whole
 * 1368 × 360 frame; then "Write your story with EPIISOD" and Book now. The section drifts
 * and dims as the closing fold slides over it (the page's parallax hand-over).
 */
export default function AboutBuilt() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const slot = section?.querySelector<HTMLElement>('.about-built__photo');
      if (!section || !slot) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        // The slot's centre within the section (offsets ignore transforms, so it's stable)
        const slotCentre = () => {
          let top = 0;
          for (let n: HTMLElement | null = slot; n && n !== section; n = n.offsetParent as HTMLElement | null) {
            top += n.offsetTop;
          }
          return top + slot.offsetHeight / 2;
        };
        gsap.fromTo(
          '.about-built__frame',
          { width: () => SQUARE[size()], height: () => SQUARE[size()] },
          {
            width: () => slot.clientWidth,
            height: () => slot.clientHeight,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: section,
              start: () => `top+=${slotCentre() + SQUARE[size()] / 2} bottom`,
              end: () => `top+=${slotCentre()} ${OPEN_AT}`,
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  // Hands over to the closing fold with the page's parallax
  useExitParallax(sectionRef);

  return (
    <section ref={sectionRef} className="about-built exit-parallax">
      <div className="about-built__content" data-exit-content>
        <div className="about-built__story">
          <VLine src={line} length={100} />
          <h2 className="about-built__title">
            Built on <em>experience</em>
          </h2>
          <div className="about-built__text">
            <p>
              With a strong foundation in student accommodation, EPIISOD is shaped by a deep understanding of how
              students live, connect, and grow.
            </p>
            <p>
              We&rsquo;ve taken these insights and reimagined them into a more considered living experience &ndash;
              where every detail, from private spaces to shared environments, is designed to support both independence
              and connection.
            </p>
          </div>
        </div>

        {/* The frame grows from the square (Figma 1470:22231) to the full slot */}
        <div className="about-built__photo">
          <div className="about-built__frame">
            <img src={wide} alt="EPIISOD Macquarie Park among the trees" />
          </div>
        </div>

        <div className="about-built__cta">
          <h2 className="about-built__title">
            Write <em>your story</em>
            <br />
            with EPIISOD
          </h2>
          <a href="/v2/locations/macquarie-park#rooms" className="about-v2__button">
            Book now
          </a>
        </div>
      </div>
      <div className="exit-shade" aria-hidden />
    </section>
  );
}
