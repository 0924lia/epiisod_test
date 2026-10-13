import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import LifeIntro from './LifeIntro';
import Wellness from './Wellness';
import { gsap, ScrollTrigger, scrollToY, useGSAP } from '../lib/smoothScroll';
import './LifeSection.css';

/**
 * Figma "life-proto": life @ epiisod fold → wellness fold, Move In (direction: left),
 * ease-in-out — scrubbed by scroll with GSAP ScrollTrigger. The intro pins (CSS sticky)
 * while the wellness fold slides in over it; once it has fully arrived, the wellness
 * story scrolls on normally.
 *
 * As it's covered, the intro drifts left at a slower pace and dims (parallax with shade).
 *
 * Wellness is laid out `slide` px below the top of the section and pulled up by the
 * same amount while sliding, so at the hand-off its layout and visual positions meet
 * and its own sticky heading takes over without a jump.
 */
export default function LifeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wellnessRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(() => window.innerHeight);
  // Scroll spent stepping through the three wellness stories (≈ 0.8 screen per image).
  const stepScroll = Math.round(slide * 2);
  const [wellnessHeight, setWellnessHeight] = useState(0);

  useEffect(() => {
    const el = wellnessRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWellnessHeight(el.offsetHeight));
    ro.observe(el);
    const onResize = () => setSlide(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // The section's height comes from React state; re-measure triggers once it settles.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [wellnessHeight, slide]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Slide-in runs for everyone: it's how the wellness fold arrives on screen.
      gsap
        .timeline({
          scrollTrigger: { trigger: section, start: 'top top', end: `+=${slide}`, scrub: true },
        })
        .fromTo(
          '.life__wellness',
          { xPercent: 100 },
          { xPercent: 0, ease: 'power1.inOut', duration: 1 },
          0,
        )
        .fromTo('.life__wellness', { y: -slide }, { y: 0, ease: 'none', duration: 1 }, 0);

      // Intro hands over with parallax: it lags behind the incoming fold and darkens
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({
            defaults: { ease: 'power1.inOut', duration: 1 },
            scrollTrigger: { trigger: section, start: 'top top', end: `+=${slide}`, scrub: true },
          })
          .fromTo('.life__intro-content', { xPercent: 0 }, { xPercent: -30 }, 0)
          .fromTo('.life__intro-shade', { opacity: 0 }, { opacity: 0.35 }, 0);
      });

      // Parallax: each layer drifts at its own --speed from the moment the section
      // enters until the wellness fold covers it. At the section's top it sits
      // exactly where Figma places it.
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          const speed = parseFloat(getComputedStyle(el).getPropertyValue('--speed')) || 0;
          gsap.fromTo(
            el,
            { y: () => speed * window.innerHeight },
            {
              y: -speed * slide,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: `top top-=${slide}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });
    },
    { scope: sectionRef, dependencies: [slide], revertOnUpdate: true },
  );

  const skipToWellness = () => {
    const section = sectionRef.current;
    if (!section) return;
    scrollToY(section.getBoundingClientRect().top + window.scrollY + slide);
  };

  return (
    <section
      ref={sectionRef}
      className="life"
      style={
        {
          height: wellnessHeight ? slide + wellnessHeight : undefined,
          '--slide': `${slide}px`,
        } as CSSProperties
      }
      aria-label="Life at EPIISOD"
    >
      <div className="life__intro">
        <div className="life__intro-content">
          <LifeIntro onNext={skipToWellness} />
        </div>
        <div className="life__intro-shade" aria-hidden />
      </div>
      <div ref={wellnessRef} className="life__wellness">
        <Wellness offset={slide} stepScroll={stepScroll} />
      </div>
    </section>
  );
}
