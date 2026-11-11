import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { gsap, useGSAP } from '../../../lib/smoothScroll';
import { PHONE_QUERY } from '../../lib/phone';
import photo from '../../../assets/v2/about/together.jpg';
import '../LifeSection.css';
import './AboutValues.css';
import './AboutTogether.css';

/** Figma 1441:16726's middle state: 648 of the 800px-tall frame. */
const TALL = 648 / 800;
/** Share of the expansion spent growing taller before it widens to the full screen. */
const SPLIT = 0.4;

/**
 * "Where it all comes together" (Figma 1470:22196), with the homepage Life @ EPIISOD
 * intro's behaviour (LifeSection.tsx): the white card holding the heading and the EPIISOD
 * Experience button pins over the dimmed photo of the building, then — over a screen of
 * scroll — grows taller and out to the edges until the screen is white, and the white
 * "Built on experience" section follows on without a seam.
 */
export default function AboutTogether() {
  const sectionRef = useRef<HTMLElement>(null);
  const [vh, setVh] = useState(() => window.innerHeight);

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const card = section?.querySelector<HTMLElement>('.life__card');
      const heading = section?.querySelector<HTMLElement>('.life__heading');
      if (!section || !card || !heading) return;

      // Card insets (px) for a box of w × h centred on the screen
      const inset = (w: number, h: number) => {
        const x = Math.max(0, (card.clientWidth - w) / 2);
        const y = Math.max(0, (card.clientHeight - h) / 2);
        return `inset(${y}px ${x}px ${y}px ${x}px)`;
      };
      // Starts hugging the heading and button (Figma: 40px padding around them)
      const start = () => inset(heading.offsetWidth + 80, heading.offsetHeight + 80);
      const tall = () => inset(heading.offsetWidth + 80, card.clientHeight * TALL);

      gsap.matchMedia().add(
        { motion: '(prefers-reduced-motion: no-preference)', phone: PHONE_QUERY },
        (ctx) => {
          const { motion, phone } = ctx.conditions as { motion: boolean; phone: boolean };
          if (!motion) {
            gsap.set(card, { clipPath: start });
            return;
          }
          gsap
            .timeline({
              defaults: { ease: 'power2.inOut' },
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: `+=${vh}`,
                scrub: phone ? 0.6 : true,
                invalidateOnRefresh: true,
              },
            })
            // All four insets written out each time (the browser reports a symmetric inset
            // in shorthand, and tweening from that leant the card to one side)
            .fromTo(card, { clipPath: start }, { clipPath: tall, duration: SPLIT })
            .fromTo(card, { clipPath: tall }, { clipPath: 'inset(0px 0px 0px 0px)', duration: 1 - SPLIT, immediateRender: false })
            // The photo settles back as the card covers it
            .fromTo('.life__photo', { scale: 1.12 }, { scale: 1, ease: 'none', duration: 1 }, 0);

          // Gentle drift on the way in, before the intro pins
          gsap.fromTo(
            '.life__photo',
            { yPercent: -8 },
            {
              yPercent: 0,
              ease: 'none',
              scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true },
            },
          );
        },
      );
    },
    { scope: sectionRef, dependencies: [vh], revertOnUpdate: true },
  );

  return (
    <section
      ref={sectionRef}
      className="life about-together"
      // The pinned intro, plus a screen of scroll for the card to grow
      style={{ height: vh * 2 } as CSSProperties}
    >
      <div className="life__intro">
        <div className="life__image" aria-hidden>
          <img className="life__photo" src={photo} alt="" draggable={false} />
          <div className="life__overlay" />
        </div>
        <div className="life__card" aria-hidden />
        <div className="life__heading about-together__heading">
          <h2 className="about-together__title">
            Where it all <br />
            comes <em>together</em>
          </h2>
          <a href="/v2/experience" className="about-v2__button">
            The EPIISOD experience
          </a>
        </div>
      </div>
    </section>
  );
}
