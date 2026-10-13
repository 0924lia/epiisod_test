import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

let lenis: Lenis | null = null;

/**
 * Scroll feel. Each wheel/trackpad movement travels SCROLL_SPEED of its usual
 * distance, then glides for SCROLL_DURATION seconds on an exponential ease-out —
 * quick to respond, then a long, gentle deceleration as it lands.
 */
const SCROLL_SPEED = 0.8;
const SCROLL_DURATION = 1.4;
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Smooth (eased) page scrolling driven by GSAP's ticker, so Lenis and every
 * ScrollTrigger animation update in the same frame — no drift or double work.
 * Skipped for viewers who prefer reduced motion; touch keeps native scrolling.
 */
export function initSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  lenis = new Lenis({
    duration: SCROLL_DURATION,
    easing: easeOutExpo,
    wheelMultiplier: SCROLL_SPEED,
    anchors: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/**
 * Scroll the page to `top`, through Lenis when it's running so the two don't fight.
 * `immediate` jumps without animating (e.g. to hold the view steady after a re-layout).
 */
export function scrollToY(top: number, { immediate = false }: { immediate?: boolean } = {}) {
  if (lenis) lenis.scrollTo(top, immediate ? { immediate: true, force: true } : { duration: SCROLL_DURATION * 1.2, easing: easeOutExpo });
  else window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' });
}

export { gsap, ScrollTrigger, useGSAP };
