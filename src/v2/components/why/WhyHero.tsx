import { useEffect, useRef, useState } from 'react';
import wellness from '../../../assets/v2/why/hero-wellness.jpg';
import comfort from '../../../assets/v2/why/hero-comfort.jpg';
import effortless from '../../../assets/v2/why/hero-effortless.jpg';
import prevIcon from '../../../assets/v2/property/icon-carousel-prev.svg';
import nextIcon from '../../../assets/v2/property/icon-carousel-next.svg';
import prevDark from '../../../assets/v2/loc-prev.svg';
import nextDark from '../../../assets/v2/loc-next.svg';
import './WhyHero.css';

/**
 * Slides (Figma 1470:22916, 1470:23356, 1470:23381), each photo cropped as in Figma.
 * TODO: Figma's one-line descriptions are placeholders ("Short one line description").
 */
const SLIDES = [
  { name: 'Wellness', text: 'Spaces to move, rest and recharge.', image: wellness, position: '50% 23%' },
  { name: 'Comfort-led Design', text: 'Rooms and lounges made for everyday ease.', image: comfort, position: '50% 50%' },
  { name: 'Effortless living', text: 'Everything you need, right where you live.', image: effortless, position: '50% 76%' },
];
/** Time each slide stays up before the carousel advances (ms). */
const AUTOPLAY_DELAY = 4000;

/**
 * Why EPIISOD intro (Figma 889:10307): the title on the left, a photo carousel flush
 * with the right edge. The carousel autoplays — pausing while hovered or focused, off
 * screen, or for reduced motion — and the arrows step through it, restarting the timer.
 */
export default function WhyHero() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);

  const step = (dir: 1 | -1) => setSlide((s) => (s + dir + SLIDES.length) % SLIDES.length);

  // Autoplay; depends on `slide`, so using the arrows restarts the countdown
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || !inView || reduced) return;
    const timer = window.setTimeout(() => step(1), AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [slide, paused, inView]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const current = SLIDES[slide];

  return (
    <section className="why-hero">
      <div className="why-hero__copy">
        <div className="why-hero__heading">
          <p className="eyebrow">Why EPIISOD</p>
          <h1 className="type-h1 why-hero__title">
            Thoughtfully <em>designed</em> student living
          </h1>
        </div>
        <p className="type-body-l why-hero__lede">Where it all comes together.</p>
      </div>

      <div
        ref={carouselRef}
        className="why-hero__carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Life at EPIISOD"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {SLIDES.map((s, i) => (
          <img
            key={s.name}
            className={`why-hero__slide${i === slide ? ' is-active' : ''}`}
            src={s.image}
            alt=""
            style={{ objectPosition: s.position }}
            aria-hidden={i !== slide}
          />
        ))}
        <div className="why-hero__fade" aria-hidden />

        <div className="why-hero__overlay">
          {/* Figma 1470:23401: the name and a line under it */}
          <div className="why-hero__caption" key={current.name} aria-live="polite">
            <p className="why-hero__name">{current.name}</p>
            <p className="why-hero__text">{current.text}</p>
          </div>
          {/* Figma 1470:22919: round arrows either side of the count */}
          <div className="why-hero__pager">
            <button type="button" className="why-hero__arrow" aria-label="Previous" onClick={() => step(-1)}>
              <img src={prevIcon} width={24} height={24} alt="" />
            </button>
            <p className="why-hero__count">
              {slide + 1} / {SLIDES.length}
            </p>
            <button type="button" className="why-hero__arrow" aria-label="Next" onClick={() => step(1)}>
              <img src={nextIcon} width={24} height={24} alt="" />
            </button>
          </div>
        </div>
      </div>

      {/* Phones (Figma 1470:23618): the arrows and count in a row under the photo */}
      <div className="why-hero__phone-nav">
        <button type="button" className="why-hero__phone-arrow" aria-label="Previous" onClick={() => step(-1)}>
          <img src={prevDark} width={24} height={24} alt="" />
        </button>
        <p className="why-hero__phone-count">
          {String(slide + 1).padStart(2, '0')}/{String(SLIDES.length).padStart(2, '0')}
        </p>
        <button type="button" className="why-hero__phone-arrow" aria-label="Next" onClick={() => step(1)}>
          <img src={nextDark} width={24} height={24} alt="" />
        </button>
      </div>
    </section>
  );
}
