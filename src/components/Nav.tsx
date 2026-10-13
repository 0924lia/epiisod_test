import { useEffect, useState } from 'react';
import caretLight from '../assets/caret-down.svg';
import caretDark from '../assets/caret-down-dark.svg';
import logoLight from '../assets/nav-logo.svg';
import logoDark from '../assets/nav-logo-compact.svg';
import dropdownLight from '../assets/dropdown.svg';
import dropdownDark from '../assets/dropdown-dark.svg';
import menuLight from '../assets/menu-icon.svg';
import menuDark from '../assets/menu-icon-dark.svg';
import './Nav.css';

const PRIMARY_LINKS = ['Life @ epiisod', 'Locations', 'Contact us'];
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
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLLED_AFTER);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <nav className="nav__inner" aria-label="Main">
        <div className="nav__links">
          {PRIMARY_LINKS.map((label) => (
            <a key={label} href="#" className="nav__link">
              <span>{label}</span>
              <Icon light={caretLight} dark={caretDark} size={16} />
            </a>
          ))}
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
    </header>
  );
}
