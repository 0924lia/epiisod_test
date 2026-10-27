import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import VLine from '../VLine';
import { PROPERTIES, REGIONS, type Property } from '../locationData';
import { gsap, ScrollTrigger, scrollToY, useGSAP } from '../../lib/smoothScroll';
import { useExitParallax } from '../../lib/useExitParallax';
import line from '../../assets/cta-line.svg';
import globe from '../../assets/locations/icon-globe.svg';
import mapPin from '../../assets/locations/icon-map-pin.svg';
import arrowRight from '../../assets/locations/arrow-right-sand.svg';
import caretDown from '../../assets/property/caret-down-grey.svg';
import resetIcon from '../../assets/locations/icon-reset.svg';
import introBuilding from '../../assets/locations/intro-building.jpg';
import introLounge from '../../assets/locations/intro-lounge.jpg';
import './LocationsListing.css';

/** The chosen country and city; null shows them all. */
export type LocationFilter = { country: string | null; city: string | null };

/** The pinned band's height: 16px + 46px field + 16px. */
const BAND_HEIGHT = 78;

/** Closes a popover on a click elsewhere or Escape. */
function useDismiss(open: boolean, ref: RefObject<HTMLElement>, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && close();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, ref, close]);
}

/** A filter field (Figma 1195:28019): icon, the chosen value or a prompt, a caret, and its list below. */
function SelectField({
  icon,
  label,
  placeholder,
  value,
  options,
  onChange,
}: {
  icon: string;
  label: string;
  placeholder: string;
  value: string | null;
  options: string[];
  onChange: (option: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, ref, () => setOpen(false));
  return (
    <div ref={ref} className={`loc-field${open ? ' is-open' : ''}${value ? ' has-value' : ''}`}>
      <button
        type="button"
        className="loc-field__button"
        aria-expanded={open}
        aria-label={`${label}: ${value ?? 'any'}`}
        onClick={() => setOpen((o) => !o)}
      >
        <img src={icon} width={24} height={24} alt="" />
        <span className="loc-field__value">{value ?? placeholder}</span>
        <img className="loc-field__caret" src={caretDown} width={24} height={24} alt="" />
      </button>
      {open && (
        <div className="loc-field__menu" role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              className={`loc-field__option${option === value ? ' is-current' : ''}`}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** A property (Figma 1182:19879): the photo under a dark fade, its name, address and link. */
function PropertyCard({ property, index }: { property: Property; index: number }) {
  const { name, address, city, image, listingImage, comingSoon, href } = property;
  const place = name.replace(/^EPIISOD\s+/, '');
  const body = (
    <>
      <img className="loc-card__image" src={listingImage ?? image} alt="" />
      <span className="loc-card__shade" aria-hidden />
      {comingSoon && <span className="loc-card__badge">Coming soon!</span>}
      <span className="loc-card__overlay">
        <span className="loc-card__name">
          EPIISOD <em>{place}</em>
        </span>
        <span className="loc-card__address">{comingSoon ? address : `${address}, ${city}`}</span>
        {comingSoon ? (
          <span className="loc-card__status">Upcoming</span>
        ) : (
          <span className="loc-card__link">
            View property
            <img src={arrowRight} width={24} height={24} alt="" />
          </span>
        )}
      </span>
    </>
  );
  const style = { '--i': index } as CSSProperties;
  // Open properties link through; coming-soon ones once they have a page
  return href || !comingSoon ? (
    <a href={href ?? '#'} className={`loc-card${comingSoon ? ' is-soon' : ''}`} style={style}>
      {body}
    </a>
  ) : (
    <article className="loc-card is-soon" style={style}>
      {body}
    </article>
  );
}

/**
 * Locations (Figma 1182:17801): the intro — heading, line of copy and the Country and City
 * filters between two photos — then every property by region and city. Once the filters
 * scroll up under the nav, a copy of them stays pinned in a white band (Figma 1195:28002);
 * choosing a country or city updates the list straight away (and the page's address, so it
 * can be shared), keeping the list's top in view. `scrollTo` asks it to glide to the list,
 * after a search on the homepage.
 */
export default function LocationsListing({
  filter,
  onFilter,
  scrollTo,
}: {
  filter: LocationFilter;
  onFilter: (next: LocationFilter) => void;
  /** Bumped to glide down to the list. */
  scrollTo: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const regionsRef = useRef<HTMLDivElement>(null);
  const introFiltersRef = useRef<HTMLDivElement>(null);
  // The hand-over to "Stay connected": the listing lags and dims as it slides over
  useExitParallax(sectionRef);
  const [pinned, setPinned] = useState(false);
  /** Set when a filter changes while the list is under the pinned band. */
  const anchor = useRef(false);

  const navOffset = () =>
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 0;

  // The band shows once the intro's filters have gone under the nav, while the list is still on screen
  useEffect(() => {
    const update = () => {
      const regions = regionsRef.current?.getBoundingClientRect();
      const intro = introFiltersRef.current?.getBoundingClientRect();
      if (!regions || !intro) return;
      const top = navOffset() + BAND_HEIGHT;
      setPinned(intro.bottom < navOffset() + 8 && regions.bottom > top + 120);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const countries = REGIONS.map((r) => r.name);
  const region = REGIONS.find((r) => r.name === filter.country) ?? null;
  const cities = region ? region.cities : REGIONS.flatMap((r) => r.cities);

  const change = (next: LocationFilter) => {
    anchor.current = pinned;
    onFilter(next);
  };
  // A country keeps the chosen city only if it's in that country; a city brings its country
  const chooseCountry = (country: string) => {
    const keepCity = filter.city && REGIONS.find((r) => r.name === country)?.cities.includes(filter.city);
    change({ country, city: keepCity ? filter.city : null });
  };
  const chooseCity = (city: string) =>
    change({ country: REGIONS.find((r) => r.cities.includes(city))?.name ?? null, city });
  const filtered = !!(filter.country || filter.city);

  // After the list changes: keep its top under the band, and re-measure the scroll
  // animations below it, whose positions moved with the list's height
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    ScrollTrigger.refresh();
    const regions = regionsRef.current;
    if (anchor.current && regions) {
      scrollToY(window.scrollY + regions.getBoundingClientRect().top - navOffset() - BAND_HEIGHT - 32, {
        immediate: true,
      });
    }
    anchor.current = false;
  }, [filter.country, filter.city]);

  // Glide to the list (the nav hides on the way down, so only the band sits above it).
  // On arrival, wait a moment for the page to settle and the hero to be seen.
  const arrival = useRef(scrollTo);
  useEffect(() => {
    if (!scrollTo) return;
    const timer = window.setTimeout(
      () => {
        const regions = regionsRef.current;
        if (regions) scrollToY(window.scrollY + regions.getBoundingClientRect().top - BAND_HEIGHT - 32);
      },
      scrollTo === arrival.current ? 700 : 0,
    );
    return () => window.clearTimeout(timer);
  }, [scrollTo]);

  // The intro's photos drift inside their frames as the page scrolls, as the featured
  // blog photo does: from the top of the page until the photos have left the screen
  useGSAP(
    () => {
      gsap.matchMedia().add('(min-width: 1101px) and (prefers-reduced-motion: no-preference)', () => {
        // The hand-over to the list: the intro's copy and filters lag behind the scroll and
        // fade a little, and the photo frames drift up at their own pace, so the list
        // reads as rising over the intro
        const handover = { trigger: '.loc-intro', start: 'top top', end: 'bottom top', scrub: 0.8 };
        gsap.to('.loc-intro__copy, .loc-intro > .vline', { y: 140, opacity: 0.25, ease: 'none', scrollTrigger: handover });
        gsap.to('.loc-intro .loc-listing__filters--intro', { y: 90, ease: 'none', scrollTrigger: handover });
        gsap.fromTo('.loc-intro__photo--left', { y: 0 }, { y: -60, ease: 'none', scrollTrigger: handover });
        gsap.fromTo('.loc-intro__photo--right', { y: 0 }, { y: -110, ease: 'none', scrollTrigger: handover });

        gsap.utils.toArray<HTMLElement>('.loc-intro__photo img').forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: { trigger: img.parentElement, start: 0, end: 'bottom top', scrub: 0.8 },
            },
          );
        });
      });
    },
    { scope: sectionRef },
  );

  // The country in view: the last whose cities have reached the middle of the screen
  const [currentRegion, setCurrentRegion] = useState<string>(REGIONS[0].id);
  useEffect(() => {
    const update = () => {
      const regions = regionsRef.current?.querySelectorAll<HTMLElement>('.loc-region');
      if (!regions?.length) return;
      let current = regions[0].dataset.region!;
      regions.forEach((r) => {
        if (r.getBoundingClientRect().top <= window.innerHeight / 2) current = r.dataset.region!;
      });
      setCurrentRegion(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [filter.country, filter.city]);

  const shown = REGIONS.filter((r) => !filter.country || r.name === filter.country).map((r) => ({
    ...r,
    cities: r.cities.filter((c) => !filter.city || c === filter.city),
  }));
  let cardIndex = 0;

  // Figma 1211:31303: the title, the two fields, then Reset — in the intro, and in the band
  const filters = (where: 'intro' | 'band') => (
    <div
      className={`loc-listing__filters loc-listing__filters--${where}`}
      role="search"
      aria-label="Filter locations"
      ref={where === 'intro' ? introFiltersRef : undefined}
    >
      <p className="loc-listing__filters-title">Locations</p>
      <SelectField
        icon={globe}
        label="Country"
        placeholder="Select Country"
        value={filter.country}
        options={countries}
        onChange={chooseCountry}
      />
      <SelectField
        icon={mapPin}
        label="City"
        placeholder="Select City"
        value={filter.city}
        options={cities}
        onChange={chooseCity}
      />
      <button
        type="button"
        className="loc-listing__reset"
        disabled={!filtered}
        onClick={() => change({ country: null, city: null })}
      >
        <img src={resetIcon} width={24} height={24} alt="" />
        Reset
      </button>
    </div>
  );

  return (
    <section ref={sectionRef} className="loc-listing exit-parallax" id="locations">
      <div className={`loc-listing__band${pinned ? ' is-pinned' : ''}`} aria-hidden={!pinned}>
        {filters('band')}
      </div>

      {/* The layer that lags in the hand-over (outside it, the band stays fixed) */}
      <div className="loc-listing__content" data-exit-content>
      {/* Figma 1211:31095: heading and filters between two photos, then the line */}
      <div className="loc-intro">
        <span className="loc-intro__photo loc-intro__photo--left">
          <img src={introBuilding} alt="" />
        </span>
        <span className="loc-intro__photo loc-intro__photo--right">
          <img src={introLounge} alt="" />
        </span>
        <div className="loc-intro__copy">
          <div className="heading-group">
            <p className="eyebrow">Locations</p>
            <h1 className="type-h1 loc-intro__title">
              Where <em>your story</em> finds its place
            </h1>
          </div>
          <p className="loc-intro__text">An exclusive offering designed for those who would not settle for ordinary.</p>
        </div>
        {filters('intro')}
        <VLine src={line} length={100} />
      </div>

      {/* Figma 1221:8889: one panel on the left naming the country in view, held at the
          middle of the screen; it changes country with a soft cross-fade as the next
          country's cities reach the middle. Re-keyed with the filter, so the listing fades
          back in when it changes. */}
      <div ref={regionsRef} key={`${filter.country}-${filter.city}`} className="loc-listing__regions">
        <div className="loc-listing__aside" aria-hidden>
          <div className="loc-listing__countries">
            {shown.map((r) => (
              <div key={r.id} className={`loc-region__header${r.id === currentRegion ? ' is-current' : ''}`}>
                <p className="loc-region__name">{r.name}</p>
                <p className="loc-region__summary">{r.summary}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="loc-listing__list">
          {shown.map((r) => (
            <div key={r.id} className="loc-region" data-region={r.id}>
              {/* The country's own heading: read by screen readers, shown on smaller screens */}
              <div className="loc-region__header loc-region__header--inline">
                <h3 className="loc-region__name">{r.name}</h3>
                <p className="loc-region__summary">{r.summary}</p>
              </div>
              <div className="loc-region__cities">
                {r.cities.map((city) => (
                  <div key={city} className="loc-city">
                    <div className="loc-city__label">
                      <p className="loc-city__name">{city}</p>
                      <p className="loc-city__path">
                        /en-{r.id}/{city.toLowerCase()}/
                      </p>
                    </div>
                    <div className="loc-city__cards">
                      {PROPERTIES.filter((p) => p.city === city).map((p) => (
                        <PropertyCard key={p.id} property={p} index={cardIndex++} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      <div className="exit-shade" aria-hidden />
    </section>
  );
}
