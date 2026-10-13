import { useEffect, useRef, useState } from 'react';
import caretLight from '../assets/caret-down.svg';
import caretDark from '../assets/caret-down-dark.svg';
import logoLight from '../assets/nav-logo.svg';
import logoDark from '../assets/nav-logo-compact.svg';
import dropdownLight from '../assets/dropdown.svg';
import dropdownDark from '../assets/dropdown-dark.svg';
import menuLight from '../assets/menu-icon.svg';
import menuDark from '../assets/menu-icon-dark.svg';
import LocationsMenu from './LocationsMenu';
import './Nav.css';

/** Primary links; those with a `menu` toggle a mega menu instead of navigating. */
const PRIMARY_LINKS: { label: string; menu?: 'locations' }[] = [
  { label: 'Life @ epiisod' },
  { label: 'Locations', menu: 'locations' },
  { label: 'Contact us' },
];
const LOCATIONS_MENU_ID = 'nav-locations-menu';
/** Scroll distance (px) after which the nav gains its solid background. */
const SCROLLED_AFTER = 40;

/** An icon in both colourways, cross-fading with the nav's state. */
function Icon({ light, dark, size }: { light: string; dark: string; size: number }) {
  return (
    <span className="nav__icon" style={{ width: size, height: size }}>
      <img className="nav__icon-light" src={light} width={size} height={size} alt="" />
      <img className="nav__icon-dark" src={dark} width={size} height={size} alt="" />
    </span>
  );
}

/**
 * Fixed global navigation. Transparent with white type over the hero (Figma 539:10035);
 * once the page scrolls it fades to a compact 90% white bar — 40px logo, 12px padding —
 * with a soft shadow and chocolate type for readability (Figma 539:12758).
 * Clicking a menu link turns the bar solid white and expands its mega menu (Figma 539:18628).
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<'locations' | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLLED_AFTER);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  // Close the open menu on Escape or a click anywhere outside the nav
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenMenu(null);
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [openMenu]);

  return (
    <header
      ref={headerRef}
      className={`nav${scrolled ? ' is-scrolled' : ''}${openMenu ? ' is-open' : ''}`}
    >
      <nav className="nav__inner" aria-label="Main">
        <div className="nav__links">
          {PRIMARY_LINKS.map(({ label, menu }) =>
            menu ? (
              <button
                key={label}
                type="button"
                className={`nav__link${openMenu === menu ? ' is-active' : ''}`}
                aria-expanded={openMenu === menu}
                aria-controls={LOCATIONS_MENU_ID}
                onClick={() => setOpenMenu((current) => (current === menu ? null : menu))}
              >
                <span>{label}</span>
                <Icon light={caretLight} dark={caretDark} size={16} />
              </button>
            ) : (
              <a key={label} href="#" className="nav__link">
                <span>{label}</span>
                <Icon light={caretLight} dark={caretDark} size={16} />
              </a>
            ),
          )}
        </div>

        <a href="#" className="nav__logo" aria-label="EPIISOD home">
          <Icon light={logoLight} dark={logoDark} size={64} />
        </a>

        <div className="nav__links nav__links--end">
          <div className="nav__actions">
            <a href="#" className="nav__link">
              <span>Log in</span>
            </a>
            <button type="button" className="nav__lang">
              <span>EN</span>
              <Icon light={dropdownLight} dark={dropdownDark} size={16} />
            </button>
            <a href="#" className="nav__cta">
              Book a tour
            </a>
          </div>
          <button type="button" className="nav__menu" aria-label="Open menu">
            <Icon light={menuLight} dark={menuDark} size={40} />
          </button>
        </div>
      </nav>

      <LocationsMenu
        id={LOCATIONS_MENU_ID}
        open={openMenu === 'locations'}
        onNavigate={() => setOpenMenu(null)}
      />
    </header>
  );
}
