import type { RefObject } from 'react';
import { gsap, useGSAP } from './smoothScroll';

/**
 * Exit parallax between sections: as the section's bottom scrolls from the bottom of
 * the screen to the top, its `[data-exit-content]` lags behind (clipped by the
 * section, see `.exit-parallax`) and its `.exit-shade` dims it, so the next section
 * appears to slide over it. Pass `shade: false` to drift without dimming (for sections
 * meant to read as one with the next). Skipped for reduced motion.
 */
export function useExitParallax(
  sectionRef: RefObject<HTMLElement>,
  { enabled = true, shade = true }: { enabled?: boolean; shade?: boolean } = {},
) {
  useGSAP(
    () => {
      if (!enabled) return;
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'bottom bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to('[data-exit-content]', { y: () => window.innerHeight * 0.45 }, 0);
        if (shade) tl.to('.exit-shade', { opacity: 0.35 }, 0);
      });
    },
    { scope: sectionRef, dependencies: [enabled, shade] },
  );
}
