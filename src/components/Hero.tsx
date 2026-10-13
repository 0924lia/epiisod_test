import { useRef, useState } from 'react';
import VLine from './VLine';
import { gsap, useGSAP } from '../lib/smoothScroll';
import heroImage from '../assets/hero.jpg';
import heroLine from '../assets/hero-line.svg';
import dropdown from '../assets/dropdown.svg';
import arrowRight from '../assets/arrow-right-white.svg';
import './Hero.css';

/** Cities per country, taken from the footer's location list. */
const CITIES: Record<string, string[]> = {
  Australia: ['Sydney', 'Perth', 'Melbourne'],
  'United Kingdom': ['London'],
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [country, setCountry] = useState('Australia');
  const [city, setCity] = useState('Sydney');

  const onCountryChange = (next: string) => {
    setCountry(next);
    setCity(CITIES[next][0]);
  };

  // Exit parallax: as the hero scrolls away the photo drifts at half speed (so the next
  // section slides over it), the copy lags further and fades, and the scene darkens.
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({
            defaults: { ease: 'none', duration: 1 },
            scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
          })
          .to('.hero__image', { yPercent: 50 }, 0)
          .to('.hero__content', { y: 320 }, 0)
          .to('.hero__content', { opacity: 0, duration: 0.7 }, 0)
          .to('.hero__shade', { opacity: 0.6 }, 0);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="hero">
      <img className="hero__image" src={heroImage} alt="" />
      <div className="hero__overlay" aria-hidden />
      <div className="hero__shade" aria-hidden />

      <div className="hero__content">
        <div className="hero__copy">
          <h1 className="hero__title">
            Thoughtfully designed <em>student living</em>
          </h1>
          <p className="hero__subtitle">
            Modern spaces, all-inclusive amenities, and a vibrant student community—all in the
            cities where you study.
          </p>
        </div>

        <VLine src={heroLine} length={50} />

        <form className="hero-search" onSubmit={(e) => e.preventDefault()}>
          <div className="hero-search__cell">
            <div className="hero-search__field hero-search__field--intro">Start your story</div>
          </div>

          <label className="hero-search__cell">
            <div className="hero-search__field">
              <span className="hero-search__label">Country</span>
              <span className="hero-search__select">
                <select value={country} onChange={(e) => onCountryChange(e.target.value)}>
                  {Object.keys(CITIES).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <img src={dropdown} width={16} height={16} alt="" />
              </span>
            </div>
          </label>

          <label className="hero-search__cell">
            <div className="hero-search__field">
              <span className="hero-search__label">City</span>
              <span className="hero-search__select">
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  {CITIES[country].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <img src={dropdown} width={16} height={16} alt="" />
              </span>
            </div>
          </label>

          <div className="hero-search__cell">
            <button type="submit" className="hero-search__submit" aria-label="Search">
              <img src={arrowRight} width={24} height={24} alt="" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
