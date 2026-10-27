import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import marker from '../../assets/property/location/epiisod-marker.svg';
import pointer from '../../assets/property/location/card-pointer.svg';
import type { MapPlace } from './propertyContent';
import './PropertyMap.css';

/**
 * Map tiles: OpenStreetMap's standard tiles, in their usual colours, which need no API
 * key. OSM's tile servers are for light use only — for
 * production traffic, swap this for a tile provider with a key (e.g. MapTiler or
 * Stadia Maps) or Google Maps with EPIISOD's own key, as on the live site.
 */
const TILES = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};
/** Zoom with no area chosen: the property among its neighbouring suburbs (Figma 1080:5903). */
const HOME_ZOOM = 14;

/** A numbered place on the map. */
export type MapMarker = { id: string; label: string; place: MapPlace };

type PropertyMapProps = {
  /** The property's name, before and after the italic part ("EPIISOD" + "Macquarie Park"). */
  brand: string;
  place: string;
  address: string;
  center: { lat: number; lng: number };
  /** The places to show, numbered. */
  markers: MapMarker[];
  /** Changing this re-frames the map around the markers (or back on the property). */
  frame: string | null;
  /** Room (px) the finder panel takes over the map's top-left corner, kept clear when framing. */
  inset: { left: number; top: number };
  /** The place under the pointer in the list, lit on the map. */
  highlight: string | null;
  /** The place picked in the list: the map moves to it and opens its card. */
  focus: { id: string } | null;
  onMarkerClick: (id: string) => void;
};

const escape = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const popupHtml = (title: string, address: string) =>
  `<p class="map-popup__title">${escape(title)}</p><p class="map-popup__address">${escape(address)}</p>`;

/**
 * Neighbourhood map (Figma 1080:5903 / 1182:8433): the EPIISOD marker under the property's
 * card, and numbered markers for the places in the chosen area. Drag to move; zoom with
 * the buttons, pinch or double-click (the wheel scrolls the page).
 */
export default function PropertyMap({
  brand,
  place,
  address,
  center,
  markers,
  frame,
  inset,
  highlight,
  focus,
  onMarkerClick,
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const clickRef = useRef(onMarkerClick);
  clickRef.current = onMarkerClick;

  // The map and the property's marker, once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const map = L.map(container, {
      center: [center.lat, center.lng],
      zoom: HOME_ZOOM,
      zoomControl: false,
      // The page scrolls with the wheel; zoom with the buttons, pinch or double-click
      scrollWheelZoom: false,
      // On touch screens one finger scrolls the page; two fingers move the map
      dragging: !L.Browser.mobile,
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer(TILES.url, { attribution: TILES.attribution, maxZoom: 19 }).addTo(map);

    // The EPIISOD marker with the property's card above it, always shown. The icon is a
    // point at the marker's centre; the card and marker are placed around it in CSS.
    L.marker([center.lat, center.lng], {
      title: `${brand} ${place}`,
      keyboard: false,
      // Under the numbered markers, so places right next door stay visible
      zIndexOffset: -1000,
      icon: L.divIcon({
        className: 'map-home',
        iconSize: [0, 0],
        html: `
          <div class="map-home__card">
            <p class="map-home__name">${escape(brand)} <em>${escape(place)}</em></p>
            <p class="map-home__address">${escape(address)}</p>
            <img class="map-home__pointer" src="${pointer}" width="23" height="17" alt="" />
          </div>
          <img class="map-home__mark" src="${marker}" width="140" height="190.5" alt="" />`,
      }),
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    // A place's card replaces the property's while it's open
    map.on('popupopen', () => container.classList.add('has-popup'));
    map.on('popupclose', () => container.classList.remove('has-popup'));
    mapRef.current = map;
    // Leaflet measures its box once; re-measure if the layout around it changes
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(container);
    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      markersRef.current.clear();
    };
  }, [brand, place, address, center]);

  // The chosen area's numbered markers
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    markersRef.current.clear();
    markers.forEach(({ id, label, place: p }) => {
      const m = L.marker([p.lat, p.lng], {
        title: p.name,
        icon: L.divIcon({
          className: 'map-marker',
          html: `<span>${label}</span>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -16],
        }),
      })
        .bindPopup(popupHtml(p.name, p.address), { className: 'map-popup', autoPanPaddingTopLeft: [inset.left, inset.top] })
        .on('click', () => clickRef.current(id))
        .addTo(layer);
      markersRef.current.set(id, m);
    });
  }, [markers, inset]);

  // Frame the area (keeping the property in view, and clear of the finder panel), or
  // go back to the property when the area is cleared
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.closePopup();
    if (frame === null) {
      map.flyTo([center.lat, center.lng], HOME_ZOOM, { duration: 0.8 });
      return;
    }
    const points = [L.latLng(center.lat, center.lng), ...markers.map((m) => L.latLng(m.place.lat, m.place.lng))];
    map.flyToBounds(L.latLngBounds(points), {
      paddingTopLeft: [inset.left + 32, Math.max(inset.top, 150)],
      paddingBottomRight: [56, 48],
      maxZoom: 16,
      duration: 0.8,
    });
    // Only when the area changes, not when the marker list is rebuilt with it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, center]);

  // Light the place under the pointer in the list
  useEffect(() => {
    markersRef.current.forEach((m, id) => {
      m.getElement()?.classList.toggle('is-lit', id === highlight);
      m.setZIndexOffset(id === highlight ? 900 : 0);
    });
  }, [highlight, markers]);

  // Move to the place picked in the list and open its card
  useEffect(() => {
    const map = mapRef.current;
    const m = focus && markersRef.current.get(focus.id);
    if (!map || !m) return;
    map.panInside(m.getLatLng(), { paddingTopLeft: [inset.left + 40, 160], paddingBottomRight: [60, 60] });
    m.openPopup();
  }, [focus, inset]);

  return (
    <div
      ref={containerRef}
      className="property-map"
      role="region"
      aria-label={`Map of places near ${brand} ${place}`}
    />
  );
}
