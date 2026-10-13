import { useRef, useState } from 'react';
import FilterTabs from './FilterTabs';
import PropertyMap from './PropertyMap';
import { useExitParallax } from '../../lib/useExitParallax';
import pin from '../../assets/property/icon-location-pin.svg';
import type { PropertyContent } from './propertyContent';
import './PropertyLocation.css';

const ALL = 'All';

/**
 * Location (Figma 539:13621): address and the neighbourhood map. The category tabs
 * filter the map's markers (places as on the live EPIISOD site).
 */
export default function PropertyLocation({ id, content }: { id: string; content: PropertyContent }) {
  const [category, setCategory] = useState(ALL);
  const sectionRef = useRef<HTMLElement>(null);
  useExitParallax(sectionRef);

  return (
    <section ref={sectionRef} className="property-location exit-parallax" id={id}>
      <div className="property-location__content" data-exit-content>
        <div className="property-location__header">
          <div className="property-location__title-row">
            <h2 className="property-location__title">Location</h2>
            <p className="property-location__address">
              <img src={pin} width={24} height={24} alt="" />
              {content.address}
            </p>
          </div>
          <FilterTabs
            className="property-location__tabs"
            label="Places nearby"
            options={[ALL, ...content.mapPlaces.map((c) => c.name)]}
            value={category}
            onChange={setCategory}
          />
        </div>

        <div className="property-location__map">
          <PropertyMap
            name={`${content.brand} ${content.place}`}
            address={content.address.replace(/^[^,]+,\s*/, '') + ', Australia'}
            center={content.mapCenter}
            categories={content.mapPlaces}
            active={category === ALL ? null : category}
          />
        </div>
      </div>
      <div className="exit-shade" aria-hidden />
    </section>
  );
}
