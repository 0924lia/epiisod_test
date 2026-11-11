import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, UIEvent } from 'react';
import VLine from '../VLine';
import { gsap, useGSAP } from '../../../lib/smoothScroll';
import { SECTION_LANDINGS } from '../Nav';
import { useExitParallax } from '../../lib/useExitParallax';
import line from '../../../assets/make-it-yours-line.svg';
import play from '../../../assets/property/icon-play-white.svg';
import prevIcon from '../../../assets/v2/property/icon-amenity-prev.svg';
import nextIcon from '../../../assets/v2/property/icon-amenity-next.svg';
import leftIcon from '../../../assets/v2/property/icon-carousel-prev.svg';
import rightIcon from '../../../assets/v2/property/icon-carousel-next.svg';
import type { Amenity, PropertyContent } from './propertyContent';
import { EXPERIENCE_URL } from '../../../lib/links';
import './Amenities.css';

/** The photo's opening frames, in Figma px (transition 1099:34869): a small window, then a
 *  wide frame, then the whole panel. Phones (1314:14065) use their own, on a 390 screen. */
const FRAMES = {
  desktop: { base: 1512, window: { w: 324, h: 276 }, wide: { w: 992, h: 454 } },
  phone: { base: 390, window: { w: 162, h: 140 }, wide: { w: 342, h: 297 } },
};

const cropStyle = (a: Amenity) =>
  (a.crop ? { '--pos': a.crop.position, '--zoom': a.crop.zoom } : undefined) as CSSProperties | undefined;

/**
 * Amenities: the heading, then a one-screen carousel (Figma 1465:17377). The photo behind
 * the list shows the active amenity; the arrows beside the list step through them (round
 * from the last back to the first), and clicking an amenity's title opens it. The white
 * mark on the line between the arrows shows where in the list it is. Nothing is tied to
 * scrolling, so the page scrolls straight on to the rooms.
 *
 * Before it, as the panel arrives, it pins for about a screen of scroll while the photo
 * opens from a small window to a wide frame to the whole panel, darkens, and the carousel
 * rises in over it (as before, Figma 1099:34869); then the page carries on.
 *
 * Phones (Figma 1465:17455): the active amenity's name and description, then its photo in a
 * row of cards (the next one peeking in) to swipe through, the arrows either side of a
 * progress line under them, and the button across the width.
 */
export default function Amenities({ id, content }: { id: string; content: PropertyContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const items = content.amenities;
  const count = items.length;
  const wrap = (i: number) => ((i % count) + count) % count;

  // Phones: the cards row follows the active amenity, and swiping it sets the amenity
  const cardsRef = useRef<HTMLDivElement>(null);
  const step = () => {
    const row = cardsRef.current;
    const card = row?.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + parseFloat(getComputedStyle(row!).columnGap || '0') : 0;
  };
  useEffect(() => {
    const row = cardsRef.current;
    const w = step();
    if (!row || !w || row.offsetParent === null) return;
    if (Math.round(row.scrollLeft / w) !== active) row.scrollTo({ left: active * w, behavior: 'smooth' });
  }, [active]);
  const onCardsScroll = (e: UIEvent<HTMLDivElement>) => {
    const w = step();
    if (!w) return;
    const i = Math.min(count - 1, Math.max(0, Math.round(e.currentTarget.scrollLeft / w)));
    if (i !== active) setActive(i);
  };

  // The list's tallest state (whichever amenity is open), so it never changes height as
  // the active one changes: measured on a hidden copy, each amenity opened in turn
  const listRef = useRef<HTMLUListElement>(null);
  const [listH, setListH] = useState(0);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      if (!list.offsetParent) return;
      const copy = list.cloneNode(true) as HTMLUListElement;
      copy.removeAttribute('id');
      copy.setAttribute('aria-hidden', 'true');
      Object.assign(copy.style, { position: 'absolute', visibility: 'hidden', pointerEvents: 'none', minHeight: '0', width: `${list.clientWidth}px` });
      copy.querySelectorAll<HTMLElement>('*').forEach((el) => (el.style.transition = 'none'));
      list.parentElement!.appendChild(copy);
      const rows = [...copy.children] as HTMLElement[];
      let max = 0;
      rows.forEach((_, i) => {
        rows.forEach((r, j) => r.classList.toggle('is-active', i === j));
        max = Math.max(max, copy.offsetHeight);
      });
      copy.remove();
      setListH(Math.ceil(max));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list.parentElement!);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [items]);

  // Up and down arrows move through the list while one of its titles has focus
  const onListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const next = wrap(active + (e.key === 'ArrowDown' ? 1 : -1));
    setActive(next);
    e.currentTarget.querySelectorAll<HTMLButtonElement>('.amenities__title')[next]?.focus();
  };

  // The opening: pinned for a screen of scroll, the photo grows to the whole panel, darkens,
  // and the carousel rises in. Reduced motion skips it (the panel is simply there).
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          phone: '(max-width: 700px) and (prefers-reduced-motion: no-preference)',
          desktop: '(min-width: 701px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const f = ctx.conditions!.phone ? FRAMES.phone : FRAMES.desktop;
          const q = gsap.utils.selector(section);
          const stage = q('.amenities__stage')[0] as HTMLElement;
          const media = q('.amenities__media')[0] as HTMLElement;
          section.classList.add('is-revealing');
          /** A frame of `w × h` Figma px, centred in the panel, as a clip-path inset. */
          const frame = ({ w, h }: { w: number; h: number }) => () => {
            const k = Math.min(1, stage.clientWidth / f.base);
            const x = Math.max(0, (stage.clientWidth - w * k) / 2);
            const y = Math.max(0, (stage.clientHeight - h * k) / 2);
            return `inset(${y}px ${x}px ${y}px ${x}px)`;
          };
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: () => `+=${window.innerHeight}`,
              pin: true,
              scrub: 0.2,
              invalidateOnRefresh: true,
              // The photos show whole in the window, taking their crops once open
              onUpdate: (self) => section.classList.toggle('is-revealing', self.progress < 0.75),
            },
          });
          // On the way in the window rises a touch faster than the heading above it
          gsap.fromTo(
            media,
            { y: () => window.innerHeight * 0.12 },
            { y: 0, ease: 'none', immediateRender: true, scrollTrigger: { trigger: stage, start: 'top bottom', end: 'top top', scrub: 0.2 } },
          );
          // One continuous growth: speeding into the wide frame, easing out of it. From an
          // explicit four-edge start each time (the browser reports frames in short form).
          tl.fromTo(media, { clipPath: frame(f.window) }, { clipPath: frame(f.wide), duration: 0.8, ease: 'power1.in' })
            .fromTo(media, { clipPath: frame(f.wide) }, { clipPath: 'inset(0px 0px 0px 0px)', duration: 0.8, ease: 'power1.out' })
            .fromTo('.amenities__overlay', { opacity: 0 }, { opacity: ctx.conditions!.phone ? 0.95 : 1, duration: 0.4 }, 1.3)
            .fromTo('.amenities__copy', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 1.6)
            .to({}, { duration: 0.2 });
          // The sub-navigation's "Amenities" lands here: the photo open, the carousel up
          SECTION_LANDINGS[id] = () => tl.scrollTrigger?.end ?? null;
          return () => {
            section.classList.remove('is-revealing');
            delete SECTION_LANDINGS[id];
          };
        },
      );
    },
    { scope: sectionRef },
  );

  // Without the opening (reduced motion), "Amenities" still lands on the carousel itself
  useEffect(() => {
    if (SECTION_LANDINGS[id]) return;
    const stage = () => document.getElementById(`${id}-stage`);
    SECTION_LANDINGS[id] = () => {
      const el = stage();
      return el ? el.getBoundingClientRect().top + window.scrollY : null;
    };
    return () => {
      delete SECTION_LANDINGS[id];
    };
  }, [id]);

  // Hand-over to the rooms: the panel lags and dims as they slide over it.
  // Set up after the pin, so it measures the section with its pinned scroll added.
  useExitParallax(sectionRef);

  return (
    <section ref={sectionRef} className="amenities exit-parallax" id={id}>
      <div className="amenities__intro">
        <VLine src={line} length={100} />
        <div className="heading-group">
          <p className="eyebrow">Amenities</p>
          <h2 className="type-h2">
            Thoughtfully designed <em>student housing</em> in {content.city}
          </h2>
        </div>
        <p className="type-body-l amenities__lede">
          Modern spaces, all-inclusive amenities, and a vibrant student community—all in the
          cities where you study.
        </p>
      </div>

      <div className="amenities__stage" id={`${id}-stage`}>
        <div className="amenities__inner" data-exit-content>
          <div className="amenities__media" aria-hidden>
            {items.map((a, i) => (
              <img
                key={a.lead + a.rest}
                className={`amenities__photo${i === active ? ' is-active' : ''}`}
                src={a.image}
                alt=""
                style={cropStyle(a)}
              />
            ))}
            <div className="amenities__overlay" />
          </div>

          <div className="amenities__copy">
            <p className="amenities__eyebrow">Amenities</p>

            {/* Phones (Figma 1465:17455) */}
            <div className="amenities__phone">
              <div className="amenities__current" aria-live="polite">
                {items.map((a, i) => (
                  <div key={a.lead + a.rest} className={`amenities__current-item${i === active ? ' is-active' : ''}`} aria-hidden={i !== active}>
                    <h3 className="amenities__current-title">
                      <em>{a.lead}</em>
                      {a.rest}
                    </h3>
                    <p className="amenities__current-text">{a.text}</p>
                  </div>
                ))}
              </div>
              <div ref={cardsRef} className="amenities__cards" onScroll={onCardsScroll}>
                {items.map((a, i) => (
                  <button
                    key={a.lead + a.rest}
                    type="button"
                    className="amenities__card"
                    aria-label={`${a.lead}${a.rest}`}
                    aria-current={i === active}
                    onClick={() => setActive(i)}
                  >
                    <img src={a.image} alt="" style={cropStyle(a)} />
                  </button>
                ))}
              </div>
              <div className="amenities__pager">
                <button type="button" className="amenities__arrow" aria-label="Previous amenity" onClick={() => setActive(wrap(active - 1))}>
                  <img src={leftIcon} width={24} height={24} alt="" />
                </button>
                <div className="amenities__bar" aria-hidden>
                  <span style={{ '--n': count, '--i': active } as CSSProperties} />
                </div>
                <button type="button" className="amenities__arrow" aria-label="Next amenity" onClick={() => setActive(wrap(active + 1))}>
                  <img src={rightIcon} width={24} height={24} alt="" />
                </button>
              </div>
            </div>

            <div className="amenities__row">
              {/* Figma 1465:17440: previous, the progress line, next */}
              <div className="amenities__nav">
                <button
                  type="button"
                  className="amenities__arrow"
                  aria-label="Previous amenity"
                  aria-controls={`${id}-list`}
                  onClick={() => setActive(wrap(active - 1))}
                >
                  <img src={prevIcon} width={24} height={24} alt="" />
                </button>
                <div className="amenities__track" aria-hidden>
                  <span
                    className="amenities__mark"
                    style={{ '--fill': (active + 1) / count } as CSSProperties}
                  />
                </div>
                <button
                  type="button"
                  className="amenities__arrow"
                  aria-label="Next amenity"
                  aria-controls={`${id}-list`}
                  onClick={() => setActive(wrap(active + 1))}
                >
                  <img src={nextIcon} width={24} height={24} alt="" />
                </button>
              </div>

              <ul
                ref={listRef}
                className="amenities__list"
                id={`${id}-list`}
                onKeyDown={onListKey}
                style={listH ? ({ '--list-h': `${listH}px` } as CSSProperties) : undefined}
              >
                {items.map((a, i) => (
                  <li key={a.lead + a.rest} className={`amenities__item${i === active ? ' is-active' : ''}`}>
                    <h3 className="amenities__heading">
                      <button
                        type="button"
                        className="amenities__title"
                        aria-expanded={i === active}
                        aria-controls={`${id}-text-${i}`}
                        tabIndex={i === active ? 0 : -1}
                        onClick={() => setActive(i)}
                      >
                        <span className="amenities__lead">{a.lead}</span>
                        {a.rest}
                      </button>
                    </h3>
                    <div className="amenities__text-wrap" id={`${id}-text-${i}`}>
                      <p className="amenities__text">{a.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <a href={EXPERIENCE_URL} className="amenities__button" target="_blank" rel="noopener noreferrer">
              <img src={play} width={24} height={24} alt="" />
              <span>Enter the EPIISOD experience</span>
            </a>
          </div>
        </div>
      </div>
      <div className="exit-shade" aria-hidden />
    </section>
  );
}
