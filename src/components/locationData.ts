import macquarie from '../assets/loc-macquarie.jpg';
import bedford from '../assets/loc-bedford.jpg';
import mckenzie from '../assets/loc-mckenzie.jpg';
import fairway from '../assets/loc-fairway.jpg';
import stirling from '../assets/loc-stirling.jpg';
import euston from '../assets/loc-euston.jpg';

export type Property = {
  id: string;
  name: string;
  address: string;
  city: string;
  image: string;
  comingSoon?: boolean;
};

export type Region = {
  id: string;
  name: string;
  summary: string;
  cities: string[];
};

export const REGIONS: Region[] = [
  {
    id: 'au',
    name: 'Australia',
    summary: '3 cities • 5 properties',
    cities: ['Sydney', 'Melbourne', 'Perth'],
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    summary: '1 city • 1 property',
    cities: ['London'],
  },
];

/** Every property, shown in the Locations carousel and the nav's Locations menu. */
export const PROPERTIES: Property[] = [
  {
    id: 'macquarie-park',
    name: 'EPIISOD Macquarie Park',
    address: '17 Lachlan Ave, Macquarie Park NSW 2113',
    city: 'Sydney',
    image: macquarie,
  },
  {
    id: 'bedford',
    name: 'EPIISOD Bedford',
    address: '2 Ascot Vale Road, Flemington VIC 3031',
    city: 'Melbourne',
    image: bedford,
  },
  {
    id: 'mckenzie',
    name: 'EPIISOD Mckenzie',
    address: 'Mckenzie Street, Melbourne VIC',
    city: 'Melbourne',
    image: mckenzie,
    comingSoon: true,
  },
  {
    id: 'fairway',
    name: 'EPIISOD Fairway',
    address: 'Perth WA',
    city: 'Perth',
    image: fairway,
    comingSoon: true,
  },
  {
    id: 'stirling',
    name: 'EPIISOD Stirling',
    address: 'Perth WA',
    city: 'Perth',
    image: stirling,
    comingSoon: true,
  },
  {
    id: 'euston',
    name: 'EPIISOD Euston',
    address: 'Euston, London NW1',
    city: 'London',
    image: euston,
    comingSoon: true,
  },
];
