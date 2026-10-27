import { useEffect, useMemo, useRef, useState } from 'react';
import PropertyMap from './PropertyMap';
import type { MapMarker } from './PropertyMap';
import { useExitParallax } from '../../lib/useExitParallax';
import pin from '../../assets/property/icon-location-pin.svg';
import searchIcon from '../../assets/property/location/icon-search.svg';
import pinLine from '../../assets/property/location/icon-map-pin-line.svg';
import closeIcon from '../../assets/property/location/icon-close.svg';
import allIcon from '../../assets/property/location/cat-all.svg';
import schoolsIcon from '../../assets/property/location/cat-schools.svg';
import transportIcon from '../../assets/property/location/cat-transport.svg';
import foodIcon from '../../assets/property/location/cat-food.svg';
import shoppingIcon from '../../assets/property/location/cat-shopping.svg';
import telcosIcon from '../../assets/property/location/cat-telcos.svg';
import landmarksIcon from '../../assets/property/location/cat-landmarks.svg';
import type { PropertyContent } from './propertyContent';
import './PropertyLocation.css';

/**
 * The areas in the finder (Figma 1182:16950), in order: each shows one of the content's
 * place categories (`source`) under the design's name. "All" shows every area's places.
 */
const AREAS = [
  { name: 'All', icon: allIcon, sources: null },
  { name: 'Schools', icon: schoolsIcon, sources: ['Education'] },
  { name: 'Transport', icon: transportIcon, sources: ['Transport'] },
  { name: 'Food', icon: foodIcon, sources: ['Food'] },
  { name: 'Shopping & Entertainment', icon: shoppingIcon, sources: ['Shopping & Entertainment'] },
  { name: 'Telcos & Post Offices', icon: telcosIcon, sources: ['Telcos & Post Offices'] },
  { name: 'Other Landmarks', icon: landmarksIcon, sources: ['Other Landmarks'] },
];
const SHOWN_SOURCES = AREAS.flatMap((a) => a.sources ?? []);

/** Straight-line distance (km) between two points. */
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** "450 m", "2.4 km", "18 km" */
function formatDistance(km: number) {
  if (km < 1) return `${Math.max(10, Math.round((km * 1000) / 10) * 10)} m`;
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

type ListedPlace = MapMarker & { distance: string };

/**
 * Location (Figma 1080:5903, states 1182:17146): the address, then the neighbourhood map
 * with the "Find nearby areas" finder over its top-left corner. The finder opens a list of
 * areas; choosing one lists its places, numbered (once across every area, so "All" reads
 * straight through), with their distance from the property,
 * and shows them on the map. Pointing at a place lights its marker; choosing one moves
 * the map to it. The cross clears the area.
 */
export default function PropertyLocation({ id, content }: { id: string; content: PropertyContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const finderRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  useExitParallax(sectionRef);

  /** The area list is open. */
  const [open, setOpen] = useState(false);
  /** The chosen area, or null for none (the property alone). */
  const [area, setArea] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [focus, setFocus] = useState<{ id: string } | null>(null);
  const [phone, setPhone] = useState(() => window.matchMedia('(max-width: 700px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const update = () => setPhone(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Every place in the finder, numbered once across all the areas in their order (Schools
  // 01–16, then Transport…), so a place keeps its number in its own area and under "All"
  const numbered = useMemo<(ListedPlace & { source: string })[]>(() => {
    const list: (ListedPlace & { source: string })[] = [];
    SHOWN_SOURCES.forEach((source) => {
      content.mapPlaces
        .find((c) => c.name === source)
        ?.places.forEach((place, index) =>
          list.push({
            id: `${source}-${index}`,
            source,
            label: String(list.length + 1).padStart(2, '0'),
            place,
            distance: formatDistance(distanceKm(content.mapCenter, place)),
          }),
        );
    });
    return list;
  }, [content]);

  // The chosen area's places
  const places = useMemo<ListedPlace[]>(() => {
    const chosen = AREAS.find((a) => a.name === area);
    if (!chosen) return [];
    return chosen.sources ? numbered.filter((p) => chosen.sources.includes(p.source)) : numbered;
  }, [area, numbered]);

  // Close the area list on a click elsewhere or Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!finderRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (name: string) => {
    setArea(name);
    setOpen(false);
    setHighlight(null);
    setFocus(null);
    listRef.current?.scrollTo({ top: 0 });
  };

  const clear = () => {
    setArea(null);
    setHighlight(null);
    setFocus(null);
  };

  // A marker clicked on the map: mark its place in the list and bring it into view
  const onMarkerClick = (placeId: string) => {
    setHighlight(placeId);
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(`[data-place="${placeId}"]`);
    if (list && item) {
      const top = item.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;
      if (top < list.scrollTop || top + item.offsetHeight > list.scrollTop + list.clientHeight)
        list.scrollTo({ top: top - 48, behavior: 'smooth' });
    }
  };

  const current = AREAS.find((a) => a.name === area);
  // The corner of the map the finder covers, kept clear when framing places
  const inset = useMemo(() => (phone ? { left: 0, top: 260 } : { left: 440, top: 0 }), [phone]);

  return (
    <section ref={sectionRef} className="property-location exit-parallax" id={id}>
      <div className="property-location__content" data-exit-content>
        <div className="property-location__header">
          <h2 className="type-h2 property-location__title">Location</h2>
          <p className="type-body-l property-location__address">
            <img src={pin} width={24} height={24} alt="" />
            {content.address}
          </p>
        </div>

        <div className="property-location__map">
          <PropertyMap
            brand={content.brand}
            place={content.place}
            address={content.address.replace(/^[^,]+,\s*/, '')}
            center={content.mapCenter}
            markers={places}
            frame={area}
            inset={inset}
            highlight={highlight}
            focus={focus}
            onMarkerClick={onMarkerClick}
          />

          <div ref={finderRef} className="location-finder">
            <button
              type="button"
              className="location-finder__field"
              aria-expanded={open}
              aria-controls={`${id}-areas`}
              onClick={() => setOpen((o) => !o)}
            >
              <img src={searchIcon} width={24} height={24} alt="" />
              <span className="location-finder__placeholder">Find nearby areas</span>
              <img src={pinLine} width={24} height={24} alt="" />
            </button>

            {open && (
              <ul className="location-finder__panel location-finder__areas" id={`${id}-areas`}>
                {AREAS.map((a) => (
                  <li key={a.name}>
                    <button
                      type="button"
                      className={`location-finder__area${a.name === area ? ' is-current' : ''}`}
                      aria-pressed={a.name === area}
                      onClick={() => choose(a.name)}
                    >
                      <span className="location-finder__icon" aria-hidden>
                        <img src={a.icon} width={16} height={16} alt="" />
                      </span>
                      {a.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {!open && current && (
              <div className="location-finder__panel location-finder__results">
                <div className="location-finder__chosen">
                  <span className="location-finder__icon is-current" aria-hidden>
                    <img src={current.icon} width={16} height={16} alt="" />
                  </span>
                  <span className="location-finder__chosen-name">{current.name}</span>
                  <button type="button" className="location-finder__clear" aria-label="Clear area" onClick={clear}>
                    <img src={closeIcon} width={24} height={24} alt="" />
                  </button>
                </div>
                {/* Scrolls on its own: the page's smooth scroll leaves the wheel to it */}
                <ul
                  ref={listRef}
                  className="location-finder__places"
                  aria-label={`${current.name} near the property`}
                  data-lenis-prevent
                >
                  {places.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        data-place={p.id}
                        className={`location-finder__place${p.id === highlight ? ' is-lit' : ''}`}
                        onPointerEnter={() => setHighlight(p.id)}
                        onPointerLeave={() => setHighlight((h) => (h === p.id ? null : h))}
                        onFocus={() => setHighlight(p.id)}
                        onClick={() => {
                          setHighlight(p.id);
                          setFocus({ id: p.id });
                        }}
                      >
                        <span className="location-finder__number">{p.label}</span>
                        <span className="location-finder__place-name">{p.place.name}</span>
                        <span className="location-finder__distance">{p.distance}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="exit-shade" aria-hidden />
    </section>
  );
}
