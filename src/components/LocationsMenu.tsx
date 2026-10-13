import { PROPERTIES, REGIONS, type Property } from './locationData';
import arrowRight from '../assets/menu-arrow-right.svg';
import './LocationsMenu.css';

type LocationsMenuProps = {
  id: string;
  open: boolean;
  onNavigate: () => void;
};

function PropertyItem({ property, onNavigate }: { property: Property; onNavigate: () => void }) {
  const { name, address, comingSoon } = property;
  const content = (
    <>
      <span className="locations-menu__name-row">
        <span className="locations-menu__name">{name}</span>
        {comingSoon ? (
          <span className="locations-menu__soon">Soon</span>
        ) : (
          <span className="locations-menu__arrow">
            <img src={arrowRight} width={16} height={16} alt="" />
          </span>
        )}
      </span>
      <span className="locations-menu__address">{address}</span>
    </>
  );

  // Only open properties link through; coming-soon ones are listed but inert.
  return comingSoon ? (
    <div className="locations-menu__property">{content}</div>
  ) : (
    <a href="#" className="locations-menu__property is-link" onClick={onNavigate}>
      {content}
    </a>
  );
}

/**
 * Locations mega menu, expanded from the nav's "Locations" link (Figma 539:18628).
 * Regions on the left, their properties grouped by city in three columns; open
 * properties highlight on hover (Figma 539:19161).
 */
export default function LocationsMenu({ id, open, onNavigate }: LocationsMenuProps) {
  return (
    <div id={id} className={`locations-menu${open ? ' is-open' : ''}`}>
      <div className="locations-menu__clip">
        <div className="locations-menu__inner">
          <p className="locations-menu__heading">Our locations</p>

          {REGIONS.map((region) => (
            <div key={region.id} className="locations-menu__row">
              <div className="locations-menu__region">
                <p className="locations-menu__region-name">{region.name}</p>
                <p className="locations-menu__region-summary">{region.summary}</p>
              </div>

              <div className="locations-menu__cities">
                {region.cities.map((city) => (
                  <div key={city} className="locations-menu__city">
                    <p className="locations-menu__city-name">{city}</p>
                    {PROPERTIES.filter((p) => p.city === city).map((p) => (
                      <PropertyItem key={p.id} property={p} onNavigate={onNavigate} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
