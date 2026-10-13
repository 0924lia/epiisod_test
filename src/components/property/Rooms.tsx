import { useMemo, useRef, useState } from 'react';
import VLine from '../VLine';
import FilterTabs from './FilterTabs';
import { useExitParallax } from '../../lib/useExitParallax';
import roomsLine from '../../assets/property/rooms-line.svg';
import hourglass from '../../assets/property/icon-hourglass.svg';
import calendarBlank from '../../assets/property/icon-calendar-blank.svg';
import caretDown from '../../assets/property/caret-down-grey.svg';
import arrowRight from '../../assets/arrow-right-white.svg';
import gridIcon from '../../assets/property/icon-grid.svg';
import listIcon from '../../assets/property/icon-list.svg';
import sortIcon from '../../assets/property/icon-sort.svg';
import lightning from '../../assets/property/icon-lightning.svg';
import crown from '../../assets/property/icon-crown.svg';
import type { PropertyContent, Room } from './propertyContent';
import './Rooms.css';

const ALL = 'All';
const BADGES = {
  offer: { label: 'Special offer', icon: lightning },
  limited: { label: 'Limited availability', icon: crown },
} as const;

function RoomCard({ room, currency }: { room: Room; currency: string }) {
  const badge = BADGES[room.badge];
  return (
    <article className="room-card">
      <div className="room-card__image">
        <img src={room.image} alt="" />
        <span className={`room-card__badge room-card__badge--${room.badge}`}>
          <img src={badge.icon} width={24} height={24} alt="" />
          {badge.label}
        </span>
      </div>
      <div className="room-card__body">
        <div className="room-card__heading">
          <p className="room-card__type">{room.type}</p>
          <h3 className="room-card__name">{room.name}</h3>
        </div>
        <ul className="room-card__features">
          {room.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="room-card__price">
          <span className="room-card__from">From</span>
          <span className="room-card__amount">
            {currency} {room.price}
          </span>
          <span className="room-card__unit">wk / person</span>
        </p>
      </div>
    </article>
  );
}

/** Rooms (Figma 539:13413): search, filters and the room grid. */
export default function Rooms({ id, content }: { id: string; content: PropertyContent }) {
  const [type, setType] = useState(ALL);
  const [availableOnly, setAvailableOnly] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useExitParallax(sectionRef);

  const rooms = useMemo(
    () =>
      content.rooms.filter(
        (r) => (type === ALL || r.type === type) && (!availableOnly || r.available),
      ),
    [content.rooms, type, availableOnly],
  );

  return (
    <section ref={sectionRef} className="rooms exit-parallax" id={id}>
      <div className="rooms__content" data-exit-content>
        <div className="rooms__intro">
          <div className="heading-group">
            <p className="eyebrow">Rooms</p>
            <h2 className="rooms__title">
              Find your <em>space</em>
            </h2>
          </div>

          {/* TODO: connect to the booking engine */}
          <form className="rooms__search" onSubmit={(e) => e.preventDefault()}>
            <label className="rooms__field">
              <img src={hourglass} width={24} height={24} alt="" />
              <select defaultValue="" aria-label="Preferred length of stay">
                <option value="" disabled>
                  Preferred Length of Stay
                </option>
                {content.stayLengths.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <img src={caretDown} width={24} height={24} alt="" />
            </label>
            <label className="rooms__field">
              <img src={calendarBlank} width={24} height={24} alt="" />
              <input
                type="text"
                placeholder="Check-in Date"
                aria-label="Check-in date"
                onFocus={(e) => (e.currentTarget.type = 'date')}
                onBlur={(e) => !e.currentTarget.value && (e.currentTarget.type = 'text')}
              />
              <img src={caretDown} width={24} height={24} alt="" />
            </label>
            <button type="submit" className="rooms__submit">
              <span>Search</span>
              <img src={arrowRight} width={24} height={24} alt="" />
            </button>
          </form>
        </div>

        <VLine src={roomsLine} length={60} />

        <div className="rooms__results">
          <div className="rooms__toolbar">
            {/* List view and sorting aren't designed yet; Grid is the only view for now */}
            <div className="rooms__views">
              <span className="rooms__view is-active">
                <img src={gridIcon} width={24} height={24} alt="" />
                Grid
              </span>
              <span className="rooms__view" aria-disabled>
                <img src={listIcon} width={24} height={24} alt="" />
                List
              </span>
              <span className="rooms__view" aria-disabled>
                <img src={sortIcon} width={24} height={24} alt="" />
                Sort
              </span>
            </div>

            <FilterTabs
              className="rooms__types"
              label="Room type"
              options={[ALL, 'Studio', 'Shared']}
              value={type}
              onChange={setType}
            />

            <label className="rooms__available">
              <input
                type="checkbox"
                role="switch"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              <span className="rooms__switch" aria-hidden />
              Available rooms only
            </label>
          </div>

          <div className="rooms__grid">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} currency={content.roomCurrency} />
            ))}
          </div>
          {rooms.length === 0 && <p className="rooms__empty">No rooms match these filters yet.</p>}
        </div>
      </div>
      <div className="exit-shade" aria-hidden />
    </section>
  );
}
