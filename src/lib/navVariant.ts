/**
 * Navigation option for UX testing. Option A (the default) is the current navigation;
 * option B (Figma 690:3977) drops the hamburger on desktop and moves its content into
 * the bar and mega menus. `?nav=b` / `?nav=a` on any page switches, and the choice is
 * remembered on this device so it holds while moving between pages.
 */
export type NavVariant = 'a' | 'b';

const STORAGE_KEY = 'epiisod-nav-variant';

function readVariant(): NavVariant {
  const fromUrl = new URLSearchParams(window.location.search).get('nav')?.toLowerCase();
  if (fromUrl === 'a' || fromUrl === 'b') {
    try {
      window.localStorage.setItem(STORAGE_KEY, fromUrl);
    } catch {
      // Storage unavailable: the URL choice still applies to this page
    }
    return fromUrl;
  }
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'b' ? 'b' : 'a';
  } catch {
    return 'a';
  }
}

/** Read once per page load (the choice only changes through the URL). */
export const NAV_VARIANT: NavVariant = readVariant();
