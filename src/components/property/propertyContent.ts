import hero from '../../assets/property/hero.jpg';
import amenity01 from '../../assets/property/amenity-01.jpg';
import amenity02 from '../../assets/property/amenity-02.jpg';
import amenity03 from '../../assets/property/amenity-03.jpg';
import amenity04 from '../../assets/property/amenity-04.jpg';
import amenity05 from '../../assets/wellness-1.jpg';
import amenity06 from '../../assets/property/amenity-06.jpg';
import amenity07 from '../../assets/property/amenity-07.jpg';
import amenity08 from '../../assets/property/amenity-08.jpg';
import amenity09 from '../../assets/property/amenity-09.jpg';
import amenity10 from '../../assets/loc-fairway.jpg';
import mapPin from '../../assets/property/icon-map-pin.svg';
import wifi from '../../assets/property/icon-wifi.svg';
import shield from '../../assets/property/icon-shield.svg';
import coffee from '../../assets/property/icon-coffee.svg';
import calendar from '../../assets/property/icon-calendar.svg';
import roomQuad from '../../assets/property/rooms/quad-ensuite.jpg';
import roomSignature from '../../assets/property/rooms/signature-studio.jpg';
import roomSignatureFlex from '../../assets/property/rooms/signature-studio-flex.jpg';
import roomAspect from '../../assets/property/rooms/aspect-studio.jpg';
import roomAspectE from '../../assets/property/rooms/aspect-studio-e.jpg';
import roomEmpowered from '../../assets/property/rooms/empowered-studio.jpg';
import roomPremier from '../../assets/property/rooms/premier-empowered-studio.jpg';
import promoBanner from '../../assets/property/promo-banner.jpg';
import promo1 from '../../assets/property/promo-1.jpg';
import promo2 from '../../assets/property/promo-2.jpg';
import promo3 from '../../assets/property/promo-3.jpg';
import promo4 from '../../assets/property/promo-4.jpg';
import { MACQUARIE_PARK_PLACES } from './macquarieParkMap';

export type RoomType = 'Studio' | 'Shared';

/** Status tag on a room card (Figma 539:30241). */
export type RoomTag = 'offer' | 'popular' | 'promotion' | 'soldOut' | 'value';

export type Room = {
  id: string;
  /** Used by the Studio / Shared filter. */
  type: RoomType;
  /** Shown above the name, e.g. "Shared Apartment". */
  typeLabel: string;
  name: string;
  image: string;
  tag: RoomTag;
  /** Views, e.g. "Garden/Urban/Pool/City", where known. */
  features?: string;
  price: number;
  available: boolean;
};

export type Promo = { id: string; title: string; text: string; image: string };

export type Faq = { question: string; answer: string };

export type MapPlace = { name: string; address: string; lat: number; lng: number };
export type MapCategory = { name: string; places: MapPlace[] };

export type PropertyContent = {
  /** Shown before the italic part of the name, e.g. "EPIISOD" + "Macquarie Park". */
  brand: string;
  place: string;
  city: string;
  address: string;
  hero: string;
  /** Carousel slides, first shown first. */
  amenitySlides: string[];
  amenities: { icon: string; label: string }[];
  rooms: Room[];
  roomCurrency: string;
  stayLengths: string[];
  /** The property's own pin. */
  mapCenter: { lat: number; lng: number };
  /** Nearby places, by category: the map's markers and its filter tabs. */
  mapPlaces: MapCategory[];
  promotion: { eyebrow: string; title: string; text: string; image: string };
  promos: Promo[];
  faqs: Faq[];
};

// TODO: replace with the real answers — the design only lists the questions.
const PENDING_ANSWER =
  'Our team is preparing a detailed answer. In the meantime, visit the FAQ page or contact us and we will be happy to help.';

/** Content for EPIISOD Macquarie Park (Figma 539:13190). */
export const MACQUARIE_PARK: PropertyContent = {
  brand: 'EPIISOD',
  place: 'Macquarie Park',
  city: 'Sydney',
  address: 'EPIISOD Macquarie Park, 17 Lachlan Ave, Macquarie Park NSW 2113',
  hero,
  amenitySlides: [
    amenity10,
    amenity09,
    amenity08,
    amenity07,
    amenity06,
    amenity05,
    amenity04,
    amenity03,
    amenity02,
    amenity01,
  ],
  amenities: [
    { icon: mapPin, label: 'Prime Location' },
    { icon: mapPin, label: 'Prime Location' },
    { icon: mapPin, label: 'Reception 24/7' },
    { icon: mapPin, label: 'Reception 24/7' },
    { icon: wifi, label: 'Unlimited WiFi' },
    { icon: wifi, label: 'Unlimited WiFi' },
    { icon: shield, label: 'Secure Building' },
    { icon: shield, label: 'Secure Building' },
    { icon: coffee, label: 'Onsite Cafe' },
    { icon: coffee, label: 'Onsite Cafe' },
    { icon: calendar, label: 'Big Social Calendar' },
  ],
  rooms: [
    { id: 'quad', type: 'Shared', typeLabel: 'Shared Apartment', name: 'Quad 4 Bedroom Ensuite', image: roomQuad, tag: 'offer', price: 615, available: true },
    { id: 'quint', type: 'Shared', typeLabel: 'Shared Apartment', name: 'Quint 5 Bedroom Ensuite', image: roomQuad, tag: 'popular', price: 615, available: true },
    { id: 'signature', type: 'Studio', typeLabel: 'Studio', name: 'Signature Studio', image: roomSignature, tag: 'promotion', features: 'Garden/Urban/Pool/City', price: 725, available: true },
    { id: 'signature-flex', type: 'Studio', typeLabel: 'Studio', name: 'Signature Studio Flex', image: roomSignatureFlex, tag: 'promotion', price: 727, available: true },
    { id: 'aspect', type: 'Studio', typeLabel: 'Studio', name: 'Aspect Studio', image: roomAspect, tag: 'soldOut', features: 'Garden/Urban/Pool/City', price: 745, available: false },
    { id: 'aspect-e', type: 'Studio', typeLabel: 'Studio', name: 'Aspect Studio E', image: roomAspectE, tag: 'promotion', features: 'Garden/Pool', price: 840, available: true },
    { id: 'empowered', type: 'Studio', typeLabel: 'Studio', name: 'Empowered Studio', image: roomEmpowered, tag: 'soldOut', price: 873, available: false },
    { id: 'premier-empowered', type: 'Studio', typeLabel: 'Studio', name: 'Premier Empowered Studio', image: roomPremier, tag: 'value', price: 893, available: true },
  ],
  roomCurrency: 'AU$',
  stayLengths: ['12 weeks', '6 months', '12 months'],
  mapCenter: { lat: -33.77917242506175, lng: 151.11718975214868 },
  mapPlaces: MACQUARIE_PARK_PLACES,
  promotion: {
    eyebrow: 'Promotion',
    title: 'Refer a Friend - Double the Joy, $600 in Rewards!',
    text: "Refer a friend to EPIISOD and you'll both receive a $300 rent credit once they move in. It's our way of saying thanks for growing our community!",
    image: promoBanner,
  },
  promos: [promo1, promo2, promo3, promo4].map((image, i) => ({
    id: `promo-${i + 1}`,
    title: 'Flexible short stay from 12 weeks to fit your needs',
    text: 'Flexible options to suit your plans. Click to learn more.',
    image,
  })),
  faqs: [
    'What documents are required to book a room?',
    'How do I book a room?',
    'What payments do I need to make when applying?',
    'When do I pay my rent?',
    'Is my reservation confirmed once I pay the holding deposit?',
    'Can I view the accommodation before applying?',
    'What is included in my rent?',
    'Will I be able to select my own desired room?',
    'Can I live with my friends or specify preferences for my roommates?',
    'Can I have additional occupant staying with me throughout my lease?',
  ].map((question) => ({ question, answer: PENDING_ANSWER })),
};
