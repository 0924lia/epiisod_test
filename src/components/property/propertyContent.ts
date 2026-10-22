import hero from '../../assets/property/hero.jpg';
import roomQuad from '../../assets/property/rooms/quad-ensuite.jpg';
import roomSignature from '../../assets/property/rooms/signature-studio.jpg';
import roomSignatureFlex from '../../assets/property/rooms/signature-studio-flex.jpg';
import roomAspect from '../../assets/property/rooms/aspect-studio.jpg';
import roomAspectE from '../../assets/property/rooms/aspect-studio-e.jpg';
import roomEmpowered from '../../assets/property/rooms/empowered-studio.jpg';
import roomPremier from '../../assets/property/rooms/premier-empowered-studio.jpg';
import promoBanner from '../../assets/property/promo-banner.jpg';
import exterior from '../../assets/about/wide-macquarie.jpg';
import lobby from '../../assets/property/amenity-lobby.jpg';
import study from '../../assets/property/amenity-wifi.jpg';
import building from '../../assets/property/amenity-secure.jpg';
import coffee from '../../assets/experience/coffee.jpg';
import socialTable from '../../assets/property/amenity-social.jpg';
import { OFFERS } from '../promotions/promotionsData';
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

/** An amenity in the scroll story (Figma 1082:17874): `lead` is set in italic. */
export type Amenity = {
  lead: string;
  rest: string;
  text: string;
  /** The full-screen photo behind the list while it's active. */
  image: string;
  /** Figma's crop, as object-position with a zoom about it (default: centred cover). */
  crop?: { position: string; zoom: number };
};

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
  amenities: Amenity[];
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
  // Photos and crops from Figma 1099:34869; every description is a placeholder (Figma:
  // "Something lorem ipsum…").
  amenities: [
    {
      lead: 'Prime',
      rest: ' Location',
      text: 'Minutes from Macquarie University, the Metro and Macquarie Centre.',
      image: exterior,
      crop: { position: '0% 62%', zoom: 1.357 },
    },
    {
      lead: 'Reception',
      rest: ' 24/7',
      text: 'A friendly team on hand day and night, whenever you need us.',
      image: lobby,
      crop: { position: '0% 88%', zoom: 1.63 },
    },
    {
      lead: 'Unlimited',
      rest: ' WiFi',
      text: 'Fast, reliable internet in every room and shared space.',
      image: study,
      crop: { position: '0% 100%', zoom: 1.169 },
    },
    {
      lead: 'Secure',
      rest: ' Building',
      text: 'Keyless entry and 24/7 security, so you can feel at home.',
      image: building,
      crop: { position: '18% 32%', zoom: 1.341 },
    },
    {
      lead: 'Onsite',
      rest: ' Cafe',
      text: 'Coffee and a bite downstairs, made just for residents.',
      image: coffee,
      crop: { position: '0% 67%', zoom: 1.16 },
    },
    {
      lead: 'Big Social',
      rest: ' Calendar',
      text: 'Dinners, events and trips that make it easy to meet people.',
      image: socialTable,
    },
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
  // The same offers as the Promotions page (Figma 1082:16918)
  promos: OFFERS.map(({ id, title, text, image }) => ({ id, title, text, image })),
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
