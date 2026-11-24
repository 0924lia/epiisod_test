import { StrictMode } from 'react';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { initSmoothScroll } from './lib/smoothScroll';

/**
 * Versions, chosen by URL: /v3 and /v3/… → version 3, the new brand (src/v3); /v2 and
 * /v2/… → version 2 (src/v2); every other path → version 1, the site as deployed
 * (src/App + src/components, frozen at the `v1` git tag). Each loads on its own so only
 * its styles are on the page — v1 and v2 use the same class names, and loading them
 * together would let v2 tweaks leak into v1. v1 and v2 share the old brand's global.css,
 * loaded before their own styles; v3 has its own tokens and base styles instead.
 */
const path = window.location.pathname.replace(/\/+$/, '');
// Separate statements (not a ternary): Vite then gives each import its own preload list.
let loadPage: Promise<{ default: ComponentType }>;
if (path === '/v3' || path.startsWith('/v3/')) {
  loadPage = import('./v3/App');
} else if (path === '/v2' || path.startsWith('/v2/')) {
  loadPage = import('./styles/global.css').then(() => import('./v2/App'));
} else {
  loadPage = import('./styles/global.css').then(() => import('./App'));
}

initSmoothScroll();

loadPage.then(({ default: Page }) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Page />
    </StrictMode>,
  );
});
