import { useEffect, useRef, useState } from 'react';
import { scrollToY } from '../lib/smoothScroll';
import caretLight from '../assets/caret-down.svg';
import caretDark from '../assets/caret-down-dark.svg';
import logoLight from '../assets/nav-logo.svg';
import logoDark from '../assets/nav-logo-compact.svg';
import dropdownLight from '../assets/dropdown.svg';
import dropdownDark from '../assets/dropdown-dark.svg';
import menuLight from '../assets/menu-icon.svg';
import menuDark from '../assets/menu-icon-dark.svg';
import MegaMenu from './MegaMenu';
import LifeMenu from './LifeMenu';
import LocationsMenu from './LocationsMenu';
import './Nav.css';

type MenuKey = 'life' | 'locations';

/** Primary links; those with a `menu` toggle a mega menu instead of navigating. */
const PRIMARY_LINKS: { label: string; menu?: MenuKey; href?: string }[] = [
  { label: 'Life @ epiisod', menu: 'life' },
  { label: 'Locations', menu: 'locations' },
  { label: 'Contact us', href: '/contact' },
];
const menuId = (menu: MenuKey) => `nav-${menu}-menu`;
/** A link in the sub-navigation row: scrolls to the section with this id. */
export type SubLink = { label: string; target: string };

/** Scroll distance (px) after which the nav gains its solid background. */
const SCROLLED_AFTER = 40;
/** Scroll movement (px) that counts as a change of direction for hiding the bar. */
const DIRECTION_TOLERANCE = 6;
/** Height of the compact (scrolled) bar: 12px padding ×2 + 44px Book a tour button + 1px rule (Nav.css). */
const COMPACT_BAR_HEIGHT = 69;

const pageTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

/**
 * Scroll so `id`'s section lands just below the nav — below the sub-navigation alone
 * when the main bar will be hidden by the time it arrives.
 */
export function scrollToSection(id: string) {
  const section = document.getElementById(id);
  const header = document.querySelector<HTMLElement>('.nav');
  if (!section || !header) return;
  const sub = header.querySelector<HTMLElement>('.nav__sub')?.offsetHeight ?? 0;
  const hideAfter = header.dataset.hideAfter && document.getElementById(header.dataset.hideAfter);
  const top = pageTop(section);
  const goingDown = top - sub > window.scrollY;
  const barHides = !!hideAfter && goingDown && top - sub >= pageTop(hideAfter) - sub - COMPACT_BAR_HEIGHT;
  scrollToY(top - sub - (barHides ? 0 : COMPACT_BAR_HEIGHT));
}

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
 * Clicking a menu link turns the bar solid white and expands its mega menu
 * (Figma 539:20915, 539:18628).
 *
 * Property pages pass `subLinks`: a second row jumping to the page's sections
 * (Figma 539:13194), which turns into a bronze band once scrolled (Figma 539:22227).
 * With `hideBarAfter`, once that section is reached the main bar slides away while
 * scrolling down — leaving just the sub-navigation — and returns on scrolling up.
 * `tone="dark"` starts as a solid chocolate bar (Figma 539:24148) for pages without a hero.
 */
export default function Nav({
  subLinks,
  hideBarAfter,
  tone = 'light',
}: {
  subLinks?: SubLink[];
  hideBarAfter?: string;
  /** `dark`: a solid chocolate bar until scrolled (Contact page). */
  tone?: 'light' | 'dark';
}) {
  const [scrolled, setScrolled] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLLED_AFTER);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  // Hide the main bar past `hideBarAfter` while scrolling down; bring it back on the way up
  useEffect(() => {
    if (!hideBarAfter) return;
    let lastY = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      const section = document.getElementById(hideBarAfter);
      const header = headerRef.current;
      if (!section || !header) return;
      if (y < pageTop(section) - header.offsetHeight) {
        setCondensed(false);
        lastY = y;
      } else if (Math.abs(y - lastY) > DIRECTION_TOLERANCE) {
        setCondensed(y > lastY);
        lastY = y;
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [hideBarAfter]);

  // The hidden bar slides up by its own height, which changes as it compacts
  useEffect(() => {
    const bar = barRef.current;
    const header = headerRef.current;
    if (!bar || !header) return;
    const ro = new ResizeObserver(() => header.style.setProperty('--bar-h', `${bar.offsetHeight}px`));
    ro.observe(bar);
    return () => ro.disconnect();
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
      className={`nav${tone === 'dark' ? ' nav--dark' : ''}${subLinks ? ' nav--sub' : ''}${scrolled ? ' is-scrolled' : ''}${openMenu ? ' is-open' : ''}${condensed && !openMenu ? ' is-condensed' : ''}`}
      data-hide-after={hideBarAfter}
    >
      <nav ref={barRef} className="nav__inner" aria-label="Main">
        <div className="nav__links">
          {PRIMARY_LINKS.map(({ label, menu, href = '#' }) =>
            menu ? (
              <button
                key={label}
                type="button"
                className={`nav__link${openMenu === menu ? ' is-active' : ''}`}
                aria-expanded={openMenu === menu}
                aria-controls={menuId(menu)}
                onClick={() => setOpenMenu((current) => (current === menu ? null : menu))}
              >
                <span>{label}</span>
                <Icon light={caretLight} dark={caretDark} size={16} />
              </button>
            ) : (
              <a key={label} href={href} className="nav__link">
                <span>{label}</span>
              </a>
            ),
          )}
        </div>

        <a href="/" className="nav__logo" aria-label="EPIISOD home">
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

      <MegaMenu activeId={openMenu && menuId(openMenu)}>
        <LifeMenu
          id={menuId('life')}
          open={openMenu === 'life'}
          onNavigate={() => setOpenMenu(null)}
        />
        <LocationsMenu
          id={menuId('locations')}
          open={openMenu === 'locations'}
          onNavigate={() => setOpenMenu(null)}
        />
      </MegaMenu>

      {subLinks && (
        <nav className="nav__sub" aria-label="On this page">
          {subLinks.map(({ label, target }) => (
            <a
              key={target}
              href={`#${target}`}
              className="nav__link nav__sub-link"
              onClick={(e) => {
                // Handled here, not by Lenis's anchor scrolling, so the section clears the bar
                e.preventDefault();
                e.stopPropagation();
                scrollToSection(target);
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
