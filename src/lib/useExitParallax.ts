import type { RefObject } from 'react';
import { gsap, useGSAP } from './smoothScroll';

/**
 * Exit parallax between sections: as the section's bottom scrolls from the bottom of
 * the screen to the top, its `[data-exit-content]` lags behind (clipped by the
 * section, see `.exit-parallax`) and its `.exit-shade` dims it, so the next section
 * appears to slide over it. Pass `shade: false` to drift without dimming (for sections
 * meant to read as one with the next), or `drift: false` to only dim (for sections with
 * pinned content, which the drift would carry along). Skipped for reduced motion.
 */
export function useExitParallax(
  sectionRef: RefObject<HTMLElement>,
  { enabled = true, shade = true, drift = true }: { enabled?: boolean; shade?: boolean; drift?: boolean } = {},
) {
  useGSAP(
    () => {
      if (!enabled) return;
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'bottom bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        if (drift) tl.to('[data-exit-content]', { y: () => window.innerHeight * 0.45 }, 0);
        if (shade) tl.to('.exit-shade', { opacity: 0.35 }, 0);
      });
    },
    { scope: sectionRef, dependencies: [enabled, shade, drift] },
  );
}
