import type { Property } from './locationData';
import arrowRight from '../assets/loc-arrow-right.svg';
import './LocationCard.css';

type LocationCardProps = {
  property: Property;
};

export default function LocationCard({ property }: LocationCardProps) {
  const { name, address, city, image, comingSoon } = property;
  return (
    <article className={`location-card${comingSoon ? ' location-card--soon' : ''}`}>
      <div className="location-card__image">
        <img src={image} alt="" draggable={false} />
        {comingSoon && <span className="location-card__badge">Stay tuned</span>}
      </div>

      <div className="location-card__details">
        <div className="location-card__info">
          <h3 className="location-card__name">{name}</h3>
          <p className="location-card__address">{address}</p>
          <p className="location-card__city">{city}</p>
        </div>

        {comingSoon ? (
          <p className="location-card__soon">Coming soon!</p>
        ) : (
          <a href="#" className="location-card__link">
            <span>View Property</span>
            <img src={arrowRight} width={24} height={24} alt="" />
          </a>
        )}
      </div>
    </article>
  );
}
