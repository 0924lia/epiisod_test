import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import VLine from '../VLine';
import FilterTabs from './FilterTabs';
import { useExitParallax } from '../../lib/useExitParallax';
import { ScrollTrigger, scrollToY } from '../../lib/smoothScroll';
import roomsLine from '../../assets/property/rooms-line.svg';
import hourglass from '../../assets/property/icon-hourglass.svg';
import calendarBlank from '../../assets/property/icon-calendar-blank.svg';
import caretDown from '../../assets/property/caret-down-grey.svg';
import arrowRight from '../../assets/arrow-right-white.svg';
import gridIcon from '../../assets/property/icon-grid.svg';
import listIcon from '../../assets/property/icon-list.svg';
import sortIcon from '../../assets/property/icon-sort.svg';
import tagLightning from '../../assets/property/rooms/tag-lightning.svg';
import tagStar from '../../assets/property/rooms/tag-star.svg';
import tagTag from '../../assets/property/rooms/tag-tag.svg';
import tagProhibit from '../../assets/property/rooms/tag-prohibit.svg';
import tagGift from '../../assets/property/rooms/tag-gift.svg';
import type { PropertyContent, Room, RoomTag } from './propertyContent';
import './Rooms.css';

const ALL = 'All';
const TAGS: Record<RoomTag, { label: string; icon: string }> = {
  offer: { label: 'Exclusive Offer', icon: tagLightning },
  popular: { label: 'Popular Choice', icon: tagStar },
  promotion: { label: 'Promotion', icon: tagTag },
  soldOut: { label: 'Sold Out', icon: tagProhibit },
  value: { label: 'Best Value', icon: tagGift },
};

/** Room card (Figma 539:30859): photo with a status tag, type, name, views and price. */
function RoomCard({ room, currency }: { room: Room; currency: string }) {
  const tag = TAGS[room.tag];
  return (
    <article className={`room-card${room.available ? '' : ' is-sold-out'}`}>
      <div className="room-card__image">
        <img src={room.image} alt="" />
        <span className={`room-card__tag room-card__tag--${room.tag}`}>
          <img src={tag.icon} width={16} height={16} alt="" />
          {tag.label}
        </span>
      </div>
      <div className="room-card__body">
        <div className="room-card__heading">
          <p className="room-card__type">{room.typeLabel}</p>
          <h3 className="room-card__name">{room.name}</h3>
          {/* Kept even when empty so every card's price lines up */}
          <p className="room-card__features">{room.features ?? '\u00a0'}</p>
        </div>
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

/**
 * Rooms (Figma 539:13413): search, filters and the room grid.
 * While the rooms scroll past, the search form and the filter row stay pinned just
 * below the nav on a white band (Figma 539:34605). Changing a filter while scrolled into
 * the list keeps the view on the top of the list, however much shorter it gets.
 * The hand-over to the next section only dims — a drift would carry the pinned controls.
 */
export default function Rooms({ id, content }: { id: string; content: PropertyContent }) {
  const [type, setType] = useState(ALL);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [stuck, setStuck] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  /** Set when a filter changes while the list is scrolled under the pinned controls. */
  const anchorToList = useRef(false);
  useExitParallax(sectionRef, { drift: false });

  /**
   * Where the pinned controls end on screen: the filter row's sticky top plus its height,
   * and the white band's 24px below. Worked out from CSS rather than measured, since right
   * after a filter shortens the list the row may have scrolled away with it.
   */
  const pinnedBottom = () => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return 0;
    return (parseFloat(getComputedStyle(toolbar).top) || 0) + toolbar.offsetHeight + 24;
  };

  const changeFilter = (apply: () => void) => {
    const grid = gridRef.current;
    anchorToList.current = !!grid && grid.getBoundingClientRect().top < pinnedBottom();
    apply();
  };

  // After the list re-renders, put its top back right under the pinned controls, and
  // re-measure the scroll animations below, whose positions moved with the list's height
  const firstRender = useRef(true);
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Refresh first: it restores the scroll position it saw, which would undo the anchoring
    ScrollTrigger.refresh();
    const grid = gridRef.current;
    if (anchorToList.current && grid) {
      scrollToY(window.scrollY + grid.getBoundingClientRect().top - pinnedBottom(), { immediate: true });
    }
    anchorToList.current = false;
  }, [type, availableOnly]);

  // Pinned once the form reaches the nav: its white band then extends behind the filters
  useEffect(() => {
    const update = () => {
      const form = searchRef.current;
      if (!form || getComputedStyle(form).position !== 'sticky') return setStuck(false);
      const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 0;
      setStuck(form.getBoundingClientRect().top <= offset + 1);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const rooms = useMemo(
    () =>
      content.rooms.filter(
        (r) => (type === ALL || r.type === type) && (!availableOnly || r.available),
      ),
    [content.rooms, type, availableOnly],
  );

  return (
    <section ref={sectionRef} className="rooms exit-parallax" id={id}>
      <div className="rooms__content">
        <div className="heading-group rooms__heading">
          <p className="eyebrow">Rooms</p>
          <h2 className="rooms__title">
            Find your <em>space</em>
          </h2>
        </div>

        {/* TODO: connect to the booking engine */}
        <form
          ref={searchRef}
          className={`rooms__search${stuck ? ' is-stuck' : ''}`}
          onSubmit={(e) => e.preventDefault()}
        >
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

        <VLine src={roomsLine} length={60} />

        <div className="rooms__results">
          <div ref={toolbarRef} className="rooms__toolbar">
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
              onChange={(t) => changeFilter(() => setType(t))}
            />

            <label className="rooms__available">
              <input
                type="checkbox"
                role="switch"
                checked={availableOnly}
                onChange={(e) => {
                  const checked = e.target.checked;
                  changeFilter(() => setAvailableOnly(checked));
                }}
              />
              <span className="rooms__switch" aria-hidden />
              Available rooms only
            </label>
          </div>

          <div ref={gridRef} className="rooms__grid">
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
