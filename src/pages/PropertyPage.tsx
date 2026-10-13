import Nav, { scrollToSection } from '../components/Nav';
import type { SubLink } from '../components/Nav';
import PropertyHero from '../components/property/PropertyHero';
import Amenities from '../components/property/Amenities';
import Rooms from '../components/property/Rooms';
import PropertyLocation from '../components/property/PropertyLocation';
import Promotions from '../components/property/Promotions';
import Faqs from '../components/property/Faqs';
import StayConnected from '../components/StayConnected';
import Footer from '../components/Footer';
import type { PropertyContent } from '../components/property/propertyContent';

/** Section ids, shared by the sub-navigation and the sections themselves. */
const SECTIONS = {
  amenities: 'amenities',
  rooms: 'rooms',
  location: 'location',
  promotions: 'promotions',
  faqs: 'faqs',
  waitlist: 'join-the-wait-list',
};

const SUB_LINKS: SubLink[] = [
  { label: 'Amenities', target: SECTIONS.amenities },
  { label: 'Room', target: SECTIONS.rooms },
  { label: 'Location', target: SECTIONS.location },
  { label: 'Promotions', target: SECTIONS.promotions },
  { label: 'FAQs', target: SECTIONS.faqs },
  { label: 'Join the wait list', target: SECTIONS.waitlist },
];

/**
 * Sections where the main bar stays hidden even when scrolling up: Rooms pins its own
 * controls under the sub-navigation, and Location's map tabs would sit under the bar.
 */
const BAR_HIDDEN_IN = [SECTIONS.rooms, SECTIONS.location];

/** A property's page (Figma 539:13190), reached from Locations in the nav and the homepage. */
export default function PropertyPage({ content }: { content: PropertyContent }) {
  return (
    <>
      <Nav subLinks={SUB_LINKS} hideBarAfter={SECTIONS.amenities} barHiddenIn={BAR_HIDDEN_IN} />
      <main>
        <PropertyHero content={content} onSeeRooms={() => scrollToSection(SECTIONS.rooms)} />
        <Amenities id={SECTIONS.amenities} content={content} />
        <Rooms id={SECTIONS.rooms} content={content} />
        <PropertyLocation id={SECTIONS.location} content={content} />
        <Promotions id={SECTIONS.promotions} content={content} />
        <Faqs id={SECTIONS.faqs} content={content} />
        <StayConnected id={SECTIONS.waitlist} exitParallax />
      </main>
      <Footer />
    </>
  );
}
