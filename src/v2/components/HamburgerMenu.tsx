import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { PROPERTIES } from './locationData';
import { setScrollLocked } from '../../lib/smoothScroll';
import LanguageSelect from './LanguageSelect';
import logo from '../../assets/v2/nav-logo-dark.svg';
import closeIcon from '../../assets/v2/menu/close.svg';
import userIcon from '../../assets/v2/menu/user.svg';
import arrowRight from '../../assets/v2/menu/arrow-right.svg';
import caretDown from '../../assets/v2/menu/caret-down.svg';
import caretUp from '../../assets/v2/menu/caret-up-bronze.svg';
import './HamburgerMenu.css';

type Link = { label: string; href: string };
type GroupKey = 'life' | 'locations' | 'contact';

/** The menu's expanding sections (Figma 1511:14284, 1511:14551, 1511:14672). */
const GROUPS: { key: GroupKey; label: string; links: Link[] }[] = [
  {
    key: 'life',
    label: 'Life @ EPIISOD',
    links: [
      { label: 'Why EPIISOD', href: '/v2/why-epiisod' },
      { label: 'Experience', href: '/v2/experience' },
      { label: 'Blogs', href: '/v2/blog' },
      { label: 'Promotions', href: '/v2/promotions' },
    ],
  },
  {
    key: 'locations',
    label: 'Locations',
    // The residences that are open, each to its page
    links: PROPERTIES.filter((p) => !p.comingSoon).map((p) => ({ label: p.name, href: `/v2/locations/${p.id}` })),
  },
  {
    key: 'contact',
    label: 'Contact',
    links: [
      { label: 'Contact Us', href: '/v2/contact' },
      { label: 'Join the Waitlist', href: '/v2/join-the-waitlist' },
      { label: 'FAQs', href: '/v2/faqs' },
    ],
  },
];

function Group({
  label,
  links,
  expanded,
  onToggle,
  onNavigate,
}: {
  label: string;
  links: Link[];
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const id = useId();
  return (
    <li className={`menu-panel__group${expanded ? ' is-expanded' : ''}`}>
      <button type="button" className="menu-panel__item" aria-expanded={expanded} aria-controls={id} onClick={onToggle}>
        <span>{label}</span>
        <img className="menu-panel__caret" src={expanded ? caretUp : caretDown} width={24} height={24} alt="" />
      </button>
      <div id={id} className="menu-panel__sub">
        <div className="menu-panel__sub-clip">
          <ul className="menu-panel__sub-list">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="menu-panel__sub-link" tabIndex={expanded ? undefined : -1} onClick={onNavigate}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

type HamburgerMenuProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * The menu (Figma 1511:14024): a white panel sliding in from the right over the blurred
 * page. Log in at the top; Life @ EPIISOD, Locations and Contact open in place, one at a
 * time; Book a tour and the language at the foot. The navigation on tablets and phones.
 */
export default function HamburgerMenu({ open, onClose }: HamburgerMenuProps) {
  const [expanded, setExpanded] = useState<GroupKey | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // While open: freeze the page, start focus on the close button, close on Escape
  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      setScrollLocked(false);
      document.removeEventListener('keydown', onKey);
      previous?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  // Each opening starts with every section closed
  useEffect(() => {
    if (!open) setExpanded(null);
  }, [open]);

  // Keep Tab within the panel while it's open
  const trapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;
    const focusable = [...(panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])].filter(
      (el) => el.tabIndex !== -1 && el.offsetParent !== null,
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className={`hamburger${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="hamburger__backdrop" onClick={onClose} />
      <div ref={panelRef} className="hamburger__panels" role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={trapFocus}>
        <div className="menu-panel" data-lenis-prevent>
          <div className="menu-panel__header">
            <a href="/v2" className="menu-panel__logo" aria-label="EPIISOD home">
              <img src={logo} width={48} height={48} alt="" />
            </a>
            <button ref={closeRef} type="button" className="menu-panel__close" aria-label="Close menu" onClick={onClose}>
              <img src={closeIcon} width={36} height={36} alt="" />
            </button>
          </div>

          <div className="menu-panel__body">
            {/* Log in (Figma 1511:14305) */}
            <div className="menu-panel__account">
              <a href="#" className="menu-panel__login" onClick={onClose}>
                <img src={userIcon} width={24} height={24} alt="" />
                <span>Log in</span>
                <img src={arrowRight} width={16} height={16} alt="" />
              </a>
            </div>

            <nav aria-label="Menu">
              <ul className="menu-panel__items">
                {GROUPS.map((g) => (
                  <Group
                    key={g.key}
                    label={g.label}
                    links={g.links}
                    expanded={expanded === g.key}
                    onToggle={() => setExpanded((e) => (e === g.key ? null : g.key))}
                    onNavigate={onClose}
                  />
                ))}
                <li>
                  <a href="/v2/about" className="menu-panel__item" onClick={onClose}>
                    <span>About</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Book a tour and the language (Figma 1511:14909) */}
          <div className="menu-panel__foot">
            <a href="/v2/book-a-tour" className="menu-panel__cta" onClick={onClose}>
              Book a tour
            </a>
            <LanguageSelect variant="menu" />
          </div>
        </div>
      </div>
    </div>
  );
}
