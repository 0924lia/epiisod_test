import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import logo from '../../assets/nav-logo.svg';
import type { MapCategory } from './propertyContent';
import './PropertyMap.css';

/**
 * Map tiles: OpenStreetMap's standard tiles, which need no API key (toned to the
 * site's palette in PropertyMap.css). OSM's tile servers are for light use only — for
 * production traffic, swap this for a tile provider with a key (e.g. MapTiler or
 * Stadia Maps) or Google Maps with EPIISOD's own key, as on the live site.
 */
const TILES = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};
/** Zoom for the "All" view, centred on the property (as in Figma 539:13638). */
const HOME_ZOOM = 16;

type PropertyMapProps = {
  name: string;
  address: string;
  center: { lat: number; lng: number };
  categories: MapCategory[];
  /** Category name to show, or null for all. */
  active: string | null;
};

const escape = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const popupHtml = (title: string, address: string) =>
  `<p class="map-popup__title">${escape(title)}</p><p class="map-popup__address">${escape(address)}</p>`;

/**
 * Neighbourhood map: the property's pin (popup open) and numbered markers for nearby
 * places, numbered across all categories as on the live site. `active` filters the
 * markers and re-frames the map around them.
 */
export default function PropertyMap({ name, address, center, categories, active }: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<Map<string, L.LayerGroup>>(new Map());
  const homeRef = useRef<L.Marker | null>(null);
  /** The filter effect leaves the first render alone, so the property's popup stays open. */
  const filtered = useRef(false);

  // Build the map and every marker once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const map = L.map(container, {
      center: [center.lat, center.lng],
      zoom: HOME_ZOOM,
      // The page scrolls with the wheel; zoom with the buttons, pinch or double-click
      scrollWheelZoom: false,
      // On touch screens one finger scrolls the page; two fingers move the map
      dragging: !L.Browser.mobile,
    });
    L.tileLayer(TILES.url, { attribution: TILES.attribution, maxZoom: 19 }).addTo(map);

    let number = 0;
    categories.forEach((category) => {
      const group = L.layerGroup();
      category.places.forEach((place) => {
        number += 1;
        L.marker([place.lat, place.lng], {
          title: place.name,
          icon: L.divIcon({
            className: 'map-marker',
            html: `<span>${number}</span>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -18],
          }),
        })
          .bindPopup(popupHtml(place.name, place.address), { className: 'map-popup' })
          .addTo(group);
      });
      group.addTo(map);
      layersRef.current.set(category.name, group);
    });

    // The property's own pin sits above every other marker, its popup open
    homeRef.current = L.marker([center.lat, center.lng], {
      title: name,
      zIndexOffset: 1000,
      icon: L.divIcon({
        className: 'map-home',
        html: `<img src="${logo}" width="56" height="56" alt="" />`,
        iconSize: [72, 72],
        iconAnchor: [36, 36],
        popupAnchor: [0, -38],
      }),
    })
      .bindPopup(popupHtml(name, address), { className: 'map-popup map-popup--home', autoPan: false })
      .addTo(map)
      .openPopup();

    mapRef.current = map;
    const layers = layersRef.current;
    // Leaflet measures its box once; re-measure if the layout around it changes
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(container);
    return () => {
      ro.disconnect();
      map.remove();
      layers.clear();
      mapRef.current = null;
      homeRef.current = null;
    };
  }, [name, address, center, categories]);

  // Show the chosen category and frame it (with the property in view)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const shown: L.LatLngExpression[] = [[center.lat, center.lng]];
    layersRef.current.forEach((group, category) => {
      const visible = !active || active === category;
      if (visible) {
        group.addTo(map);
        group.eachLayer((layer) => shown.push((layer as L.Marker).getLatLng()));
      } else {
        group.remove();
      }
    });
    if (!filtered.current && !active) {
      filtered.current = true;
      return;
    }
    filtered.current = true;
    map.closePopup();
    if (!active) {
      // Back to all: home in on the property and reopen its card
      map.flyTo([center.lat, center.lng], HOME_ZOOM, { duration: 0.8 });
      map.once('moveend', () => homeRef.current?.openPopup());
    } else {
      map.flyToBounds(L.latLngBounds(shown), { padding: [60, 60], maxZoom: 16, duration: 0.8 });
    }
  }, [active, center]);

  return <div ref={containerRef} className="property-map" role="region" aria-label={`Map of places near ${name}`} />;
}
