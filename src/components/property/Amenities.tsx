import { useEffect, useRef, useState } from 'react';
import { LOGOS, LogoSlot } from '../Partners';
import { useExitParallax } from '../../lib/useExitParallax';
import play from '../../assets/property/icon-play-dark.svg';
import activeDot from '../../assets/loc-active-dot.svg';
import dot from '../../assets/property/dot-light.svg';
import type { PropertyContent } from './propertyContent';
import './Amenities.css';

const pad = (n: number) => String(n).padStart(2, '0');
/** Time each photo stays up before the carousel advances (ms). */
const AUTOPLAY_DELAY = 3000;

/**
 * Amenities (Figma 539:13256): a photo carousel bleeding off the left edge, the
 * amenity list beside it, then the property's partners.
 *
 * The carousel autoplays — pausing while hovered, off screen, or for reduced motion —
 * and the dots jump to any photo, restarting the timer. As the section scrolls away
 * its content drifts and dims so the rooms section slides over it.
 */
export default function Amenities({ id, content }: { id: string; content: PropertyContent }) {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const slides = content.amenitySlides;

  // Autoplay; depends on `slide`, so choosing a dot restarts the countdown
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || !inView || reduced) return;
    const timer = window.setTimeout(() => setSlide((s) => (s + 1) % slides.length), AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [slide, paused, inView, slides.length]);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(gallery);
    return () => io.disconnect();
  }, []);

  useExitParallax(sectionRef);

  return (
    <section ref={sectionRef} className="amenities exit-parallax" id={id}>
      <div data-exit-content>
        <div className="amenities__main">
          <div
            ref={galleryRef}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="amenities__gallery"
            role="region"
            aria-roledescription="carousel"
            aria-label={`${content.place} photos`}
          >
            {slides.map((src, i) => (
              <img
                key={src + i}
                className={`amenities__slide${i === slide ? ' is-active' : ''}`}
                src={src}
                alt=""
                aria-hidden={i !== slide}
              />
            ))}
            <div className="amenities__shade" aria-hidden />

            <div className="amenities__pager">
              <p className="amenities__count" aria-live="polite">
                {pad(slide + 1)} / {pad(slides.length)}
              </p>
              <div className="amenities__dots">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="amenities__dot"
                    aria-label={`Show photo ${i + 1}`}
                    aria-current={i === slide}
                    onClick={() => setSlide(i)}
                  >
                    <img src={i === slide ? activeDot : dot} width={8} height={8} alt="" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="amenities__details">
            <div className="amenities__heading">
              <p className="eyebrow">Amenities</p>
              <h2 className="amenities__title">
                Thoughtfully designed <em>student housing</em> in {content.city}
              </h2>
              <p className="amenities__lede">
                Modern spaces, all-inclusive amenities, and a vibrant student community—all in the
                cities where you study.
              </p>
            </div>

            <ul className="amenities__list">
              {content.amenities.map(({ icon, label }, i) => (
                <li key={i} className="amenities__item">
                  <img src={icon} width={24} height={24} alt="" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            <a href="#" className="amenities__cta">
              <img src={play} width={24} height={24} alt="" />
              <span>Enter the experience</span>
            </a>
          </div>
        </div>

        <div className="amenities__partners">
          <h3 className="amenities__partners-title">
            Part of the story at <em>{content.place}</em>
          </h3>
          <div className="amenities__logos">
            {LOGOS.slice(0, 3).map((logo, i) => (
              <LogoSlot key={i} logo={logo} />
            ))}
          </div>
        </div>
      </div>
      <div className="exit-shade" aria-hidden />
    </section>
  );
}
