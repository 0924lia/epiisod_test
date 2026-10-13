import { useRef, useState } from 'react';
import FilterTabs from './FilterTabs';
import { useExitParallax } from '../../lib/useExitParallax';
import pin from '../../assets/property/icon-location-pin.svg';
import type { PropertyContent } from './propertyContent';
import './PropertyLocation.css';

const ALL = 'All';

/**
 * Location (Figma 539:13621): address and the neighbourhood map.
 * The map is the static design image for now, so the category tabs only mark a
 * selection — TODO: swap in an interactive map whose markers they filter.
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
            label="Places nearby"
            options={[ALL, ...content.mapCategories]}
            value={category}
            onChange={setCategory}
          />
        </div>

        <div className="property-location__map">
          <img src={content.mapImage} alt={`Map of the area around ${content.brand} ${content.place}`} />
        </div>
      </div>
      <div className="exit-shade" aria-hidden />
    </section>
  );
}
